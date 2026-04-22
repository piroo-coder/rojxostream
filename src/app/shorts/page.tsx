"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Heart, MessageCircle, Share2, User, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ShortsPage() {
  const { library } = useMedia();
  const [isMuted, setIsMuted] = useState(false);
  const shorts = library.filter(item => item.type === 'short');

  const getYoutubeEmbedUrl = (url: string, muted: boolean) => {
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('/shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&loop=1&playlist=${id}`;
    }
    return url;
  };

  return (
    <main className="h-screen bg-black overflow-hidden relative">
      <Navbar />
      
      <div className="shorts-container h-full">
        {shorts.length > 0 ? (
          shorts.map((short) => {
            const isYoutube = short.mediaUrl.includes('youtube.com');
            const embedUrl = isYoutube ? getYoutubeEmbedUrl(short.mediaUrl, isMuted) : short.mediaUrl;

            return (
              <div key={short.id} className="short-item relative flex items-center justify-center group bg-neutral-900">
                {isYoutube ? (
                  <iframe
                    key={`${short.id}-${isMuted}`} // Force re-render on mute toggle to update iframe param
                    src={embedUrl}
                    className="h-full w-full max-w-md aspect-[9/16]"
                    title={short.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={short.mediaUrl} 
                    className="h-full w-full object-cover max-w-md"
                    loop
                    autoPlay
                    muted={isMuted}
                    playsInline
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Interaction Bar */}
                <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-10">
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </Button>
                    <span className="text-xs font-medium">{isMuted ? 'Muted' : 'Sound'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all">
                      <Heart size={24} />
                    </Button>
                    <span className="text-xs font-medium">12K</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all">
                      <MessageCircle size={24} />
                    </Button>
                    <span className="text-xs font-medium">420</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/10 backdrop-blur-md hover:bg-primary hover:text-white transition-all">
                      <Share2 size={24} />
                    </Button>
                    <span className="text-xs font-medium">Share</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-10 left-4 right-16 z-10 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <span className="font-headline font-bold text-lg">@{short.creator || 'Creator'}</span>
                    <Button size="sm" className="rounded-full h-8 bg-primary hover:bg-primary/90">Follow</Button>
                  </div>
                  <p className="text-sm line-clamp-2 mb-2 text-white/90">{short.description || short.title}</p>
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <span className="font-bold">Original Audio</span> • 256K Reels
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No shorts available yet.
          </div>
        )}
      </div>
    </main>
  );
}
