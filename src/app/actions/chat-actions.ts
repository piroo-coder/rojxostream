
'use server';

/**
 * @fileOverview Firestore-backed Chat Actions.
 * Implements permanent persistence with automatic 100-message cleanup.
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  Timestamp,
  where
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

const MESSAGES_COLLECTION = 'messages';
const PRESENCE_COLLECTION = 'presence';
const MAX_HISTORY = 100;
const ONLINE_THRESHOLD = 15000; // 15 seconds

/**
 * Fetches the 100 most recent messages and checks partner presence.
 */
export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const now = Date.now();
  
  // 1. Update Current User Presence
  try {
    const presenceRef = doc(db, PRESENCE_COLLECTION, currentUser);
    await setDoc(presenceRef, {
      lastSeen: now,
      isTyping: false // Default to false unless explicitly set
    }, { merge: true });
  } catch (e) {
    console.error("Presence update failed", e);
  }

  // 2. Fetch History (Limit 100)
  let messages: ChatMessage[] = [];
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(MAX_HISTORY)
    );
    const snapshot = await getDocs(q);
    messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage)).reverse();
  } catch (e) {
    console.error("Fetch messages failed", e);
  }

  // 3. Check Partner Status
  const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
  let isOtherOnline = false;
  let isOtherTyping = false;

  try {
    const otherPresenceRef = doc(db, PRESENCE_COLLECTION, otherUser);
    const otherPresenceSnap = await getDoc(otherPresenceRef);
    if (otherPresenceSnap.exists()) {
      const data = otherPresenceSnap.data();
      isOtherOnline = (now - (data.lastSeen || 0)) < ONLINE_THRESHOLD;
      isOtherTyping = !!data.isTyping && isOtherOnline;
    }
  } catch (e) {
    console.error("Partner status fetch failed", e);
  }

  return {
    messages,
    isOtherOnline,
    isOtherTyping
  };
}

/**
 * Sends a message and triggers cleanup of anything beyond the 100th most recent.
 */
export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  try {
    // 1. Add New Message
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      sender,
      text,
      timestamp: Date.now(),
    });

    // 2. Cleanup Background (Lightweight maintenance)
    // We fetch more than MAX_HISTORY to find candidates for deletion
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.size > MAX_HISTORY) {
      const docsToDelete = snapshot.docs.slice(MAX_HISTORY);
      const deletePromises = docsToDelete.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    }

    // 3. Update presence on send
    const presenceRef = doc(db, PRESENCE_COLLECTION, sender);
    await setDoc(presenceRef, {
      lastSeen: Date.now(),
      isTyping: false
    }, { merge: true });

    return { success: true };
  } catch (err) {
    console.error("Send message failed", err);
    return { success: false };
  }
}

/**
 * Updates typing status in Firestore.
 */
export async function setTypingStatus(user: 'Abhi' | 'Priya', isTyping: boolean) {
  try {
    const presenceRef = doc(db, PRESENCE_COLLECTION, user);
    await setDoc(presenceRef, {
      lastSeen: Date.now(),
      isTyping
    }, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
