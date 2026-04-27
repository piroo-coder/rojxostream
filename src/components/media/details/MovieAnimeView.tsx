
"use client";

import { MediaItem } from '@/app/types/media';
import { X, Play, Sparkles, Share2, CircleDot, Layers, ShieldAlert, Maximize2, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMedia } from '@/context/MediaContext';
import { updateSharingState, syncPlayback } from '@/app/actions/sync-actions';
import { toast } from '@/hooks/use-toast';

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

  // Sync Video State
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
          className="object-cover opacity-30 blur-2xl"
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
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 flex flex-col items-center">
          
          {mode === 'discovery' ? (
            <div className="w-full space-y-12 md:space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-3 bg-black/40 border border-primary/30 px-6 py-2 rounded-full backdrop-blur-3xl">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Multiverse Portal</span>
                </div>
                <h1 className="text-4xl sm:text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white drop-shadow-2xl leading-none">{item.title}</h1>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                   <Button onClick={() => setMode('playing')} className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg gap-3 shadow-2xl">
                     <Play fill="currentColor" size={20} /> Enter Solo
                   </Button>
                   {!isFollowing && !isLeader && (
                     <Button onClick={handleStartSharing} variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl border-accent/20 bg-accent/5 hover:bg-accent/10 text-white font-black text-lg gap-3 group">
                       <MonitorPlay size={22} className="text-accent group-hover:scale-110 transition-transform" /> Share with {otherUser}
                     </Button>
                   )}
                </div>
              </div>

              {isFollowing && (
                <div className="w-full p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20 text-center space-y-4 animate-pulse backdrop-blur-3xl">
                   <h3 className="text-2xl font-headline font-bold text-white italic">"{otherUser} is waiting for you!"</h3>
                   <p className="text-white/40 text-sm font-medium">Join the shared cinematic timeline now.</p>
                   <Button onClick={() => setMode('playing')} className="rounded-full bg-accent text-accent-foreground font-black px-12 h-14 text-base shadow-2xl">Connect to Stream</Button>
                </div>
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
                 
                 {isFollowing && !isYoutube && (
                    <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                       <div className="p-8 bg-background/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 text-center space-y-4 max-w-sm shadow-2xl">
                          <ShieldAlert className="mx-auto text-accent size-8" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Timeline Guard</p>
                            <p className="text-lg font-bold text-white">{otherUser} is directing this universe</p>
                          </div>
                          <p className="text-[10px] italic text-white/20">Controls are synchronized to the leader.</p>
                       </div>
                    </div>
                 )}
               </div>

               {isFullScreen && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsFullScreen(false)}
                    className="absolute top-8 right-8 z-[100] bg-black/60 hover:bg-black/80 rounded-full text-white/60 h-12 w-12 border border-white/10 backdrop-blur-xl"
                  >
                    <X size={24} />
                  </Button>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
