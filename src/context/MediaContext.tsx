
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

const initialData: MediaItem[] = [
  {
    id: 'a1',
    type: 'anime',
    title: 'Suzume',
    thumbnailUrl: 'https://wallpapers.com/images/hd/suzume-anime-movie-poster-69doru0ca93nyhwn.jpg',
    mediaUrl: 'https://www.dailymotion.com/video/x9te5vk',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=_KFk8FVr4mk',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Koichiro Ito, Genki Kawamura',
    theme: 'Coming of age, Disaster, Fantasy',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Suzume_(film)',
    mangaUrl: 'https://mangamirai.com/product_collections/a573a65b-6a2a-468e-8783-3bf3fa6e395f',
    imdbRating: '7.7',
    summary: 'A 17-year-old girl named Suzume helps a mysterious young man close doors from the other side that are releasing disasters all over Japan.',
    moral: 'Coming to terms with past trauma is essential for moving forward.',
    genre: ['Adventure', 'Fantasy'],
    relatedShortIds: ['sh10'],
    characters: [
      { name: "Suzume Iwato", role: "Main Protagonist", image_url: "https://cdn.anisearch.com/images/character/cover/121/121822_400.webp" },
      { name: "Souta Munakata", role: "The Closer", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJb7HiZNRg5og-WOFj1kdoacn2WZuN9Z3qseWZxbuyjVpbhrLIjSPSOi2eZWn7sLb2jck7L4dwLTC-1BOz73C_1CIOOzYah-rbnomjLigUg&s=10" }
    ]
  },
  {
    id: 'a2',
    type: 'anime',
    title: 'I Want to Eat Your Pancreas',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5496669.jpg',
    mediaUrl: 'https://app.videas.fr/embed/media/69469d2b-d21b-4636-94d2-b6613c005089/',
    creator: 'Shin\'ichirō Ushijima',
    imdbRating: '8.0',
    summary: 'A dying girl and an aloof boy find a connection that transcends life and death.',
    moral: 'Live every day to the fullest, for every heartbeat is a gift.',
    genre: ['Drama', 'Romance'],
    relatedShortIds: ['sh1'],
    characters: [
      { name: "Sakura Yamauchi", role: "The Dying Girl", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2P6I_S5H1X7L2U6H3_N2N5A3S4P5_U6V7W8&s" },
      { name: "Haruki Shiga", role: "Aloof Boy", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_P9U6I_S5H1X7L2U6H3_N2N5A3S4P5_U6V7W8&s" }
    ]
  },
  {
    id: 'sh1',
    type: 'short',
    title: 'Pancreas Sad Moment',
    thumbnailUrl: 'https://picsum.photos/seed/sh1/600/400',
    mediaUrl: 'https://www.youtube.com/shorts/vAEc_DMNz00',
    creator: 'AnimeFragments'
  },
  {
    id: 'a4',
    type: 'anime',
    title: 'A Silent Voice',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5165277.jpg',
    mediaUrl: 'https://www.dropbox.com/scl/fi/wo0nqqg27jckoym42v8hc/a-silent-voice.mp4?rlkey=nl6cmtjct02abzjtebje4ouy2&st=z3n2evlg&dl=0',
    creator: 'Naoko Yamada',
    imdbRating: '8.1',
    summary: 'Making amends for childhood bullying through empathy and growth.',
    moral: 'Forgiveness is the path to redemption.',
    genre: ['Drama', 'Romance'],
    characters: [
      { name: "Shoya Ishida", role: "Repentant Bully", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3_P9U6I_S5H1X7L2U6H3_N2N5A3S4P5_U6V7W8&s" },
      { name: "Shoko Nishimiya", role: "Gentle Soul", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4_P9U6I_S5H1X7L2U6H3_N2N5A3S4P5_U6V7W8&s" }
    ]
  },
  {
    id: 'm1',
    type: 'movie',
    title: 'Chhichhore',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp6319679.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=3Q1yTBHjwXc',
    creator: 'Nitesh Tiwari',
    imdbRating: '8.3',
    summary: 'College friends reunite after a tragedy to learn that failing isn\'t the end.',
    moral: 'Effort counts more than success.',
    genre: ['Comedy', 'Drama']
  }
];

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library] = useState<MediaItem[]>(initialData);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserNameState] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

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
      if (data.sharing.status === 'active' && data.sharing.leader !== userName) {
        if (data.sharing.mediaId && currentlyPlaying?.id !== data.sharing.mediaId) {
          const item = library.find(i => i.id === data.sharing.mediaId);
          if (item) setCurrentlyPlaying(item);
        }
      }
    }
  }, [userName, library, currentlyPlaying]);

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
