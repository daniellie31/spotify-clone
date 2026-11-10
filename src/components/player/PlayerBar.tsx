"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  Maximize2,
  Video,
  Loader2,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { formatTime } from "@/lib/utils";

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    shuffle,
    isLoading,
    togglePlay,
    seekTo,
    nextSong,
    prevSong,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    isVideoMode,
    toggleVideoMode,
    isQueueOpen,
    setIsQueueOpen,
    setIsExpandedNowPlaying,
  } = usePlayer();

  const { isFavorite, toggleFavorite } = usePlaylists();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekVal, setSeekVal] = useState(0);

  if (!currentSong) return null;

  const isLiked = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? ((isSeeking ? seekVal : currentTime) / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setSeekVal(Number(e.target.value));
  };

  const handleSeekCommit = () => {
    seekTo(seekVal);
    setIsSeeking(false);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 sm:h-22 glass-panel border-t border-zinc-800/90 bg-zinc-950/95 px-3 sm:px-6 flex items-center select-none backdrop-blur-xl">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-2 sm:gap-4">
        {/* Left: Current Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[140px] max-w-[280px]">
          <div
            onClick={() => setIsExpandedNowPlaying(true)}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 cursor-pointer group shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isPlaying ? "brightness-105" : "brightness-90"
              }`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="truncate flex-1">
            <h4
              onClick={() => setIsExpandedNowPlaying(true)}
              className="text-xs sm:text-sm font-semibold text-white truncate cursor-pointer hover:underline"
              title={currentSong.title}
            >
              {currentSong.title}
            </h4>
            <p className="text-[11px] text-zinc-400 truncate" title={currentSong.artist}>
              {currentSong.artist}
            </p>
          </div>

          {/* Quick Heart & Video Mode Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(currentSong)}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                isLiked ? "text-emerald-400 hover:text-emerald-300" : "text-zinc-500 hover:text-zinc-200"
              }`}
              title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={toggleVideoMode}
              className={`hidden sm:flex p-1.5 rounded-full transition cursor-pointer ${
                isVideoMode
                  ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
              title={isVideoMode ? "Hide video preview" : "Show video preview"}
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Playback Controls & Seekbar */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-2">
          {/* Controls buttons row */}
          <div className="flex items-center gap-3 sm:gap-5 mb-1 sm:mb-1.5">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                shuffle ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={prevSong}
              className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={nextSong}
              className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Next"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              onClick={cycleRepeatMode}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                repeatMode !== "off" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>

          {/* Time & Seek Bar */}
          <div className="flex items-center gap-2 sm:gap-3 w-full text-[11px] text-zinc-400 font-mono">
            <span className="w-9 text-right">{formatTime(isSeeking ? seekVal : currentTime)}</span>
            <div className="relative flex-1 flex items-center group py-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={isSeeking ? seekVal : currentTime}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
                }}
              />
            </div>
            <span className="w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Drawer Toggles */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/4 min-w-[120px] max-w-[240px]">
          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1 text-zinc-400 hover:text-white transition cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 lg:w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 ${
                  isMuted ? 0 : volume
                }%, rgba(255,255,255,0.15) ${isMuted ? 0 : volume}%)`,
              }}
            />
          </div>

          {/* Queue Drawer Button */}
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isQueueOpen
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Expand Modal View */}
          <button
            onClick={() => setIsExpandedNowPlaying(true)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition cursor-pointer"
            title="Full Screen / Expanded Player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
