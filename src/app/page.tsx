
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaDetails } from '@/components/media/MediaDetails';
import { LoginGate } from '@/components/auth/LoginGate';
import { FloatingChat } from '@/components/chat/FloatingChat';
import { ChevronDown, Play, Sparkles, Search } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HomePage() {
  const { library, setCurrentlyPlaying, searchTerm, userName } = useMedia();

  const filteredLibrary = library.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const anime = filteredLibrary.filter(item => item.type === 'anime');
  const movies = filteredLibrary.filter(item => item.type === 'movie');
  const allAnime = library.filter(item => item.type === 'anime');

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <LoginGate />
      {userName && (
        <>
          <Navbar />
          <FloatingChat />
          
          {!searchTerm && allAnime.length > 0 && (
            <section className="h-[70vh] md:h-svh w-full relative overflow-hidden bg-black">
              <Carousel 
                opts={{ loop: true, align: 'start' }}
                plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
                className="w-full h-full"
              >
                <CarouselContent className="h-full ml-0">
                  {allAnime.map((item) => (
                    <CarouselItem key={item.id} className="h-full w-full pl-0 relative flex flex-col justify-end pb-12 md:pb-24 px-6 md:px-24 overflow-hidden">
                      <div className="absolute inset-0 z-0">
                        <Image 
                          src={item.thumbnailUrl} 
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-[8000ms] hover:scale-105"
                          priority
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      </div>
                      
                      <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-xl px-3 py-1 rounded-full border border-primary/30 mb-4 md:mb-6">
                           <Sparkles size={10} className="text-primary animate-pulse" />
                           <span className="text-[10px] font-black tracking-widest uppercase text-primary">Featured Universe</span>
                        </div>
                        <h1 className="text-3xl md:text-7xl font-headline font-bold mb-3 md:mb-4 tracking-tighter text-white drop-shadow-2xl">{item.title}</h1>
                        <p className="text-sm md:text-xl text-white/80 mb-6 md:mb-10 max-w-2xl font-light italic leading-relaxed line-clamp-2">{item.summary}</p>
                        <div className="flex gap-4">
                          <button onClick={() => setCurrentlyPlaying(item)} className="h-12 md:h-14 px-6 md:px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black text-sm md:text-base shadow-2xl flex items-center gap-2 transition-all hover:scale-105">
                            <Play fill="currentColor" size={14} className="md:size-4" /> Enter Universe
                          </button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-20 pointer-events-none hidden md:block">
                <ChevronDown size={32} className="text-white" />
              </div>
            </section>
          )}

          <div className={cn("px-4 md:px-24 pb-24", searchTerm ? "pt-32" : "pt-12 md:pt-24")}>
            {anime.length > 0 && (
              <section className="mb-16 md:mb-24">
                <h2 className="text-2xl md:text-5xl font-headline font-bold mb-6 md:mb-10 tracking-tight">World of <span className="text-accent">Anime</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {anime.map((item) => <MediaCard key={item.id} item={item} />)}
                </div>
              </section>
            )}

            {movies.length > 0 && (
              <section className="mb-16 md:mb-24">
                <h2 className="text-2xl md:text-5xl font-headline font-bold mb-6 md:mb-10 tracking-tight">The <span className="text-primary">Cinema</span> Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {movies.map((item) => <MediaCard key={item.id} item={item} />)}
                </div>
              </section>
            )}

            {searchTerm && filteredLibrary.length === 0 && (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                <Search size={48} className="text-white/10 mb-6" />
                <h3 className="text-2xl md:text-3xl font-headline font-bold mb-2">Universe Not Found</h3>
                <p className="text-white/40 max-w-md px-4 text-sm md:text-base">The archives have no record of "{searchTerm}".</p>
              </div>
            )}
          </div>

          <MediaDetails />
        </>
      )}
    </main>
  );
}
