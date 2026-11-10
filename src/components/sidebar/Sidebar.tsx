"use client";

import { Home, Search, Heart, PlusCircle, Music, ListMusic, Trash2 } from "lucide-react";
import { usePlaylists } from "@/context/PlaylistContext";

interface SidebarProps {
  activeView: "dashboard" | "search" | "library" | "playlist";
  onNavigate: (view: "dashboard" | "search" | "library" | "playlist") => void;
  openCreateModal: () => void;
}

export function Sidebar({ activeView, onNavigate, openCreateModal }: SidebarProps) {
  const { playlists, favorites, activePlaylistId, setActivePlaylistId, deletePlaylist } = usePlaylists();

  const handleSelectPlaylist = (id: string) => {
    setActivePlaylistId(id);
    onNavigate("playlist");
  };

  const handleSelectFavorites = () => {
    setActivePlaylistId("favorites");
    onNavigate("playlist");
  };

  return (
    <aside className="w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/80 flex flex-col flex-shrink-0 h-[calc(100vh-61px-80px)] select-none transition-colors">
      {/* Primary Navigation */}
      <div className="p-4 space-y-1">
        <button
          onClick={() => {
            setActivePlaylistId(null);
            onNavigate("dashboard");
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeView === "dashboard"
              ? "bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-900"
          }`}
        >
          <Home className={`w-4 h-4 ${activeView === "dashboard" ? "text-emerald-500" : ""}`} />
          Home
        </button>

        <button
          onClick={() => {
            setActivePlaylistId(null);
            onNavigate("search");
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeView === "search"
              ? "bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-900"
          }`}
        >
          <Search className={`w-4 h-4 ${activeView === "search" ? "text-emerald-500" : ""}`} />
          Search & Discover
        </button>

        <button
          onClick={handleSelectFavorites}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeView === "playlist" && activePlaylistId === "favorites"
              ? "bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/60 dark:to-zinc-900 text-zinc-950 dark:text-white border-l-2 border-emerald-500 font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950">
              <Heart className="w-3 h-3 fill-current" />
            </div>
            <span>Liked Songs</span>
          </div>
          <span className="text-xs text-zinc-500">{favorites.length}</span>
        </button>
      </div>

      <div className="mx-4 my-2 border-t border-zinc-200 dark:border-zinc-800/60" />

      {/* Playlists Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
          <ListMusic className="w-3.5 h-3.5" />
          Playlists
        </span>
        <button
          onClick={openCreateModal}
          className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-900 transition cursor-pointer"
          title="Create Playlist"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Playlists Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {playlists.map((pl) => {
          const isActive = activeView === "playlist" && activePlaylistId === pl.id;
          return (
            <div
              key={pl.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                isActive
                  ? "bg-zinc-200/80 dark:bg-zinc-800/90 text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/80"
              }`}
            >
              <div
                onClick={() => handleSelectPlaylist(pl.id)}
                className="flex items-center gap-2.5 truncate flex-1"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                  {pl.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pl.coverImage} alt={pl.name} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </div>
                <div className="truncate">
                  <div className="truncate">{pl.name}</div>
                  <div className="text-[10px] text-zinc-500 font-normal">
                    {pl.songs.length} {pl.songs.length === 1 ? "track" : "tracks"}
                  </div>
                </div>
              </div>

              {pl.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(pl.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition rounded"
                  title="Delete Playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 m-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
        <div className="font-semibold text-zinc-800 dark:text-zinc-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Live YouTube Feed
        </div>
        <p className="text-[10px] text-zinc-500 leading-tight">
          Dynamic streaming with zero ads when using Brave or browser ad blockers.
        </p>
      </div>
    </aside>
  );
}
