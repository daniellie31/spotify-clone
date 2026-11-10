"use client";

import { Play, Shuffle, Heart, Trash2, Clock, Music } from "lucide-react";
import { usePlaylists } from "@/context/PlaylistContext";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";

export function PlaylistView() {
  const {
    playlists,
    favorites,
    activePlaylistId,
    removeSongFromPlaylist,
    toggleFavorite,
    isFavorite,
  } = usePlaylists();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  const isLikedSongsView = activePlaylistId === "favorites";
  const currentPlaylist = isLikedSongsView
    ? {
        id: "favorites",
        name: "Liked Songs",
        description: "All the tracks you have liked in Wavefy",
        coverImage:
          "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
        songs: favorites,
      }
    : playlists.find((p) => p.id === activePlaylistId) || playlists[0];

  if (!currentPlaylist) return null;

  const totalDuration = currentPlaylist.songs.reduce((acc, s) => acc + (s.duration || 0), 0);

  const handlePlayAll = () => {
    if (currentPlaylist.songs.length > 0) {
      playSong(currentPlaylist.songs[0], currentPlaylist.songs);
    }
  };

  const handleShufflePlay = () => {
    if (currentPlaylist.songs.length > 0) {
      const shuffled = [...currentPlaylist.songs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-28 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 p-6 sm:p-8 rounded-3xl glass-panel border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 shadow-2xl border border-white/10">
          {currentPlaylist.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentPlaylist.coverImage}
              alt={currentPlaylist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <Music className="w-16 h-16 text-zinc-600" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {isLikedSongsView ? "Collection" : "Playlist"}
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentPlaylist.name}
          </h1>

          {currentPlaylist.description && (
            <p className="text-sm text-zinc-400 max-w-xl">{currentPlaylist.description}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 font-mono">
            <span className="font-semibold text-zinc-200">
              {currentPlaylist.songs.length}{" "}
              {currentPlaylist.songs.length === 1 ? "track" : "tracks"}
            </span>
            <span>•</span>
            <span>{Math.round(totalDuration / 60)} min</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={handlePlayAll}
          disabled={currentPlaylist.songs.length === 0}
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 cursor-pointer"
          title="Play All"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>

        <button
          onClick={handleShufflePlay}
          disabled={currentPlaylist.songs.length === 0}
          className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
          title="Shuffle Play"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* Tracks Table */}
      <div className="space-y-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/80">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-6 sm:col-span-7">Title</span>
          <span className="col-span-3 sm:col-span-3 hidden sm:inline">Category</span>
          <span className="col-span-5 sm:col-span-1 text-right flex items-center justify-end">
            <Clock className="w-3.5 h-3.5" />
          </span>
        </div>

        {currentPlaylist.songs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2 border border-dashed border-zinc-800 rounded-2xl my-4">
            <Music className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm">This playlist is empty.</p>
            <p className="text-xs text-zinc-600">
              Browse tracks on Home or use Search to add songs!
            </p>
          </div>
        ) : (
          currentPlaylist.songs.map((song, idx) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = isFavorite(song.id);

            return (
              <div
                key={`${song.id}-${idx}`}
                className={`group grid grid-cols-12 items-center px-4 py-2.5 rounded-xl hover:bg-zinc-900/90 border border-transparent hover:border-zinc-800 transition ${
                  isCurrent ? "bg-zinc-900 border-zinc-800" : ""
                }`}
              >
                {/* Index / Play */}
                <div className="col-span-1 text-center">
                  <span className="text-xs font-mono text-zinc-500 group-hover:hidden">
                    {idx + 1}
                  </span>
                  <button
                    onClick={() => playSong(song, currentPlaylist.songs)}
                    className="hidden group-hover:inline-flex items-center justify-center text-emerald-400"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Title & Artist */}
                <div
                  onClick={() => playSong(song, currentPlaylist.songs)}
                  className="col-span-6 sm:col-span-7 flex items-center gap-3 truncate cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
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

                {/* Category */}
                <div className="col-span-3 hidden sm:inline text-xs text-zinc-400 truncate">
                  {song.category || "YouTube Track"}
                </div>

                {/* Duration & Actions */}
                <div className="col-span-5 sm:col-span-1 flex items-center justify-end gap-2 text-xs font-mono text-zinc-400">
                  <span>{formatTime(song.duration)}</span>

                  <button
                    onClick={() => toggleFavorite(song)}
                    className={`p-1 transition ${
                      isLiked ? "text-emerald-400" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                  </button>

                  {!isLikedSongsView && (
                    <button
                      onClick={() => removeSongFromPlaylist(currentPlaylist.id, song.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                      title="Remove from playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
