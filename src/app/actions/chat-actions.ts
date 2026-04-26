
'use server';

/**
 * @fileOverview Firestore-backed Chat Actions.
 * Implements permanent persistence with optimized 100-message maintenance.
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
  writeBatch
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
const ONLINE_THRESHOLD = 20000; // 20 seconds for better stability

/**
 * Fetches the 100 most recent messages and checks partner presence.
 */
export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const now = Date.now();
  
  try {
    // 1. Update Current User Presence (Don't let this block message fetching)
    const presenceRef = doc(db, PRESENCE_COLLECTION, currentUser);
    setDoc(presenceRef, {
      lastSeen: now,
      isTyping: false 
    }, { merge: true }).catch(e => console.error("Presence update failed", e));

    // 2. Fetch History (Limit 100)
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(MAX_HISTORY)
    );
    
    const snapshot = await getDocs(q);
    const messages: ChatMessage[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sender: data.sender,
        text: data.text,
        timestamp: typeof data.timestamp === 'number' ? data.timestamp : data.timestamp?.toMillis?.() || Date.now()
      } as ChatMessage;
    }).reverse();

    // 3. Check Partner Status
    const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
    let isOtherOnline = false;
    let isOtherTyping = false;

    const otherPresenceRef = doc(db, PRESENCE_COLLECTION, otherUser);
    const otherPresenceSnap = await getDoc(otherPresenceRef);
    if (otherPresenceSnap.exists()) {
      const data = otherPresenceSnap.data();
      isOtherOnline = (now - (data.lastSeen || 0)) < ONLINE_THRESHOLD;
      isOtherTyping = !!data.isTyping && isOtherOnline;
    }

    return {
      messages,
      isOtherOnline,
      isOtherTyping
    };
  } catch (e) {
    console.error("Chat state sync failed:", e);
    throw e; // Bubble up to let the UI know
  }
}

/**
 * Sends a message and triggers cleanup of older messages.
 */
export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  try {
    const timestamp = Date.now();
    
    // 1. Add New Message
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      sender,
      text,
      timestamp,
    });

    // 2. Cleanup (Run periodically or check size)
    // We don't want to run this every single time if it's too slow,
    // but for 100 messages it's usually very fast.
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.size > MAX_HISTORY) {
      const docsToDelete = snapshot.docs.slice(MAX_HISTORY);
      const batch = writeBatch(db);
      docsToDelete.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }

    // 3. Update presence on send
    const presenceRef = doc(db, PRESENCE_COLLECTION, sender);
    await setDoc(presenceRef, {
      lastSeen: Date.now(),
      isTyping: false
    }, { merge: true });

    return { success: true };
  } catch (err) {
    console.error("Transmission error:", err);
    return { success: false, error: "Failed to reach archive." };
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
