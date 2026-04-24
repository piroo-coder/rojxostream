
"use client";

import { MediaItem } from '@/app/types/media';
import { X, Headset, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SongViewProps { item: MediaItem; onClose: () => void; }

export const SongView: React.FC<SongViewProps> = ({ item, onClose }) => {
  const [songMode, setSongMode] = useState<'video' | 'audio'>('audio');

  const getEmbedSource = () => {
    if (item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be')) {
      let id = '';
      if (item.mediaUrl.includes('watch?v=')) id = item.mediaUrl.split('v=')[1].split('&')[0];
      else if (item.mediaUrl.includes('youtu.be/')) id = item.mediaUrl.split('be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return item.mediaUrl;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background animate-in fade-in duration-500 overflow-hidden flex flex-col items-center justify-center p-4">
      {/* PROFESSIONAL MUSIC BACKGROUND - Visibility Increased */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={item.audioBackgroundUrl || item.thumbnailUrl} 
          alt=""
          fill
          className="object-cover opacity-50 blur-2xl scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-6 right-6 text-white/50 hover:text-white z-[80] bg-white/5 rounded-full"
        onClick={onClose}
      >
        <X size={24} />
      </Button>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter drop-shadow-2xl">
            {item.title}
          </h1>
          <p className="text-accent text-xl font-bold italic">{item.creator}</p>
        </div>

        {/* CENTRAL MUSIC DISK / PLAYER */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] flex items-center justify-center">
          {songMode === 'audio' ? (
            <div className="flex flex-col items-center justify-center gap-8 w-full h-full relative">
              {/* Background image layer inside the player container */}
              <div className="absolute inset-0 z-0 opacity-40">
                <Image 
                  src={item.audioBackgroundUrl || item.thumbnailUrl} 
                  alt="" 
                  fill 
                  className="object-cover" 
                  unoptimized 
                />
              </div>

              {/* Central Disk visualizer - Transparency Reduced (More Solid) */}
              <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(var(--primary),0.3)]">
                <Image 
                  src={item.thumbnailUrl} 
                  alt="" 
                  fill 
                  className="object-cover opacity-100 animate-[spin_10s_linear_infinite]" 
                  unoptimized
                />
                <div className="relative z-10 flex items-end gap-1.5 h-12">
                   <div className="now-playing-bar n1"></div>
                   <div className="now-playing-bar n2"></div>
                   <div className="now-playing-bar n3"></div>
                   <div className="now-playing-bar n4"></div>
                   <div className="now-playing-bar n5"></div>
                </div>
              </div>
              
              <iframe 
                src={getEmbedSource()}
                className="absolute opacity-0 pointer-events-none w-1 h-1"
                allow="autoplay"
              />
            </div>
          ) : (
            <iframe 
              src={getEmbedSource()}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-3 p-2 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl">
          <Button 
            onClick={() => setSongMode('audio')}
            className={cn("h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest", songMode === 'audio' ? "bg-primary text-white" : "text-white/40 hover:text-white bg-transparent")}
          >
            <Headset size={16} className="mr-2" /> Audio
          </Button>
          <Button 
            onClick={() => setSongMode('video')}
            className={cn("h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest", songMode === 'video' ? "bg-primary text-white" : "text-white/40 hover:text-white bg-transparent")}
          >
            <Video size={16} className="mr-2" /> Video
          </Button>
        </div>
      </div>
    </div>
  );
};
