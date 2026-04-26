
export interface MediaCharacter {
  name: string;
  image_url: string;
  background_url?: string;
  role?: string;
  description?: string;
}

export type MediaType = 'anime' | 'movie' | 'song' | 'short';

export interface CriticalAnalysis {
  characterMotivations: { topic: string; explanation: string }[];
  narrativeEvents: { event: string; explanation: string }[];
  writersMessage: string;
  realLifeRelation: string;
  importanceToUs: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  thumbnailUrl: string;
  audioBackgroundUrl?: string; // Background image for audio-only mode
  mediaUrl: string;
  hindiExplanationUrl?: string; // Link for Hindi summary/explanation
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
  characters?: MediaCharacter[];
  criticalAnalysis?: CriticalAnalysis;
  imdbRating?: string;
  rottenTomatoesRating?: string;
  youtubeViews?: string;
  publishedAt?: string;
  genre?: string[];
}
