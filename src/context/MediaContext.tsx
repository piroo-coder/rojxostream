
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/app/types/media';
import { getSyncState, SyncData } from '@/app/actions/sync-actions';

interface MediaContextType {
  library: MediaItem[];
  currentlyPlaying: MediaItem | null;
  setCurrentlyPlaying: (item: MediaItem | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
  syncData: SyncData | null;
  isOtherOnline: boolean;
  isOtherTyping: boolean;
  otherUser: string | null;
  isInitializing: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library] = useState<MediaItem[]>([]); // Media content removed for screen sharing focus
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserNameState] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Authentication uses sessionStorage to ensure logout on refresh as requested
  useEffect(() => {
    const stored = sessionStorage.getItem('rojxo_user');
    if (stored) setUserNameState(stored);
    setIsInitializing(false);
  }, []);

  const setUserName = (name: string | null) => {
    if (name) sessionStorage.setItem('rojxo_user', name);
    else sessionStorage.removeItem('rojxo_user');
    setUserNameState(name);
  };

  const fetchSync = useCallback(async () => {
    if (!userName) return;
    const data = await getSyncState(userName);
    if (data) {
      setSyncData(data);
    }
  }, [userName]);

  useEffect(() => {
    if (userName) {
      const interval = setInterval(fetchSync, 800);
      return () => clearInterval(interval);
    }
  }, [fetchSync, userName]);

  const otherUser = userName === 'Abhi' ? 'Priyu' : 'Abhi';
  const isOtherOnline = !!syncData?.presence[otherUser];
  const isOtherTyping = !!syncData?.typing[otherUser];

  return (
    <MediaContext.Provider value={{ 
      library, 
      currentlyPlaying, 
      setCurrentlyPlaying, 
      searchTerm,
      setSearchTerm,
      userName,
      setUserName,
      syncData,
      isOtherOnline,
      isOtherTyping,
      otherUser,
      isInitializing
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMedia must be used within a MediaProvider');
  return context;
};
