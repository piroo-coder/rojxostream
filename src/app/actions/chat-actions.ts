'use server';

import fs from 'fs/promises';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'src/app/lib/messages.json');

export interface ChatMessage {
  id: string;
  sender: 'Abhi' | 'Priya';
  text: string;
  timestamp: number;
}

export async function getMessages(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
}

export async function sendMessage(sender: 'Abhi' | 'Priya', text: string) {
  try {
    const messages = await getMessages();
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: Date.now(),
    };

    // Add new message and keep only the recent 100
    const updatedMessages = [...messages, newMessage].slice(-100);
    
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(updatedMessages, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving message:', error);
    return { success: false };
  }
}
