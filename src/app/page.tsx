
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaDetails } from '@/components/media/MediaDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const { library } = useMedia();

  const movies = library.filter(item => item.type === 'movie' || item.type === 'anime');
  const songs = library.filter(item => item.type === 'song');
  const shorts = library.filter(item => item.type === 'short');

  return (
    <main className="min-h-screen pb-20 pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 tracking-tighter">
            Discover <span className="text-primary">Endless</span> Entertainment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stream your favorite anime, movies, songs, and immersive shorts in high fidelity.
          </p>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-secondary/50 p-1 mb-8">
            <TabsTrigger value="all" className="px-8 rounded-md">All Content</TabsTrigger>
            <TabsTrigger value="anime" className="px-8 rounded-md">Anime & Movies</TabsTrigger>
            <TabsTrigger value="songs" className="px-8 rounded-md">Music</TabsTrigger>
            <TabsTrigger value="shorts" className="px-8 rounded-md">Shorts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {library.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="anime">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="songs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {songs.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shorts">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shorts.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MediaDetails />
    </main>
  );
}
