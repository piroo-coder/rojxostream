
export type MediaType = 'anime' | 'movie' | 'song' | 'short';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  thumbnailUrl: string;
  mediaUrl: string;
  description?: string;
  summary?: string;
  moral?: string;
  creator?: string; // Movie: Director, Song: Singer, Short: Channel
  characters?: string[];
  imdbRating?: string;
  rottenTomatoesRating?: string;
  youtubeViews?: string;
  publishedAt?: string;
  genre?: string[];
}
