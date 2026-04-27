'use server';

/**
 * @fileOverview Local File-Based Sync Actions for Priyu & Abhi.
 * Handles Presence, Chat, and Watch Party without external APIs.
 */

import fs from 'fs';
import path from 'path';

const SYNC_FILE = path.join(process.cwd(), 'src/app/lib/sync.json');

export interface SyncData {
  presence: Record<string, number>;
  messages: { sender: string; text: string; timestamp: number }[];
  sharing: {
    leader: string | null;
    mediaId: string | null;
    status: 'idle' | 'requesting' | 'active';
  };
}

function ensureFileSync() {
  const dir = path.dirname(SYNC_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SYNC_FILE)) {
    const initial: SyncData = {
      presence: {},
      messages: [],
      sharing: { leader: null, mediaId: null, status: 'idle' }
    };
    fs.writeFileSync(SYNC_FILE, JSON.stringify(initial, null, 2));
  }
}

export async function getSyncState(userName: string) {
  try {
    ensureFileSync();
    const now = Date.now();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));

    // Update current user presence
    data.presence[userName] = now;
    
    // Clean old presence (inactive for > 30s)
    const cleanedPresence: Record<string, number> = {};
    Object.entries(data.presence).forEach(([user, time]) => {
      if (now - time < 30000) cleanedPresence[user] = time;
    });
    data.presence = cleanedPresence;

    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return data;
  } catch (e) {
    return null;
  }
}

export async function sendSyncMessage(sender: string, text: string) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    data.messages.push({ sender, text, timestamp: Date.now() });
    
    // Keep last 50 messages
    if (data.messages.length > 50) data.messages = data.messages.slice(-50);
    
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateSharingState(leader: string | null, mediaId: string | null, status: SyncData['sharing']['status']) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    data.sharing = { leader, mediaId, status };
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}
