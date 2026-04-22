"use client";

import { useMedia } from '@/context/MediaContext';
import { X, Play, Music, Info, Star, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const MediaDetails: React.FC = () => {
  const { currentlyPlaying, setCurrentlyPlaying } = useMedia();

  if (!currentlyPlaying) return null;

  const isAudio = currentlyPlaying.type === 'song';
  const isYoutube = currentlyPlaying.mediaUrl.includes('youtube.com') || currentlyPlaying.mediaUrl.includes('youtu.be');
  const isVideoFile = currentlyPlaying.mediaUrl.match(/\.(mp4|webm|ogg|mp3|wav)$/i) || currentlyPlaying.mediaUrl.includes('soundhelix');
  
  const isExternalEmbed = !isAudio && !isVideoFile;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-[60]"
        onClick={() => setCurrentlyPlaying(null)}
      >
        <X size={24} />
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full h-full lg:h-[80vh]">
        <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-2xl group">
          {isAudio ? (
            <div className="flex flex-col items-center gap-6 p-12 text-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent animate-pulse flex items-center justify-center">
                <Music size={64} />
              </div>
              <h2 className="text-3xl font-headline font-bold">{currentlyPlaying.title}</h2>
              <p className="text-accent text-xl">{currentlyPlaying.creator}</p>
              <audio controls src={currentlyPlaying.mediaUrl} className="w-full mt-4" autoPlay />
            </div>
          ) : isExternalEmbed ? (
            <div className="relative w-full h-full">
              <iframe 
                src={isYoutube ? getYoutubeEmbedUrl(currentlyPlaying.mediaUrl) : currentlyPlaying.mediaUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
              {/* Fallback Overlay if framing is blocked by target site */}
              {!isYoutube && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center pointer-events-none group-hover:pointer-events-auto">
                  <p className="text-sm mb-4 text-white/80">If the video doesn't load, the website might restrict internal playback.</p>
                  <Button onClick={handleOpenSource} className="bg-primary hover:bg-primary/90">
                    <ExternalLink size={16} className="mr-2" /> Watch on Original Website
                  </Button>
                </div>
              )}
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

            <div className="pt-4 flex flex-col gap-3">
              {isExternalEmbed && !isYoutube && (
                <Button variant="secondary" onClick={handleOpenSource} className="w-full h-12 text-lg">
                  <ExternalLink className="mr-2" size={20} /> Watch on Source
                </Button>
              )}
              <Button 
                className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90"
                onClick={() => setCurrentlyPlaying(null)}
              >
                Close Player
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
