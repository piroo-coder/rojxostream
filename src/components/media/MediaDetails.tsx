
"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Play, Music, Info, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();

  if (!currentlyPlaying) return null;

  const isAudio = currentlyPlaying.type === 'song';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X size={24} />
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full h-full lg:h-[80vh]">
        <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-2xl">
          {isAudio ? (
            <div className="flex flex-col items-center gap-6 p-12 text-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent animate-pulse flex items-center justify-center">
                <Music size={64} />
              </div>
              <h2 className="text-3xl font-headline font-bold">{currentlyPlaying.title}</h2>
              <p className="text-accent text-xl">{currentlyPlaying.creator}</p>
              <audio controls src={currentlyPlaying.mediaUrl} className="w-full mt-4" />
            </div>
          ) : (
            <video 
              controls 
              src={currentlyPlaying.mediaUrl} 
              className="w-full h-full object-contain"
              autoPlay
            />
          )}
        </div>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">{currentlyPlaying.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="text-accent font-medium">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span>{currentlyPlaying.imdbRating} (IMDb)</span>
                  </div>
                )}
                {currentlyPlaying.youtubeViews && (
                  <span>{currentlyPlaying.youtubeViews} views</span>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {currentlyPlaying.summary && (
              <div className="space-y-2">
                <h3 className="text-lg font-headline font-semibold flex items-center gap-2">
                  <Info size={20} className="text-accent" />
                  Plot Summary
                </h3>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{currentlyPlaying.summary}"
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="space-y-2 bg-primary/10 p-4 rounded-xl border border-primary/20">
                <h3 className="text-lg font-headline font-semibold flex items-center gap-2">
                  <MessageSquare size={20} className="text-primary" />
                  Core Message
                </h3>
                <p className="text-foreground/90 font-medium">
                  {currentlyPlaying.moral}
                </p>
              </div>
            )}

            {currentlyPlaying.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-headline font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  {currentlyPlaying.description}
                </p>
              </div>
            )}

            {currentlyPlaying.characters && currentlyPlaying.characters.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-headline font-semibold">Featured Characters</h3>
                <div className="flex flex-wrap gap-2">
                  {currentlyPlaying.characters.map((char) => (
                    <span key={char} className="px-3 py-1 bg-secondary rounded-full text-xs">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90">
                <Play className="mr-2 fill-current" /> Continue Watching
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
