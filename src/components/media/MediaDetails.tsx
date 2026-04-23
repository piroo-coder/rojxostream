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
  const isFacebook = currentlyPlaying.mediaUrl.includes('facebook.com');
  const isDropbox = currentlyPlaying.mediaUrl.includes('dropbox.com');
  const isVideas = currentlyPlaying.mediaUrl.includes('videas.fr');
  const isBilibili = currentlyPlaying.mediaUrl.includes('bilibili.tv') || currentlyPlaying.mediaUrl.includes('bilibili.com');
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

  const getFacebookEmbedUrl = (url: string) => {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1`;
  };

  const getDropboxEmbedUrl = (url: string) => {
    return url.replace('dl=0', 'raw=1');
  };

  const getBilibiliEmbedUrl = (url: string) => {
    // For bilibili.tv (Global), the ID is usually the last part of the numeric path
    const parts = url.split('/');
    const id = parts[parts.length - 1].split('?')[0];
    // Global Bilibili TV usually doesn't have a direct "embed" subdomain like YouTube, 
    // but some regions support a specific route. We'll try the common Global iframe pattern.
    return `https://www.bilibili.tv/en/video/${id}`;
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
    if (isFacebook) return getFacebookEmbedUrl(currentlyPlaying.mediaUrl);
    if (isDropbox) return getDropboxEmbedUrl(currentlyPlaying.mediaUrl);
    if (isBilibili) return getBilibiliEmbedUrl(currentlyPlaying.mediaUrl);
    return currentlyPlaying.mediaUrl;
  };

  const isEmbeddable = isYoutube || isDailymotion || isVimeo || isFacebook || isDropbox || isVideas || isGenericEmbed || isBilibili;

  const barDelays = [0.5, 0.2, 1.2, 0.9, 2.3, 1.3, 3.1, 1.9];

  return (
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-500 overflow-hidden bg-background h-svh w-screen flex flex-col">
      {/* Immersive Background Artwork */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={bgImage} 
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-100 transition-opacity duration-1000"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Persistent Close Control */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-xl border border-white/20 w-10 h-10 sm:w-14 sm:h-14 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X className="size-5 sm:size-7" />
      </Button>

      <ScrollArea className="flex-1 w-full h-full relative z-10">
        <div className="container mx-auto max-w-5xl px-4 min-h-full flex flex-col items-center justify-center py-20 md:py-32 space-y-8 md:space-y-12">
          
          <div className="text-center space-y-2 md:space-y-4 animate-in slide-in-from-top-8 duration-700 w-full z-20">
            <div className="flex justify-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-black/40 px-4 py-1.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
                {currentlyPlaying.type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter leading-tight text-white drop-shadow-2xl px-4">
              {currentlyPlaying.title}
            </h1>
            <p className="text-accent font-bold text-base sm:text-xl md:text-2xl drop-shadow-xl">{currentlyPlaying.creator}</p>
          </div>

          <div className="relative group w-full max-w-4xl flex items-center justify-center animate-in zoom-in-95 duration-1000 z-20">
            <div className="relative aspect-video w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/20 bg-black/40 flex items-center justify-center">
              {isEmbeddable ? (
                <>
                  {isSong && songMode === 'audio' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden">
                      <div className="absolute inset-0">
                        <Image 
                          src={bgImage} 
                          alt=""
                          fill
                          className="object-cover opacity-20 scale-110 blur-sm"
                          unoptimized
                        />
                      </div>
                      
                      {/* Pulse Visualizer Container */}
                      <div className="relative z-30 flex flex-col items-center gap-6">
                        <div className="flex items-end gap-1.5 h-[60px]">
                          {barDelays.map((delay, i) => (
                            <div 
                              key={i}
                              className="w-2.5 rounded-full border border-accent/40 bg-transparent animate-music-pulse"
                              style={{ 
                                animationDelay: `${delay}s`,
                                height: '1px'
                              }}
                            />
                          ))}
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
                    (isDropbox || isBilibili) ? (
                      <video 
                        src={getEmbedSource()}
                        className="w-full h-full object-contain absolute inset-0"
                        controls
                        autoPlay
                      />
                    ) : (
                      <iframe 
                        src={getEmbedSource()}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
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

            {isSong && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/80 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl z-30">
                <Button 
                  size="sm"
                  variant={songMode === 'audio' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-10 px-6 gap-2 font-bold text-[10px] uppercase tracking-widest transition-all", songMode === 'audio' ? "bg-primary text-white" : "text-white/40 hover:text-white")}
                  onClick={() => handleModeChange('audio')}
                >
                  <Headset size={14} /> Audio
                </Button>
                <Button 
                  size="sm"
                  variant={songMode === 'video' ? 'default' : 'ghost'} 
                  className={cn("rounded-xl h-10 px-6 gap-2 font-bold text-[10px] uppercase tracking-widest transition-all", songMode === 'video' ? "bg-primary text-white" : "text-white/40 hover:text-white")}
                  onClick={() => handleModeChange('video')}
                >
                  <Video size={14} /> Video
                </Button>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto w-full space-y-8 md:space-y-10 animate-in slide-in-from-bottom-8 duration-700 pb-20 z-20">
            {(currentlyPlaying.summary || currentlyPlaying.description) && (
              <div className="space-y-3 text-center px-4">
                <h3 className="text-[9px] font-headline font-bold flex items-center justify-center gap-2 text-white/30 uppercase tracking-[0.4em]">
                  <Info size={12} /> The Narrative
                </h3>
                <p className="text-white/90 text-sm sm:text-lg leading-relaxed font-light italic tracking-tight max-w-2xl mx-auto drop-shadow-lg">
                  {currentlyPlaying.summary || currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl relative overflow-hidden text-center shadow-2xl mx-4">
                <h3 className="text-[9px] font-headline font-bold text-accent/40 uppercase tracking-[0.4em] mb-3">Core Essence</h3>
                <p className="text-white text-base sm:text-xl font-medium leading-snug italic">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4 px-4">
              <Button onClick={handleOpenSource} variant="outline" className="h-14 rounded-2xl border-white/20 flex-1 bg-white/10 hover:bg-white/20 font-bold text-sm backdrop-blur-md">
                <ExternalLink size={16} className="mr-2 text-accent" /> Source Portal
              </Button>
              <Button 
                variant="secondary"
                className="h-14 rounded-2xl flex-1 bg-white/20 hover:bg-white/30 font-bold text-sm backdrop-blur-md border border-white/20"
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
