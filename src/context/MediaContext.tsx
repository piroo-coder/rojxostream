
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem } from '@/app/types/media';

interface MediaContextType {
  library: MediaItem[];
  currentlyPlaying: MediaItem | null;
  setCurrentlyPlaying: (item: MediaItem | null) => void;
  addToLibrary: (item: MediaItem) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaItem | null>(null);

  useEffect(() => {
    // Initial mock data
    const initialData: MediaItem[] = [
      {
        id: '1',
        type: 'movie',
        title: 'Project RojXO',
        thumbnailUrl: 'https://picsum.photos/seed/roj1/600/400',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        creator: 'Director X',
        imdbRating: '8.9',
        rottenTomatoesRating: '95%',
        summary: 'A futuristic journey through the neon-lit streets of Neo-Tokyo as a young hacker discovers a secret that could change the world forever.',
        moral: 'Technology is a tool, but humanity is the master.',
        genre: ['Sci-Fi', 'Cyberpunk']
      },
      {
        id: '2',
        type: 'song',
        title: 'Midnight Echoes',
        thumbnailUrl: 'https://picsum.photos/seed/echoes/600/400',
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        creator: 'Luna Violet',
        description: 'A soothing lofi beat for midnight wandering.',
        youtubeViews: '1.2M',
        genre: ['Lofi', 'Chill']
      },
      {
        id: '3',
        type: 'short',
        title: 'Life in 15 Seconds',
        thumbnailUrl: 'https://picsum.photos/seed/short1/400/600',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        creator: 'ShortsDaily',
        youtubeViews: '500K',
        description: 'Catching the sunset over the horizon.'
      }
    ];
    setLibrary(initialData);
  }, []);

  const addToLibrary = (item: MediaItem) => {
    setLibrary((prev) => [item, ...prev]);
  };

  return (
    <MediaContext.Provider value={{ library, currentlyPlaying, setCurrentlyPlaying, addToLibrary }}>
      {children}
      {currentlyPlaying && (
        <div 
          className="dynamic-bg-blur" 
          style={{ backgroundImage: `url(${currentlyPlaying.thumbnailUrl})` }}
        />
      )}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMedia must be used within a MediaProvider');
  return context;
};
