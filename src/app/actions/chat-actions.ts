'use server';

/**
 * @fileOverview Chat Actions with Persistence & Typing Status
 * Handles message history (max 100), offline messaging, and real-time typing indicators.
 * Note: In Vercel, this uses a warm-lambda global store for simulation.
 */

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

// Global state to simulate a persistent store/file in serverless environments
const globalState = global as unknown as {
  chatMessages: ChatMessage[];
  presence: Record<string, number>;
  typingStatus: Record<string, number>;
};

if (!globalState.chatMessages) globalState.chatMessages = [];
if (!globalState.presence) globalState.presence = {};
if (!globalState.typingStatus) globalState.typingStatus = {};

const ONLINE_THRESHOLD_MS = 10000; // 10 seconds
const TYPING_THRESHOLD_MS = 3000;  // 3 seconds

export async function updatePresence(user: 'Abhi' | 'Priya') {
  globalState.presence[user] = Date.now();
  return { success: true };
}

export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  if (isTyping) {
    globalState.typingStatus[user] = Date.now();
  } else {
    globalState.typingStatus[user] = 0;
  }
  return { success: true };
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const now = Date.now();
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  
  const lastSeenOther = globalState.presence[otherUser] || 0;
  const isOtherOnline = (now - lastSeenOther) < ONLINE_THRESHOLD_MS;
  
  const lastTypingOther = globalState.typingStatus[otherUser] || 0;
  const isOtherTyping = (now - lastTypingOther) < TYPING_THRESHOLD_MS;

  return {
    messages: globalState.chatMessages,
    isOtherOnline,
    isOtherTyping,
    onlineUsers: Object.keys(globalState.presence).filter(u => (now - globalState.presence[u]) < ONLINE_THRESHOLD_MS)
  };
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substring(2, 11),
    sender,
    text,
    timestamp: Date.now(),
  };

  // Add message to global history
  globalState.chatMessages.push(newMessage);
  
  // Keep only the most recent 100 messages (Lightweight requirement)
  if (globalState.chatMessages.length > 100) {
    globalState.chatMessages = globalState.chatMessages.slice(-100);
  }
  
  // Reset typing status on send
  globalState.typingStatus[sender] = 0;
  globalState.presence[sender] = Date.now();

  return { success: true };
}

export async function clearSession() {
  globalState.chatMessages = [];
  return { success: true };
}
