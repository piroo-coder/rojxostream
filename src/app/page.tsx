
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
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background relative scroll-smooth scrollbar-hide">
      <Navbar />
      
      {!searchTerm && allAnime.length > 0 && (
        <section className="h-screen w-full snap-start relative overflow-hidden bg-black">
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
                <CarouselItem key={item.id} className="h-full w-full pl-0 relative flex flex-col justify-end pb-12 sm:pb-20 md:pb-32 px-6 sm:px-12 md:px-20 lg:px-24 overflow-hidden">
                  {/* Immersive Background Image */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent hidden md:block" />
                    <div className="absolute inset-0 bg-black/40 md:hidden" />
                  </div>
                  
                  {/* Slide Content Overlay */}
                  <div className="relative z-10 max-w-6xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-24">
                    <div className="flex items-center gap-3 mb-3 md:mb-6">
                      <div className="bg-primary/20 backdrop-blur-xl px-3 py-1 md:px-4 md:py-1.5 rounded-full flex items-center gap-2 border border-primary/30 shadow-2xl">
                        <Sparkles className="text-primary animate-pulse" size={10} />
                        <span className="text-primary font-black tracking-[0.2em] uppercase text-[8px] md:text-xs">Featured Universe</span>
                      </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-headline font-bold mb-4 md:mb-6 tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
                      {item.title}
                    </h1>
                    
                    <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/80 mb-6 md:mb-10 max-w-3xl font-light leading-relaxed line-clamp-3 md:line-clamp-none drop-shadow-lg italic">
                      {item.summary || "Experience the magic of cinema like never before. Immerse yourself in worlds beyond imagination."}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-6">
                      <Button 
                        size="lg" 
                        className="h-12 sm:h-16 md:h-20 px-6 sm:px-10 md:px-14 text-base sm:text-lg md:text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 border-0"
                        onClick={() => setCurrentlyPlaying(item)}
                      >
                        <Play className="mr-2 sm:mr-3 fill-current" size={18} /> Stream Now
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-12 sm:h-16 md:h-20 px-6 sm:px-10 md:px-14 text-base sm:text-lg md:text-xl font-bold rounded-2xl border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95 text-white"
                        onClick={() => setCurrentlyPlaying(item)}
                      >
                        <Info className="mr-2 sm:mr-3" size={18} /> Details
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Centered Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30 z-20 pointer-events-none hidden md:block">
            <ChevronDown size={32} className="text-white" />
          </div>
        </section>
      )}

      {/* Content Sections Container */}
      <div className={cn("px-4 sm:px-8 md:px-16", searchTerm ? "pt-24 md:pt-32" : "")}>
        
        {anime.length > 0 && (
          <section className="min-h-screen w-full snap-start py-12 md:py-28 flex flex-col justify-center">
            <div className="mb-8 md:mb-20">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-headline font-bold mb-4 md:mb-6 tracking-tight">World of <span className="text-accent">Anime</span></h2>
              <p className="text-muted-foreground text-base sm:text-lg md:text-2xl max-w-3xl font-light leading-relaxed">Breathtaking visuals and emotional storytelling from the heart of Japan's most legendary studios.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-12">
              {anime.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {movies.length > 0 && (
          <section className="min-h-screen w-full snap-start py-12 md:py-28 flex flex-col justify-center">
            <div className="mb-8 md:mb-20">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-headline font-bold mb-4 md:mb-6 tracking-tight">The <span className="text-primary">Cinema</span> Gallery</h2>
              <p className="text-muted-foreground text-base sm:text-lg md:text-2xl max-w-3xl font-light leading-relaxed">From spine-chilling horror to heartwarming drama, experience every spectrum of human emotion on the silver screen.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
              {movies.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {songs.length > 0 && (
          <section className="min-h-screen w-full snap-start py-12 md:py-28 flex flex-col justify-center">
            <div className="mb-8 md:mb-20">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-headline font-bold mb-4 md:mb-6 tracking-tight">Sonic <span className="text-accent">Vibrations</span></h2>
              <p className="text-muted-foreground text-base sm:text-lg md:text-2xl max-w-3xl font-light leading-relaxed">Immerse yourself in the soundtracks that define your favorite cinematic moments and memories.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              {songs.map((item, idx) => (
                <div key={item.id} className="animate-in zoom-in-95 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {searchTerm && filteredLibrary.length === 0 && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 md:mb-8 border border-white/10 shadow-inner">
              <Search size={32} className="text-white/10 md:w-10 md:h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-3 md:mb-4 tracking-tight">No universes found</h3>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-light max-w-md">Try searching for something else, like <span className="text-primary font-medium">Anime</span>, <span className="text-accent font-medium">Suzume</span>, or a specific director.</p>
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
