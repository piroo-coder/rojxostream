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
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden bg-background">
      {/* Immersive Background Image - Clearly Visible */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image 
          src={bgImage} 
          alt="Immersive Background"
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[8000ms] ease-out"
          priority
          unoptimized
        />
        {/* Layered gradients for visibility and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-3xl border border-white/10 w-10 h-10 sm:w-12 sm:h-12 shadow-2xl"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X size={20} className="sm:size-24" />
      </Button>

      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full max-w-[1920px] mx-auto overflow-hidden">
        
        {/* Left Section: Playback Player */}
        <div className="relative w-full lg:w-[60%] xl:w-[65%] h-[45vh] sm:h-[55vh] lg:h-full flex flex-col bg-black/20 overflow-hidden">
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            {isEmbeddable ? (
              <div className="w-full h-full relative">
                {isSong && songMode === 'audio' && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 overflow-hidden">
                    {/* Song Background Visualization */}
                    <div className="absolute inset-0 z-10">
                       <Image 
                        src={bgImage} 
                        alt="Visualization"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-70"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
                    </div>
                    
                    {/* Visualization Disk - Responsive Sizing */}
                    <div className="relative z-30 flex flex-col items-center gap-4 sm:gap-8 md:gap-12 text-center p-6 max-w-2xl w-full">
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-all duration-1000 animate-pulse" />
                        <div className="w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full bg-black/60 backdrop-blur-3xl flex items-center justify-center animate-[spin_10s_linear_infinite] border-4 border-primary/40 shadow-[0_0_100px_rgba(var(--primary),0.3)] relative z-10 overflow-hidden">
                           <div className="absolute inset-4 rounded-full border-2 border-white/10" />
                           <Music className="text-primary w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32" />
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-4 px-4 bg-black/40 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10">
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-accent drop-shadow-md">Now Vibrating</p>
                        <h2 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-headline font-bold text-white line-clamp-1 leading-tight drop-shadow-2xl">{currentlyPlaying.title}</h2>
                        <p className="text-xs sm:text-lg md:text-xl lg:text-2xl text-white/80 font-medium drop-shadow-lg">{currentlyPlaying.creator}</p>
                      </div>
                    </div>

                    {/* Hidden Iframe for Audio Playback */}
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
                    className="w-full h-full border-0 animate-in fade-in duration-700"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 sm:p-12 text-center gap-6 sm:gap-10">
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <ExternalLink className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-headline font-bold mb-2 md:mb-4">Launch Content</h3>
                  <p className="text-white/50 mb-6 md:mb-8 text-xs sm:text-base font-light leading-relaxed">This universe is hosted on an external plane. Ready to teleport?</p>
                  <Button onClick={handleOpenSource} size="lg" className="h-12 sm:h-14 md:h-16 px-8 sm:px-12 rounded-2xl bg-primary text-sm sm:text-lg font-bold w-full shadow-2xl shadow-primary/20 border-0">
                    <Play className="mr-2 sm:mr-3 fill-current" size={14} /> Play Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Selector for Songs - Responsive Scaling */}
          {isSong && (
            <div className="p-4 sm:p-6 md:p-8 bg-background/60 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center gap-3 sm:gap-6 z-30">
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-xl sm:rounded-2xl gap-2 sm:gap-3 px-4 sm:px-8 h-10 sm:h-12 md:h-14 text-[10px] sm:text-xs md:text-sm font-bold transition-all flex-1 md:flex-none",
                  songMode === 'audio' ? "bg-primary shadow-xl shadow-primary/20 border-0" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={14} className="sm:size-16" /> Audio
              </Button>
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-xl sm:rounded-2xl gap-2 sm:gap-3 px-4 sm:px-8 h-10 sm:h-12 md:h-14 text-[10px] sm:text-xs md:text-sm font-bold transition-all flex-1 md:flex-none",
                  songMode === 'video' ? "bg-primary shadow-xl shadow-primary/20 border-0" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
                onClick={() => handleModeChange('video')}
              >
                <Video size={14} className="sm:size-16" /> Video
              </Button>
            </div>
          )}
        </div>

        {/* Right Section: Details & Info - Improved Responsive Padding */}
        <ScrollArea className="flex-1 h-[55vh] sm:h-[45vh] lg:h-full bg-background/40 backdrop-blur-sm lg:border-l border-white/5">
          <div className="p-6 sm:p-10 md:p-12 lg:p-16 space-y-8 lg:space-y-12 pb-24 lg:pb-16">
            <div className="animate-in slide-in-from-right duration-700">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-accent bg-accent/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-accent/20">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-headline font-bold mb-3 sm:mb-4 tracking-tighter leading-tight text-white drop-shadow-xl">
                {currentlyPlaying.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-white/70">
                <span className="text-accent font-bold text-base sm:text-xl lg:text-2xl tracking-tight">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-500/10 text-yellow-500 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl border border-yellow-500/10">
                    <Star size={12} className="sm:size-16 fill-current" />
                    <span className="font-black text-xs sm:text-lg lg:text-xl">{currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-3 sm:space-y-5 animate-in slide-in-from-right duration-700 delay-150">
                <h3 className="text-xs sm:text-sm md:text-base font-headline font-bold flex items-center gap-2 text-accent/80 uppercase tracking-widest">
                  <Info size={14} className="sm:size-16 text-accent" />
                  The Narrative
                </h3>
                <p className="text-white/80 text-sm sm:text-lg lg:text-xl leading-relaxed font-light italic">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-3 sm:space-y-4 relative overflow-hidden group animate-in slide-in-from-right duration-700 delay-300">
                <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10">
                  <MessageSquare size={32} className="sm:size-48 text-primary" />
                </div>
                <h3 className="text-[10px] sm:text-xs font-headline font-bold flex items-center gap-2 text-primary relative z-10 uppercase tracking-widest">
                  Soul Essence
                </h3>
                <p className="text-white text-base sm:text-xl lg:text-2xl font-medium leading-relaxed italic relative z-10 pl-3 sm:pl-4 border-l-2 border-primary/40">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-in slide-in-from-bottom duration-700 delay-500">
              <Button onClick={handleOpenSource} variant="outline" className="h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl border-white/10 text-xs sm:text-sm lg:text-base font-bold flex-1 hover:bg-white/5 transition-all text-white">
                <ExternalLink className="mr-2" size={14} /> Origin Metadata
              </Button>
              <Button 
                variant="secondary"
                className="h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl text-xs sm:text-sm lg:text-base font-black flex-1 active:scale-95 transition-all"
                onClick={() => setCurrentlyPlaying(null)}
              >
                Close Realm
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};