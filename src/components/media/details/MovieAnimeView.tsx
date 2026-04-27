"use client";

import { MediaItem, MediaCharacter } from '@/app/types/media';
import { X, Info, Play, BookOpen, Sparkles, Users, BrainCircuit, Quote, Heart, ArrowLeft, Languages, ShieldAlert, User, ChevronRight, Layers, Share2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';
import { updateSharingState } from '@/app/actions/sync-actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MovieAnimeViewProps {
  item: MediaItem;
  onClose: () => void;
}

type ViewMode = 'discovery' | 'playing' | 'analysis' | 'hindi-explanation' | 'wikipedia' | 'character-details';

export const MovieAnimeView: React.FC<MovieAnimeViewProps> = ({ item, onClose }) => {
  const router = useRouter();
  const { library, userName, otherUser, syncData } = useMedia();
  const [mode, setMode] = useState<ViewMode>('discovery');
  const [showMangaConfirm, setShowMangaConfirm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<MediaCharacter | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isFollowing = syncData?.sharing.status === 'active' && syncData.sharing.leader !== userName;
  const isLeader = syncData?.sharing.status === 'active' && syncData.sharing.leader === userName;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
  }, [mode, selectedCharacter]);

  const getEmbedSource = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let id = '';
      if (url.includes('watch?v=')) id = url.split('v=')[1].split('&')[0];
      else if (url.includes('youtu.be/')) id = url.split('be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  const handleStartSharing = () => {
    updateSharingState(userName, item.id, 'requesting');
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

      {!isFollowing && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/10 w-12 h-12 shadow-2xl"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
      )}

      {isFollowing && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 bg-primary/20 border border-primary/30 px-6 py-2.5 rounded-full backdrop-blur-3xl animate-pulse">
           <AlertCircle className="text-primary" size={16} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Watching with {otherUser}</span>
        </div>
      )}

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
                       <Share2 size={20} className="group-hover:scale-110" /> Start Sharing
                     </Button>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                  <div className="p-8 rounded-[2.5rem] bg-card/60 border border-white/5 backdrop-blur-3xl space-y-8">
                     <div className="space-y-4">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-primary">Director</h4>
                        <p className="text-xl font-bold">{item.creator}</p>
                     </div>
                     {item.imdbRating && (
                        <div className="space-y-4">
                           <h4 className="text-[9px] font-black uppercase tracking-widest text-accent">Rating</h4>
                           <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-xs font-black border border-yellow-500/20">IMDb {item.imdbRating}</div>
                           </div>
                        </div>
                     )}
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-12">
                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-4">
                        <div className="h-px w-12 bg-primary/30" /> The Chronicle
                      </h3>
                      <p className="text-2xl font-light text-white/90 leading-tight italic">{item.summary || item.description}</p>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-12">
               <div className="text-center space-y-4">
                 <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">{item.title}</h2>
                 {!isFollowing && (
                   <button onClick={() => setMode('discovery')} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-transparent border-0 mx-auto">
                      <ArrowLeft size={14} /> Back to Discovery
                   </button>
                 )}
               </div>
               
               <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] bg-black relative">
                 <iframe 
                    src={getEmbedSource(item.mediaUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {isFollowing && (
                    <div className="absolute inset-0 z-50 bg-transparent cursor-not-allowed pointer-events-auto" title="Leader is controlling the session" />
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
