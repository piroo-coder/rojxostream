
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
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-500 overflow-hidden bg-background h-svh">
      {/* Immersive Background Image - Full Visibility */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <Image 
          src={bgImage} 
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Consistent Home Screen Style Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10 lg:bg-black/5" />
      </div>

      {/* Close Button - Responsive & Accessible */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 text-white z-[80] bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-3xl border border-white/10 w-10 h-10 sm:w-12 sm:h-12 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X className="size-5 sm:size-6" />
      </Button>

      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full">
        
        {/* Left Section: Playback Player - Adaptive Height */}
        <div className="relative w-full lg:w-[60%] h-[35vh] sm:h-[45vh] lg:h-full flex flex-col bg-black/20 overflow-hidden">
          <div className="flex-1 relative flex items-center justify-center">
            {isEmbeddable ? (
              <div className="w-full h-full">
                {isSong && songMode === 'audio' && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
                    {/* Song Visualizer Overlay */}
                    <div className="absolute inset-0 z-10">
                       <Image 
                        src={bgImage} 
                        alt=""
                        fill
                        className="object-cover opacity-50"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                    </div>
                    
                    {/* Spinning Disk - Responsive Scaling */}
                    <div className="relative z-30 flex flex-col items-center gap-4 sm:gap-6 text-center p-4">
                      <div className="relative group">
                        <div className="absolute -inset-6 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-all duration-1000 animate-pulse" />
                        <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-44 lg:w-56 rounded-full bg-black/40 backdrop-blur-3xl flex items-center justify-center animate-[spin_10s_linear_infinite] border-2 border-primary/40 shadow-2xl relative z-10 overflow-hidden">
                           <Music className="text-primary w-8 h-8 sm:w-14 sm:h-14 lg:w-20 lg:h-20 opacity-90" />
                        </div>
                      </div>

                      <div className="px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-xl max-w-xs sm:max-w-md">
                        <p className="text-[6px] sm:text-[8px] font-black uppercase tracking-[0.4em] text-accent/80 mb-1">Atmosphere</p>
                        <h2 className="text-xs sm:text-base md:text-xl font-headline font-bold text-white line-clamp-1">{currentlyPlaying.title}</h2>
                        <p className="text-[8px] sm:text-xs text-white/60 font-medium">{currentlyPlaying.creator}</p>
                      </div>
                    </div>

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
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <ExternalLink size={32} />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl sm:text-2xl font-headline font-bold mb-2">Open Portal</h3>
                  <p className="text-white/40 mb-6 text-xs sm:text-sm font-light">This universe is hosted on an external reality.</p>
                  <Button onClick={handleOpenSource} size="lg" className="h-12 sm:h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold w-full sm:w-auto">
                    <Play className="mr-2 fill-current" size={14} /> Enter Portal
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Player Mode Controls */}
          {isSong && (
            <div className="p-3 sm:p-4 bg-background/20 backdrop-blur-3xl border-t border-white/10 flex items-center justify-center gap-3">
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-xl gap-2 px-6 h-10 sm:h-11 text-[10px] sm:text-xs font-bold transition-all",
                  songMode === 'audio' ? "bg-primary shadow-lg" : "text-white/40 hover:text-white hover:bg-white/10"
                )}
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={14} /> Audio
              </Button>
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-xl gap-2 px-6 h-10 sm:h-11 text-[10px] sm:text-xs font-bold transition-all",
                  songMode === 'video' ? "bg-primary shadow-lg" : "text-white/40 hover:text-white hover:bg-white/10"
                )}
                onClick={() => handleModeChange('video')}
              >
                <Video size={14} /> Video
              </Button>
            </div>
          )}
        </div>

        {/* Right Section: Content Details - Stretching & Responsive */}
        <div className="flex-1 min-h-0 bg-background/30 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/10">
          <ScrollArea className="h-[65vh] sm:h-[55vh] lg:h-full">
            <div className="p-6 sm:p-10 lg:p-16 space-y-8 sm:space-y-12">
              <div className="animate-in slide-in-from-right duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-accent bg-accent/20 px-3 py-1 rounded-full border border-accent/20">
                    {currentlyPlaying.type}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-headline font-bold mb-3 tracking-tighter leading-tight text-white drop-shadow-md">
                  {currentlyPlaying.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <span className="text-accent font-bold text-base sm:text-xl lg:text-2xl">{currentlyPlaying.creator}</span>
                  {currentlyPlaying.imdbRating && (
                    <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-xl border border-yellow-500/10">
                      <Star size={14} className="fill-current" />
                      <span className="font-black text-xs sm:text-lg">{currentlyPlaying.imdbRating}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {(currentlyPlaying.summary || currentlyPlaying.description) && (
                <div className="space-y-4 animate-in slide-in-from-right duration-700 delay-150">
                  <h3 className="text-[10px] font-headline font-bold flex items-center gap-2 text-accent/60 uppercase tracking-widest">
                    <Info size={14} />
                    Chronicle
                  </h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed font-light italic">
                    {currentlyPlaying.summary || currentlyPlaying.description}
                  </p>
                </div>
              )}

              {currentlyPlaying.moral && (
                <div className="p-6 sm:p-8 rounded-[2rem] bg-primary/10 border border-primary/20 space-y-4 relative overflow-hidden animate-in slide-in-from-right duration-700 delay-300 shadow-2xl">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <MessageSquare size={64} className="text-primary" />
                  </div>
                  <h3 className="text-[10px] font-headline font-bold flex items-center gap-2 text-primary/80 uppercase tracking-widest relative z-10">
                    The Lesson
                  </h3>
                  <p className="text-white/90 text-sm sm:text-xl font-medium leading-relaxed italic relative z-10 pl-4 border-l-2 border-primary/40">
                    "{currentlyPlaying.moral}"
                  </p>
                </div>
              )}

              <div className="pt-8 flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom duration-700 delay-500 pb-12">
                <Button onClick={handleOpenSource} variant="outline" className="h-12 sm:h-14 lg:h-16 rounded-2xl border-white/10 text-xs sm:text-sm font-bold flex-1 hover:bg-white/10 text-white transition-all">
                  <ExternalLink size={16} className="mr-2" /> Metadata
                </Button>
                <Button 
                  variant="secondary"
                  className="h-12 sm:h-14 lg:h-16 rounded-2xl text-xs sm:text-sm font-black flex-1 active:scale-95 bg-white/10 hover:bg-white/20 text-white transition-all"
                  onClick={() => setCurrentlyPlaying(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
