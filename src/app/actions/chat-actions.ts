'use server';

/**
 * @fileOverview Local File-Backed Chat Actions.
 * Optimized for maximum speed and repository-level persistence.
 */

import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

const MESSAGES_FILE = path.join(process.cwd(), 'src/app/lib/messages.json');
const MAX_HISTORY = 100;

// Ephemeral in-memory presence for the current server instance
const presenceStore: Record<string, { lastSeen: number, isTyping: boolean }> = {};

/**
 * Fetches history from the local repository file and checks partner status.
 */
export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const now = Date.now();
  
  // Update Current User Presence
  presenceStore[currentUser] = {
    lastSeen: now,
    isTyping: presenceStore[currentUser]?.isTyping || false
  };

  try {
    // 1. Read History from messages.json
    let messages: ChatMessage[] = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
      messages = JSON.parse(data || '[]');
    } else {
      // Ensure file exists
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
    }

    // 2. Check Partner Status
    const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
    const otherPresence = presenceStore[otherUser];
    const isOtherOnline = otherPresence ? (now - otherPresence.lastSeen < 15000) : false;
    const isOtherTyping = otherPresence ? (otherPresence.isTyping && isOtherOnline) : false;

    return {
      messages,
      isOtherOnline,
      isOtherTyping
    };
  } catch (e) {
    console.error("Local archive read failure:", e);
    return {
      messages: [],
      isOtherOnline: false,
      isOtherTyping: false
    };
  }
}

/**
 * Appends a message to the local repository file and performs instant cleanup.
 */
export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  try {
    const timestamp = Date.now();
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp,
    };

    // 1. Read existing
    let messages: ChatMessage[] = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
      messages = JSON.parse(data || '[]');
    }

    // 2. Update and Trim
    messages.push(newMessage);
    if (messages.length > MAX_HISTORY) {
      messages = messages.slice(-MAX_HISTORY);
    }

    // 3. Write back to repository file
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    // 4. Reset Presence
    if (presenceStore[sender]) {
      presenceStore[sender].isTyping = false;
      presenceStore[sender].lastSeen = Date.now();
    }

    return { success: true, id: newMessage.id };
  } catch (err) {
    console.error("Local write error:", err);
    return { success: false, error: "Archive write failed." };
  }
}

/**
 * Updates typing status in memory.
 */
export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  if (!presenceStore[user]) {
    presenceStore[user] = { lastSeen: Date.now(), isTyping: false };
  }
  presenceStore[user].isTyping = isTyping;
  presenceStore[user].lastSeen = Date.now();
  return { success: true };
}
