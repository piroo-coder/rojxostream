
"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Music, Info, ExternalLink, Play, Video, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      {/* Immersive Background Artwork - Fixed to be clearly visible */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={bgImage} 
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-80 transition-opacity duration-1000"
          priority
          unoptimized
        />
        {/* Cinematic Gradient Overlays for readability without heavy blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Persistent Close Control */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/10 w-10 h-10 sm:w-14 sm:h-14 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X className="size-5 sm:size-7" />
      </Button>

      <ScrollArea className="flex-1 w-full h-full relative z-10">
        <div className="container mx-auto max-w-5xl px-4 min-h-screen flex flex-col items-center justify-center py-16 md:py-24 space-y-12">
          
          {/* Section 1: Top Metadata */}
          <div className="text-center space-y-4 animate-in slide-in-from-top-8 duration-700 w-full">
            <div className="flex justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-black/20 px-4 py-1.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
                {currentlyPlaying.type}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tighter leading-tight text-white drop-shadow-2xl">
              {currentlyPlaying.title}
            </h1>
            <p className="text-accent font-bold text-lg sm:text-2xl drop-shadow-xl">{currentlyPlaying.creator}</p>
          </div>

          {/* Section 2: Centered Media Player */}
          <div className="relative group w-full max-w-4xl flex items-center justify-center">
            <div className="relative aspect-video w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 bg-black/40">
              {isEmbeddable ? (
                <>
                  {isSong && songMode === 'audio' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-700">
                      {/* Subdued Interior Background */}
                      <div className="absolute inset-0">
                        <Image 
                          src={bgImage} 
                          alt=""
                          fill
                          className="object-cover opacity-20"
                          unoptimized
                        />
                      </div>
                      
                      {/* Minimalist Fading Animation - Very Transparent */}
                      <div className="relative z-30 flex flex-col items-center gap-6">
                        <div className="relative group">
                          {/* Very Subtle Ambient Glow */}
                          <div className="absolute -inset-16 bg-primary/5 rounded-full blur-[80px] animate-pulse-slow opacity-20" />
                          
                          {/* Central Pulse Logo - Barely Visible and Transparent */}
                          <div className="w-32 h-32 sm:w-48 md:w-56 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center animate-pulse-slow border border-white/5 shadow-inner relative z-10 overflow-hidden">
                             <Music className="text-white/10 w-12 h-12 sm:w-16 md:w-20" />
                          </div>
                        </div>
                      </div>

                      {/* Background Audio Source */}
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
                    <h3 className="text-2xl font-headline font-bold">External Universe</h3>
                    <p className="text-white/60 text-sm sm:text-base max-w-md">This content is hosted beyond our dimension.</p>
                    <Button onClick={handleOpenSource} size="lg" className="rounded-xl bg-primary">
                      <Play className="mr-2 fill-current" size={14} /> Connect
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Song Mode Toggles - Centered at bottom of player */}
            {isSong && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-30">
                <Button 
                  size="sm"
                  variant={songMode === 'audio' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-10 px-6 gap-2 font-bold text-xs uppercase tracking-widest transition-all", songMode === 'audio' ? "bg-primary text-white" : "text-white/40 hover:text-white")}
                  onClick={() => handleModeChange('audio')}
                >
                  <Headset size={14} /> Audio
                </Button>
                <Button 
                  size="sm"
                  variant={songMode === 'video' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-10 px-6 gap-2 font-bold text-xs uppercase tracking-widest transition-all", songMode === 'video' ? "bg-primary text-white" : "text-white/40 hover:text-white")}
                  onClick={() => handleModeChange('video')}
                >
                  <Video size={14} /> Video
                </Button>
              </div>
            )}
          </div>

          {/* Section 3: Bottom Narrative Info */}
          <div className="max-w-3xl mx-auto w-full space-y-10 animate-in slide-in-from-bottom-8 duration-700">
            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-3 text-center">
                <h3 className="text-[9px] font-headline font-bold flex items-center justify-center gap-2 text-white/20 uppercase tracking-[0.4em]">
                  <Info size={12} /> The Narrative
                </h3>
                <p className="text-white/80 text-sm sm:text-lg leading-relaxed font-light italic tracking-tight max-w-2xl mx-auto drop-shadow-lg">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-6 sm:p-8 rounded-[2rem] bg-black/20 border border-white/5 backdrop-blur-md relative overflow-hidden text-center shadow-xl">
                <h3 className="text-[9px] font-headline font-bold text-accent/30 uppercase tracking-[0.4em] mb-3">Core Essence</h3>
                <p className="text-white text-base sm:text-xl font-medium leading-snug italic">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleOpenSource} variant="outline" className="h-14 rounded-2xl border-white/10 flex-1 bg-white/5 hover:bg-white/10 font-bold text-sm backdrop-blur-md">
                <ExternalLink size={16} className="mr-2 text-accent" /> Source Portal
              </Button>
              <Button 
                variant="secondary"
                className="h-14 rounded-2xl flex-1 bg-white/5 hover:bg-white/10 font-bold text-sm backdrop-blur-md border border-white/5"
                onClick={() => setCurrentlyPlaying(null)}
              >
                Close Connection
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
