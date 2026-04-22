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
  // Default to audio mode as requested
  const [songMode, setSongMode] = useState<'video' | 'audio'>('audio');

  // Reset mode to audio whenever a new item is selected
  useEffect(() => {
    if (currentlyPlaying) {
      setSongMode('audio');
    }
  }, [currentlyPlaying?.id]);

  if (!currentlyPlaying) return null;

  const isSong = currentlyPlaying.type === 'song';
  const isYoutube = currentlyPlaying.mediaUrl.includes('youtube.com') || currentlyPlaying.mediaUrl.includes('youtu.be');
  const isVimeo = currentlyPlaying.mediaUrl.includes('vimeo.com');
  const isDailymotion = currentlyPlaying.mediaUrl.includes('dailymotion.com') || currentlyPlaying.mediaUrl.includes('dai.ly');
  const isFacebook = currentlyPlaying.mediaUrl.includes('facebook.com');
  const isFebspot = currentlyPlaying.mediaUrl.includes('febspot.com');
  
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

  const getVimeoEmbedUrl = (url: string) => {
    const parts = url.split('vimeo.com/');
    const idPart = parts[1] || '';
    const id = idPart.split('?')[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;
  };

  const getDailymotionEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('/video/')) {
      id = url.split('/video/')[1].split('?')[0];
    } else if (url.includes('dai.ly/')) {
      id = url.split('dai.ly/')[1].split('?')[0];
    }
    return `https://www.dailymotion.com/embed/video/${id}?autoplay=1&mute=0`;
  };

  const getFacebookEmbedUrl = (url: string) => {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&t=0&autoplay=true`;
  };

  const getFebspotEmbedUrl = (url: string) => {
    const parts = url.split('/video/');
    const id = parts[1] || '';
    return `https://www.febspot.com/embed/${id}`;
  };

  const handleOpenSource = () => {
    window.open(currentlyPlaying.mediaUrl, '_blank');
  };

  const handleModeChange = (mode: 'video' | 'audio') => {
    if (mode === songMode) return;
    setSongMode(mode);
  };

  const bgImage = currentlyPlaying.audioBackgroundUrl || currentlyPlaying.thumbnailUrl;

  const getEmbedSource = () => {
    if (isYoutube) return getYoutubeEmbedUrl(currentlyPlaying.mediaUrl);
    if (isVimeo) return getVimeoEmbedUrl(currentlyPlaying.mediaUrl);
    if (isDailymotion) return getDailymotionEmbedUrl(currentlyPlaying.mediaUrl);
    if (isFacebook) return getFacebookEmbedUrl(currentlyPlaying.mediaUrl);
    if (isFebspot) return getFebspotEmbedUrl(currentlyPlaying.mediaUrl);
    return '';
  };

  const isEmbeddable = isYoutube || isVimeo || isDailymotion || isFacebook || isFebspot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 overflow-hidden">
      {/* Immersive Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt="Immersive Background"
          fill
          className="object-cover scale-110 blur-xl opacity-40 transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[70] bg-white/10 rounded-full backdrop-blur-xl transition-all hover:scale-110"
        onClick={() => {
          setCurrentlyPlaying(null);
        }}
      >
        <X size={28} />
      </Button>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-7xl w-full h-full lg:h-[85vh] bg-card/10 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all duration-500">
        
        <div className="relative w-full h-full bg-black/20 flex flex-col overflow-hidden border-r border-white/5">
          {/* Playback Area */}
          <div className="flex-1 relative overflow-hidden group">
            {isEmbeddable ? (
              <div className="w-full h-full relative">
                {/* Audio Mode View - Default for songs */}
                {isSong && songMode === 'audio' && (
                  <div key="audio-player-ui" className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="absolute inset-0 z-10">
                       <Image 
                        src={currentlyPlaying.audioBackgroundUrl || currentlyPlaying.thumbnailUrl} 
                        alt="Audio Visualization Background"
                        fill
                        className="object-cover opacity-60 transition-opacity duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>
                    
                    <div className="relative z-30 flex flex-col items-center gap-8 text-center p-6">
                      <div className="w-56 h-56 rounded-full bg-primary/10 backdrop-blur-2xl flex items-center justify-center animate-pulse border-4 border-primary/20 shadow-[0_0_100px_rgba(var(--primary),0.3)]">
                        <div className="relative">
                           <Music className="text-primary animate-bounce-slow" size={90} />
                           <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full -z-10" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-[0.8em] text-accent/80 drop-shadow-md">Now Playing Audio</p>
                        <h2 className="text-4xl font-headline font-bold text-white drop-shadow-2xl">{currentlyPlaying.title}</h2>
                        <p className="text-xl text-white/70 font-medium tracking-wide">{currentlyPlaying.creator}</p>
                      </div>
                    </div>

                    {/* Keep sound playing in background */}
                    <iframe 
                      src={getEmbedSource()}
                      className="absolute opacity-0 pointer-events-none w-1 h-1"
                      allow="autoplay"
                    />
                  </div>
                )}

                {/* Video Mode View */}
                {(!isSong || songMode === 'video') && (
                  <iframe 
                    key="video-player-active"
                    src={getEmbedSource()}
                    className="w-full h-full border-0 animate-in fade-in zoom-in-95 duration-700"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-2xl">
                  <ExternalLink size={48} />
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-headline font-bold mb-3">Launch Content</h3>
                  <p className="text-white/60 text-lg mb-8">
                    This masterpiece is ready for launch.
                  </p>
                  <Button onClick={handleOpenSource} size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-xl font-bold shadow-2xl shadow-primary/20">
                    <Play size={24} className="mr-3 fill-current" /> Play Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Toggle for Songs */}
          {isSong && (
            <div className="p-8 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-center gap-10 z-30">
              <Button 
                variant={songMode === 'audio' ? 'default' : 'ghost'} 
                size="lg"
                className={cn(
                  "rounded-full gap-3 px-10 h-16 text-lg font-black transition-all hover:scale-105",
                  songMode === 'audio' ? "bg-primary shadow-[0_0_30px_rgba(var(--primary),0.4)]" : "text-white/40 hover:text-white"
                )}
                onClick={() => handleModeChange('audio')}
              >
                <Headset size={22} /> Audio
              </Button>
              <Button 
                variant={songMode === 'video' ? 'default' : 'ghost'} 
                size="lg"
                className={cn(
                  "rounded-full gap-3 px-10 h-16 text-lg font-black transition-all hover:scale-105",
                  songMode === 'video' ? "bg-primary shadow-[0_0_30px_rgba(var(--primary),0.4)]" : "text-white/40 hover:text-white"
                )}
                onClick={() => handleModeChange('video')}
              >
                <Video size={22} /> Video
              </Button>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <ScrollArea className="h-full bg-black/10 backdrop-blur-md">
          <div className="p-10 lg:p-14 space-y-12">
            <div className="animate-in slide-in-from-right duration-700">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-accent bg-accent/10 px-6 py-2 rounded-full border border-accent/20">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-6xl font-headline font-bold mb-6 tracking-tighter leading-none drop-shadow-2xl">{currentlyPlaying.title}</h1>
              <div className="flex flex-wrap items-center gap-8 text-white/70">
                <span className="text-accent font-bold text-2xl tracking-tight">{currentlyPlaying.creator}</span>
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
              <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-150">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-accent/80">
                  <Info size={28} />
                  Universe Story
                </h3>
                <p className="text-white/80 text-2xl leading-relaxed font-light tracking-wide italic">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/10 space-y-6 relative overflow-hidden group shadow-inner animate-in slide-in-from-right duration-700 delay-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-primary/20 transition-colors" />
                <h3 className="text-2xl font-headline font-bold flex items-center gap-3 text-primary relative z-10">
                  <MessageSquare size={30} />
                  The Essence
                </h3>
                <p className="text-white text-2xl font-medium leading-relaxed italic relative z-10 pl-6 border-l-4 border-primary/30">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-10 flex flex-col gap-6 animate-in slide-in-from-bottom duration-700 delay-500">
              <Button onClick={handleOpenSource} variant="outline" className="h-20 rounded-[2rem] border-white/10 hover:bg-white/10 text-xl font-bold transition-all hover:scale-[1.02] backdrop-blur-xl">
                <ExternalLink className="mr-3" size={24} /> Source Metadata
              </Button>
              <Button 
                className="h-20 rounded-[2rem] bg-white/5 text-white/50 hover:bg-destructive hover:text-white text-2xl font-black transition-all"
                onClick={() => {
                  setCurrentlyPlaying(null);
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
