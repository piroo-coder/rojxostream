"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Music, Info, Star, MessageSquare, ExternalLink, Play, Video, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();
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
    setSongMode(mode);
  };

  const bgImage = currentlyPlaying.audioBackgroundUrl || currentlyPlaying.thumbnailUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 overflow-hidden">
      {/* Immersive Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt="Immersive Background"
          fill
          className="object-cover scale-110 blur-2xl opacity-60 transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[70] bg-white/10 rounded-full backdrop-blur-xl"
        onClick={() => {
          setCurrentlyPlaying(null);
          setSongMode('video');
        }}
      >
        <X size={28} />
      </Button>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-7xl w-full h-full lg:h-[85vh] bg-card/20 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="relative w-full h-full bg-black/40 flex flex-col overflow-hidden">
          {/* Playback Area */}
          <div className="flex-1 relative overflow-hidden group">
            {isYoutube ? (
              <div className="w-full h-full relative">
                {isSong && songMode === 'audio' ? (
                  <div key="audio-player" className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-transparent">
                    <div className="absolute inset-0 opacity-40">
                       <Image 
                        src={currentlyPlaying.audioBackgroundUrl || currentlyPlaying.thumbnailUrl} 
                        alt="Visualization"
                        fill
                        className="object-cover animate-pulse-slow"
                      />
                    </div>
                    <div className="relative z-30 flex flex-col items-center gap-8 text-center p-6">
                      <div className="w-48 h-48 rounded-full bg-primary/20 backdrop-blur-3xl flex items-center justify-center animate-pulse border-4 border-primary/30 shadow-[0_0_80px_rgba(var(--primary),0.4)]">
                        <Music className="text-primary" size={80} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.6em] text-accent/80">Premium Audio Stream</p>
                        <h2 className="text-3xl font-headline font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{currentlyPlaying.title}</h2>
                        <p className="text-lg text-white/60 font-medium">{currentlyPlaying.creator}</p>
                      </div>
                    </div>
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
                    className="w-full h-full border-0 animate-in fade-in duration-700"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-8 bg-transparent">
                <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-2xl">
                  <ExternalLink size={48} />
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-headline font-bold mb-3">Immersive Player</h3>
                  <p className="text-white/60 text-lg mb-8">
                    Content is loading from secure source. Click to launch full experience.
                  </p>
                  <Button onClick={handleOpenSource} size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-xl font-bold group shadow-2xl shadow-primary/20">
                    <Play size={24} className="mr-3 fill-current" /> Play Universe 
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Toggle for Songs */}
          {isSong && (
            <div className="p-6 bg-black/60 backdrop-blur-3xl border-t border-white/10 flex items-center justify-center gap-8 z-30">
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                size="lg"
                className="rounded-full gap-3 px-8 h-14 text-lg font-bold transition-all hover:scale-105"
                onClick={() => handleModeChange('video')}
              >
                <Video size={20} /> Video
              </Button>
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                size="lg"
                className="rounded-full gap-3 px-8 h-14 text-lg font-bold transition-all hover:scale-105"
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={20} /> Audio
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-full bg-black/20">
          <div className="p-10 lg:p-14 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-accent bg-accent/10 px-6 py-2 rounded-full border border-accent/20">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-6xl font-headline font-bold mb-6 tracking-tighter leading-none drop-shadow-2xl">{currentlyPlaying.title}</h1>
              <div className="flex flex-wrap items-center gap-8 text-white/70">
                <span className="text-accent font-bold text-2xl">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-2.5 bg-yellow-500/10 text-yellow-500 px-5 py-2.5 rounded-2xl border border-yellow-500/20">
                    <Star size={20} className="fill-current" />
                    <span className="font-black text-xl">{currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-accent">
                  <Info size={28} />
                  Story Context
                </h3>
                <p className="text-white/80 text-2xl leading-relaxed font-light tracking-wide">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-10 rounded-[3rem] bg-primary/10 border border-primary/20 space-y-6 relative overflow-hidden group shadow-inner">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-primary/20 transition-colors" />
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-primary relative z-10">
                  <MessageSquare size={30} />
                  The Essence
                </h3>
                <p className="text-white text-2xl font-medium leading-relaxed italic relative z-10 pl-4 border-l-4 border-primary/30">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-10 flex flex-col gap-5">
              <Button onClick={handleOpenSource} variant="outline" className="h-20 rounded-[1.5rem] border-white/10 hover:bg-white/10 text-xl font-bold transition-all hover:scale-[1.02] backdrop-blur-xl">
                <ExternalLink className="mr-3" size={24} /> Official Metadata Source
              </Button>
              <Button 
                className="h-20 rounded-[1.5rem] bg-secondary/80 text-white hover:bg-secondary text-2xl font-black transition-all shadow-2xl"
                onClick={() => {
                  setCurrentlyPlaying(null);
                  setSongMode('video');
                }}
              >
                Exit Universe
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
