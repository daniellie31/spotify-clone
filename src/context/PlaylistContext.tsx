"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Playlist, Song } from "@/types/music";
import { INITIAL_PLAYLISTS, CURATED_TRACKS } from "@/data/curatedTracks";

interface PlaylistContextType {
  playlists: Playlist[];
  favorites: Song[];
  activePlaylistId: string | null;
  setActivePlaylistId: (id: string | null) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  toggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const STORAGE_PLAYLISTS_KEY = "wavefy_playlists_v1";
const STORAGE_FAVORITES_KEY = "wavefy_favorites_v1";

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [favorites, setFavorites] = useState<Song[]>([CURATED_TRACKS[0], CURATED_TRACKS[1]]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedPlaylists = localStorage.getItem(STORAGE_PLAYLISTS_KEY);
      if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists));
      }
      const storedFavorites = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch {
      // ignore
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const createPlaylist = useCallback(
    (name: string, description?: string): Playlist => {
      const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        name: name.trim() || "My New Playlist",
        description: description || "Custom user playlist",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        songs: [],
        isCustom: true,
        createdAt: Date.now(),
      };
      setPlaylists((prev) => [newPlaylist, ...prev]);
      showToast(`Playlist "${newPlaylist.name}" created!`);
      return newPlaylist;
    },
    [showToast]
  );

  const deletePlaylist = useCallback(
    (id: string) => {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      if (activePlaylistId === id) {
        setActivePlaylistId(null);
      }
      showToast("Playlist deleted");
    },
    [activePlaylistId, showToast]
  );

  const addSongToPlaylist = useCallback(
    (playlistId: string, song: Song) => {
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            const exists = pl.songs.some((s) => s.id === song.id);
            if (exists) {
              return pl;
            }
            return {
              ...pl,
              songs: [song, ...pl.songs],
            };
          }
          return pl;
        })
      );
      showToast(`Added to playlist`);
    },
    [showToast]
  );

  const removeSongFromPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            return {
              ...pl,
              songs: pl.songs.filter((s) => s.id !== songId),
            };
          }
          return pl;
        })
      );
      showToast("Removed from playlist");
    },
    [showToast]
  );

  const toggleFavorite = useCallback(
    (song: Song) => {
      setFavorites((prev) => {
        const isFav = prev.some((s) => s.id === song.id);
        if (isFav) {
          showToast(`Removed from Liked Songs`);
          return prev.filter((s) => s.id !== song.id);
        } else {
          showToast(`Added to Liked Songs`);
          return [song, ...prev];
        }
      });
    },
    [showToast]
  );

  const isFavorite = useCallback(
    (songId: string) => {
      return favorites.some((s) => s.id === songId);
    },
    [favorites]
  );

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        favorites,
        activePlaylistId,
        setActivePlaylistId,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        toggleFavorite,
        isFavorite,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylists must be used within a PlaylistProvider");
  }
  return context;
}
