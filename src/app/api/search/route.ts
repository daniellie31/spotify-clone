import { NextResponse } from "next/server";
import { extractYouTubeId } from "@/lib/utils";
import { CURATED_TRACKS } from "@/data/curatedTracks";
import { Song } from "@/types/music";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query) {
    return NextResponse.json({ results: CURATED_TRACKS });
  }

  // 1. If query is a direct YouTube link or ID
  const directId = extractYouTubeId(query);
  if (directId) {
    const directSong: Song = {
      id: directId,
      title: `YouTube Video (${directId})`,
      artist: "YouTube",
      thumbnail: `https://i.ytimg.com/vi/${directId}/hqdefault.jpg`,
      duration: 0,
      category: "YouTube Stream",
      url: `https://www.youtube.com/watch?v=${directId}`
    };

    // Try fetching title via oembed
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${directId}&format=json`,
        { next: { revalidate: 3600 } }
      );
      if (oembedRes.ok) {
        const odata = await oembedRes.json();
        directSong.title = odata.title || directSong.title;
        directSong.artist = odata.author_name || directSong.artist;
        directSong.thumbnail = odata.thumbnail_url || directSong.thumbnail;
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ results: [directSong] });
  }

  // 2. Search local curated tracks
  const lowerQ = query.toLowerCase();
  const matchedCurated = CURATED_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQ) ||
      t.artist.toLowerCase().includes(lowerQ) ||
      (t.category && t.category.toLowerCase().includes(lowerQ))
  );

  // 3. Try searching YouTube HTML or suggest queries
  const youtubeResults: Song[] = [];
  try {
    const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
    const res = await fetch(ytSearchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (res.ok) {
      const html = await res.text();
      // Extract ytInitialData
      const match = html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/) || html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        const contents =
          parsed?.contents?.twoColumnSearchResultsRenderer?.primaryContents
            ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

        for (const item of contents) {
          if (youtubeResults.length >= 8) break;
          const video = item?.videoRenderer;
          if (video && video.videoId) {
            const videoId = video.videoId;
            const title = video.title?.runs?.[0]?.text || "Untitled";
            const artist = video.ownerText?.runs?.[0]?.text || "Artist";
            const durationText = video.lengthText?.simpleText || "0:00";
            const viewCount = video.viewCountText?.simpleText || "";

            // Parse duration text like "3:45"
            let duration = 0;
            const parts = durationText.split(":").map(Number);
            if (parts.length === 2) duration = parts[0] * 60 + parts[1];
            else if (parts.length === 3) duration = parts[0] * 3600 + parts[1] * 60 + parts[2];

            youtubeResults.push({
              id: videoId,
              title,
              artist,
              thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              duration,
              category: "Search Result",
              views: viewCount,
              url: `https://www.youtube.com/watch?v=${videoId}`
            });
          }
        }
      }
    }
  } catch {
    // If YouTube network fetch fails, fallback to curated matches
  }

  // Combine results with duplicate removal
  const existingIds = new Set(matchedCurated.map((m) => m.id));
  const combined = [...matchedCurated];

  for (const item of youtubeResults) {
    if (!existingIds.has(item.id)) {
      combined.push(item);
      existingIds.add(item.id);
    }
  }

  return NextResponse.json({ results: combined.length > 0 ? combined : matchedCurated });
}
