
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
    ],
    criticalAnalysis: {
      characterMotivations: [{ topic: "Suzume's Drive", explanation: "Unresolved grief." }],
      narrativeEvents: [{ event: "The Worm", explanation: "Disasters manifest in ruins." }],
      writersMessage: "Acknowledge history to move forward.",
      realLifeRelation: "2011 Earthquake dialogue.",
      importanceToUs: "Resilience is facing fears."
    }
  },
  {
    id: 'a2',
    type: 'anime',
    title: 'I Want to Eat Your Pancreas',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5496669.jpg',
    mediaUrl: 'https://app.videas.fr/embed/media/69469d2b-d21b-4636-94d2-b6613c005089/',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=vYqD3PEFRno',
    creator: 'Shin\'ichirō Ushijima',
    imdbRating: '8.0',
    summary: 'A dying girl and an aloof boy find a connection.',
    moral: 'Live every day to the fullest.',
    genre: ['Drama', 'Romance'],
    relatedShortIds: ['sh8', 'sh9']
  },
  {
    id: 'a3',
    type: 'anime',
    title: 'The Garden of Words',
    thumbnailUrl: 'https://wallpaperaccess.com/full/970464.jpg',
    mediaUrl: 'https://vimeo.com/855974784?fl=pl&fe=sh',
    creator: 'Makoto Shinkai',
    imdbRating: '7.4',
    summary: 'Rainy day meetings in a Japanese garden.',
    moral: 'Brief connections give us strength.',
    genre: ['Drama', 'Romance']
  },
  {
    id: 'a4',
    type: 'anime',
    title: 'A Silent Voice',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5165277.jpg',
    mediaUrl: 'https://www.dropbox.com/scl/fi/wo0nqqg27jckoym42v8hc/a-silent-voice.mp4?rlkey=nl6cmtjct02abzjtebje4ouy2&st=z3n2evlg&dl=0',
    creator: 'Naoko Yamada',
    imdbRating: '8.1',
    summary: 'Making amends for childhood bullying.',
    moral: 'Forgiveness is the path to redemption.',
    genre: ['Drama', 'Romance']
  },
  {
    id: 'a5',
    type: 'anime',
    title: 'Your Name',
    thumbnailUrl: 'https://4kwallpapers.com/images/walls/thumbs_3t/14943.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=vAEc_DMNz00',
    creator: 'Makoto Shinkai',
    imdbRating: '8.4',
    summary: 'Body-swapping teenagers connected by fate.',
    moral: 'Destiny requires effort and memory.',
    genre: ['Fantasy', 'Romance']
  },
  {
    id: 'a6',
    type: 'anime',
    title: 'Weathering with You',
    thumbnailUrl: 'https://m.gettywallpapers.com/wp-content/uploads/2021/09/Weathering-With-You-Background-Images.png',
    mediaUrl: 'https://www.dailymotion.com/video/x9fne28',
    creator: 'Makoto Shinkai',
    imdbRating: '7.5',
    summary: 'A runaway boy meets a weather-controlling girl.',
    moral: 'Love vs The World.',
    genre: ['Fantasy', 'Drama']
  },
  {
    id: 'm1',
    type: 'movie',
    title: 'Chhichhore',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp6319679.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=3Q1yTBHjwXc',
    creator: 'Nitesh Tiwari',
    imdbRating: '8.3',
    summary: 'College friends reunite after a tragedy.',
    moral: 'Effort counts more than success.',
    genre: ['Comedy', 'Drama']
  },
  {
    id: 'm2',
    type: 'movie',
    title: 'Half Girlfriend',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp8276890.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=AI9r3XjyOXs',
    creator: 'Mohit Suri',
    imdbRating: '4.5',
    summary: 'Persistence in love across classes.',
    moral: 'Persistence in love can bridge any gap.',
    genre: ['Romance', 'Drama']
  },
  {
    id: 'm3',
    type: 'movie',
    title: 'Oh My God',
    thumbnailUrl: 'https://i.ytimg.com/vi/1d3WlZAgZ7o/maxresdefault.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=MWxBbTtjmXg',
    creator: 'Umesh Shukla',
    imdbRating: '8.1',
    summary: 'A shopkeeper sues God after a disaster.',
    moral: 'Spirituality is in humanity.',
    genre: ['Comedy', 'Fantasy']
  },
  {
    id: 's1',
    type: 'song',
    title: 'Suzume Theme Song',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp12664354.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=m3w1mUXtCj0',
    creator: 'Radwimps',
    genre: ['J-Pop']
  },
  {
    id: 's2',
    type: 'song',
    title: 'Fir Bhi Tumko Chahunga',
    thumbnailUrl: 'https://wallpapers.com/images/hd/a-silent-voice-crying-couple-2hrblheq4u5w4q8c.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=jQdDpRTVe9k',
    creator: 'Arijit Singh',
    genre: ['Bollywood']
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
    const stored = localStorage.getItem('rojxo_user');
    if (stored) setUserNameState(stored);
    setIsInitializing(false);
  }, []);

  const setUserName = (name: string | null) => {
    if (name) localStorage.setItem('rojxo_user', name);
    else localStorage.removeItem('rojxo_user');
    setUserNameState(name);
  };

  const fetchSync = useCallback(async () => {
    if (!userName) return;
    const data = await getSyncState(userName);
    if (data) {
      setSyncData(data);
      if (data.sharing.status === 'active' && data.sharing.leader !== userName) {
        const item = library.find(i => i.id === data.sharing.mediaId);
        if (item && currentlyPlaying?.id !== item.id) {
          setCurrentlyPlaying(item);
        }
      }
    }
  }, [userName, library, currentlyPlaying]);

  useEffect(() => {
    if (userName) {
      const interval = setInterval(fetchSync, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchSync, userName]);

  const otherUser = userName === 'Abhi' ? 'Priyu' : 'Abhi';
  const isOtherOnline = !!syncData?.presence[otherUser];

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
