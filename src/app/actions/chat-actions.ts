'use server';

/**
 * @fileOverview Transient Chat Actions
 * Handles real-time presence and ephemeral message passing without persistent storage.
 * Note: In serverless environments like Vercel, this state is transient and resets with lambda cold starts.
 */

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

// Use global to maintain state across requests in a warm lambda instance
// This fulfills the "no permanent history" and "real-time session" requirement.
const globalState = global as unknown as {
  chatMessages: ChatMessage[];
  presence: Record<string, number>;
};

if (!globalState.chatMessages) globalState.chatMessages = [];
if (!globalState.presence) globalState.presence = {};

const ONLINE_THRESHOLD_MS = 10000; // 10 seconds

export async function updatePresence(user: 'Abhi' | 'Priya') {
  globalState.presence[user] = Date.now();
  
  // Clean up old messages (keep only very recent ones for "live" feel)
  if (globalState.chatMessages.length > 50) {
    globalState.chatMessages = globalState.chatMessages.slice(-50);
  }
  
  return { success: true };
}

export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  const lastSeenOther = globalState.presence[otherUser] || 0;
  const isOtherOnline = (Date.now() - lastSeenOther) < ONLINE_THRESHOLD_MS;

  return {
    messages: globalState.chatMessages,
    isOtherOnline,
    onlineUsers: Object.keys(globalState.presence).filter(u => (Date.now() - globalState.presence[u]) < ONLINE_THRESHOLD_MS)
  };
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  const otherUser = sender === 'Abhi' ? 'Priya' : 'Abhi';
  const lastSeenOther = globalState.presence[otherUser] || 0;
  const isOtherOnline = (Date.now() - lastSeenOther) < ONLINE_THRESHOLD_MS;

  // Only allow sending if both are "online" (active in the session)
  if (!isOtherOnline) {
    return { success: false, error: 'Connection lost. Wait for the other person to be online.' };
  }

  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substring(2, 11),
    sender,
    text,
    timestamp: Date.now(),
  };

  globalState.chatMessages.push(newMessage);
  
  // Update sender presence
  globalState.presence[sender] = Date.now();

  return { success: true };
}

export async function clearSession() {
  globalState.chatMessages = [];
  return { success: true };
}
