"use client";

import { MediaItem } from '@/app/types/media';
import { X, Info, Play, Film, BookOpen, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MovieAnimeViewProps {
  item: MediaItem;
  onClose: () => void;
}

export const MovieAnimeView: React.FC<MovieAnimeViewProps> = ({ item, onClose }) => {
  const [mode, setMode] = useState<'discovery' | 'playing'>('discovery');

  const isYoutube = item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be');
  
  const getEmbedSource = () => {
    if (isYoutube) {
      let id = '';
      if (item.mediaUrl.includes('watch?v=')) id = item.mediaUrl.split('v=')[1].split('&')[0];
      else if (item.mediaUrl.includes('youtu.be/')) id = item.mediaUrl.split('be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return item.mediaUrl;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background animate-in fade-in duration-500 overflow-hidden h-svh w-screen flex flex-col">
      {/* PROFESSIONAL DARK ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={item.thumbnailUrl} 
          alt=""
          fill
          className="object-cover opacity-30 scale-110 blur-2xl"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        {/* Ambient Dark Neon Pulse */}
        <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[50rem] h-[50rem] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/10 w-12 h-12 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={onClose}
      >
        <X size={24} />
      </Button>

      <ScrollArea className="flex-1 w-full relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-32 flex flex-col items-center">
          
          {mode === 'discovery' ? (
            <div className="w-full space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              {/* Header section with professional typography and neon accent */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 bg-black/40 border border-primary/30 px-6 py-2 rounded-full backdrop-blur-3xl shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Discovery Mode</span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none text-white drop-shadow-2xl">
                  {item.title}
                </h1>
                <p className="text-xl md:text-2xl text-accent font-bold tracking-tight italic">{item.creator}</p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Info sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="p-8 rounded-[2.5rem] bg-card/60 border border-white/5 backdrop-blur-3xl shadow-2xl space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">The Architects</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-primary uppercase font-black tracking-widest">Director</p>
                          <p className="text-lg font-bold">{item.creator}</p>
                        </div>
                        {item.writers && (
                          <div>
                            <p className="text-[10px] text-primary uppercase font-black tracking-widest">Writers</p>
                            <p className="text-sm font-medium text-white/80">{item.writers}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">Resource Portals</h4>
                      <div className="flex flex-col gap-3">
                        {item.wikipediaUrl && (
                          <Button onClick={() => window.open(item.wikipediaUrl, '_blank')} variant="outline" className="justify-start gap-3 h-12 rounded-2xl bg-white/5 border-white/10 hover:border-primary/50 transition-all group">
                            <Info size={16} className="text-primary group-hover:animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Wikipedia</span>
                          </Button>
                        )}
                        {item.type === 'anime' && item.mangaUrl && (
                          <Button onClick={() => window.open(item.mangaUrl, '_blank')} variant="outline" className="justify-start gap-3 h-12 rounded-2xl bg-white/5 border-white/10 hover:border-accent/50 transition-all group">
                            <BookOpen size={16} className="text-accent group-hover:animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Read Manga</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Narrative & Characters */}
                <div className="lg:col-span-8 space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-4">
                      <div className="h-px w-12 bg-primary/30" /> The Chronicle
                    </h3>
                    <p className="text-2xl md:text-3xl font-light text-white/90 leading-tight italic drop-shadow-md">
                      "{item.summary || item.description}"
                    </p>
                  </div>

                  {item.characters && item.characters.length > 0 && (
                    <div className="space-y-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-accent flex items-center gap-4">
                        <div className="h-px w-12 bg-accent/30" /> Manifested Souls
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.characters.map((char, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group/char cursor-default">
                            <Avatar className="h-14 w-14 border-2 border-white/10 group-hover/char:border-accent/50 transition-all">
                              <AvatarImage src={char.image_url} alt={char.name} className="object-cover" />
                              <AvatarFallback><Users className="text-white/20" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-white group-hover/char:text-accent transition-colors">{char.name}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Main Character</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.moral && (
                    <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/20 backdrop-blur-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={80} className="text-primary" />
                      </div>
                      <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6">Core Essence</h3>
                      <p className="text-2xl md:text-4xl font-headline font-bold text-white italic leading-tight">
                        "{item.moral}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enter Action */}
              <div className="flex flex-col items-center gap-8 pt-12">
                <Button 
                  size="lg" 
                  onClick={() => setMode('playing')}
                  className="h-24 px-16 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-2xl font-black shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] transition-all hover:scale-105 active:scale-95 group"
                >
                  <Play size={28} fill="currentColor" className="mr-4 group-hover:animate-pulse" />
                  Enter Universe
                </Button>
                <Button 
                  onClick={onClose}
                  variant="ghost" 
                  className="text-white/30 hover:text-white uppercase tracking-[0.4em] font-black text-[10px]"
                >
                  Exit to Explore
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-12 animate-in zoom-in-95 duration-1000">
               <div className="text-center space-y-4">
                 <h2 className="text-3xl md:text-5xl font-headline font-bold text-white drop-shadow-2xl">{item.title}</h2>
                 <Button variant="ghost" onClick={() => setMode('discovery')} className="text-accent hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Info size={14} /> Back to Discovery
                 </Button>
               </div>
               
               <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] bg-black">
                 {isYoutube ? (
                   <iframe 
                    src={getEmbedSource()}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                 ) : (
                   <div className="flex items-center justify-center h-full text-white/20 font-black uppercase tracking-widest">
                     External Media Link Found
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
