
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
    
    // We only want autoplay if it's the active short
    const autoplay = active ? 1 : 0;
    const muteParam = muted ? 1 : 0;
    
    // Using standard embed parameters to ensure controls are available
    return `https://www.youtube.com/embed/${id}?autoplay=${autoplay}&mute=${muteParam}&controls=1&rel=0&modestbranding=1&enablejsapi=1`;
  };

  return (
    <div className="short-item relative flex items-center justify-center bg-black w-full h-screen overflow-hidden">
      {isActive ? (
        <div className="relative w-full h-full max-w-[450px] aspect-[9/16] bg-neutral-900">
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
        <div className="w-full h-full max-w-[450px] aspect-[9/16] bg-neutral-900 flex items-center justify-center">
          <img 
            src={short.thumbnailUrl} 
            alt={short.title} 
            className="w-full h-full object-cover opacity-50 blur-sm"
          />
        </div>
      )}
      
      {/* Visual Overlay - Using pointer-events-none to let clicks pass through to the iframe */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Interaction Bar - Positioned to the side to avoid overlapping central controls */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-20">
        <div className="flex flex-col items-center gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all w-12 h-12"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </Button>
          <span className="text-[10px] font-medium uppercase tracking-tighter">Sound</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all w-12 h-12">
            <Heart size={24} />
          </Button>
          <span className="text-[10px] font-medium">12K</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all w-12 h-12">
            <MessageCircle size={24} />
          </Button>
          <span className="text-[10px] font-medium">420</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all w-12 h-12">
            <Share2 size={24} />
          </Button>
          <span className="text-[10px] font-medium">Share</span>
        </div>
      </div>

      {/* Bottom Info - Positioned at the very bottom to clear the player progress bar */}
      <div className="absolute bottom-6 left-4 right-20 z-20 text-white pointer-events-none">
        <div className="flex items-center gap-3 mb-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center ring-2 ring-white/20">
            <User size={20} />
          </div>
          <span className="font-headline font-bold text-lg">@{short.creator || 'Creator'}</span>
          <Button size="sm" className="rounded-full h-7 px-4 bg-primary hover:bg-primary/90 text-xs">Follow</Button>
        </div>
        <div className="pointer-events-auto">
          <p className="text-sm font-medium line-clamp-1 mb-1">{short.title}</p>
          <p className="text-xs text-white/70 line-clamp-2 max-w-sm">{short.description}</p>
        </div>
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) setActiveId(id);
          }
        });
      },
      { threshold: 0.6 } // Video must be 60% visible to switch
    );

    const elements = document.querySelectorAll('.short-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [shorts]);

  return (
    <main className="h-screen bg-black overflow-hidden relative">
      <Navbar />
      
      <div ref={containerRef} className="shorts-container h-full">
        {shorts.length > 0 ? (
          shorts.map((short) => (
            <div key={short.id} data-id={short.id} className="w-full h-full">
              <ShortItem 
                short={short} 
                isActive={activeId === short.id} 
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
              />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground pt-20">
            <h3 className="text-xl font-bold mb-2">No shorts found</h3>
            <p className="text-sm">Try a different search term.</p>
          </div>
        )}
      </div>
    </main>
  );
}
