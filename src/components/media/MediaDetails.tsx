"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Music, Info, Star, MessageSquare, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();
  const [videoError, setVideoError] = useState(false);

  if (!currentlyPlaying) return null;

  const isAudio = currentlyPlaying.type === 'song';
  const isYoutube = currentlyPlaying.mediaUrl.includes('youtube.com') || currentlyPlaying.mediaUrl.includes('youtu.be');
  const isVideoFile = currentlyPlaying.mediaUrl.match(/\.(mp4|webm|ogg|mp3|wav)$/i) || currentlyPlaying.mediaUrl.includes('soundhelix');
  
  const getYoutubeEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('shorts/')) {
      id = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      id = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      id = url.split('be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  };

  const handleOpenSource = () => {
    window.open(currentlyPlaying.mediaUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-3xl p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-[60] bg-white/5 rounded-full"
        onClick={() => {
          setCurrentlyPlaying(null);
          setVideoError(false);
        }}
      >
        <X size={24} />
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full h-full lg:h-[85vh] bg-card/30 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          {isYoutube ? (
            <iframe 
              src={getYoutubeEmbedUrl(currentlyPlaying.mediaUrl)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isAudio ? (
            <div className="flex flex-col items-center gap-8 p-12 text-center w-full">
              <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-accent animate-pulse flex items-center justify-center shadow-[0_0_80px_-20px_rgba(var(--primary),0.6)]">
                <Music size={80} className="text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-headline font-bold">{currentlyPlaying.title}</h2>
                <p className="text-accent text-xl font-medium">{currentlyPlaying.creator}</p>
              </div>
              <audio controls src={currentlyPlaying.mediaUrl} className="w-full max-w-md mt-8" autoPlay />
            </div>
          ) : isVideoFile ? (
            <video 
              controls 
              src={currentlyPlaying.mediaUrl} 
              className="w-full h-full object-contain"
              autoPlay
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <ExternalLink size={40} />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-headline font-bold mb-2">External Media Content</h3>
                <p className="text-muted-foreground mb-6">
                  This content is hosted on an external platform. Click the button below to watch it in high quality on the original site.
                </p>
                <Button onClick={handleOpenSource} size="lg" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-lg group">
                  <Play size={20} className="mr-2 fill-current" /> Open Player 
                  <ExternalLink size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                </Button>
              </div>
            </div>
          )}

          {videoError && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center gap-4">
              <p className="text-white/80 max-w-sm">The video could not be loaded directly. It might be restricted or have moved.</p>
              <Button onClick={handleOpenSource} variant="secondary" className="rounded-xl">
                Try Watching on Source <ExternalLink size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-full p-8 md:p-12">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {currentlyPlaying.type}
                </span>
              </div>
              <h1 className="text-5xl font-headline font-bold mb-4 tracking-tight leading-tight">{currentlyPlaying.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <span className="text-accent font-semibold text-lg">{currentlyPlaying.creator}</span>
                {currentlyPlaying.imdbRating && (
                  <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-xl border border-yellow-500/20">
                    <Star size={18} className="fill-current" />
                    <span className="font-bold">{currentlyPlaying.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {currentlyPlaying.summary && (
              <div className="space-y-3">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3 text-white/90">
                  <Info size={22} className="text-accent" />
                  Storyline
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {currentlyPlaying.summary}
                </p>
              </div>
            )}

            {currentlyPlaying.moral && (
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3 text-primary">
                  <MessageSquare size={22} />
                  The Moral
                </h3>
                <p className="text-foreground/90 text-lg font-medium leading-snug italic">
                  "{currentlyPlaying.moral}"
                </p>
              </div>
            )}

            <div className="pt-6 flex flex-col gap-4">
              {!isYoutube && !isVideoFile && (
                <Button onClick={handleOpenSource} variant="outline" className="h-14 rounded-2xl border-white/10 hover:bg-white/5 text-lg">
                  <ExternalLink className="mr-3" size={20} /> Watch on Original Source
                </Button>
              )}
              <Button 
                className="h-14 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg font-bold"
                onClick={() => {
                  setCurrentlyPlaying(null);
                  setVideoError(false);
                }}
              >
                Return to Gallery
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
