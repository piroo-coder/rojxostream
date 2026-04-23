
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
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-500 overflow-hidden bg-background h-screen">
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
        <div className="absolute inset-0 bg-black/20" />
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
        <div className="relative w-full lg:w-[60%] h-[40vh] sm:h-[45vh] lg:h-full flex flex-col bg-black/40 lg:bg-transparent overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
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
                        className="object-cover opacity-60"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    </div>
                    
                    {/* Spinning Disk - Responsive Scaling */}
                    <div className="relative z-30 flex flex-col items-center gap-4 sm:gap-6 text-center p-4">
                      <div className="relative group">
                        <div className="absolute -inset-6 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-all duration-1000 animate-pulse" />
                        <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-56 lg:w-72 rounded-full bg-black/40 backdrop-blur-3xl flex items-center justify-center animate-[spin_10s_linear_infinite] border-2 border-primary/40 shadow-2xl relative z-10 overflow-hidden">
                           <Music className="text-primary w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 opacity-90" />
                        </div>
                      </div>

                      <div className="px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-xl max-w-xs sm:max-w-md">
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-accent/80 mb-1">Atmosphere</p>
                        <h2 className="text-sm sm:text-lg md:text-2xl font-headline font-bold text-white line-clamp-1">{currentlyPlaying.title}</h2>
                        <p className="text-[10px] sm:text-sm text-white/60 font-medium">{currentlyPlaying.creator}</p>
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <ExternalLink size={36} />
                </div>
                <div className="max-w-md px-4">
                  <h3 className="text-2xl sm:text-3xl font-headline font-bold mb-3">Dimensional Link</h3>
                  <p className="text-white/50 mb-8 text-sm sm:text-base font-light">This content exists in another reality. Connect to experience it.</p>
                  <Button onClick={handleOpenSource} size="lg" className="h-14 sm:h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-sm sm:text-base font-bold w-full sm:w-auto shadow-2xl shadow-primary/40">
                    <Play className="mr-2 fill-current" size={16} /> Establish Link
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Player Mode Controls */}
          {isSong && (
            <div className="p-4 sm:p-6 bg-background/40 backdrop-blur-3xl border-t border-white/10 flex items-center justify-center gap-4">
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-xl gap-2 px-8 h-12 sm:h-14 text-xs sm:text-sm font-bold transition-all flex-1 sm:flex-none",
                  songMode === 'audio' ? "bg-primary shadow-xl" : "text-white/40 hover:text-white hover:bg-white/10"
                )}
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={18} /> Audio
              </Button>
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-xl gap-2 px-8 h-12 sm:h-14 text-xs sm:text-sm font-bold transition-all flex-1 sm:flex-none",
                  songMode === 'video' ? "bg-primary shadow-xl" : "text-white/40 hover:text-white hover:bg-white/10"
                )}
                onClick={() => handleModeChange('video')}
              >
                <Video size={18} /> Video
              </Button>
            </div>
          )}
        </div>

        {/* Right Section: Content Details - Stretching & Responsive */}
        <div className="flex-1 min-h-0 bg-background/50 backdrop-blur-xl h-full flex flex-col">
          <ScrollArea className="flex-1 w-full">
            <div className="p-8 sm:p-12 lg:p-20 space-y-10 sm:space-y-16">
              <div className="animate-in slide-in-from-right duration-700">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest text-accent bg-accent/20 px-4 py-1.5 rounded-full border border-accent/20 shadow-inner">
                    {currentlyPlaying.type}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-headline font-bold mb-4 tracking-tighter leading-[1.1] text-white drop-shadow-2xl">
                  {currentlyPlaying.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <span className="text-accent font-bold text-lg sm:text-2xl lg:text-3xl">{currentlyPlaying.creator}</span>
                  {currentlyPlaying.imdbRating && (
                    <div className="flex items-center gap-2.5 bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-xl border border-yellow-500/10 shadow-lg">
                      <Star size={16} className="fill-current" />
                      <span className="font-black text-sm sm:text-xl">IMDb {currentlyPlaying.imdbRating}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-white/5" />

              {(currentlyPlaying.summary || currentlyPlaying.description) && (
                <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-150">
                  <h3 className="text-[10px] sm:text-[12px] font-headline font-bold flex items-center gap-3 text-accent/50 uppercase tracking-[0.3em] font-black">
                    <Info size={16} />
                    Chronicle
                  </h3>
                  <p className="text-white/70 text-base sm:text-xl lg:text-2xl leading-relaxed font-light italic tracking-tight">
                    {currentlyPlaying.summary || currentlyPlaying.description}
                  </p>
                </div>
              )}

              {currentlyPlaying.moral && (
                <div className="p-8 sm:p-12 rounded-[3rem] bg-primary/10 border border-primary/20 space-y-6 relative overflow-hidden animate-in slide-in-from-right duration-700 delay-300 shadow-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <MessageSquare size={128} className="text-primary" />
                  </div>
                  <h3 className="text-[10px] sm:text-[12px] font-headline font-bold flex items-center gap-3 text-primary/70 uppercase tracking-[0.3em] font-black relative z-10">
                    The Lesson
                  </h3>
                  <p className="text-white/95 text-lg sm:text-2xl lg:text-3xl font-medium leading-relaxed italic relative z-10 pl-6 border-l-4 border-primary/40">
                    "{currentlyPlaying.moral}"
                  </p>
                </div>
              )}

              <div className="pt-12 flex flex-col sm:flex-row gap-6 animate-in slide-in-from-bottom duration-700 delay-500 pb-20">
                <Button onClick={handleOpenSource} variant="outline" className="h-14 sm:h-16 lg:h-20 rounded-2xl border-white/10 text-xs sm:text-base font-bold flex-1 hover:bg-white/10 text-white transition-all shadow-xl">
                  <ExternalLink size={20} className="mr-3" /> Metadata
                </Button>
                <Button 
                  variant="secondary"
                  className="h-14 sm:h-16 lg:h-20 rounded-2xl text-xs sm:text-base font-black flex-1 active:scale-95 bg-white/10 hover:bg-white/20 text-white transition-all shadow-xl"
                  onClick={() => setCurrentlyPlaying(null)}
                >
                  Close Archive
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
