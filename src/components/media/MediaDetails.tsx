"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Music, Info, Star, MessageSquare, ExternalLink, Play, Video, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();
  const [videoError, setVideoError] = useState(false);
  const [songMode, setSongMode] = useState<'video' | 'audio'>('video');

  if (!currentlyPlaying) return null;

  const isSong = currentlyPlaying.type === 'song';
  const isYoutube = currentlyPlaying.mediaUrl.includes('youtube.com') || currentlyPlaying.mediaUrl.includes('youtu.be');
  
  const getYoutubeEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('shorts/')) {
      id = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      id = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      id = url.split('be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  };

  const handleOpenSource = () => {
    window.open(currentlyPlaying.mediaUrl, '_blank');
  };

  const handleModeChange = (mode: 'video' | 'audio') => {
    if (mode === songMode) return;
    // Changing the mode state will force a re-render of the playback area
    setSongMode(mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-3xl p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-[60] bg-white/5 rounded-full"
        onClick={() => {
          setCurrentlyPlaying(null);
          setVideoError(false);
          setSongMode('video');
        }}
      >
        <X size={24} />
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full h-full lg:h-[85vh] bg-card/30 rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
          {/* Playback Area */}
          <div className="flex-1 relative overflow-hidden group">
            {isYoutube ? (
              <div className="w-full h-full relative">
                {/* 
                   We use 'key' here tied to songMode. 
                   When key changes, React unmounts and remounts the iframe.
                   This effectively stops the sound from the previous mode and starts fresh sound in the new mode.
                */}
                {isSong && songMode === 'audio' ? (
                  <div key="audio-player" className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
                    {currentlyPlaying.audioBackgroundUrl && (
                      <Image 
                        src={currentlyPlaying.audioBackgroundUrl} 
                        alt="Audio Visualization"
                        fill
                        className="object-cover opacity-60 animate-in fade-in duration-1000"
                        priority
                      />
                    )}
                    <div className="relative z-30 flex flex-col items-center gap-6">
                      <div className="w-32 h-32 rounded-full bg-primary/20 backdrop-blur-2xl flex items-center justify-center animate-pulse border-2 border-primary/40 shadow-[0_0_50px_rgba(var(--primary),0.3)]">
                        <Music className="text-primary" size={60} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.4em] text-primary/80 mb-2">Exclusive Audio Mode</p>
                        <h2 className="text-xl font-headline font-bold text-white drop-shadow-md">Now Playing: {currentlyPlaying.title}</h2>
                      </div>
                    </div>
                    {/* Hidden YouTube player for audio sound only */}
                    <iframe 
                      src={getYoutubeEmbedUrl(currentlyPlaying.mediaUrl)}
                      className="absolute opacity-0 pointer-events-none w-1 h-1"
                      allow="autoplay"
                    />
                  </div>
                ) : (
                  <iframe 
                    key="video-player"
                    src={getYoutubeEmbedUrl(currentlyPlaying.mediaUrl)}
                    className="w-full h-full border-0 animate-in fade-in duration-500"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-6 bg-black">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <ExternalLink size={40} />
                </div>
                <div className="max-w-md">
                  <h3 className="text-2xl font-headline font-bold mb-2">External Content</h3>
                  <p className="text-muted-foreground mb-6">
                    Watching {currentlyPlaying.title}...
                  </p>
                  <Button onClick={handleOpenSource} size="lg" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-lg group">
                    <Play size={20} className="mr-2 fill-current" /> Open in Source 
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Toggle for Songs */}
          {isSong && (
            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-6 z-30">
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                size="lg"
                className="rounded-full gap-3 px-6 h-12"
                onClick={() => handleModeChange('video')}
              >
                <Video size={18} /> Video Mode
              </Button>
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                size="lg"
                className="rounded-full gap-3 px-6 h-12"
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={18} /> Audio Mode
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-full p-8 md:p-12">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-5xl font-headline font-bold mb-4 tracking-tight leading-tight drop-shadow-sm">{currentlyPlaying.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <span className="text-accent font-semibold text-xl">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-xl border border-yellow-500/20">
                    <Star size={18} className="fill-current" />
                    <span className="font-bold text-lg">{currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {currentlyPlaying.summary && (
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-white/90">
                  <Info size={24} className="text-accent" />
                  Storyline
                </h3>
                <p className="text-muted-foreground text-xl leading-relaxed font-light">
                  {currentlyPlaying.summary}
                </p>
              </div>
            )}

            {currentlyPlaying.description && !currentlyPlaying.summary && (
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-white/90">
                  <Info size={24} className="text-accent" />
                  Description
                </h3>
                <p className="text-muted-foreground text-xl leading-relaxed font-light">
                  {currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-primary relative z-10">
                  <MessageSquare size={26} />
                  The Moral
                </h3>
                <p className="text-foreground/90 text-xl font-medium leading-relaxed italic relative z-10">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-8 flex flex-col gap-4">
              <Button onClick={handleOpenSource} variant="outline" className="h-16 rounded-2xl border-white/10 hover:bg-white/5 text-xl font-medium transition-all hover:scale-[1.02]">
                <ExternalLink className="mr-3" size={22} /> Official Resource Link
              </Button>
              <Button 
                className="h-16 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xl font-bold transition-all"
                onClick={() => {
                  setCurrentlyPlaying(null);
                  setVideoError(false);
                  setSongMode('video');
                }}
              >
                Close Universe
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
