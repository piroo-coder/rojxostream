
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaDetails } from '@/components/media/MediaDetails';
import { ChevronDown, Play, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const { library, setCurrentlyPlaying, searchTerm } = useMedia();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filteredLibrary = library.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.creator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const anime = filteredLibrary.filter(item => item.type === 'anime');
  const movies = filteredLibrary.filter(item => item.type === 'movie');
  const songs = filteredLibrary.filter(item => item.type === 'song');

  const allAnime = library.filter(item => item.type === 'anime');
  const featured = allAnime[featuredIndex] || allAnime[0];

  useEffect(() => {
    if (allAnime.length <= 1) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % allAnime.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allAnime.length]);

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background relative scroll-smooth">
      <Navbar />
      
      {!searchTerm && (
        <section className="h-screen w-full snap-start relative flex items-end pb-32 px-6 md:px-16 overflow-hidden">
          {featured && (
            <div className="absolute inset-0 z-0">
              <Image 
                key={featured.id}
                src={featured.thumbnailUrl} 
                alt={featured.title}
                fill
                className="object-cover scale-105 animate-pulse-slow transition-all duration-1000 animate-in fade-in duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            </div>
          )}
          
          <div className="relative z-10 max-w-4xl animate-in slide-in-from-left duration-1000" key={`info-${featured?.id}`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-accent animate-bounce" size={20} />
              <span className="text-accent font-bold tracking-widest uppercase text-sm">Featured Masterpiece</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-headline font-extrabold mb-6 tracking-tighter leading-none">
              {featured?.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl font-light leading-relaxed">
              {featured?.summary || "Experience the magic of cinema like never before. Immerse yourself in worlds beyond imagination."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="h-16 px-10 text-xl rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105"
                onClick={() => setCurrentlyPlaying(featured)}
              >
                <Play className="mr-3 fill-current" size={24} /> Start Streaming
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 text-xl rounded-2xl border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all"
                onClick={() => setCurrentlyPlaying(featured)}
              >
                <Info className="mr-3" size={24} /> More Info
              </Button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <ChevronDown size={32} />
          </div>
        </section>
      )}

      <div className={searchTerm ? "pt-20 px-6 md:px-16" : ""}>
        {anime.length > 0 && (
          <section className="min-h-screen w-full snap-start py-24 px-6 md:px-16 bg-background flex flex-col justify-center">
            <div className="mb-12">
              <h2 className="text-5xl font-headline font-bold mb-4">World of <span className="text-accent">Anime</span></h2>
              <p className="text-muted-foreground text-lg">Breathtaking visuals and emotional storytelling from the heart of Japan.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {anime.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {movies.length > 0 && (
          <section className="min-h-screen w-full snap-start py-24 px-6 md:px-16 bg-card/20 flex flex-col justify-center">
            <div className="mb-12">
              <h2 className="text-5xl font-headline font-bold mb-4">The <span className="text-primary">Cinema</span> Gallery</h2>
              <p className="text-muted-foreground text-lg">From chilling horror to heartwarming drama, experience every emotion.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((item, idx) => (
                <div key={item.id} className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <MediaCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {songs.length > 0 && (
          <section className="min-h-screen w-full snap-start py-24 px-6 md:px-16 bg-background flex flex-col justify-center">
            <div className="mb-12">
              <h2 className="text-5xl font-headline font-bold mb-4">Sonic <span className="text-accent">Vibrations</span></h2>
              <p className="text-muted-foreground text-lg">Listen to the soundtracks that define your favorite moments.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
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
            <h3 className="text-3xl font-headline font-bold mb-4">No universes found</h3>
            <p className="text-muted-foreground text-lg">Try searching for something else, like "Anime" or "Suzume".</p>
          </div>
        )}
      </div>

      <MediaDetails />
    </main>
  );
}
