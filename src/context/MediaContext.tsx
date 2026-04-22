'use client';

import React, { createContext, useContext, useState } from 'react';
import { MediaItem } from '@/app/types/media';

interface MediaContextType {
  library: MediaItem[];
  currentlyPlaying: MediaItem | null;
  setCurrentlyPlaying: (item: MediaItem | null) => void;
  addToLibrary: (item: MediaItem) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const initialData: MediaItem[] = [
  {
    id: 'a1',
    type: 'anime',
    title: 'Suzume',
    thumbnailUrl: 'https://wallpapers.com/images/hd/suzume-anime-movie-poster-69doru0ca93nyhwn.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/suzume.mp4',
    creator: 'Makoto Shinkai',
    imdbRating: '7.7',
    summary: 'A 17-year-old girl named Suzume helps a mysterious young man close doors from the other side that are releasing disasters all over Japan.',
    moral: 'Coming to terms with past trauma is essential for moving forward.',
    genre: ['Adventure', 'Fantasy']
  },
  {
    id: 'a2',
    type: 'anime',
    title: 'I Want to Eat Your Pancreas',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5496669.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/i-want-to-eat-your-pancreas.mp4',
    creator: 'Shin\'ichirō Ushijima',
    imdbRating: '8.0',
    summary: 'An aloof high school student finds the diary of his popular classmate and learns she is dying from a pancreatic disease.',
    moral: 'Live every day to the fullest, for life is fragile and beautiful.',
    genre: ['Drama', 'Romance']
  },
  {
    id: 'a3',
    type: 'anime',
    title: 'The Garden of Words',
    thumbnailUrl: 'https://wallpapercat.com/w/full/5/2/a/32983-1920x1080-desktop-full-hd-the-garden-of-words-wallpaper-photo.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/the-garden-of-words.mp4',
    creator: 'Makoto Shinkai',
    imdbRating: '7.4',
    summary: 'A 15-year-old boy training to be a shoemaker skips school on rainy days to sketch shoes in a Japanese garden and meets a mysterious older woman.',
    moral: 'Sometimes, a brief connection can give us the strength to keep walking.',
    genre: ['Drama', 'Romance']
  },
  {
    id: 'a4',
    type: 'anime',
    title: 'A Silent Voice',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5165277.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/a-silent-voice.mp4',
    creator: 'Naoko Yamada',
    imdbRating: '8.1',
    summary: 'A young man who bullied a deaf classmate in elementary school tries to make amends years later after meeting her again.',
    moral: 'Forgiveness, both for others and oneself, is the path to redemption.',
    genre: ['Drama', 'Romance']
  },
  {
    id: 'a5',
    type: 'anime',
    title: 'Your Name',
    thumbnailUrl: 'https://4kwallpapers.com/images/walls/thumbs_3t/14943.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/your-name.mp4',
    creator: 'Makoto Shinkai',
    imdbRating: '8.4',
    summary: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    moral: 'Destiny is real, but it requires effort and memory to fulfill.',
    genre: ['Fantasy', 'Romance']
  },
  {
    id: 'a6',
    type: 'anime',
    title: 'Weathering with You',
    thumbnailUrl: 'https://m.gettywallpapers.com/wp-content/uploads/2021/09/Weathering-With-You-Background-Images.png',
    mediaUrl: 'https://watchanimeworld.net/videos/weathering-with-you.mp4',
    creator: 'Makoto Shinkai',
    imdbRating: '7.5',
    summary: 'A high-school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.',
    moral: 'Sometimes the world\'s balance matters less than the person you love.',
    genre: ['Fantasy', 'Drama']
  },
  {
    id: 'm5',
    type: 'movie',
    title: 'Chhichhore',
    thumbnailUrl: 'https://watchanimeworld.net/thumbnails/chhichhore.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/chhichhore.mp4',
    creator: 'Nitesh Tiwari',
    imdbRating: '8.3',
    summary: 'A group of college friends reunite after a tragic incident involving one of their children, recalling their days as "losers".',
    moral: 'Success is not the destination; the effort we put in is what truly counts.',
    genre: ['Comedy', 'Drama']
  },
  {
    id: 'm6',
    type: 'movie',
    title: 'Half Girlfriend',
    thumbnailUrl: 'https://watchanimeworld.net/thumbnails/half-girlfriend.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/half-girlfriend.mp4',
    creator: 'Mohit Suri',
    imdbRating: '4.5',
    summary: 'A young man from a rural area falls in love with a wealthy girl at college, leading to a complex relationship.',
    moral: 'Persistence in love can bridge any gap.',
    genre: ['Romance', 'Drama']
  },
  {
    id: 'm7',
    type: 'movie',
    title: 'Oh My God',
    thumbnailUrl: 'https://watchanimeworld.net/thumbnails/oh-my-god.jpg',
    mediaUrl: 'https://watchanimeworld.net/videos/oh-my-god.mp4',
    creator: 'Umesh Shukla',
    imdbRating: '8.1',
    summary: 'A shopkeeper sues God after his shop is destroyed in an earthquake, leading to a trial that challenges religious norms.',
    moral: 'True spirituality is found in humanity, not just in rituals.',
    genre: ['Comedy', 'Fantasy']
  },
  {
    id: 's1',
    type: 'song',
    title: 'Suzume Theme Song',
    thumbnailUrl: 'https://picsum.photos/seed/suzumesong/600/400',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    creator: 'Radwimps',
    description: 'The hauntingly beautiful main theme from the movie Suzume.',
    youtubeViews: '45M',
    genre: ['J-Pop', 'Soundtrack']
  },
  {
    id: 's2',
    type: 'song',
    title: 'Fir Bhi Tumko Chahunga',
    thumbnailUrl: 'https://picsum.photos/seed/fbt/600/400',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    creator: 'Arijit Singh',
    description: 'A soulful ballad about eternal love from the movie Half Girlfriend.',
    youtubeViews: '150M',
    genre: ['Bollywood', 'Romantic']
  },
  {
    id: 's3',
    type: 'song',
    title: 'Zara Zara Behekta Hai',
    thumbnailUrl: 'https://picsum.photos/seed/zarazara/600/400',
    mediaUrl: 'https://www.youtube.com/watch?v=NeXbmEnpSz0',
    creator: 'Bombay Jayashri',
    description: 'A timeless romantic classic from Rehnaa Hai Terre Dil Mein.',
    youtubeViews: '200M',
    genre: ['Bollywood', 'Romantic']
  },
  {
    id: 'sh1',
    type: 'short',
    title: 'True Love Never Ends',
    thumbnailUrl: 'https://picsum.photos/seed/truelove/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/9d1N4c5tHxQ',
    creator: 'LoveStories',
    description: 'A short visual poem about the enduring nature of love.',
    youtubeViews: '2M'
  },
  {
    id: 'sh2',
    type: 'short',
    title: 'Life in Perspective',
    thumbnailUrl: 'https://picsum.photos/seed/perspective/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/wXpvE2QLgio',
    creator: 'DailyInsights',
    description: 'A profound look at life through a different lens.',
    youtubeViews: '5M'
  }
];

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<MediaItem[]>(initialData);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addToLibrary = (item: MediaItem) => {
    setLibrary((prev) => [item, ...prev]);
  };

  return (
    <MediaContext.Provider value={{ 
      library, 
      currentlyPlaying, 
      setCurrentlyPlaying, 
      addToLibrary,
      searchTerm,
      setSearchTerm
    }}>
      {children}
      {currentlyPlaying && (
        <div 
          className="fixed inset-0 z-[-1] filter blur-[100px] opacity-30 transition-all duration-1000" 
          style={{ backgroundImage: `url(${currentlyPlaying.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
