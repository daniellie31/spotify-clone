import { extractYouTubeId } from "./utils";
import { Song } from "@/types/music";

export async function fetchYouTubeInfo(urlOrId: string): Promise<Song | null> {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  const standardThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        id: videoId,
        title: data.title || `Track ${videoId}`,
        artist: data.author_name || "YouTube Creator",
        thumbnail: data.thumbnail_url || standardThumbnail,
        duration: 0, // will be populated dynamically by YouTube IFrame once loaded
        category: "YouTube Stream",
        views: "YouTube",
        url
      };
    }
  } catch {
    // If oEmbed fetch is blocked or offline, still return a valid Song object!
  }

  return {
    id: videoId,
    title: `YouTube Video (${videoId})`,
    artist: "YouTube Artist",
    thumbnail: standardThumbnail,
    duration: 0,
    category: "YouTube Stream",
    views: "YouTube",
    url
  };
}
