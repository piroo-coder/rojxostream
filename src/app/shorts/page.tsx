
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Heart, MessageCircle, Share2, User, Volume2, VolumeX, Sparkles, Stars, Music, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/app/types/media';
import { cn } from '@/lib/utils';

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
      className="short-item relative flex items-center justify-center bg-black w-full h-svh overflow-hidden"
      data-short-id={short.id}
    >
      {/* Immersive Background Blur (Atmosphere) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={short.thumbnailUrl} 
          alt="" 
          className="w-full h-full object-cover opacity-20 blur-[120px] scale-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
      </div>

      {/* Main Video Container (Aligned to YouTube Shorts Proportions) */}
      <div className="relative w-full h-full max-w-[500px] md:max-h-[90vh] md:aspect-[9/16] bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center z-10 md:rounded-[3rem] overflow-hidden border-x border-white/5 md:border border-white/10 group">
        
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
              className="w-full h-full object-cover opacity-50 grayscale-[0.5]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white/80 border-b-[12px] border-b-transparent ml-2" />
              </div>
            </div>
          </div>
        )}

        {/* Mute/Audio Overlay - Subtle and Top-Right */}
        <button 
          className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white/90 hover:bg-white/20 transition-all active:scale-90"
          onClick={onToggleMute}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Interaction Overlays - Placed INSIDE the video frame for YouTube feel */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 md:p-6 z-20">
          <div className="flex items-end justify-between gap-4 w-full">
            
            {/* Info Section (Bottom Left) */}
            <div className="flex-1 pointer-events-auto text-white space-y-4 mb-4 drop-shadow-2xl max-w-[80%]">
              <div className="flex items-center gap-3">
                <div className="relative group/avatar cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-sm opacity-60 group-hover/avatar:opacity-100 transition-opacity" />
                  <div className="relative w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/50 overflow-hidden shadow-xl">
                    <User size={22} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5 border-2 border-black">
                    <Plus size={10} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-base leading-none tracking-tight">@{short.creator || 'Creator'}</span>
                    <button className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full hover:bg-neutral-200 transition-colors uppercase tracking-widest">Follow</button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium leading-tight line-clamp-2 text-white/95">{short.title}</p>
                {short.description && (
                  <p className="text-[11px] text-white/70 line-clamp-1 font-light">{short.description}</p>
                )}
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 w-fit">
                  <Music size={12} className="animate-pulse text-pink-400" />
                  <span className="text-[10px] font-bold tracking-tight truncate max-w-[120px]">Original Sound • {short.title}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Vertical Right) */}
            <div className="flex flex-col gap-6 pointer-events-auto mb-6 items-center">
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-pink-500/80 transition-all w-12 h-12 border border-white/10 group-active:scale-90"
                >
                  <Heart size={26} className="fill-current text-white group-hover:text-white transition-colors" />
                </Button>
                <span className="text-[10px] font-black text-white/90 drop-shadow-md">24.5K</span>
              </div>

              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-all w-12 h-12 border border-white/10 group-active:scale-90"
                >
                  <MessageCircle size={26} className="fill-current text-white" />
                </Button>
                <span className="text-[10px] font-black text-white/90 drop-shadow-md">1.8K</span>
              </div>

              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-all w-12 h-12 border border-white/10 group-active:scale-90"
                >
                  <Share2 size={24} className="text-white" />
                </Button>
                <span className="text-[10px] font-black text-white/90 drop-shadow-md">Share</span>
              </div>
              
              <div className="relative mt-2">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-md opacity-40 animate-pulse" />
                <div className="relative w-10 h-10 rounded-full border-2 border-white/40 overflow-hidden animate-[spin_12s_linear_infinite] shadow-2xl">
                  <img src={short.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Darkening bottom gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none z-10" />
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
    <main className="h-svh bg-background overflow-hidden relative">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] text-pink-500/10 animate-pulse">
          <Stars size={100} />
        </div>
        <div className="absolute bottom-[10%] right-[5%] text-accent/10 animate-pulse delay-1000">
          <Sparkles size={80} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] bg-pink-500/5 rounded-full blur-[180px] animate-pulse-slow" />
      </div>
      
      <div ref={containerRef} className="shorts-container h-full snap-y snap-mandatory scroll-smooth relative z-10 scrollbar-hide">
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
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-inner">
              <Sparkles size={48} className="text-white/10" />
            </div>
            <h3 className="text-3xl font-headline font-bold mb-3 text-white">Quiet in the Multiverse</h3>
            <p className="text-base max-w-xs font-light">No short universes were discovered with those coordinates. Try another search!</p>
          </div>
        )}
      </div>
    </main>
  );
}
