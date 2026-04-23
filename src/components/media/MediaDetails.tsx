
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

  const handleOpenSource = () => window.open(currentlyPlaying.mediaUrl, '_blank');

  const handleModeChange = (mode: 'video' | 'audio') => {
    if (mode === songMode) return;
    setSongMode(mode);
  };

  const bgImage = currentlyPlaying.audioBackgroundUrl || currentlyPlaying.thumbnailUrl;

  const getEmbedSource = () => {
    if (isYoutube) return getYoutubeEmbedUrl(currentlyPlaying.mediaUrl);
    return currentlyPlaying.mediaUrl;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden bg-background">
      {/* Immersive Background Blur */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt="Immersive Background"
          fill
          sizes="100vw"
          className="object-cover scale-110 blur-[100px] opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-3xl border border-white/10 w-12 h-12"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X size={24} />
      </Button>

      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full max-w-[1920px] mx-auto overflow-hidden">
        
        {/* Left Section: Playback Player */}
        <div className="relative w-full lg:w-[60%] xl:w-[65%] h-[40vh] sm:h-[50vh] lg:h-full bg-black flex flex-col shadow-2xl">
          <div className="flex-1 relative overflow-hidden">
            {isYoutube ? (
              <div className="w-full h-full relative">
                {isSong && songMode === 'audio' && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 overflow-hidden">
                    <div className="absolute inset-0 z-10">
                       <Image 
                        src={bgImage} 
                        alt="Visualization"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-40 blur-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                    
                    <div className="relative z-30 flex flex-col items-center gap-6 md:gap-10 text-center p-8 max-w-2xl">
                      <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-primary/20 backdrop-blur-3xl flex items-center justify-center animate-pulse border-2 border-primary/30 shadow-[0_0_80px_rgba(var(--primary),0.2)]">
                         <Music className="text-primary animate-bounce-slow w-16 h-16 md:w-24 md:h-24" />
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-accent/80">Listening Mode Active</p>
                        <h2 className="text-2xl md:text-5xl font-headline font-bold text-white line-clamp-2 leading-tight">{currentlyPlaying.title}</h2>
                        <p className="text-lg md:text-2xl text-white/60 font-medium">{currentlyPlaying.creator}</p>
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
                    className="w-full h-full border-0 animate-in fade-in duration-700"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <ExternalLink className="w-12 h-12 md:w-16 md:h-16" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-2xl md:text-4xl font-headline font-bold mb-4">Launch Content</h3>
                  <p className="text-white/50 mb-8 font-light leading-relaxed">This universe is hosted on an external plane. Ready to teleport?</p>
                  <Button onClick={handleOpenSource} size="lg" className="h-16 px-12 rounded-2xl bg-primary text-xl font-bold w-full shadow-2xl shadow-primary/20">
                    <Play size={24} className="mr-3 fill-current" /> Play Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Selector for Songs */}
          {isSong && (
            <div className="p-6 md:p-8 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-center gap-6">
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-2xl gap-3 px-8 h-14 md:h-16 text-sm md:text-lg font-bold transition-all flex-1 md:flex-none",
                  songMode === 'audio' ? "bg-primary shadow-xl shadow-primary/20" : "text-white/40 hover:text-white"
                )}
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={22} /> Audio Only
              </Button>
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                className={cn(
                  "rounded-2xl gap-3 px-8 h-14 md:h-16 text-sm md:text-lg font-bold transition-all flex-1 md:flex-none",
                  songMode === 'video' ? "bg-primary shadow-xl shadow-primary/20" : "text-white/40 hover:text-white"
                )}
                onClick={() => handleModeChange('video')}
              >
                <Video size={22} /> Video Mode
              </Button>
            </div>
          )}
        </div>

        {/* Right Section: Details & Info */}
        <ScrollArea className="flex-1 h-[60vh] sm:h-[50vh] lg:h-full bg-black/40 backdrop-blur-md">
          <div className="p-8 md:p-16 lg:p-20 space-y-12">
            <div className="animate-in slide-in-from-right duration-700">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent bg-accent/10 px-6 py-2 rounded-full border border-accent/20">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold mb-6 tracking-tighter leading-[1.1] text-white">
                {currentlyPlaying.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <span className="text-accent font-bold text-xl md:text-3xl tracking-tight">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-2.5 bg-yellow-500/10 text-yellow-500 px-5 py-2.5 rounded-2xl border border-yellow-500/10">
                    <Star size={20} className="fill-current" />
                    <span className="font-black text-lg md:text-2xl">{currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-150">
                <h3 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-3 text-accent/80 uppercase tracking-widest">
                  <Info size={28} className="text-accent" />
                  Chronicle
                </h3>
                <p className="text-white/80 text-lg md:text-2xl leading-relaxed font-light italic">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-8 md:p-12 rounded-[3rem] bg-primary/5 border border-primary/10 space-y-6 relative overflow-hidden group animate-in slide-in-from-right duration-700 delay-300">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <MessageSquare size={120} className="text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-3 text-primary relative z-10 uppercase tracking-widest">
                  The Essence
                </h3>
                <p className="text-white text-xl md:text-3xl font-medium leading-relaxed italic relative z-10 pl-6 border-l-4 border-primary/40">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-8 flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom duration-700 delay-500 pb-10">
              <Button onClick={handleOpenSource} variant="outline" className="h-16 md:h-20 rounded-[2rem] border-white/10 text-lg md:text-xl font-bold flex-1 hover:bg-white/5 transition-all">
                <ExternalLink className="mr-3" size={24} /> Metadata Origin
              </Button>
              <Button 
                variant="secondary"
                className="h-16 md:h-20 rounded-[2rem] text-lg md:text-xl font-black flex-1 active:scale-95 transition-all"
                onClick={() => setCurrentlyPlaying(null)}
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
