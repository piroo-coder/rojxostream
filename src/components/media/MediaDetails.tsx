
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
  const [songMode, setSongMode] = useState<'video' | 'audio'>('audio');

  useEffect(() => {
    if (currentlyPlaying) {
      setSongMode('audio');
    }
  }, [currentlyPlaying?.id]);

  if (!currentlyPlaying) return null;

  const isSong = currentlyPlaying.type === 'song';
  
  const isYoutube = currentlyPlaying.mediaUrl.includes('youtube.com') || currentlyPlaying.mediaUrl.includes('youtu.be');
  const isDailymotion = currentlyPlaying.mediaUrl.includes('dailymotion.com') || currentlyPlaying.mediaUrl.includes('dai.ly');
  const isVimeo = currentlyPlaying.mediaUrl.includes('vimeo.com');
  const isVideas = currentlyPlaying.mediaUrl.includes('videas.fr');
  const isGenericEmbed = currentlyPlaying.mediaUrl.includes('/embed/');
  
  const getYoutubeEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('shorts/')) {
      id = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      id = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      id = url.split('be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&loop=1&playlist=${id}`;
  };

  const getDailymotionEmbedUrl = (url: string) => {
    const parts = url.split('/');
    const id = parts[parts.length - 1].split('?')[0];
    return `https://www.dailymotion.com/embed/video/${id}?autoplay=1&mute=0`;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const parts = url.split('/');
    const id = parts[parts.length - 1].split('?')[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1`;
  };

  const handleOpenSource = () => window.open(currentlyPlaying.mediaUrl, '_blank');

  const handleModeChange = (mode: 'video' | 'audio') => {
    if (mode === songMode) return;
    setSongMode(mode);
  };

  const bgImage = currentlyPlaying.audioBackgroundUrl || currentlyPlaying.thumbnailUrl;

  const getEmbedSource = () => {
    if (isYoutube) return getYoutubeEmbedUrl(currentlyPlaying.mediaUrl);
    if (isDailymotion) return getDailymotionEmbedUrl(currentlyPlaying.mediaUrl);
    if (isVimeo) return getVimeoEmbedUrl(currentlyPlaying.mediaUrl);
    return currentlyPlaying.mediaUrl;
  };

  const isEmbeddable = isYoutube || isDailymotion || isVimeo || isVideas || isGenericEmbed;

  return (
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-500 overflow-hidden bg-background h-svh w-screen flex flex-col">
      {/* Cinematic Global Background - Clearly Visible */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={bgImage} 
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 transition-opacity duration-1000"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>

      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-3xl border border-white/10 w-10 h-10 sm:w-14 sm:h-14 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X className="size-5 sm:size-7" />
      </Button>

      <ScrollArea className="flex-1 w-full h-full relative z-10">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24 space-y-8 md:space-y-12">
          
          {/* 1. Header: Title & Creator (Above) */}
          <div className="text-center space-y-4 animate-in slide-in-from-top-8 duration-700">
            <div className="flex justify-center">
              <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-accent bg-accent/20 px-4 py-1.5 rounded-full border border-accent/20 shadow-inner backdrop-blur-md">
                {currentlyPlaying.type}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tighter leading-tight text-white drop-shadow-2xl">
              {currentlyPlaying.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <span className="text-accent font-bold text-lg sm:text-2xl md:text-3xl drop-shadow-xl">{currentlyPlaying.creator}</span>
              {currentlyPlaying.imdbRating && (
                <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-xl border border-yellow-500/20 backdrop-blur-md">
                  <Star size={14} className="fill-current" />
                  <span className="font-black text-xs sm:text-base">IMDb {currentlyPlaying.imdbRating}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Middle: Media Player (Video/Audio) */}
          <div className="relative group mx-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-700">
            <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/40">
              {isEmbeddable ? (
                <>
                  {isSong && songMode === 'audio' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-700">
                      {/* High Visibility Background for Audio Mode */}
                      <div className="absolute inset-0">
                        <Image 
                          src={bgImage} 
                          alt=""
                          fill
                          className="object-cover opacity-80"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                      
                      {/* Vinyl Visualizer */}
                      <div className="relative z-30 flex flex-col items-center gap-6">
                        <div className="relative group">
                          <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
                          <div className="w-32 h-32 sm:w-48 md:w-56 rounded-full bg-black/60 backdrop-blur-3xl flex items-center justify-center animate-[spin_20s_linear_infinite] border-4 border-white/20 shadow-2xl relative z-10 overflow-hidden ring-1 ring-primary/20">
                             <Music className="text-primary/60 w-12 h-12 sm:w-20 md:w-24 drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                          </div>
                        </div>
                      </div>

                      {/* Hidden Background Player */}
                      <iframe 
                        src={getEmbedSource()}
                        className="absolute opacity-0 pointer-events-none w-1 h-1"
                        allow="autoplay"
                      />
                    </div>
                  )}

                  {(!isSong || songMode === 'video') && (
                    <iframe 
                      src={getEmbedSource()}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-6">
                  <ExternalLink size={48} className="text-primary" />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-headline font-bold">External Reality</h3>
                    <p className="text-white/60 text-sm sm:text-base max-w-md">Connect to the original source to witness this media's full narrative.</p>
                    <Button onClick={handleOpenSource} size="lg" className="rounded-xl bg-primary shadow-lg shadow-primary/30">
                      <Play className="mr-2 fill-current" size={14} /> Establish Connection
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mode Controls for Songs */}
            {isSong && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-black/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl z-30">
                <Button 
                  size="sm"
                  variant={songMode === 'audio' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-10 px-6 gap-2 font-bold", songMode === 'audio' ? "bg-primary" : "text-white/40")}
                  onClick={() => handleModeChange('audio')}
                >
                  <Headset size={16} /> Audio
                </Button>
                <Button 
                  size="sm"
                  variant={songMode === 'video' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-10 px-6 gap-2 font-bold", songMode === 'video' ? "bg-primary" : "text-white/40")}
                  onClick={() => handleModeChange('video')}
                >
                  <Video size={16} /> Video
                </Button>
              </div>
            )}
          </div>

          {/* 3. Footer: Description & Moral (Below) */}
          <div className="max-w-4xl mx-auto space-y-10 pt-8 animate-in slide-in-from-bottom-8 duration-700">
            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-headline font-bold flex items-center gap-2 text-white/40 uppercase tracking-[0.3em]">
                  <Info size={14} /> Narrative
                </h3>
                <p className="text-white/90 text-base sm:text-xl leading-relaxed font-light italic tracking-tight">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-8 sm:p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                  <MessageSquare size={120} className="text-primary" />
                </div>
                <h3 className="text-[10px] font-headline font-bold text-primary/60 uppercase tracking-[0.3em] mb-4">The Core Essence</h3>
                <p className="text-white text-lg sm:text-2xl font-medium leading-snug italic border-l-3 border-primary/30 pl-6">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pb-20">
              <Button onClick={handleOpenSource} variant="outline" className="h-14 sm:h-16 rounded-2xl border-white/10 flex-1 hover:bg-white/5 font-bold">
                <ExternalLink size={18} className="mr-2 text-accent" /> Dimension Details
              </Button>
              <Button 
                variant="secondary"
                className="h-14 sm:h-16 rounded-2xl flex-1 bg-white/5 hover:bg-white/10 font-bold"
                onClick={() => setCurrentlyPlaying(null)}
              >
                Close Archive
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
