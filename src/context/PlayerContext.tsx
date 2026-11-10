"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { Song, RepeatMode } from "@/types/music";
import { CURATED_TRACKS } from "@/data/curatedTracks";
import { fetchYouTubeInfo } from "@/lib/youtube";
import { extractYouTubeId } from "@/lib/utils";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  queue: Song[];
  queueIndex: number;
  isVideoMode: boolean;
  isExpandedNowPlaying: boolean;
  isQueueOpen: boolean;
  isLoading: boolean;
  playbackRate: number;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  playSong: (song: Song, newQueue?: Song[]) => void;
  playFromYouTubeUrl: (urlOrId: string) => Promise<boolean>;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seekTo: (seconds: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleVideoMode: () => void;
  setIsExpandedNowPlaying: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setPlayerInstance: (instance: unknown) => void;
  onPlayerStateChange: (state: number) => void;
  onPlayerDurationChange: (duration: number) => void;
  onPlayerCurrentTimeChange: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// YouTube Player state constants
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;
const YT_BUFFERING = 3;

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(CURATED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(CURATED_TRACKS[0]?.duration || 0);
  const [volume, setVolumeState] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>(CURATED_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);
  const [isExpandedNowPlaying, setIsExpandedNowPlaying] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  repeatModeRef.current = repeatMode;
  const queueRef = useRef<Song[]>(queue);
  queueRef.current = queue;
  const queueIndexRef = useRef<number>(queueIndex);
  queueIndexRef.current = queueIndex;
  const shuffleRef = useRef<boolean>(shuffle);
  shuffleRef.current = shuffle;
  const currentTimeRef = useRef<number>(currentTime);
  currentTimeRef.current = currentTime;
  const durationRef = useRef<number>(duration);
  durationRef.current = duration;
  const volumeRef = useRef<number>(volume);
  volumeRef.current = volume;

  const setPlayerInstance = useCallback((instance: unknown) => {
    ytPlayerRef.current = instance;
    if (instance && volume) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (instance as any).setVolume(volume);
      } catch {
        // ignore
      }
    }
  }, [volume]);

  const onPlayerDurationChange = useCallback((newDuration: number) => {
    if (newDuration > 0) {
      setDuration(newDuration);
      setCurrentSong((prev) => (prev ? { ...prev, duration: newDuration } : null));
    }
  }, []);

  const onPlayerCurrentTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    if (ytPlayerRef.current?.seekTo) {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch {
        // ignore
      }
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (ytPlayerRef.current?.pauseVideo) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    }
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
    if (ytPlayerRef.current?.playVideo) {
      try {
        ytPlayerRef.current.playVideo();
      } catch {
        // ignore
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const nextSong = useCallback(() => {
    const currentQueue = queueRef.current;
    const currentIndex = queueIndexRef.current;
    if (currentQueue.length === 0) return;

    let nextIdx: number;
    if (shuffleRef.current && currentQueue.length > 1) {
      do {
        nextIdx = Math.floor(Math.random() * currentQueue.length);
      } while (nextIdx === currentIndex);
    } else {
      nextIdx = currentIndex + 1;
      if (nextIdx >= currentQueue.length) {
        if (repeatModeRef.current === "all") {
          nextIdx = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    const nextTrack = currentQueue[nextIdx];
    if (nextTrack) {
      setQueueIndex(nextIdx);
      setCurrentSong(nextTrack);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(nextTrack.duration || 0);
      if (ytPlayerRef.current?.loadVideoById) {
        try {
          ytPlayerRef.current.loadVideoById(nextTrack.id);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const prevSong = useCallback(() => {
    if (currentTimeRef.current > 3) {
      seekTo(0);
      return;
    }

    const currentQueue = queueRef.current;
    const currentIndex = queueIndexRef.current;
    if (currentQueue.length === 0) return;

    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      prevIdx = currentQueue.length - 1;
    }

    const prevTrack = currentQueue[prevIdx];
    if (prevTrack) {
      setQueueIndex(prevIdx);
      setCurrentSong(prevTrack);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(prevTrack.duration || 0);
      if (ytPlayerRef.current?.loadVideoById) {
        try {
          ytPlayerRef.current.loadVideoById(prevTrack.id);
        } catch {
          // ignore
        }
      }
    }
  }, [seekTo]);

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === song.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      setQueue((prev) => {
        const exists = prev.findIndex((s) => s.id === song.id);
        if (exists !== -1) {
          setQueueIndex(exists);
          return prev;
        }
        const updated = [...prev, song];
        setQueueIndex(updated.length - 1);
        return updated;
      });
    }

    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(song.duration || 0);

    if (ytPlayerRef.current?.loadVideoById) {
      try {
        ytPlayerRef.current.loadVideoById(song.id);
      } catch {
        // ignore
      }
    }
  }, []);

  const playFromYouTubeUrl = useCallback(
    async (urlOrId: string): Promise<boolean> => {
      const vid = extractYouTubeId(urlOrId);
      if (!vid) return false;

      setIsLoading(true);
      try {
        const info = await fetchYouTubeInfo(vid);
        if (info) {
          playSong(info);
          return true;
        }
      } catch {
        const basicSong: Song = {
          id: vid,
          title: `YouTube Video (${vid})`,
          artist: "YouTube",
          thumbnail: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
          duration: 0,
          category: "YouTube URL",
          url: `https://www.youtube.com/watch?v=${vid}`,
        };
        playSong(basicSong);
        return true;
      } finally {
        setIsLoading(false);
      }
      return false;
    },
    [playSong]
  );

  const onPlayerStateChange = useCallback(
    (state: number) => {
      if (state === YT_PLAYING) {
        setIsPlaying(true);
        setIsLoading(false);

        if (ytPlayerRef.current?.getDuration) {
          const d = ytPlayerRef.current.getDuration();
          if (d && d > 0) setDuration(d);
        }
        if (ytPlayerRef.current?.getVideoData) {
          const data = ytPlayerRef.current.getVideoData();
          if (data && data.title) {
            setCurrentSong((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                title: prev.title.startsWith("YouTube Video (") ? data.title : prev.title,
                artist:
                  prev.artist === "YouTube" || prev.artist === "YouTube Artist"
                    ? data.author || prev.artist
                    : prev.artist,
              };
            });
          }
        }
      } else if (state === YT_PAUSED) {
        setIsPlaying(false);
      } else if (state === YT_BUFFERING) {
        setIsLoading(true);
      } else if (state === YT_ENDED) {
        if (repeatModeRef.current === "one") {
          seekTo(0);
          resume();
        } else {
          nextSong();
        }
      }
    },
    [nextSong, resume, seekTo]
  );

  const setVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(100, vol));
      setVolumeState(clamped);
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
      }
      if (ytPlayerRef.current?.setVolume) {
        try {
          ytPlayerRef.current.setVolume(clamped);
          if (clamped === 0) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
          }
        } catch {
          // ignore
        }
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      if (ytPlayerRef.current?.unMute) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume || 50);
        } catch {
          // ignore
        }
      }
    } else {
      setIsMuted(true);
      if (ytPlayerRef.current?.mute) {
        try {
          ytPlayerRef.current.mute();
        } catch {
          // ignore
        }
      }
    }
  }, [isMuted, volume]);

  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => !prev);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    setQueueIndex((prev) => (index < prev ? prev - 1 : prev));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  const toggleVideoMode = useCallback(() => {
    setIsVideoMode((prev) => !prev);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (ytPlayerRef.current?.setPlaybackRate) {
      try {
        ytPlayerRef.current.setPlaybackRate(rate);
      } catch {
        // ignore
      }
    }
  }, []);

  const setSleepTimer = useCallback((minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes === null) {
      setSleepTimerRemaining(null);
    } else {
      setSleepTimerRemaining(minutes * 60);
    }
  }, []);

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepTimerRemaining === null) return;
    if (sleepTimerRemaining <= 0) {
      pause();
      setSleepTimerRemaining(null);
      setSleepTimerMinutes(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [pause, sleepTimerRemaining]);

  // Sync playback time loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (ytPlayerRef.current?.getCurrentTime) {
          try {
            const time = ytPlayerRef.current.getCurrentTime();
            if (typeof time === "number") {
              setCurrentTime(time);
            }
          } catch {
            // ignore
          }
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // MediaSession API Integration
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    if (currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: "Wavefy Stream",
        artwork: [
          { src: currentSong.thumbnail, sizes: "512x512", type: "image/jpeg" },
        ],
      });
    }

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    try {
      navigator.mediaSession.setActionHandler("play", () => resume());
      navigator.mediaSession.setActionHandler("pause", () => pause());
      navigator.mediaSession.setActionHandler("previoustrack", () => prevSong());
      navigator.mediaSession.setActionHandler("nexttrack", () => nextSong());
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime !== undefined) seekTo(details.seekTime);
      });
      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const offset = details.seekOffset || 10;
        seekTo(Math.max(0, currentTimeRef.current - offset));
      });
      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const offset = details.seekOffset || 10;
        seekTo(Math.min(durationRef.current, currentTimeRef.current + offset));
      });
    } catch {
      // ignore
    }
  }, [currentSong, isPlaying, nextSong, pause, prevSong, resume, seekTo]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seekTo(Math.max(0, currentTimeRef.current - 5));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seekTo(Math.min(durationRef.current, currentTimeRef.current + 5));
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setVolume(Math.min(100, volumeRef.current + 5));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setVolume(Math.max(0, volumeRef.current - 5));
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setIsExpandedNowPlaying((prev) => !prev);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        toggleShuffle();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        cycleRepeatMode();
      } else if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleRepeatMode, seekTo, setVolume, toggleMute, togglePlay, toggleShuffle]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        shuffle,
        queue,
        queueIndex,
        isVideoMode,
        isExpandedNowPlaying,
        isQueueOpen,
        isLoading,
        playbackRate,
        sleepTimerMinutes,
        sleepTimerRemaining,
        isShortcutsOpen,
        setIsShortcutsOpen,
        setPlaybackRate,
        setSleepTimer,
        playSong,
        playFromYouTubeUrl,
        togglePlay,
        pause,
        resume,
        seekTo,
        nextSong,
        prevSong,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleVideoMode,
        setIsExpandedNowPlaying,
        setIsQueueOpen,
        setPlayerInstance,
        onPlayerStateChange,
        onPlayerDurationChange,
        onPlayerCurrentTimeChange,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
