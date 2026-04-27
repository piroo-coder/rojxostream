
'use server';

/**
 * @fileOverview High-Speed File-Based Sync Actions for WebRTC Signaling.
 */

import fs from 'fs';
import path from 'path';

const SYNC_FILE = path.join(process.cwd(), 'src/app/lib/sync.json');

export interface SyncData {
  presence: Record<string, number>;
  typing: Record<string, number>;
  messages: { sender: string; text: string; timestamp: number }[];
  screenShare: {
    leader: string | null;
    status: 'idle' | 'requesting' | 'active';
    offer: any | null;
    answer: any | null;
    iceCandidatesA: any[];
    iceCandidatesB: any[];
    timestamp: number;
  };
}

function ensureFileSync() {
  const dir = path.dirname(SYNC_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SYNC_FILE)) {
    const initial: SyncData = {
      presence: {},
      typing: {},
      messages: [],
      screenShare: { 
        leader: null, 
        status: 'idle',
        offer: null,
        answer: null,
        iceCandidatesA: [],
        iceCandidatesB: [],
        timestamp: 0
      }
    };
    fs.writeFileSync(SYNC_FILE, JSON.stringify(initial, null, 2));
  }
}

export async function getSyncState(userName: string) {
  try {
    ensureFileSync();
    const now = Date.now();
    const rawData = fs.readFileSync(SYNC_FILE, 'utf8');
    const data: SyncData = JSON.parse(rawData || '{}');

    // Initialize missing fields to prevent crashes
    if (!data.presence) data.presence = {};
    if (!data.typing) data.typing = {};
    if (!data.messages) data.messages = [];
    if (!data.screenShare) {
      data.screenShare = { 
        leader: null, 
        status: 'idle',
        offer: null,
        answer: null,
        iceCandidatesA: [],
        iceCandidatesB: [],
        timestamp: 0
      };
    }

    data.presence[userName] = now;
    
    const cleanedPresence: Record<string, number> = {};
    const cleanedTyping: Record<string, number> = {};
    
    Object.entries(data.presence).forEach(([user, time]) => {
      if (now - time < 15000) cleanedPresence[user] = time;
    });
    Object.entries(data.typing).forEach(([user, time]) => {
      if (now - time < 3000) cleanedTyping[user] = time;
    });

    data.presence = cleanedPresence;
    data.typing = cleanedTyping;

    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return data;
  } catch (e) {
    console.error("Sync read error:", e);
    return null;
  }
}

export async function setTypingStatus(userName: string, isTyping: boolean) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    if (!data.typing) data.typing = {};
    if (isTyping) data.typing[userName] = Date.now();
    else delete data.typing[userName];
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function sendSyncMessage(sender: string, text: string) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    if (!data.messages) data.messages = [];
    if (!data.typing) data.typing = {};
    
    data.messages.push({ sender, text, timestamp: Date.now() });
    if (data.messages.length > 50) data.messages = data.messages.slice(-50);
    delete data.typing[sender];
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateScreenShareState(update: Partial<SyncData['screenShare']>) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    if (!data.screenShare) {
      data.screenShare = { 
        leader: null, 
        status: 'idle',
        offer: null,
        answer: null,
        iceCandidatesA: [],
        iceCandidatesB: [],
        timestamp: 0
      };
    }
    data.screenShare = { ...data.screenShare, ...update, timestamp: Date.now() };
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function addIceCandidate(sender: string, candidate: any) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    if (!data.screenShare) return false;
    
    if (sender === 'Abhi') data.screenShare.iceCandidatesA.push(candidate);
    else data.screenShare.iceCandidatesB.push(candidate);
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function resetScreenShare() {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    data.screenShare = {
      leader: null,
      status: 'idle',
      offer: null,
      answer: null,
      iceCandidatesA: [],
      iceCandidatesB: [],
      timestamp: Date.now()
    };
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}
