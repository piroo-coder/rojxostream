
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
      {/* Cinematic Global Background - Highly Visible like Home Screen */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={bgImage} 
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-70 sm:opacity-90 transition-opacity duration-1000"
          priority
          unoptimized
        />
        {/* Cinematic Multi-layered Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
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
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24 space-y-8 md:space-y-12 min-h-screen flex flex-col justify-center">
          
          {/* Header: Title & Creator (Top) */}
          <div className="text-center space-y-4 animate-in slide-in-from-top-8 duration-700">
            <div className="flex justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-accent/20 px-4 py-1.5 rounded-full border border-accent/20 shadow-inner backdrop-blur-md">
                {currentlyPlaying.type}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tighter leading-tight text-white drop-shadow-2xl">
              {currentlyPlaying.title}
            </h1>
            <p className="text-accent font-bold text-lg sm:text-2xl drop-shadow-xl">{currentlyPlaying.creator}</p>
          </div>

          {/* Middle: Media Player (Centered) */}
          <div className="relative group mx-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-700">
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 bg-black/40">
              {isEmbeddable ? (
                <>
                  {isSong && songMode === 'audio' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-700">
                      {/* Subdued Background for Audio Mode Player Area */}
                      <div className="absolute inset-0">
                        <Image 
                          src={bgImage} 
                          alt=""
                          fill
                          className="object-cover opacity-30"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      
                      {/* Minimalist Barely Visible Animation */}
                      <div className="relative z-30 flex flex-col items-center gap-6">
                        <div className="relative group">
                          {/* Subdued Glow */}
                          <div className="absolute -inset-16 bg-primary/10 rounded-full blur-[80px] animate-pulse-slow opacity-30" />
                          {/* Translucent Disc with Ultra Slow Rotation */}
                          <div className="w-24 h-24 sm:w-32 md:w-40 rounded-full bg-white/5 backdrop-blur-2xl flex items-center justify-center animate-[spin_120s_linear_infinite] border border-white/10 shadow-inner relative z-10 overflow-hidden ring-1 ring-white/5">
                             <Music className="text-white/20 w-8 h-8 sm:w-12 md:w-14" />
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
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-black/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl z-30">
                <Button 
                  size="sm"
                  variant={songMode === 'audio' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-9 px-5 gap-2 font-bold text-xs uppercase tracking-widest", songMode === 'audio' ? "bg-primary text-white" : "text-white/40")}
                  onClick={() => handleModeChange('audio')}
                >
                  <Headset size={14} /> Audio
                </Button>
                <Button 
                  size="sm"
                  variant={songMode === 'video' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-9 px-5 gap-2 font-bold text-xs uppercase tracking-widest", songMode === 'video' ? "bg-primary text-white" : "text-white/40")}
                  onClick={() => handleModeChange('video')}
                >
                  <Video size={14} /> Video
                </Button>
              </div>
            )}
          </div>

          {/* Footer: Description & Moral (Bottom) */}
          <div className="max-w-3xl mx-auto space-y-10 pt-8 animate-in slide-in-from-bottom-8 duration-700">
            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-4 text-center">
                <h3 className="text-[9px] font-headline font-bold flex items-center justify-center gap-2 text-white/30 uppercase tracking-[0.4em]">
                  <Info size={12} /> The Narrative
                </h3>
                <p className="text-white/80 text-sm sm:text-lg leading-relaxed font-light italic tracking-tight max-w-2xl mx-auto">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-6 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden text-center">
                <h3 className="text-[9px] font-headline font-bold text-accent/50 uppercase tracking-[0.4em] mb-4">Core Essence</h3>
                <p className="text-white text-base sm:text-xl font-medium leading-snug italic">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pb-12">
              <Button onClick={handleOpenSource} variant="outline" className="h-12 rounded-xl border-white/10 flex-1 hover:bg-white/5 font-bold text-sm">
                <ExternalLink size={16} className="mr-2 text-accent" /> Full Universe
              </Button>
              <Button 
                variant="secondary"
                className="h-12 rounded-xl flex-1 bg-white/5 hover:bg-white/10 font-bold text-sm"
                onClick={() => setCurrentlyPlaying(null)}
              >
                Close Portal
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
