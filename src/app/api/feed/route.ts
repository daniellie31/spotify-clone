import { NextResponse } from "next/server";
import { Song } from "@/types/music";

// Helper to parse duration text like "3:45" or "1:15:30"
function parseDuration(text: string): number {
  if (!text) return 0;
  const parts = text.split(":").map(Number);
  if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
  if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  return 0;
}

// Scrape YouTube search results for live dynamic songs
async function scrapeYouTube(searchQuery: string, limit = 12): Promise<Song[]> {
  const songs: Song[] = [];
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      searchQuery
    )}&sp=EgIQAQ%253D%253D`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) return songs;
    const html = await res.text();

    const match =
      html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/) ||
      html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);

    if (!match || !match[1]) return songs;

    const parsed = JSON.parse(match[1]);
    const contents =
      parsed?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer
        ?.contents?.[0]?.itemSectionRenderer?.contents || [];

    for (const item of contents) {
      if (songs.length >= limit) break;
      const video = item?.videoRenderer;
      if (video && video.videoId) {
        const videoId = video.videoId;
        const title = video.title?.runs?.[0]?.text || "Unknown Track";
        const artist = video.ownerText?.runs?.[0]?.text || "Various Artists";
        const durationText = video.lengthText?.simpleText || "0:00";
        const views = video.viewCountText?.simpleText || "";

        songs.push({
          id: videoId,
          title,
          artist,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          duration: parseDuration(durationText),
          category: searchQuery.replace(" music", "").replace(" songs", ""),
          views,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }
  } catch (error) {
    console.error("YouTube scraping error:", error);
  }

  return songs;
}

// Fallback to iTunes Public Music API if YouTube rate-limits
async function fetchITunesCharts(term: string, limit = 10): Promise<Song[]> {
  const songs: Song[] = [];
  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=song&limit=${limit}`;
    const res = await fetch(itunesUrl);
    if (!res.ok) return songs;
    const data = await res.json();

    if (data.results && Array.isArray(data.results)) {
      for (const item of data.results) {
        // Find or map item
        songs.push({
          id: item.trackId ? String(item.trackId) : `${item.artistName}-${item.trackName}`,
          title: item.trackName || "Untitled",
          artist: item.artistName || "Unknown Artist",
          thumbnail: item.artworkUrl100?.replace("100x100bb", "600x600bb") || "",
          duration: Math.round((item.trackTimeMillis || 0) / 1000),
          category: item.primaryGenreName || term,
          views: "Trending",
          url: item.trackViewUrl,
        });
      }
    }
  } catch {
    // ignore
  }
  return songs;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") || "Trending";
  const type = searchParams.get("type") || "tracks"; // "tracks" | "quickPicks"

  const searchQuery =
    genre === "All" || genre === "Trending"
      ? "top hits music 2024"
      : `${genre} popular music audio`;

  // Scrape live YouTube results
  let tracks = await scrapeYouTube(searchQuery, type === "quickPicks" ? 6 : 18);

  // If YouTube scraping returned fewer than 3 items, try backup public search
  if (tracks.length < 3) {
    const backupQuery = `${genre} official music video`;
    tracks = await scrapeYouTube(backupQuery, 12);
  }

  return NextResponse.json({
    genre,
    tracks,
    timestamp: Date.now(),
  });
}
