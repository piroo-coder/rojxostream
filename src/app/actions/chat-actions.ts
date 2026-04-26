'use server';

/**
 * @fileOverview Chat Actions with Dual-Persistence (Memory + File)
 * Uses a Global Memory Store for immediate "Live" feel and 
 * attempts to sync with src/app/lib/messages.json for file-based persistence.
 */

import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

// Global Store Keys for persistence across Server Action re-executions
const CHAT_STORE_KEY = Symbol.for('rojxo.chat.global_store');

interface GlobalChatStore {
  messages: ChatMessage[];
  presence: Record<string, number>;
  typingStatus: Record<string, number>;
  initialized: boolean;
}

// Initialize or retrieve the global store
const store: GlobalChatStore = (global as any)[CHAT_STORE_KEY] || {
  messages: [],
  presence: {},
  typingStatus: {},
  initialized: false,
};

if (!(global as any)[CHAT_STORE_KEY]) {
  (global as any)[CHAT_STORE_KEY] = store;
}

const ONLINE_THRESHOLD_MS = 10000; 
const TYPING_THRESHOLD_MS = 3000;  
const MAX_HISTORY = 100;

// Helper to get the absolute path to messages.json
const getMessagesPath = () => path.join(process.cwd(), 'src/app/lib/messages.json');

// Initial load from file if not already initialized in memory
function ensureInitialized() {
  if (store.initialized) return;
  
  try {
    const filePath = getMessagesPath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(data || '[]');
      store.messages = Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
    }
  } catch (error) {
    console.error("Failed to load initial chat history from file:", error);
  } finally {
    store.initialized = true;
  }
}

// Persist current memory messages to file (Best Effort)
function syncToFile() {
  try {
    const filePath = getMessagesPath();
    const data = JSON.stringify(store.messages, null, 2);
    // Ensure dir exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, data);
  } catch (error) {
    // This will likely fail on Vercel, which is expected.
    // The memory store will still handle the active session history.
    console.warn("File system sync skipped (likely read-only environment). History will persist in memory for this session.");
  }
}

export async function updatePresence(user: 'Abhi' | 'Priya') {
  store.presence[user] = Date.now();
  return { success: true };
}

export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  store.typingStatus[user] = isTyping ? Date.now() : 0;
  return { success: true };
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  ensureInitialized();
  const now = Date.now();
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  
  const lastSeenOther = store.presence[otherUser] || 0;
  const isOtherOnline = (now - lastSeenOther) < ONLINE_THRESHOLD_MS;
  
  const lastTypingOther = store.typingStatus[otherUser] || 0;
  const isOtherTyping = (now - lastTypingOther) < TYPING_THRESHOLD_MS;

  return {
    messages: store.messages,
    isOtherOnline,
    isOtherTyping,
    onlineUsers: Object.keys(store.presence).filter(u => (now - store.presence[u]) < ONLINE_THRESHOLD_MS)
  };
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  ensureInitialized();
  
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substring(2, 11),
    sender,
    text,
    timestamp: Date.now(),
  };

  // Update Memory Store
  store.messages.push(newMessage);
  if (store.messages.length > MAX_HISTORY) {
    store.messages = store.messages.slice(-MAX_HISTORY);
  }
  
  // Update Presence & Typing
  store.typingStatus[sender] = 0;
  store.presence[sender] = Date.now();

  // Trigger File Sync
  syncToFile();

  return { success: true, message: newMessage };
}

export async function clearSession() {
  store.messages = [];
  syncToFile();
  return { success: true };
}
