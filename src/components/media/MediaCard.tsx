
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
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-card/20 backdrop-blur-md border border-white/5 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] hover:bg-card/40"
      onClick={() => setCurrentlyPlaying(item)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint={item.type + " cover"}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-500">
          <div className="rounded-full bg-white/20 backdrop-blur-2xl p-6 text-white shadow-2xl border border-white/30 transform transition-transform hover:scale-110 active:scale-95">
            <Play fill="currentColor" size={36} />
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-black/40 backdrop-blur-xl border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            <Icon size={12} className="mr-2" />
            {item.type}
          </Badge>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl md:text-2xl font-headline font-bold line-clamp-1 group-hover:text-accent transition-colors duration-300">
            {item.title}
          </h3>
        </div>
        
        <p className="text-sm md:text-base text-white/50 line-clamp-1 mb-6 font-medium">
          {item.creator || 'Featured Artist'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.imdbRating && (
              <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-yellow-500/10">
                IMDb {item.imdbRating}
              </div>
            )}
            {item.genre && item.genre.length > 0 && (
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">
                {item.genre[0]}
              </span>
            )}
          </div>
          <Info size={18} className="text-white/20 group-hover:text-white/50 transition-colors" />
        </div>
      </div>
    </div>
  );
};
