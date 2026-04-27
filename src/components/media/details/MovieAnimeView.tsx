"use client";

import { MediaItem, MediaCharacter } from '@/app/types/media';
import { X, Info, Play, BookOpen, Sparkles, Users, BrainCircuit, Quote, Heart, ArrowLeft, Languages, ShieldAlert, User, ChevronRight, Layers, Share2, AlertCircle, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';
import { updateSharingState, syncPlayback } from '@/app/actions/sync-actions';
import { toast } from '@/hooks/use-toast';

interface MovieAnimeViewProps {
  item: MediaItem;
  onClose: () => void;
}

type ViewMode = 'discovery' | 'playing';

export const MovieAnimeView: React.FC<MovieAnimeViewProps> = ({ item, onClose }) => {
  const router = useRouter();
  const { userName, otherUser, syncData } = useMedia();
  const [mode, setMode] = useState<ViewMode>('discovery');
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const syncInterval = useRef<NodeJS.Timeout | null>(null);

  const isFollowing = syncData?.sharing.status === 'active' && syncData.sharing.leader !== userName;
  const isLeader = syncData?.sharing.status === 'active' && syncData.sharing.leader === userName;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
  }, [mode]);

  // LEADER SYNC: Push video state to server
  useEffect(() => {
    if (isLeader && videoRef.current && mode === 'playing') {
      const pushSync = () => {
        if (!videoRef.current) return;
        syncPlayback(userName!, videoRef.current.currentTime, !videoRef.current.paused);
      };
      const interval = setInterval(pushSync, 1000);
      return () => clearInterval(interval);
    }
  }, [isLeader, mode, userName]);

  // FOLLOWER SYNC: Pull video state from leader
  useEffect(() => {
    if (isFollowing && videoRef.current && mode === 'playing' && syncData?.sharing.videoState) {
      const state = syncData.sharing.videoState;
      const localTime = videoRef.current.currentTime;
      
      // If time drift is > 2 seconds, snap to leader
      if (Math.abs(localTime - state.currentTime) > 2) {
        videoRef.current.currentTime = state.currentTime;
      }
      
      // Play/Pause sync
      if (state.isPlaying && videoRef.current.paused) videoRef.current.play().catch(() => {});
      else if (!state.isPlaying && !videoRef.current.paused) videoRef.current.pause();
    }
  }, [isFollowing, mode, syncData?.sharing.videoState]);

  const handleStartSharing = () => {
    updateSharingState(userName, item.id, 'requesting');
    toast({ title: "Sharing Request Sent", description: `Waiting for ${otherUser} to join the universe.` });
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
    <div className="fixed inset-0 z-[60] bg-background animate-in fade-in duration-500 overflow-hidden h-svh w-screen flex flex-col">
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none transition-all duration-1000">
        <Image 
          src={item.thumbnailUrl} 
          alt=""
          fill
          className={cn("object-cover opacity-30 blur-2xl transition-all duration-1000")}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/10 w-12 h-12 shadow-2xl"
        onClick={onClose}
      >
        <X size={24} />
      </Button>

      <div ref={scrollRef} className="flex-1 w-full relative z-10 overflow-y-auto scroll-smooth scrollbar-hide">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-32 flex flex-col items-center">
          
          {mode === 'discovery' ? (
            <div className="w-full space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 bg-black/40 border border-primary/30 px-6 py-2 rounded-full backdrop-blur-3xl">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Multiverse Archive</span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white drop-shadow-2xl">{item.title}</h1>
                
                <div className="flex items-center justify-center gap-4">
                   <Button onClick={() => setMode('playing')} className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg gap-3">
                     <Play fill="currentColor" size={20} /> Enter Universe
                   </Button>
                   {!isFollowing && !isLeader && (
                     <Button onClick={handleStartSharing} variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-lg gap-3 group">
                       <Share2 size={20} className="group-hover:scale-110" /> Share Universe
                     </Button>
                   )}
                </div>
              </div>

              {isFollowing && (
                <div className="w-full p-8 rounded-[2rem] bg-accent/10 border border-accent/20 text-center space-y-4">
                   <h3 className="text-2xl font-headline font-bold text-white italic">"Ready to watch together?"</h3>
                   <p className="text-white/60">Leader: {otherUser}</p>
                   <Button onClick={() => setMode('playing')} className="rounded-full bg-accent text-accent-foreground font-black px-8">Join Party</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-12">
               <div className="text-center space-y-4">
                 <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">{item.title}</h2>
                 {isLeader && (
                   <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/30">
                      <CircleDot size={12} className="text-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Broadcasting to {otherUser}</span>
                   </div>
                 )}
                 {isFollowing && (
                   <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-1.5 rounded-full border border-accent/30">
                      <Layers size={12} className="text-accent animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent">Following {otherUser}'s Timeline</span>
                   </div>
                 )}
               </div>
               
               <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] bg-black relative group">
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
                 
                 {isFollowing && (
                    <div className="absolute inset-0 z-50 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="p-6 bg-background/80 backdrop-blur-3xl rounded-[2rem] border border-white/10 text-center space-y-2">
                          <ShieldAlert className="mx-auto text-accent" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Timeline Locked</p>
                          <p className="text-sm font-bold">{otherUser} is Directing</p>
                       </div>
                    </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
