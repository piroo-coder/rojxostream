'use server';

/**
 * @fileOverview Robust Chat Actions with singleton persistence.
 * Designed to survive Vercel's ephemeral environments as much as possible.
 */

import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

const CHAT_STORE_KEY = 'ROJXO_CHAT_STORE_STABLE_V6';
const MAX_HISTORY = 100;
const ONLINE_THRESHOLD = 8000;
const TYPING_THRESHOLD = 3000;

interface GlobalStore {
  messages: ChatMessage[];
  presence: Record<string, number>;
  typingStatus: Record<string, number>;
  initialized: boolean;
}

/**
 * Gets the global store, ensuring it exists as a singleton in the Node.js process.
 */
function getStore(): GlobalStore {
  const g = global as any;
  if (!g[CHAT_STORE_KEY]) {
    g[CHAT_STORE_KEY] = {
      messages: [],
      presence: {},
      typingStatus: {},
      initialized: false,
    };
  }
  return g[CHAT_STORE_KEY];
}

const getFilePath = () => path.join(process.cwd(), 'src/app/lib/messages.json');

/**
 * Loads history from the project file.
 */
function syncStore() {
  const store = getStore();
  
  if (store.initialized) return;

  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (store.messages.length === 0) {
          store.messages = parsed.slice(-MAX_HISTORY);
        }
      }
    }
  } catch (e) {
    // Fail silently - Vercel filesystem might be restricted
  } finally {
    store.initialized = true;
  }
}

/**
 * Best-effort persistence to the project file.
 */
function saveToDisk() {
  const store = getStore();
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const limitedHistory = store.messages.slice(-MAX_HISTORY);
    fs.writeFileSync(filePath, JSON.stringify(limitedHistory, null, 2));
  } catch (e) {
    // On Vercel, this will fail silently, but memory remains active
  }
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  syncStore(); 
  const store = getStore();
  const now = Date.now();
  
  // Update presence heartbeat
  store.presence[currentUser] = now;
  
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  const isOtherOnline = (now - (store.presence[otherUser] || 0)) < ONLINE_THRESHOLD;
  const isOtherTyping = (now - (store.typingStatus[otherUser] || 0)) < TYPING_THRESHOLD;

  return {
    messages: JSON.parse(JSON.stringify(store.messages)),
    isOtherOnline,
    isOtherTyping
  };
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string, id?: string) {
  syncStore();
  const store = getStore();
  
  const newMessage: ChatMessage = {
    id: id || (Math.random().toString(36).substring(2, 11) + Date.now().toString()),
    sender,
    text,
    timestamp: Date.now(),
  };

  // Prevent duplicates if already added via optimistic update or parallel request
  const exists = store.messages.some(m => m.id === newMessage.id);
  if (!exists) {
    store.messages.push(newMessage);
    // Maintain strict 100 message limit
    if (store.messages.length > MAX_HISTORY) {
      store.messages = store.messages.slice(-MAX_HISTORY);
    }
    saveToDisk();
  }

  // Clear typing and update presence
  store.typingStatus[sender] = 0;
  store.presence[sender] = Date.now();

  return { success: true };
}

export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  const store = getStore();
  store.typingStatus[user] = isTyping ? Date.now() : 0;
  return { success: true };
}