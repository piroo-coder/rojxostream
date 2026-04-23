
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaDetails } from '@/components/media/MediaDetails';
import { ChevronDown, Play, Info, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HomePage() {
  const { library, setCurrentlyPlaying, searchTerm } = useMedia();

  const filteredLibrary = library.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.creator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const anime = filteredLibrary.filter(item => item.type === 'anime');
  const movies = filteredLibrary.filter(item => item.type === 'movie');
  const songs = filteredLibrary.filter(item => item.type === 'song');

  const allAnime = library.filter(item => item.type === 'anime');

  return (
    <main className="h-svh overflow-y-scroll snap-y snap-mandatory bg-background relative scroll-smooth scrollbar-hide">
      <Navbar />
      
      {!searchTerm && allAnime.length > 0 && (
        <section className="h-svh w-full snap-start relative overflow-hidden bg-black">
          <Carousel 
            opts={{ loop: true, align: 'start' }}
            plugins={[
              Autoplay({
                delay: 6000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full ml-0">
              {allAnime.map((item) => (
                <CarouselItem key={item.id} className="h-full w-full pl-0 relative flex flex-col justify-end pb-12 sm:pb-20 md:pb-24 px-6 sm:px-12 md:px-20 lg:px-24 overflow-hidden">
                  {/* Immersive Background Image - Fully Responsive Fill */}
                  <div className="absolute inset-0 z-0 h-full w-full">
                    <Image 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      fill
                      sizes="100vw"
                      className="object-cover object-center transition-transform duration-[8000ms] ease-out hover:scale-105"
                      priority
                      unoptimized
                    />
                    {/* Multi-layered Gradients for Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent hidden md:block" />
                    <div className="absolute inset-0 bg-black/40 md:hidden" />
                  </div>
                  
                  {/* Slide Content Overlay */}
                  <div className="relative z-10 max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-32">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <div className="bg-primary/20 backdrop-blur-xl px-2.5 py-1 rounded-full flex items-center gap-2 border border-primary/30 shadow-2xl">
                        <Sparkles className="text-primary animate-pulse" size={10} />
                        <span className="text-primary font-black tracking-[0.2em] uppercase text-[8px] md:text-[10px]">Featured Universe</span>
                      </div>
                    </div>
                    
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-3 md:mb-4 tracking-tighter leading-[1] text-white drop-shadow-2xl">
                      {item.title}
                    </h1>
                    
                    <p className="text-xs sm:text-sm md:text-base text-white/80 mb-6 md:mb-8 max-w-2xl font-light leading-relaxed line-clamp-2 md:line-clamp-none drop-shadow-lg italic">
                      {item.summary || "Experience the magic of cinema like never before. Immerse yourself in worlds beyond imagination."}
                    </p>
                    
                    <div className="flex flex-row gap-3 md:gap-4">
                      <button 
                        className="h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-white"
                        onClick={() => setCurrentlyPlaying(item)}
                      >
                        <Play className="fill-current" size={14} /> Stream
                      </button>
                      <button 
                        className="h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm font-bold rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95 text-white flex items-center gap-2"
                        onClick={() => setCurrentlyPlaying(item)}
                      >
                        <Info size={14} /> Details
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Centered Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30 z-20 pointer-events-none hidden md:block">
            <ChevronDown size={24} className="text-white" />
          </div>
        </section>
      )}

      {/* Content Sections Container */}
      <div className={cn("px-4 sm:px-8 md:px-16", searchTerm ? "pt-24 md:pt-32" : "")}>
        
        {anime.length > 0 && (
          <section className="min-h-svh w-full snap-start py-12 md:py-20 flex flex-col justify-center">
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-headline font-bold mb-2 md:mb-3 tracking-tight">World of <span className="text-accent">Anime</span></h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">Breathtaking visuals and emotional storytelling from the heart of Japan's most legendary studios.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {anime.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {movies.length > 0 && (
          <section className="min-h-svh w-full snap-start py-12 md:py-20 flex flex-col justify-center">
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-headline font-bold mb-2 md:mb-3 tracking-tight">The <span className="text-primary">Cinema</span> Gallery</h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">From spine-chilling horror to heartwarming drama, experience every spectrum of human emotion on the silver screen.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {movies.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {songs.length > 0 && (
          <section className="min-h-svh w-full snap-start py-12 md:py-20 flex flex-col justify-center">
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-headline font-bold mb-2 md:mb-3 tracking-tight">Sonic <span className="text-accent">Vibrations</span></h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">Immerse yourself in the soundtracks that define your favorite cinematic moments and memories.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {songs.map((item, idx) => (
                <div key={item.id} className="animate-in zoom-in-95 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {searchTerm && filteredLibrary.length === 0 && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-2xl backdrop-blur-xl">
              <Search size={32} className="text-white/20" />
            </div>
            <h3 className="text-2xl md:text-4xl font-headline font-bold mb-3 md:mb-4 tracking-tight text-white">Universe Not Found</h3>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light max-w-md leading-relaxed">
              We couldn't find any worlds matching "<span className="text-primary font-bold">{searchTerm}</span>". 
              Try searching for something else or explore our featured collections.
            </p>
          </div>
        )}
      </div>

      {/* Persistent Components */}
      <MediaDetails />
      
      {/* Footer spacer */}
      <div className="h-16 md:h-20" /> 
    </main>
  );
}
