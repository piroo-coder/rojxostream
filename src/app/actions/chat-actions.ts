'use server';

/**
 * @fileOverview Refined Chat Actions with Stable Global Persistence
 * Implements a robust memory store with a file-system backup.
 */

import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

const CHAT_STORE_KEY = 'ROJXO_CHAT_STORE_V2';
const MAX_HISTORY = 100;
const ONLINE_THRESHOLD = 10000;
const TYPING_THRESHOLD = 3000;

interface GlobalStore {
  messages: ChatMessage[];
  presence: Record<string, number>;
  typingStatus: Record<string, number>;
  initialized: boolean;
}

// Access the global store securely using a stable key
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

// Ensure history is loaded from disk into memory
function syncStore() {
  const store = getStore();
  
  // If memory is already initialized, we just ensure it's not empty if the file has content
  // This is a "singleton" initialization pattern
  if (store.initialized && store.messages.length > 0) return;

  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed)) {
        // Load only the most recent 100
        store.messages = parsed.slice(-MAX_HISTORY);
      }
    }
  } catch (e) {
    console.warn("Note: File persistence check occurred. Memory store remains active source of truth.");
  } finally {
    store.initialized = true;
  }
}

// Best-effort save to disk to survive server restarts (local)
function saveToDisk() {
  const store = getStore();
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Always keep only the last 100
    const limitedHistory = store.messages.slice(-MAX_HISTORY);
    fs.writeFileSync(filePath, JSON.stringify(limitedHistory, null, 2));
  } catch (e) {
    // Silence error on serverless environments like Vercel which are read-only
  }
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  syncStore(); // Ensure memory is populated from archive
  const store = getStore();
  const now = Date.now();
  
  // Update current user presence
  store.presence[currentUser] = now;
  
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  const isOtherOnline = (now - (store.presence[otherUser] || 0)) < ONLINE_THRESHOLD;
  const isOtherTyping = (now - (store.typingStatus[otherUser] || 0)) < TYPING_THRESHOLD;

  // Return a fresh copy of the archive
  return {
    messages: [...store.messages],
    isOtherOnline,
    isOtherTyping
  };
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  syncStore();
  const store = getStore();
  
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substring(2, 11),
    sender,
    text,
    timestamp: Date.now(),
  };

  store.messages.push(newMessage);
  
  // Enforce strict 100 message limit
  if (store.messages.length > MAX_HISTORY) {
    store.messages = store.messages.slice(-MAX_HISTORY);
  }

  // Clear typing status and update presence
  store.typingStatus[sender] = 0;
  store.presence[sender] = Date.now();

  saveToDisk();

  return { success: true };
}

export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  const store = getStore();
  store.typingStatus[user] = isTyping ? Date.now() : 0;
  return { success: true };
}

export async function updatePresence(user: 'Abhi' | 'Priya') {
  const store = getStore();
  store.presence[user] = Date.now();
  return { success: true };
}
