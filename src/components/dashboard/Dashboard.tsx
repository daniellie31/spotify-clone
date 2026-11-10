"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Heart,
  Plus,
  Sparkles,
  TrendingUp,
  Headphones,
  Radio,
  Flame,
  Clock,
  Check,
} from "lucide-react";
import { CURATED_TRACKS, GENRES } from "@/data/curatedTracks";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { Song } from "@/types/music";
import { formatTime } from "@/lib/utils";

interface DashboardProps {
  onNavigate: (view: "dashboard" | "search" | "library" | "playlist") => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentSong, isPlaying, playSong, addToQueue } = usePlayer();
  const { playlists, favorites, toggleFavorite, isFavorite, addSongToPlaylist, setActivePlaylistId } =
    usePlaylists();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeMenuSongId, setActiveMenuSongId] = useState<string | null>(null);

  const filteredTracks =
    selectedGenre === "All"
      ? CURATED_TRACKS
      : CURATED_TRACKS.filter((t) => t.category?.toLowerCase() === selectedGenre.toLowerCase());

  const quickPicks = CURATED_TRACKS.slice(0, 6);

  const handleTrackPlay = (song: Song) => {
    playSong(song, filteredTracks);
  };

  const handleOpenPlaylist = (id: string) => {
    setActivePlaylistId(id);
    onNavigate("playlist");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-28 space-y-10">
      {/* Hero Banner - Minimalist & Modern */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Ad-Free Music Streaming</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Listen to any YouTube track. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Clean, Minimalist & Ad-Free.
            </span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            Stream full audio without interruptions. Paste any YouTube URL directly into the player,
            explore curated playlists, or discover new tracks. Brave Shields & browser ad blockers automatically filter video ads.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleTrackPlay(CURATED_TRACKS[0])}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Trending Hit
            </button>

            <button
              onClick={() => onNavigate("search")}
              className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium text-xs sm:text-sm transition cursor-pointer"
            >
              Search YouTube & Explore
            </button>
          </div>
        </div>
      </section>

      {/* Quick Picks 6-Card Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            Quick Picks
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPicks.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <motion.div
                key={song.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleTrackPlay(song)}
                className={`group flex items-center justify-between p-2 rounded-2xl glass-card cursor-pointer border ${
                  isCurrent
                    ? "bg-zinc-800/80 border-emerald-500/50"
                    : "border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="flex gap-0.5 items-end h-3">
                          <span className="w-0.5 h-3 bg-emerald-400 animate-pulse"></span>
                          <span className="w-0.5 h-2 bg-emerald-400 animate-pulse"></span>
                          <span className="w-0.5 h-3.5 bg-emerald-400 animate-pulse"></span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="truncate">
                    <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song);
                    }}
                    className={`p-1.5 rounded-full transition ${
                      isFavorite(song.id) ? "text-emerald-400" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(song.id) ? "fill-current" : ""}`} />
                  </button>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                      isCurrent && isPlaying
                        ? "bg-emerald-500 text-zinc-950 scale-100"
                        : "bg-white text-zinc-950 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Playlists Carousel/Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-400" />
            Curated Playlists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <motion.div
              key={pl.id}
              whileHover={{ y: -4 }}
              onClick={() => handleOpenPlaylist(pl.id)}
              className="group p-4 rounded-2xl glass-card border border-zinc-800/80 hover:border-zinc-700 cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 shadow-md">
                {pl.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pl.coverImage}
                    alt={pl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-semibold text-white truncate">{pl.name}</span>
                  <span className="text-[11px] text-zinc-400">{pl.songs.length} tracks</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-400 line-clamp-2">{pl.description}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500 font-medium">Wavefy Curated</span>
                <span className="text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Listen Now →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommended Songs with Genre Filters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Recommendations & Trending
            </h2>
            <p className="text-xs text-zinc-400">Stream top tracks or filter by soundscape</p>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedGenre === genre
                    ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks List / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTracks.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = isFavorite(song.id);

            return (
              <motion.div
                key={song.id}
                whileHover={{ y: -4 }}
                onClick={() => handleTrackPlay(song)}
                className="group relative p-3 rounded-2xl glass-card border border-zinc-800/80 hover:border-zinc-700/80 cursor-pointer flex flex-col justify-between transition-all"
              >
                {/* Artwork with hover play button */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800 mb-3 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play Button Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all ${
                      isCurrent && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Category Pill */}
                  {song.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-md bg-black/60 text-zinc-200 backdrop-blur-md">
                      {song.category}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                </div>

                {/* Footer details & Playlist Add */}
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-zinc-800/50 text-[10px] text-zinc-500">
                  <span>{formatTime(song.duration)}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song);
                      }}
                      className={`p-1 rounded transition ${
                        isLiked ? "text-emerald-400" : "text-zinc-500 hover:text-white"
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuSongId(activeMenuSongId === song.id ? null : song.id);
                        }}
                        className="p-1 rounded text-zinc-500 hover:text-white transition"
                        title="Add to playlist / queue"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenuSongId === song.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl py-1 z-30 text-xs"
                        >
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
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
