export type MediaType = 'anime' | 'movie' | 'song' | 'short';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  thumbnailUrl: string;
  audioBackgroundUrl?: string; // Background image for audio-only mode
  mediaUrl: string;
  description?: string;
  summary?: string;
  moral?: string;
  creator?: string; // Movie: Director, Song: Singer, Short: Channel
  writers?: string;
  producers?: string;
  theme?: string;
  wikipediaUrl?: string;
  mangaUrl?: string;
  fullPlot?: string;
  characters?: string[];
  imdbRating?: string;
  rottenTomatoesRating?: string;
  youtubeViews?: string;
  publishedAt?: string;
  genre?: string[];
}
