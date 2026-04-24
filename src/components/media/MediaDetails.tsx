"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Music, Info, ExternalLink, Play, Video, Headset, BookOpen, Film, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();
  const [songMode, setSongMode] = useState<'video' | 'audio'>('audio');
  const [mode, setMode] = useState<'discovery' | 'playing'>('discovery');

  useEffect(() => {
    if (currentlyPlaying) {
      // Auto-play for Music and Shorts
      if (currentlyPlaying.type === 'song' || currentlyPlaying.type === 'short') {
        setMode('playing');
      } else {
        setMode('discovery');
      }
      setSongMode('audio');
    }
  }, [currentlyPlaying?.id, currentlyPlaying?.type]);

  if (!currentlyPlaying) return null;

  const isSong = currentlyPlaying.type === 'song';
  const isCine = currentlyPlaying.type === 'movie' || currentlyPlaying.type === 'anime';
  
  const isYoutube = currentlyPlaying.mediaUrl.includes('youtube.com') || currentlyPlaying.mediaUrl.includes('youtu.be');
  const isDailymotion = currentlyPlaying.mediaUrl.includes('dailymotion.com') || currentlyPlaying.mediaUrl.includes('dai.ly');
  const isVimeo = currentlyPlaying.mediaUrl.includes('vimeo.com');
  const isFacebook = currentlyPlaying.mediaUrl.includes('facebook.com');
  const isDropbox = currentlyPlaying.mediaUrl.includes('dropbox.com');
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
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('dl=0', 'raw=1');
  };

  const getBilibiliEmbedUrl = (url: string) => {
    if (url.includes('bilibili.com')) {
      const bvidMatch = url.match(/BV[a-zA-Z0-9]+/);
      if (bvidMatch) return `https://player.bilibili.com/player.html?bvid=${bvidMatch[0]}&autoplay=1`;
    }
    const parts = url.split('/');
    const id = parts[parts.length - 1].split('?')[0];
    if (url.includes('bilibili.tv')) return `https://www.bilibili.tv/en/video/embed/${id}`;
    return url;
  };

  const handleOpenSource = () => window.open(currentlyPlaying.mediaUrl, '_blank');
  const handleOpenWiki = () => currentlyPlaying.wikipediaUrl && window.open(currentlyPlaying.wikipediaUrl, '_blank');
  const handleOpenManga = () => currentlyPlaying.mangaUrl && window.open(currentlyPlaying.mangaUrl, '_blank');

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

  const isEmbeddable = isYoutube || isDailymotion || isVimeo || isFacebook || isDropbox || isGenericEmbed || isBilibili;

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
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Persistent Close Control */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/20 w-10 h-10 sm:w-14 sm:h-14 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X className="size-5 sm:size-7" />
      </Button>

      <ScrollArea className="flex-1 w-full h-full relative z-10">
        <div className="container mx-auto max-w-5xl px-4 min-h-full flex flex-col items-center justify-center py-20 md:py-32">
          
          {mode === 'discovery' && isCine ? (
            <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent bg-black/60 px-6 py-2 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
                    Universe Discovery
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold tracking-tighter leading-tight text-white drop-shadow-2xl">
                  {currentlyPlaying.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-accent font-bold text-lg md:text-xl">
                   <span className="flex items-center gap-2"><Film size={18} /> {currentlyPlaying.creator}</span>
                   {currentlyPlaying.theme && <span className="text-white/40">•</span>}
                   {currentlyPlaying.theme && <span className="flex items-center gap-2 text-white/60"><Sparkles size={18} /> {currentlyPlaying.theme}</span>}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Meta & Links */}
                <div className="lg:col-span-1 space-y-6">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">The Creators</h4>
                        <div className="space-y-3">
                           <div>
                              <p className="text-[10px] uppercase text-accent font-bold">Director</p>
                              <p className="text-sm font-medium">{currentlyPlaying.creator}</p>
                           </div>
                           {currentlyPlaying.writers && (
                             <div>
                                <p className="text-[10px] uppercase text-accent font-bold">Writers</p>
                                <p className="text-sm font-medium">{currentlyPlaying.writers}</p>
                             </div>
                           )}
                           {currentlyPlaying.producers && (
                             <div>
                                <p className="text-[10px] uppercase text-accent font-bold">Producers</p>
                                <p className="text-sm font-medium">{currentlyPlaying.producers}</p>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Resources</h4>
                        <div className="flex flex-col gap-2">
                           {currentlyPlaying.wikipediaUrl && (
                             <Button onClick={handleOpenWiki} variant="ghost" className="justify-start gap-3 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                               <Info size={16} className="text-blue-400" />
                               <span className="text-xs font-bold uppercase tracking-widest">Wikipedia</span>
                             </Button>
                           )}
                           {currentlyPlaying.type === 'anime' && currentlyPlaying.mangaUrl && (
                             <Button onClick={handleOpenManga} variant="ghost" className="justify-start gap-3 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                               <BookOpen size={16} className="text-pink-400" />
                               <span className="text-xs font-bold uppercase tracking-widest">Read Manga</span>
                             </Button>
                           )}
                        </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Narrative */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="space-y-4">
                      <h3 className="text-xs font-headline font-bold flex items-center gap-3 text-accent uppercase tracking-[0.3em]">
                        <div className="h-px w-8 bg-accent/30" /> The Journey
                      </h3>
                      <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light italic">
                        "{currentlyPlaying.summary}"
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h3 className="text-xs font-headline font-bold flex items-center gap-3 text-accent uppercase tracking-[0.3em]">
                        <div className="h-px w-8 bg-accent/30" /> Full Narrative Plot
                      </h3>
                      <p className="text-white/70 text-base leading-relaxed font-body">
                        {currentlyPlaying.fullPlot || currentlyPlaying.description}
                      </p>
                   </div>

                   {currentlyPlaying.moral && (
                     <div className="p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20 backdrop-blur-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                           <Sparkles size={80} className="text-accent" />
                        </div>
                        <h3 className="text-[10px] font-headline font-bold text-accent uppercase tracking-[0.4em] mb-4">Core Life Essence</h3>
                        <p className="text-white text-xl md:text-2xl font-medium leading-snug italic relative z-10">
                          "{currentlyPlaying.moral}"
                        </p>
                     </div>
                   )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row gap-6 pt-12 items-center justify-center">
                 <Button 
                   size="lg" 
                   onClick={() => setMode('playing')}
                   className="h-20 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-xl font-bold shadow-2xl shadow-primary/40 group relative overflow-hidden transition-all hover:scale-105 active:scale-95"
                 >
                   <Play className="mr-4 fill-current group-hover:animate-pulse" size={24} />
                   Enter the Universe
                 </Button>
                 <Button 
                   onClick={() => setCurrentlyPlaying(null)}
                   variant="ghost" 
                   className="h-16 px-10 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 uppercase tracking-widest font-black text-xs"
                 >
                   Return to Explore
                 </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center space-y-8 md:space-y-12">
               {/* Player Header */}
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

              {/* Media Player Container */}
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
                          
                          <div className="relative z-30 flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-transparent">
                            <div className="flex items-end gap-1 px-4">
                              <div className="now-playing-bar n1"></div>
                              <div className="now-playing-bar n2"></div>
                              <div className="now-playing-bar n3"></div>
                              <div className="now-playing-bar n4"></div>
                              <div className="now-playing-bar n5"></div>
                              <div className="now-playing-bar n6"></div>
                              <div className="now-playing-bar n7"></div>
                              <div className="now-playing-bar n8"></div>
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
                        (isDropbox) ? (
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
                      onClick={() => setSongMode('audio')}
                    >
                      <Headset size={14} /> Audio
                    </Button>
                    <Button 
                      size="sm"
                      variant={songMode === 'video' ? 'default' : 'ghost'} 
                      className={cn("rounded-xl h-10 px-6 gap-2 font-bold text-[10px] uppercase tracking-widest transition-all", songMode === 'video' ? "bg-primary text-white" : "text-white/40 hover:text-white")}
                      onClick={() => setSongMode('video')}
                    >
                      <Video size={14} /> Video
                    </Button>
                  </div>
                )}
              </div>

              {/* Back to Discovery Option for Movies/Anime */}
              {isCine && (
                <div className="z-20 pt-8 animate-in fade-in duration-1000">
                   <Button 
                     variant="ghost" 
                     onClick={() => setMode('discovery')}
                     className="text-white/40 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                   >
                     <Info size={14} /> View Detailed Description
                   </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
