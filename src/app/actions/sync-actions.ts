'use server';

/**
 * @fileOverview High-Speed File-Based Sync Actions for Priyu & Abhi.
 * Handles Presence, Instant Chat, Typing Indicators, and Video Playback Sync.
 */

import fs from 'fs';
import path from 'path';

const SYNC_FILE = path.join(process.cwd(), 'src/app/lib/sync.json');

export interface SyncData {
  presence: Record<string, number>;
  typing: Record<string, number>;
  messages: { sender: string; text: string; timestamp: number }[];
  sharing: {
    leader: string | null;
    mediaId: string | null;
    status: 'idle' | 'requesting' | 'active';
    videoState: {
      currentTime: number;
      isPlaying: boolean;
      lastUpdated: number;
      isYouTube: boolean;
      youtubeId?: string;
    };
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
      sharing: { 
        leader: null, 
        mediaId: null, 
        status: 'idle',
        videoState: { currentTime: 0, isPlaying: false, lastUpdated: 0, isYouTube: false }
      }
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
    
    // Clean old presence and typing (inactive for > 15s)
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
    return null;
  }
}

export async function setTypingStatus(userName: string, isTyping: boolean) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
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
    data.messages.push({ sender, text, timestamp: Date.now() });
    if (data.messages.length > 100) data.messages = data.messages.slice(-100);
    delete data.typing[sender];
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateSharingState(
  leader: string | null, 
  mediaId: string | null, 
  status: SyncData['sharing']['status'],
  isYouTube = false,
  youtubeId?: string
) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    data.sharing = { 
      ...data.sharing,
      leader, 
      mediaId, 
      status,
      videoState: { 
        ...data.sharing.videoState,
        isYouTube,
        youtubeId: youtubeId || data.sharing.videoState.youtubeId
      }
    };
    if (status === 'idle') {
       data.sharing.videoState = { currentTime: 0, isPlaying: false, lastUpdated: 0, isYouTube: false };
    }
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export async function syncPlayback(leader: string, time: number, playing: boolean) {
  try {
    ensureFileSync();
    const data: SyncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    if (data.sharing.leader === leader) {
      data.sharing.videoState.currentTime = time;
      data.sharing.videoState.isPlaying = playing;
      data.sharing.videoState.lastUpdated = Date.now();
      fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
    }
    return true;
  } catch (e) {
    return false;
  }
}
