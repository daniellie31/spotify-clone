import { Song, Playlist } from "@/types/music";

export const CURATED_TRACKS: Song[] = [
  {
    id: "4NRXx6U8ABQ",
    title: "Blinding Lights",
    artist: "The Weeknd",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    duration: 200,
    category: "Synthwave",
    views: "800M+ views",
    url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ"
  },
  {
    id: "jfKfPfyJRdk",
    title: "beats to relax/study to (Lofi Hip Hop)",
    artist: "Lofi Girl",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    duration: 3600,
    category: "Lo-Fi",
    views: "Live Stream",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  },
  {
    id: "JGwWNGJdvx8",
    title: "Shape of You",
    artist: "Ed Sheeran",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    duration: 233,
    category: "Pop",
    views: "6.2B views",
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8"
  },
  {
    id: "b1kbLwvqugk",
    title: "SLOW DANCING IN THE DARK",
    artist: "Joji",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    duration: 217,
    category: "Chill & R&B",
    views: "430M views",
    url: "https://www.youtube.com/watch?v=b1kbLwvqugk"
  },
  {
    id: "5qap5aO4i9A",
    title: "beats to sleep/chill to (Lofi Hip Hop)",
    artist: "Lofi Girl",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    duration: 3600,
    category: "Lo-Fi",
    views: "Live Stream",
    url: "https://www.youtube.com/watch?v=5qap5aO4i9A"
  },
  {
    id: "OPf0YbXqDm0",
    title: "Uptown Funk (ft. Bruno Mars)",
    artist: "Mark Ronson",
    thumbnail: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop&q=80",
    duration: 270,
    category: "Funk & Pop",
    views: "5.1B views",
    url: "https://www.youtube.com/watch?v=OPf0YbXqDm0"
  },
  {
    id: "V1Pl8CzNzCw",
    title: "bad guy",
    artist: "Billie Eilish",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    duration: 205,
    category: "Alternative",
    views: "1.3B views",
    url: "https://www.youtube.com/watch?v=V1Pl8CzNzCw"
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    duration: 359,
    category: "Classic Rock",
    views: "1.7B views",
    url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ"
  },
  {
    id: "hT_nvWreIhg",
    title: "Counting Stars",
    artist: "OneRepublic",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    duration: 267,
    category: "Pop Rock",
    views: "4.0B views",
    url: "https://www.youtube.com/watch?v=hT_nvWreIhg"
  },
  {
    id: "FM7MFYoylVs",
    title: "Something Just Like This",
    artist: "The Chainsmokers & Coldplay",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80",
    duration: 247,
    category: "Electronic",
    views: "2.3B views",
    url: "https://www.youtube.com/watch?v=FM7MFYoylVs"
  },
  {
    id: "C9kH4U6wE18",
    title: "I Like Me Better",
    artist: "Lauv",
    thumbnail: "https://images.unsplash.com/photo-1520523839898-507129cd14f1?w=600&auto=format&fit=crop&q=80",
    duration: 197,
    category: "Pop",
    views: "520M views",
    url: "https://www.youtube.com/watch?v=C9kH4U6wE18"
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Perfect",
    artist: "Ed Sheeran",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    duration: 263,
    category: "Acoustic",
    views: "3.7B views",
    url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g"
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: "favorites",
    name: "Liked Songs",
    description: "Your favorite hand-picked tracks",
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    songs: [CURATED_TRACKS[0], CURATED_TRACKS[1], CURATED_TRACKS[3]],
    isCustom: false,
    createdAt: Date.now() - 1000000
  },
  {
    id: "lofi-focus",
    name: "Late Night Focus & Code",
    description: "Deep flow, chill beats, and zero distractions",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    songs: [CURATED_TRACKS[1], CURATED_TRACKS[4], CURATED_TRACKS[3]],
    isCustom: false,
    createdAt: Date.now() - 2000000
  },
  {
    id: "global-hits",
    name: "Today's Top Hits",
    description: "The hottest tracks right now across the globe",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    songs: [CURATED_TRACKS[0], CURATED_TRACKS[2], CURATED_TRACKS[5], CURATED_TRACKS[9]],
    isCustom: false,
    createdAt: Date.now() - 3000000
  }
];

export const GENRES = [
  "All",
  "Lo-Fi",
  "Pop",
  "Synthwave",
  "Chill & R&B",
  "Electronic",
  "Classic Rock",
  "Alternative",
  "Acoustic"
];
