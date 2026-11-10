export interface Song {
  id: string; // YouTube Video ID
  title: string;
  artist: string;
  thumbnail: string;
  duration: number; // in seconds
  category?: string;
  views?: string;
  addedAt?: number;
  url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  songs: Song[];
  isCustom?: boolean;
  createdAt: number;
}

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 100
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  queue: Song[];
  queueIndex: number;
  isVideoMode: boolean; // toggle to view video embed
}
