
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Heart, MessageCircle, Share2, User, Volume2, VolumeX, Sparkles, Stars, Music } from 'lucide-react';
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
      className="short-item relative flex items-center justify-center bg-black w-full h-screen overflow-hidden"
      data-short-id={short.id}
    >
      {/* Immersive Background Blur (Lovely Atmosphere) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={short.thumbnailUrl} 
          alt="" 
          className="w-full h-full object-cover opacity-20 blur-[100px] scale-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
      </div>

      {/* Main Video Container */}
      <div className="relative w-full h-full max-w-[450px] aspect-[9/16] bg-neutral-900/50 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center z-10 sm:rounded-[2.5rem] overflow-hidden border border-white/10 backdrop-blur-sm">
        {isActive ? (
          <div className="w-full h-full">
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(short.mediaUrl, isActive, isMuted)}
                className="w-full h-full scale-[1.01]"
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
              className="w-full h-full object-cover opacity-50 grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white/60 border-b-[10px] border-b-transparent ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* Mute Overlay Button (Professional & Functional) */}
        <button 
          className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 transition-all active:scale-90"
          onClick={onToggleMute}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
      {/* Cute & Professional Interaction UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-20 pb-24 md:pb-12">
        <div className="flex justify-between items-end gap-6 max-w-[500px] mx-auto w-full">
          
          {/* Info Section (Cute typography & Lovely Avatar) */}
          <div className="flex-1 pointer-events-auto text-white space-y-4 mb-4 drop-shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-pink-500/40 rounded-full blur-sm animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center ring-2 ring-white/30 overflow-hidden shadow-lg">
                  <User size={24} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline font-bold text-lg leading-none tracking-tight">@{short.creator || 'Creator'}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/50">Follow</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 opacity-60">
                  <Music size={10} className="animate-pulse" />
                  <span className="text-[10px] truncate max-w-[150px]">Original Sound • {short.title}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/5 max-w-[280px]">
              <p className="text-sm font-bold line-clamp-2 leading-tight mb-1">{short.title}</p>
              <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed font-light">{short.description}</p>
            </div>
          </div>

          {/* Action Bar (Lovely Buttons) */}
          <div className="flex flex-col gap-5 pointer-events-auto mb-4 items-center">
            <div className="flex flex-col items-center gap-1.5 group">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full bg-white/10 backdrop-blur-2xl hover:bg-pink-500/80 transition-all w-14 h-14 border border-white/10 shadow-xl group-active:scale-90"
              >
                <Heart size={28} className="fill-current text-pink-400 group-hover:text-white transition-colors" />
              </Button>
              <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">24.5K</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 group">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full bg-white/10 backdrop-blur-2xl hover:bg-accent/80 transition-all w-14 h-14 border border-white/10 shadow-xl group-active:scale-90"
              >
                <MessageCircle size={28} className="text-accent group-hover:text-white transition-colors" />
              </Button>
              <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">1.8K</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 group">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full bg-white/10 backdrop-blur-2xl hover:bg-purple-500/80 transition-all w-14 h-14 border border-white/10 shadow-xl group-active:scale-90"
              >
                <Share2 size={26} className="text-purple-300 group-hover:text-white transition-colors" />
              </Button>
              <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">Share</span>
            </div>
            
            <div className="relative mt-2">
              <div className="absolute -inset-1 bg-white/20 rounded-full blur animate-pulse" />
              <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center overflow-hidden">
                <img src={short.thumbnailUrl} className="w-full h-full object-cover animate-[spin_10s_linear_infinite]" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10" />
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
    <main className="h-screen bg-background overflow-hidden relative">
      <Navbar />
      
      {/* Soft Background Drifting Stars (Lovely Detail) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] text-pink-500/10 animate-pulse">
          <Stars size={80} />
        </div>
        <div className="absolute bottom-[15%] right-[10%] text-accent/10 animate-pulse delay-700">
          <Sparkles size={60} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-pink-500/5 rounded-full blur-[150px] animate-pulse-slow" />
      </div>
      
      <div ref={containerRef} className="shorts-container h-full snap-y snap-mandatory scroll-smooth relative z-10">
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
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center pt-24">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-inner">
              <Sparkles size={40} className="text-white/10" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2 text-white">No Shorts available</h3>
            <p className="text-sm max-w-xs font-light">Your search didn't reveal any short universes. Try exploring everything!</p>
          </div>
        )}
      </div>
    </main>
  );
}
