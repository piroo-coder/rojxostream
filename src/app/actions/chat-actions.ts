'use server';

/**
 * @fileOverview Robust Chat Actions with singleton persistence.
 * Ensures 100 messages are maintained and shared between users.
 */

import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

const CHAT_STORE_KEY = 'ROJXO_CHAT_STORE_STABLE_V3';
const MAX_HISTORY = 100;
const ONLINE_THRESHOLD = 10000;
const TYPING_THRESHOLD = 3000;

interface GlobalStore {
  messages: ChatMessage[];
  presence: Record<string, number>;
  typingStatus: Record<string, number>;
  initialized: boolean;
}

// Global reference for serverless environments (best effort persistence)
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

// Improved Sync: Only loads once and never clears existing memory
function syncStore() {
  const store = getStore();
  
  // If already initialized, we trust the memory store (source of truth)
  if (store.initialized) return;

  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Only load if memory is empty and file has content
        if (store.messages.length === 0) {
          store.messages = parsed.slice(-MAX_HISTORY);
        }
      }
    }
  } catch (e) {
    console.warn("Persistence sync warning: Proceeding with memory-only store.");
  } finally {
    store.initialized = true;
  }
}

// Best-effort save to disk (works in local environments)
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
    // Silence error on read-only environments (Vercel)
  }
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  syncStore(); 
  const store = getStore();
  const now = Date.now();
  
  // Update current user presence
  store.presence[currentUser] = now;
  
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  const isOtherOnline = (now - (store.presence[otherUser] || 0)) < ONLINE_THRESHOLD;
  const isOtherTyping = (now - (store.typingStatus[otherUser] || 0)) < TYPING_THRESHOLD;

  return {
    messages: [...store.messages], // Return a snapshot of the archive
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

  // Add message to global archive
  store.messages.push(newMessage);
  
  // Maintain strict 100 message limit
  if (store.messages.length > MAX_HISTORY) {
    store.messages = store.messages.slice(-MAX_HISTORY);
  }

  // Activity updates
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
