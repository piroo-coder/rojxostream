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
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background relative scroll-smooth">
      <Navbar />
      
      {!searchTerm && allAnime.length > 0 && (
        <section className="h-screen w-full snap-start relative overflow-hidden">
          <Carousel 
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 6000,
              }),
            ]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full ml-0">
              {allAnime.map((item) => (
                <CarouselItem key={item.id} className="h-full pl-0 relative flex items-center md:items-end pb-20 md:pb-40 px-6 md:px-20 overflow-hidden">
                  {/* Background Image with Fixed Positioning */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      fill
                      sizes="100vw"
                      className="object-cover object-center transition-all duration-[4000ms] ease-out group-data-[state=active]:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent hidden md:block" />
                    <div className="absolute inset-0 bg-black/40 md:hidden" />
                  </div>
                  
                  {/* Slide Content */}
                  <div className="relative z-10 max-w-5xl animate-in fade-in slide-in-from-left duration-1000 text-center md:text-left mx-auto md:mx-0">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                      <div className="bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-accent/30">
                        <Sparkles className="text-accent animate-pulse" size={16} />
                        <span className="text-accent font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">Featured Universe</span>
                      </div>
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold mb-8 tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
                      {item.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-light leading-relaxed line-clamp-3 md:line-clamp-none mx-auto md:mx-0 drop-shadow-lg">
                      {item.summary || "Experience the magic of cinema like never before. Immerse yourself in worlds beyond imagination."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                      <Button 
                        size="lg" 
                        className="h-16 px-10 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                        onClick={() => setCurrentlyPlaying(item)}
                      >
                        <Play className="mr-3 fill-current" size={24} /> Stream Now
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-16 px-10 text-lg rounded-2xl border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95"
                        onClick={() => setCurrentlyPlaying(item)}
                      >
                        <Info className="mr-3" size={24} /> Details
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden md:block z-20 pointer-events-none">
            <ChevronDown size={40} className="text-white" />
          </div>
        </section>
      )}

      <div className={cn("px-6 md:px-16 pb-24", searchTerm ? "pt-24 md:pt-32" : "")}>
        {anime.length > 0 && (
          <section className="min-h-screen w-full snap-start py-16 md:py-28 flex flex-col justify-center">
            <div className="mb-12 md:mb-20">
              <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">World of <span className="text-accent">Anime</span></h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light">Breathtaking visuals and emotional storytelling from the heart of Japan.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
              {anime.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {movies.length > 0 && (
          <section className="min-h-screen w-full snap-start py-16 md:py-28 flex flex-col justify-center">
            <div className="mb-12 md:mb-20">
              <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">The <span className="text-primary">Cinema</span> Gallery</h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light">From chilling horror to heartwarming drama, experience every emotion on the silver screen.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {movies.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {songs.length > 0 && (
          <section className="min-h-screen w-full snap-start py-16 md:py-28 flex flex-col justify-center">
            <div className="mb-12 md:mb-20">
              <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">Sonic <span className="text-accent">Vibrations</span></h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light">Listen to the soundtracks that define your favorite cinematic moments.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
              {songs.map((item, idx) => (
                <div key={item.id} className="animate-in zoom-in duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {searchTerm && filteredLibrary.length === 0 && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <Search size={40} className="text-white/20" />
            </div>
            <h3 className="text-3xl font-headline font-bold mb-4">No universes found</h3>
            <p className="text-muted-foreground text-lg">Try searching for something else, like "Anime" or "Suzume".</p>
          </div>
        )}
      </div>

      <MediaDetails />
    </main>
  );
}
