"use client";

import { useMedia } from '@/context/MediaContext';
import { MovieAnimeView } from './details/MovieAnimeView';
import { SongView } from './details/SongView';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();

  if (!currentlyPlaying) return null;

  const handleClose = () => setCurrentlyPlaying(null);

  // Dispatch to the specific isolated view based on media type
  if (currentlyPlaying.type === 'movie' || currentlyPlaying.type === 'anime') {
    return <MovieAnimeView item={currentlyPlaying} onClose={handleClose} />;
  }

  if (currentlyPlaying.type === 'song') {
    return <SongView item={currentlyPlaying} onClose={handleClose} />;
  }

  // Fallback for types not yet refactored (e.g., shorts)
  return (
    <div className="fixed inset-0 z-[60] bg-background flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">{currentlyPlaying.title}</h2>
        <button onClick={handleClose} className="text-accent underline">Close Portal</button>
      </div>
    </div>
  );
};