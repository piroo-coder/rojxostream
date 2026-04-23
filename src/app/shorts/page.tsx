
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Heart, MessageCircle, Share2, User, Volume2, VolumeX, Sparkles, Stars, Music, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/app/types/media';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ShortItem = ({ 
  short, 
  isActive, 
  isMuted, 
  onToggleMute 
}: { 
  short: MediaItem; 
  isActive: boolean; 
  isMuted: boolean;
  onToggleMute: () => void;
}) => {
  const isYoutube = short.mediaUrl.includes('youtube.com');
  
  const getYoutubeEmbedUrl = (url: string, active: boolean, muted: boolean) => {
    let id = '';
    if (url.includes('/shorts/')) {
      id = url.split('/shorts/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      id = url.split('v=')[1].split('&')[0];
    }
    
    const muteParam = muted ? 1 : 0;
    return `https://www.youtube.com/embed/${id}?autoplay=${active ? 1 : 0}&mute=${muteParam}&controls=0&rel=0&modestbranding=1&enablejsapi=1&loop=1&playlist=${id}`;
  };

  return (
    <div 
      className="short-item relative flex items-center justify-center bg-black w-full h-[calc(100svh-64px)] md:h-[calc(100svh-80px)] overflow-hidden"
      data-short-id={short.id}
    >
      {/* Immersive Ambient Glow (YouTube style) - Intense & Color-Accurate */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* The primary color spill - Using thumbnail with high saturation and massive blur */}
        <div className="absolute inset-0 opacity-80 blur-[120px] scale-[2] saturate-[250%] transition-all duration-1000">
           <img 
              src={short.thumbnailUrl} 
              alt="" 
              className="w-full h-full object-cover"
            />
        </div>
        
        {/* Layered Color Spill for Depth */}
        <div className="absolute inset-0 opacity-40 blur-[200px] scale-[1.5] saturate-[300%] transition-all duration-1000">
           <img 
              src={short.thumbnailUrl} 
              alt="" 
              className="w-full h-full object-cover"
            />
        </div>
        
        {/* Subtle Darkening Overlay - Less intense to let colors shine */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Floating Decor */}
        <div className="absolute top-[20%] left-[10%] text-white/5 animate-pulse">
          <Heart size={60} fill="currentColor" />
        </div>
        <div className="absolute bottom-[30%] right-[15%] text-white/5 animate-bounce">
          <Sparkles size={40} />
        </div>
      </div>

      {/* Main Video Container (Slim mobile-first proportion) */}
      <div className={cn(
        "relative z-10 w-full h-full max-w-[360px] aspect-[9/16] bg-black shadow-[0_0_150px_rgba(0,0,0,1)]",
        "flex items-center justify-center sm:rounded-[2.5rem] overflow-hidden border border-white/20 group transition-all duration-500"
      )}>
        
        {isActive ? (
          <div className="w-full h-full">
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(short.mediaUrl, isActive, isMuted)}
                className="w-full h-full scale-[1.05]"
                title={short.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video 
                src={short.mediaUrl} 
                className="w-full h-full object-cover"
                loop
                autoPlay
                muted={isMuted}
                playsInline
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <img 
              src={short.thumbnailUrl} 
              alt={short.title} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white/80 border-b-[8px] border-b-transparent ml-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Audio Toggle (Top Right) */}
        <button 
          className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl"
          onClick={onToggleMute}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Interaction Overlays */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-20">
          <div className="flex items-end justify-between w-full">
            
            {/* Creator Info (Bottom Left) */}
            <div className="flex-1 pointer-events-auto text-white space-y-3 mb-2 drop-shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="relative group/avatar cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-sm opacity-50 group-hover/avatar:opacity-100 transition-opacity" />
                  <div className="relative w-10 h-10 rounded-full bg-neutral-800 border-2 border-white/40 overflow-hidden">
                    <User size={20} className="m-auto mt-2" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-pink-500 rounded-full p-0.5 border border-black">
                    <Plus size={8} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-sm tracking-tight">@{short.creator || 'Creator'}</span>
                    <button className="bg-white text-black text-[9px] font-black px-3 py-1 rounded-full hover:bg-pink-500 hover:text-white transition-all uppercase tracking-widest">Follow</button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium leading-snug line-clamp-2 text-white/95 max-w-[90%]">{short.title}</p>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit">
                  <Music size={10} className="animate-pulse text-pink-400" />
                  <span className="text-[10px] font-bold tracking-tight truncate max-w-[140px]">Original Sound • {short.title}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Right Stack) */}
            <div className="flex flex-col gap-5 pointer-events-auto mb-2 items-center pl-2">
              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-pink-500/80 transition-all w-12 h-12 border border-white/10 group active:scale-90 shadow-lg"
                >
                  <Heart size={24} className="text-white group-hover:scale-110 transition-transform" />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">24.5K</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-all w-12 h-12 border border-white/10 group active:scale-90 shadow-lg"
                >
                  <MessageCircle size={24} className="text-white" />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">1.2K</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-all w-12 h-12 border border-white/10 group active:scale-90 shadow-lg"
                >
                  <Share2 size={22} className="text-white" />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">Share</span>
              </div>
              
              <div className="relative mt-2">
                <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-md opacity-60 animate-pulse" />
                <div className="relative w-10 h-10 rounded-full border-2 border-white/40 overflow-hidden animate-[spin_10s_linear_infinite]">
                  <img src={short.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradients for UI Visibility */}
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/70 via-transparent to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default function ShortsPage() {
  const { library, searchTerm } = useMedia();
  const [isMuted, setIsMuted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shorts = library.filter(item => 
    item.type === 'short' && 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.creator?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (shorts.length > 0 && !activeId) {
      setActiveId(shorts[0].id);
    }
  }, [shorts, activeId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = shorts.findIndex(s => s.id === activeId);
        if (currentIndex === -1) return;

        let targetIndex = currentIndex;
        if (e.key === 'ArrowDown') {
          targetIndex = Math.min(shorts.length - 1, currentIndex + 1);
        } else {
          targetIndex = Math.max(0, currentIndex - 1);
        }

        if (targetIndex !== currentIndex) {
          const targetId = shorts[targetIndex].id;
          const targetElement = document.querySelector(`[data-short-id="${targetId}"]`);
          targetElement?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shorts, activeId]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.8,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-short-id');
          if (id) {
            setActiveId(id);
          }
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.short-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [shorts]);

  return (
    <main className="h-svh bg-black overflow-hidden relative">
      <Navbar />
      
      {/* Global Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] text-white/5 animate-pulse">
          <Stars size={120} />
        </div>
        <div className="absolute bottom-[10%] right-[5%] text-white/5 animate-pulse delay-1000">
          <Sparkles size={100} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rem] h-[80rem] bg-white/5 rounded-full blur-[200px] animate-pulse-slow" />
      </div>
      
      <div 
        ref={containerRef} 
        className={cn(
          "shorts-container h-full pt-16 md:pt-20",
          "snap-y snap-mandatory scroll-smooth relative z-10 scrollbar-hide",
          "scroll-pt-16 md:scroll-pt-20"
        )}
      >
        {shorts.length > 0 ? (
          shorts.map((short) => (
            <div 
              key={short.id} 
              className="w-full h-full snap-start"
            >
              <ShortItem 
                short={short} 
                isActive={activeId === short.id} 
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
              />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center pt-32">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <Sparkles size={48} className="text-white/10" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2 text-white">No Shorts Found</h3>
            <p className="text-sm max-w-xs font-light">The multiverse is quiet. Try another search!</p>
          </div>
        )}
      </div>
    </main>
  );
}
