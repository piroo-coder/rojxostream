
"use client";

import { MediaItem } from '@/app/types/media';
import { X, Play, Sparkles, Share2, CircleDot, Layers, ShieldAlert, Maximize2, MonitorPlay, Users, BookOpen, Quote, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMedia } from '@/context/MediaContext';
import { updateSharingState, syncPlayback } from '@/app/actions/sync-actions';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface MovieAnimeViewProps {
  item: MediaItem;
  onClose: () => void;
}

type ViewMode = 'discovery' | 'playing';

export const MovieAnimeView: React.FC<MovieAnimeViewProps> = ({ item, onClose }) => {
  const { userName, otherUser, syncData } = useMedia();
  const [mode, setMode] = useState<ViewMode>('discovery');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isFollowing = syncData?.sharing.status === 'active' && syncData.sharing.leader !== userName;
  const isLeader = syncData?.sharing.status === 'active' && syncData.sharing.leader === userName;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
  }, [mode]);

  useEffect(() => {
    if (isLeader && videoRef.current && mode === 'playing') {
      const pushSync = () => {
        if (!videoRef.current) return;
        syncPlayback(userName!, videoRef.current.currentTime, !videoRef.current.paused);
      };
      const interval = setInterval(pushSync, 800);
      return () => clearInterval(interval);
    }
  }, [isLeader, mode, userName]);

  useEffect(() => {
    if (isFollowing && videoRef.current && mode === 'playing' && syncData?.sharing.videoState) {
      const state = syncData.sharing.videoState;
      const localTime = videoRef.current.currentTime;
      
      if (Math.abs(localTime - state.currentTime) > 1.5) {
        videoRef.current.currentTime = state.currentTime;
      }
      
      if (state.isPlaying && videoRef.current.paused) videoRef.current.play().catch(() => {});
      else if (!state.isPlaying && !videoRef.current.paused) videoRef.current.pause();
    }
  }, [isFollowing, mode, syncData?.sharing.videoState]);

  const handleStartSharing = () => {
    const isYoutube = item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be');
    let youtubeId = '';
    if (isYoutube) {
      if (item.mediaUrl.includes('watch?v=')) youtubeId = item.mediaUrl.split('v=')[1].split('&')[0];
      else if (item.mediaUrl.includes('youtu.be/')) youtubeId = item.mediaUrl.split('be/')[1].split('?')[0];
    }
    updateSharingState(userName, item.id, 'requesting', isYoutube, youtubeId);
    toast({ title: "Sharing Universe...", description: `Asking ${otherUser} to join the cinematic stream.` });
  };

  const isYoutube = item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be');

  const getEmbedSource = (url: string) => {
    if (!url) return '';
    if (isYoutube) {
      let id = '';
      if (url.includes('watch?v=')) id = url.split('v=')[1].split('&')[0];
      else if (url.includes('youtu.be/')) id = url.split('be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
    }
    return url;
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[60] bg-background animate-in fade-in duration-500 overflow-hidden h-svh w-screen flex flex-col",
      isFullScreen && "z-[100]"
    )}>
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none transition-all duration-1000">
        <Image 
          src={item.thumbnailUrl} 
          alt=""
          fill
          className="object-cover opacity-20 blur-3xl scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/10 w-10 h-10 md:w-12 md:h-12 shadow-2xl"
        onClick={onClose}
      >
        <X size={20} className="md:size-6" />
      </Button>

      <div ref={scrollRef} className="flex-1 w-full relative z-10 overflow-y-auto scrollbar-hide">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          
          {mode === 'discovery' ? (
            <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              {/* Hero Info */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 bg-black/40 border border-primary/30 px-6 py-2 rounded-full backdrop-blur-3xl">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Multiverse Archive</span>
                </div>
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-headline font-bold tracking-tighter text-white drop-shadow-2xl leading-none">{item.title}</h1>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                   <Button onClick={() => setMode('playing')} className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95">
                     <Play fill="currentColor" size={20} /> Enter Solo
                   </Button>
                   {!isFollowing && !isLeader && (
                     <Button onClick={handleStartSharing} variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl border-accent/20 bg-accent/5 hover:bg-accent/10 text-white font-black text-lg gap-3 group transition-all hover:scale-105">
                       <MonitorPlay size={22} className="text-accent group-hover:scale-110 transition-transform" /> Share with {otherUser}
                     </Button>
                   )}
                </div>
              </div>

              {/* Character Grid */}
              {item.characters && item.characters.length > 0 && (
                <div className="space-y-8">
                   <h3 className="text-2xl font-headline font-bold flex items-center gap-3">
                     <Users size={24} className="text-accent" /> Essential Souls
                   </h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                     {item.characters.map((char, i) => (
                       <div key={i} className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-500">
                         <Image src={char.image_url} alt={char.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                         <div className="absolute bottom-4 left-4 right-4">
                           <p className="text-xs font-black text-white truncate">{char.name}</p>
                           <p className="text-[9px] text-accent uppercase font-black tracking-widest">{char.role || 'Protagonist'}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* Plot & Moral */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-2xl font-headline font-bold flex items-center gap-3">
                    <BookOpen size={24} className="text-primary" /> The Chronicle
                  </h3>
                  <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light italic">
                    "{item.summary || item.description}"
                  </p>
                </div>
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                     <Quote size={12} /> The Essence
                   </h4>
                   <p className="text-2xl font-headline font-bold text-white italic leading-tight">
                     {item.moral || "Brief connections give us strength."}
                   </p>
                </div>
              </div>

              {/* Related Shorts Link */}
              {item.relatedShortIds && item.relatedShortIds.length > 0 && (
                 <Link href={`/shorts?ids=${item.relatedShortIds.join(',')}`}>
                   <div className="group relative w-full h-32 md:h-40 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-primary/40 transition-all cursor-pointer shadow-2xl">
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-between px-8 md:px-12">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Multiverse Fragments</p>
                          <h4 className="text-2xl md:text-4xl font-headline font-bold text-white">Explore Related Shorts</h4>
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-4 transition-transform">
                          <ChevronRight size={32} className="text-white" />
                        </div>
                      </div>
                   </div>
                 </Link>
              )}
            </div>
          ) : (
            <div className={cn(
              "w-full flex flex-col items-center gap-6 md:gap-12",
              isFullScreen && "fixed inset-0 z-[90] p-0 bg-black justify-center"
            )}>
               {!isFullScreen && (
                 <div className="text-center space-y-4 px-4">
                   <h2 className="text-2xl md:text-5xl font-headline font-bold text-white tracking-tight">{item.title}</h2>
                   <div className="flex flex-wrap items-center justify-center gap-3">
                     {isLeader && (
                       <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-xl">
                          <CircleDot size={12} className="text-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Broadcasting to {otherUser}</span>
                       </div>
                     )}
                     {isFollowing && (
                       <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20 shadow-xl">
                          <Layers size={12} className="text-accent animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Following {otherUser}</span>
                       </div>
                     )}
                     <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="rounded-full bg-white/5 hover:bg-white/10 text-white/40 h-10 px-4 border border-white/5"
                     >
                       <Maximize2 size={14} className="mr-2" /> {isFullScreen ? "Exit Fullscreen" : "Immersive Mode"}
                     </Button>
                   </div>
                 </div>
               )}
               
               <div className={cn(
                 "w-full max-w-5xl aspect-video overflow-hidden border border-white/10 bg-black relative group transition-all duration-700",
                 isFullScreen ? "max-w-none w-screen h-screen rounded-0 border-0" : "rounded-[2rem] md:rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,1)]"
               )}>
                 {isYoutube ? (
                   <iframe 
                      src={getEmbedSource(item.mediaUrl)}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                 ) : (
                   <video 
                      ref={videoRef}
                      src={item.mediaUrl}
                      controls={!isFollowing}
                      className="w-full h-full object-contain"
                    />
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
