
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
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-500 overflow-hidden bg-background h-screen w-screen flex flex-col lg:flex-row">
      {/* Cinematic Global Background */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={bgImage} 
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Persistent Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-3xl border border-white/10 w-10 h-10 sm:w-14 sm:h-14 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X className="size-5 sm:size-7" />
      </Button>

      {/* Left: Interactive Media Section (50% Split) */}
      <div className="relative w-full lg:w-1/2 h-[50svh] lg:h-full flex flex-col bg-black/40 lg:bg-transparent overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 z-10">
        <div className="flex-1 relative w-full h-full flex items-center justify-center">
          {isEmbeddable ? (
            <div className="w-full h-full relative">
              {isSong && songMode === 'audio' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden animate-in fade-in zoom-in-95 duration-700">
                  {/* High Visibility Background for Audio Mode */}
                  <div className="absolute inset-0">
                    <Image 
                      src={bgImage} 
                      alt=""
                      fill
                      className="object-cover opacity-90"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>
                  
                  {/* Pro Vinyl Visualizer UI */}
                  <div className="relative z-30 flex flex-col items-center gap-6 sm:gap-8 text-center px-6">
                    <div className="relative group">
                      <div className="absolute -inset-10 bg-primary/30 rounded-full blur-[80px] animate-pulse" />
                      <div className="w-36 h-36 sm:w-56 md:w-72 lg:w-80 rounded-full bg-black/40 backdrop-blur-2xl flex items-center justify-center animate-[spin_15s_linear_infinite] border-4 border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden ring-1 ring-primary/20">
                         <Music className="text-primary/80 w-14 h-14 sm:w-24 lg:w-32 drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                      </div>
                    </div>

                    <div className="px-6 py-4 sm:py-6 bg-black/60 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl max-w-[260px] sm:max-w-md animate-in slide-in-from-bottom-4 duration-700">
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2">Now Resonating</p>
                      <h2 className="text-base sm:text-2xl md:text-3xl font-headline font-bold text-white line-clamp-1 leading-tight">{currentlyPlaying.title}</h2>
                      <p className="text-xs sm:text-lg text-white/70 font-medium italic mt-1">{currentlyPlaying.creator}</p>
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
                  className="w-full h-full border-0 animate-in fade-in duration-1000"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-6">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2rem] bg-white/5 backdrop-blur-3xl flex items-center justify-center text-primary border border-white/10 shadow-2xl">
                <ExternalLink size={40} />
              </div>
              <div className="max-w-md px-4 text-white">
                <h3 className="text-2xl sm:text-4xl font-headline font-bold mb-4 drop-shadow-2xl">Dimensional Link</h3>
                <p className="text-white/60 mb-8 text-sm sm:text-lg font-light leading-relaxed">This artifact is hosted in another reality. Connect to experience the full narrative.</p>
                <Button onClick={handleOpenSource} size="lg" className="h-14 sm:h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-sm sm:text-lg font-bold w-full sm:w-auto shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                  <Play className="mr-3 fill-current" size={18} /> Establish Link
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Mode Controls for Songs */}
        {isSong && (
          <div className="p-4 sm:p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-center gap-4">
            <Button 
              variant={songMode === 'audio' ? 'default' : 'ghost'} 
              className={cn(
                "rounded-2xl gap-3 px-8 h-12 sm:h-14 text-xs sm:text-base font-bold transition-all flex-1 sm:flex-none border border-transparent",
                songMode === 'audio' ? "bg-primary shadow-2xl border-white/20" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
              onClick={() => handleModeChange('audio')}
            >
              <Headset size={20} /> Audio
            </Button>
            <Button 
              variant={songMode === 'video' ? 'default' : 'ghost'} 
              className={cn(
                "rounded-2xl gap-3 px-8 h-12 sm:h-14 text-xs sm:text-base font-bold transition-all flex-1 sm:flex-none border border-transparent",
                songMode === 'video' ? "bg-primary shadow-2xl border-white/20" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
              onClick={() => handleModeChange('video')}
            >
              <Video size={20} /> Video
            </Button>
          </div>
        )}
      </div>

      {/* Right: Narrative & Metadata Section (50% Split) */}
      <div className="flex-1 min-h-0 bg-transparent z-10 flex flex-col h-[50svh] lg:h-full">
        <ScrollArea className="flex-1 w-full h-full">
          <div className="p-8 sm:p-12 lg:p-20 space-y-10 sm:space-y-16">
            <div className="animate-in slide-in-from-right-8 duration-700">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-accent bg-accent/20 px-5 py-2 rounded-full border border-accent/20 shadow-inner backdrop-blur-md">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-headline font-bold mb-6 tracking-tighter leading-none text-white drop-shadow-2xl">
                {currentlyPlaying.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <span className="text-accent font-bold text-lg sm:text-3xl lg:text-4xl drop-shadow-xl">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-2.5 bg-yellow-500/10 text-yellow-500 px-5 py-2 rounded-2xl border border-yellow-500/20 shadow-xl backdrop-blur-md">
                    <Star size={18} className="fill-current" />
                    <span className="font-black text-sm sm:text-2xl">IMDb {currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/5" />

            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-700 delay-150">
                <h3 className="text-[10px] sm:text-[12px] font-headline font-bold flex items-center gap-3 text-white/30 uppercase tracking-[0.4em] font-black">
                  <Info size={16} />
                  Narrative
                </h3>
                <p className="text-white/80 text-base sm:text-xl lg:text-2xl leading-relaxed font-light italic tracking-tight max-w-4xl">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-8 sm:p-16 rounded-[3rem] bg-primary/5 border border-primary/10 space-y-8 relative overflow-hidden animate-in slide-in-from-right-8 duration-700 delay-300 shadow-2xl">
                <div className="absolute -top-10 -right-10 p-8 opacity-[0.03]">
                  <MessageSquare size={200} className="text-primary" />
                </div>
                <h3 className="text-[10px] sm:text-[12px] font-headline font-bold flex items-center gap-3 text-primary/60 uppercase tracking-[0.4em] font-black relative z-10">
                  The Core Essence
                </h3>
                <p className="text-white text-xl sm:text-3xl lg:text-4xl font-medium leading-tight italic relative z-10 pl-8 border-l-4 border-primary/30 tracking-tight">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-12 flex flex-col sm:flex-row gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-500 pb-24">
              <Button onClick={handleOpenSource} variant="outline" className="h-16 sm:h-20 rounded-[2rem] border-white/10 text-xs sm:text-lg font-bold flex-1 hover:bg-white/5 text-white transition-all shadow-2xl hover:border-white/20 active:scale-95">
                <ExternalLink size={20} className="mr-3 text-accent" /> Dimension Details
              </Button>
              <Button 
                variant="secondary"
                className="h-16 sm:h-20 rounded-[2rem] text-xs sm:text-lg font-black flex-1 active:scale-95 bg-white/5 hover:bg-white/10 text-white transition-all shadow-2xl border border-white/5"
                onClick={() => setCurrentlyPlaying(null)}
              >
                Close Archive
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
