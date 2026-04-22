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
    // Add additional params for autoplay and controls
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  };

  const handleOpenSource = () => {
    window.open(currentlyPlaying.mediaUrl, '_blank');
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full h-full lg:h-[85vh] bg-card/30 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
          {/* Playback Area */}
          <div className="flex-1 relative overflow-hidden group">
            {isYoutube ? (
              <div className="w-full h-full relative">
                {/* Audio Mode Overlay */}
                {isSong && songMode === 'audio' && currentlyPlaying.audioBackgroundUrl && (
                  <div className="absolute inset-0 z-20 animate-in fade-in duration-500">
                    <Image 
                      src={currentlyPlaying.audioBackgroundUrl} 
                      alt="Audio Visualization"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center animate-pulse border border-primary/30">
                          <Music className="text-primary" size={40} />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/50">Listening Mode</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <iframe 
                  src={getYoutubeEmbedUrl(currentlyPlaying.mediaUrl)}
                  className={cn(
                    "w-full h-full border-0 transition-all duration-700",
                    isSong && songMode === 'audio' ? "opacity-0 invisible pointer-events-none" : "opacity-100"
                  )}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Always keep the audio playing in background for Audio mode */}
                {isSong && songMode === 'audio' && (
                  <iframe 
                    src={getYoutubeEmbedUrl(currentlyPlaying.mediaUrl)}
                    className="absolute opacity-0 pointer-events-none"
                    allow="autoplay"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <ExternalLink size={40} />
                </div>
                <div className="max-w-md">
                  <h3 className="text-2xl font-headline font-bold mb-2">Internal Media Player</h3>
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
            <div className="p-4 bg-black/50 backdrop-blur-md border-t border-white/5 flex items-center justify-center gap-4 z-30">
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setSongMode('video')}
              >
                <Video size={16} /> Video Mode
              </Button>
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setSongMode('audio')}
              >
                <Headset size={16} /> Audio Mode
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-full p-8 md:p-12">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-5xl font-headline font-bold mb-4 tracking-tight leading-tight">{currentlyPlaying.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <span className="text-accent font-semibold text-lg">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-xl border border-yellow-500/20">
                    <Star size={18} className="fill-current" />
                    <span className="font-bold">{currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {currentlyPlaying.summary && (
              <div className="space-y-3">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3 text-white/90">
                  <Info size={22} className="text-accent" />
                  Storyline
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {currentlyPlaying.summary}
                </p>
              </div>
            )}

            {currentlyPlaying.description && !currentlyPlaying.summary && (
              <div className="space-y-3">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3 text-white/90">
                  <Info size={22} className="text-accent" />
                  Description
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3 text-primary">
                  <MessageSquare size={22} />
                  The Moral
                </h3>
                <p className="text-foreground/90 text-lg font-medium leading-snug italic">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-6 flex flex-col gap-4">
              <Button onClick={handleOpenSource} variant="outline" className="h-14 rounded-2xl border-white/10 hover:bg-white/5 text-lg">
                <ExternalLink className="mr-3" size={20} /> Official Link
              </Button>
              <Button 
                className="h-14 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg font-bold"
                onClick={() => {
                  setCurrentlyPlaying(null);
                  setVideoError(false);
                  setSongMode('video');
                }}
              >
                Close Player
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
