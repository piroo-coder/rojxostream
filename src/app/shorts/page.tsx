
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Heart, MessageCircle, Share2, User, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/app/types/media';

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
    return `https://www.youtube.com/embed/${id}?autoplay=${active ? 1 : 0}&mute=${muteParam}&controls=1&rel=0&modestbranding=1&enablejsapi=1&loop=1&playlist=${id}`;
  };

  return (
    <div 
      className="short-item relative flex items-center justify-center bg-black w-full h-screen overflow-hidden"
      data-short-id={short.id}
    >
      {/* Video Container */}
      <div className="relative w-full h-full max-w-[450px] aspect-[9/16] bg-neutral-900 shadow-2xl flex items-center justify-center">
        {isActive ? (
          <div className="w-full h-full">
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(short.mediaUrl, isActive, isMuted)}
                className="w-full h-full"
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
              className="w-full h-full object-cover opacity-30 blur-2xl"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center animate-pulse border border-white/20">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Interaction UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-20">
        <div className="flex justify-between items-end gap-4 max-w-[450px] mx-auto w-full">
          {/* Info Side */}
          <div className="flex-1 pointer-events-auto text-white space-y-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center ring-2 ring-white/20 overflow-hidden">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-lg leading-none">@{short.creator || 'Creator'}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/60">Following</span>
              </div>
            </div>
            <div>
              <p className="text-base font-bold line-clamp-2 drop-shadow-lg mb-1">{short.title}</p>
              <p className="text-sm text-white/80 line-clamp-1 drop-shadow-md font-light">{short.description}</p>
            </div>
          </div>

          {/* Buttons Side */}
          <div className="flex flex-col gap-6 pointer-events-auto mb-6">
             <div className="flex flex-col items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-primary transition-all w-14 h-14 border border-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMute();
                }}
              >
                {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
              </Button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-pink-500 transition-all w-14 h-14 border border-white/10">
                <Heart size={28} className="fill-current" />
              </Button>
              <span className="text-xs font-bold shadow-sm">24K</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-blue-500 transition-all w-14 h-14 border border-white/10">
                <MessageCircle size={28} />
              </Button>
              <span className="text-xs font-bold shadow-sm">1.2K</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-accent transition-all w-14 h-14 border border-white/10">
                <Share2 size={28} />
              </Button>
              <span className="text-xs font-bold shadow-sm">Share</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />
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
    <main className="h-screen bg-black overflow-hidden relative">
      <Navbar />
      
      <div ref={containerRef} className="shorts-container h-full snap-y snap-mandatory scroll-smooth">
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
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Layers size={40} className="text-white/20" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2">No Shorts available</h3>
            <p className="text-sm max-w-xs">Your search didn't reveal any short universes. Try exploring everything!</p>
          </div>
        )}
      </div>
    </main>
  );
}
