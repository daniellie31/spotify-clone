"use client";

import { useState, useEffect } from "react";
import { Search, Link as LinkIcon, Play, Heart, Plus, Loader2, Sparkles } from "lucide-react";
import { Song } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { CURATED_TRACKS } from "@/data/curatedTracks";
import { formatTime, extractYouTubeId } from "@/lib/utils";

export function SearchView() {
  const { playSong, playFromYouTubeUrl, addToQueue, currentSong, isPlaying } = usePlayer();
  const { playlists, isFavorite, toggleFavorite, addSongToPlaylist } = usePlaylists();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>(CURATED_TRACKS);
  const [loading, setLoading] = useState(false);
  const [activeMenuSongId, setActiveMenuSongId] = useState<string | null>(null);

  // Quick suggestions
  const suggestions = [
    "Lofi Girl",
    "The Weeknd",
    "Synthwave Chill",
    "Ed Sheeran",
    "Billie Eilish",
    "Coldplay",
    "Joji",
    "Queen",
  ];

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    if (!searchTerm.trim()) {
      setResults(CURATED_TRACKS);
      return;
    }

    // If it's a direct YouTube URL
    const vid = extractYouTubeId(searchTerm);
    if (vid) {
      setLoading(true);
      await playFromYouTubeUrl(searchTerm);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      // Fallback to local filter
      const filtered = CURATED_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-28 space-y-6">
      {/* Search Bar Input */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            ) : (
              <Search className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search songs, artists, or paste any YouTube URL directly..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 shadow-xl transition-all"
            autoFocus
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Try:
          </span>
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => handleSearch(item)}
              className="px-3 py-1 rounded-full text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition whitespace-nowrap cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-4xl mx-auto pt-2">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            {query ? `Search Results for "${query}"` : "Discover & Recommended Tracks"}
          </h2>
          <span className="text-xs text-zinc-500">{results.length} tracks</span>
        </div>

        {/* Results List */}
        <div className="mt-3 space-y-1">
          {results.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm">No direct tracks found.</p>
              <p className="text-xs text-zinc-600">
                Tip: You can paste any full YouTube video link directly above to play it instantly!
              </p>
            </div>
          ) : (
            results.map((song, idx) => {
              const isCurrent = currentSong?.id === song.id;
              const isLiked = isFavorite(song.id);

              return (
                <div
                  key={`${song.id}-${idx}`}
                  className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-zinc-900/90 border border-transparent hover:border-zinc-800 transition ${
                    isCurrent ? "bg-zinc-900 border-zinc-800" : ""
                  }`}
                >
                  {/* Left: Index / Play & Thumbnail + Info */}
                  <div
                    onClick={() => playSong(song, results)}
                    className="flex items-center gap-3.5 truncate flex-1 cursor-pointer"
                  >
                    <span className="w-5 text-center text-xs font-mono text-zinc-500 group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button className="w-5 hidden group-hover:flex items-center justify-center text-emerald-400">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        </div>
                      )}
                    </div>

                    <div className="truncate">
                      <h4
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent ? "text-emerald-400" : "text-white group-hover:text-emerald-400"
                        }`}
                      >
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  {/* Right: Category, Duration, & Actions */}
                  <div className="flex items-center gap-3">
                    {song.category && (
                      <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800/80 text-zinc-400">
                        {song.category}
                      </span>
                    )}

                    <span className="text-xs text-zinc-400 font-mono">
                      {formatTime(song.duration)}
                    </span>

                    <button
                      onClick={() => toggleFavorite(song)}
                      className={`p-1.5 rounded-full transition ${
                        isLiked ? "text-emerald-400" : "text-zinc-500 hover:text-white"
                      }`}
                      title={isLiked ? "Remove Favorite" : "Add Favorite"}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuSongId(activeMenuSongId === song.id ? null : song.id)
                        }
                        className="p-1.5 rounded-full text-zinc-500 hover:text-white transition"
                        title="Add to playlist"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {activeMenuSongId === song.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30 text-xs">
                          <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-500">
                            Add To Playlist
                          </div>
                          {playlists.map((pl) => (
                            <button
                              key={pl.id}
                              onClick={() => {
                                addSongToPlaylist(pl.id, song);
                                setActiveMenuSongId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white truncate"
                            >
                              {pl.name}
                            </button>
                          ))}
                          <div className="border-t border-zinc-800 my-1" />
                          <button
                            onClick={() => {
                              addToQueue(song);
                              setActiveMenuSongId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-emerald-400 hover:bg-zinc-800 font-medium"
                          >
                            + Add to Queue
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
