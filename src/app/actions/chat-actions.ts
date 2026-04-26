
'use server';

/**
 * @fileOverview Firestore-backed Chat Actions.
 * Optimized for high performance and reliable 100-message persistence.
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
  writeBatch,
  Timestamp
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
const ONLINE_THRESHOLD = 30000; // 30 seconds for stable presence

/**
 * Fetches the 100 most recent messages and checks partner presence.
 * Optimized for minimal data transfer.
 */
export async function getChatState(currentUser: 'Abhi' | 'Priya') {
  const now = Date.now();
  
  try {
    // 1. Update Current User Presence (Background/Fire-and-forget)
    const presenceRef = doc(db, PRESENCE_COLLECTION, currentUser);
    setDoc(presenceRef, {
      lastSeen: now,
      isTyping: false 
    }, { merge: true }).catch(() => {});

    // 2. Fetch History (Strict 100 Limit)
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(MAX_HISTORY)
    );
    
    const snapshot = await getDocs(q);
    const messages: ChatMessage[] = snapshot.docs.map(doc => {
      const data = doc.data();
      let ts = now;
      
      // Robust timestamp parsing
      if (data.timestamp instanceof Timestamp) {
        ts = data.timestamp.toMillis();
      } else if (typeof data.timestamp === 'number') {
        ts = data.timestamp;
      }
      
      return {
        id: doc.id,
        sender: data.sender,
        text: data.text,
        timestamp: ts
      };
    }).reverse();

    // 3. Check Partner Status
    const otherUser = currentUser === 'Abhi' ? 'Priya' : 'Abhi';
    const otherPresenceSnap = await getDoc(doc(db, PRESENCE_COLLECTION, otherUser));
    
    let isOtherOnline = false;
    let isOtherTyping = false;
    
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
    console.error("Portal sync failure:", e);
    return {
      messages: [],
      isOtherOnline: false,
      isOtherTyping: false
    };
  }
}

/**
 * Sends a message and performs optimized background cleanup.
 */
export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  try {
    const timestamp = Date.now();
    
    // 1. Direct Commit
    const newMessageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      sender,
      text,
      timestamp,
    });

    // 2. Instant Presence Reset
    await setDoc(doc(db, PRESENCE_COLLECTION, sender), {
      lastSeen: Date.now(),
      isTyping: false
    }, { merge: true });

    // 3. Optimized Cleanup (Only if needed, using a batch for speed)
    // We check for a slightly higher buffer to avoid cleaning on every single send
    const q = query(
      collection(db, MESSAGES_COLLECTION), 
      orderBy('timestamp', 'desc'), 
      limit(MAX_HISTORY + 10) 
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.size > MAX_HISTORY) {
      const batch = writeBatch(db);
      const docsToDelete = snapshot.docs.slice(MAX_HISTORY);
      docsToDelete.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }

    return { success: true, id: newMessageRef.id };
  } catch (err) {
    console.error("Transmission error:", err);
    return { success: false, error: "Link unstable." };
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
