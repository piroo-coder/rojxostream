
"use client";

import Image from 'next/image';
import { MediaItem } from '@/app/types/media';
import { useMedia } from '@/context/MediaContext';
import { Play, Music, Film, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const { setCurrentlyPlaying } = useMedia();

  const Icon = item.type === 'song' ? Music : item.type === 'movie' ? Film : Tv;

  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-card transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
      onClick={() => setCurrentlyPlaying(item)}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          data-ai-hint={item.type + " cover"}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="rounded-full bg-primary p-3 text-white shadow-lg">
            <Play fill="currentColor" size={24} />
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-none">
            <Icon size={12} className="mr-1" />
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-headline font-semibold line-clamp-1 group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {item.creator || 'Various Artists'}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {item.imdbRating && (
            <span className="text-[10px] font-bold text-accent px-1.5 py-0.5 rounded border border-accent/30">
              IMDb {item.imdbRating}
            </span>
          )}
          {item.youtubeViews && (
            <span className="text-[10px] text-muted-foreground">
              {item.youtubeViews} views
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
