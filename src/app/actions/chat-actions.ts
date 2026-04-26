'use server';

/**
 * @fileOverview Chat Actions with File-Based Persistence
 * Handles message history (max 100) using src/app/lib/messages.json.
 * Uses a global memory store for transient data like presence and typing status.
 */

import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

// Transient state for presence and typing indicators (not saved to file)
const CHAT_TRANSIENT_KEY = Symbol.for('rojxo.chat.transient');
const transientState = (global as any)[CHAT_TRANSIENT_KEY] || {
  presence: {},
  typingStatus: {},
};

if (!(global as any)[CHAT_TRANSIENT_KEY]) {
  (global as any)[CHAT_TRANSIENT_KEY] = transientState;
}

const ONLINE_THRESHOLD_MS = 10000; // 10 seconds
const TYPING_THRESHOLD_MS = 3000;  // 3 seconds

// Helper to get the absolute path to messages.json
const getMessagesPath = () => path.join(process.cwd(), 'src/app/lib/messages.json');

// Helper to read messages from the JSON file
function readMessagesFromFile(): ChatMessage[] {
  try {
    const filePath = getMessagesPath();
    if (!fs.existsSync(filePath)) {
      // Ensure directory exists if it doesn't
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '[]');
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error("Error reading messages file:", error);
    return [];
  }
}

// Helper to write messages to the JSON file
function writeMessagesToFile(messages: ChatMessage[]) {
  try {
    const filePath = getMessagesPath();
    // Keep only the most recent 100 messages
    const limitedMessages = messages.slice(-100);
    fs.writeFileSync(filePath, JSON.stringify(limitedMessages, null, 2));
  } catch (error) {
    console.error("Error writing messages file:", error);
  }
}

export async function updatePresence(user: 'Abhi' | 'Priya') {
  transientState.presence[user] = Date.now();
  return { success: true };
}

export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  if (isTyping) {
    transientState.typingStatus[user] = Date.now();
  } else {
    transientState.typingStatus[user] = 0;
  }
  return { success: true };
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const now = Date.now();
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  
  const lastSeenOther = transientState.presence[otherUser] || 0;
  const isOtherOnline = (now - lastSeenOther) < ONLINE_THRESHOLD_MS;
  
  const lastTypingOther = transientState.typingStatus[otherUser] || 0;
  const isOtherTyping = (now - lastTypingOther) < TYPING_THRESHOLD_MS;

  // Read current history from the project file
  const messages = readMessagesFromFile();

  return {
    messages,
    isOtherOnline,
    isOtherTyping,
    onlineUsers: Object.keys(transientState.presence).filter(u => (now - transientState.presence[u]) < ONLINE_THRESHOLD_MS)
  };
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substring(2, 11),
    sender,
    text,
    timestamp: Date.now(),
  };

  // Load existing, append, and save
  const currentMessages = readMessagesFromFile();
  currentMessages.push(newMessage);
  writeMessagesToFile(currentMessages);
  
  // Reset transient status
  transientState.typingStatus[sender] = 0;
  transientState.presence[sender] = Date.now();

  return { success: true, message: newMessage };
}

export async function clearSession() {
  writeMessagesToFile([]);
  return { success: true };
}
