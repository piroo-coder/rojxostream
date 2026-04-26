'use server';

/**
 * @fileOverview Local File-Backed Presence Actions.
 * Tracks "Real" online users within the repository filesystem.
 */

import fs from 'fs';
import path from 'path';

const PRESENCE_FILE = path.join(process.cwd(), 'src/app/lib/presence.json');

interface UserPresence {
  name: string;
  lastSeen: number;
}

function ensureFile() {
  const dir = path.dirname(PRESENCE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PRESENCE_FILE)) {
    fs.writeFileSync(PRESENCE_FILE, JSON.stringify({}, null, 2));
  }
}

/**
 * Updates a user's presence and returns the list of all active users.
 */
export async function updateAndGetPresence(userName: string) {
  try {
    ensureFile();
    const now = Date.now();
    const data = fs.readFileSync(PRESENCE_FILE, 'utf8');
    const presenceMap: Record<string, UserPresence> = JSON.parse(data || '{}');

    // 1. Update Current User
    presenceMap[userName] = {
      name: userName,
      lastSeen: now
    };

    // 2. Filter out inactive users (older than 30 seconds)
    const activeUsers: string[] = [];
    const updatedMap: Record<string, UserPresence> = {};

    Object.entries(presenceMap).forEach(([name, presence]) => {
      if (now - presence.lastSeen < 30000) {
        updatedMap[name] = presence;
        activeUsers.push(presence.name);
      }
    });

    // 3. Save back to file
    fs.writeFileSync(PRESENCE_FILE, JSON.stringify(updatedMap, null, 2));

    return activeUsers;
  } catch (err) {
    console.error("Presence update error:", err);
    return [userName]; // Fallback to just the current user
  }
}

/**
 * Fetches the current list of online users.
 */
export async function getOnlineUsers() {
  try {
    ensureFile();
    const now = Date.now();
    const data = fs.readFileSync(PRESENCE_FILE, 'utf8');
    const presenceMap: Record<string, UserPresence> = JSON.parse(data || '{}');

    return Object.values(presenceMap)
      .filter(p => now - p.lastSeen < 30000)
      .map(p => p.name);
  } catch (err) {
    return [];
  }
}
