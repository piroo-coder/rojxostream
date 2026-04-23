
"use client";

import Image from 'next/image';
import { MediaItem } from '@/app/types/media';
import { useMedia } from '@/context/MediaContext';
import { Play, Music, Film, Tv, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const { setCurrentlyPlaying } = useMedia();

  const Icon = item.type === 'song' ? Music : item.type === 'movie' ? Film : Tv;

  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] hover:bg-card/80"
      onClick={() => setCurrentlyPlaying(item)}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes="400px"
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          data-ai-hint={item.type + " cover"}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100 flex items-center justify-center scale-90 group-hover:scale-100">
          <div className="rounded-full bg-primary p-5 text-white shadow-2xl shadow-primary/50 transform transition-transform hover:scale-110 active:scale-95">
            <Play fill="currentColor" size={32} />
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-md border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Icon size={12} className="mr-2" />
            {item.type}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-headline font-bold line-clamp-1 group-hover:text-accent transition-colors duration-300">
            {item.title}
          </h3>
        </div>
        
        <p className="text-sm text-white/50 line-clamp-1 mb-4">
          {item.creator || 'Featured Artist'}
        </p>
        
        <div className="flex items-center gap-3">
          {item.imdbRating && (
            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-lg text-[11px] font-black border border-yellow-500/20">
              IMDb {item.imdbRating}
            </div>
          )}
          {item.genre && item.genre.length > 0 && (
            <span className="text-[11px] text-white/40 uppercase tracking-widest font-bold">
              {item.genre[0]}
            </span>
          )}
        </div>
      </div>

      {/* Hover Info Tip */}
      <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
        <Info size={18} className="text-white/30" />
      </div>
    </div>
  );
};
