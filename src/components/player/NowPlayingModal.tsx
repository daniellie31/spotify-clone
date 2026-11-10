"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Disc3,
  Video,
  ListMusic,
  ExternalLink,
  Moon,
  Keyboard,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { formatTime } from "@/lib/utils";

export function NowPlayingModal() {
  const {
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
    isExpandedNowPlaying,
    setIsExpandedNowPlaying,
    togglePlay,
    seekTo,
    nextSong,
    prevSong,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    playSong,
    toggleVideoMode,
    isVideoMode,
    playbackRate,
    setPlaybackRate,
    sleepTimerMinutes,
    sleepTimerRemaining,
    setSleepTimer,
    setIsShortcutsOpen,
  } = usePlayer();

  const { isFavorite, toggleFavorite } = usePlaylists();
  const [showSleepMenu, setShowSleepMenu] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpandedNowPlaying) {
        setIsExpandedNowPlaying(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpandedNowPlaying, setIsExpandedNowPlaying]);

  if (!currentSong || !isExpandedNowPlaying) return null;

  const isLiked = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const upNextQueue = queue.slice(queueIndex + 1, queueIndex + 6);

  const speedOptions = [0.75, 1, 1.25, 1.5, 2];
  const sleepOptions = [
    { label: "Off", value: null },
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl glass-panel bg-zinc-950/90 border border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Ambient background glow */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Bar: Header & Actions */}
          <div className="flex items-center justify-between z-10 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Disc3 className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              Now Playing
            </div>

            <div className="flex items-center gap-2">
              {/* Speed Pills */}
              <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition ${
                      playbackRate === rate
                        ? "bg-emerald-500 text-zinc-950"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Sleep Timer */}
              <div className="relative">
                <button
                  onClick={() => setShowSleepMenu(!showSleepMenu)}
                  className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs ${
                    sleepTimerRemaining !== null
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-semibold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                  title="Sleep Timer"
                >
                  <Moon className="w-3.5 h-3.5" />
                  {sleepTimerRemaining !== null && (
                    <span>{Math.ceil(sleepTimerRemaining / 60)}m</span>
                  )}
                </button>

                {showSleepMenu && (
                  <div className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1 z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-500">
                      Sleep Timer
                    </div>
                    {sleepOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setSleepTimer(opt.value);
                          setShowSleepMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                          sleepTimerMinutes === opt.value
                            ? "bg-emerald-500 text-zinc-950 font-bold"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Shortcuts trigger */}
              <button
                onClick={() => setIsShortcutsOpen(true)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpandedNowPlaying(false)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Grid: Vinyl / Cover Art + Track Info + Up Next */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 my-auto">
            {/* Left: Vinyl & Album Art */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <div className="relative group w-56 h-56 sm:w-72 sm:h-72">
                {/* Vinyl Record Behind Cover Art */}
                <div
                  className={`absolute -right-4 -top-4 w-full h-full rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-700 ${
                    isPlaying ? "animate-spin-slow" : "animate-spin-slow paused"
                  }`}
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #18181b 30%, #27272a 31%, #18181b 32%, #27272a 60%, #18181b 61%, #09090b 100%)",
                  }}
                >
                  <div className="w-20 h-20 rounded-full border border-zinc-700/50 bg-emerald-950/80 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800" />
                  </div>
                </div>

                {/* Album Cover Card */}
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSong.thumbnail}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Live Audio Equalizer Waveform Animation */}
              <div className="flex items-center gap-1 mt-6 h-6">
                {[40, 75, 90, 60, 30, 85, 100, 45, 80, 65, 95, 35, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isPlaying ? [`${Math.max(15, h * 0.2)}%`, `${h}%`, "20%"] : "20%",
                    }}
                    transition={{
                      duration: 0.6 + (i % 3) * 0.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Right: Metadata, Controls, & Up Next */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {currentSong.category || "YouTube Track"}
                  </span>

                  <a
                    href={currentSong.url || `https://www.youtube.com/watch?v=${currentSong.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
                  >
                    Watch on YT <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight line-clamp-2">
                  {currentSong.title}
                </h2>
                <p className="text-sm text-zinc-400 mt-1">{currentSong.artist}</p>
              </div>

              {/* Progress & Duration */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-zinc-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Expanded Controls Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleFavorite(currentSong)}
                  className={`p-2.5 rounded-full border transition cursor-pointer ${
                    isLiked
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                  title="Like Song"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 rounded-full transition cursor-pointer ${
                      shuffle ? "text-emerald-400" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>

                  <button
                    onClick={prevSong}
                    className="p-2 text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    <SkipBack className="w-6 h-6 fill-current" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </button>

                  <button
                    onClick={nextSong}
                    className="p-2 text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    <SkipForward className="w-6 h-6 fill-current" />
                  </button>

                  <button
                    onClick={cycleRepeatMode}
                    className={`p-2 rounded-full transition cursor-pointer ${
                      repeatMode !== "off" ? "text-emerald-400" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {repeatMode === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  onClick={toggleVideoMode}
                  className={`p-2.5 rounded-full border transition cursor-pointer ${
                    isVideoMode
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                  title={isVideoMode ? "Hide Video Preview" : "Show Video Preview"}
                >
                  <Video className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 ${
                      isMuted ? 0 : volume
                    }%, rgba(255,255,255,0.15) ${isMuted ? 0 : volume}%)`,
                  }}
                />
              </div>

              {/* Up Next Mini Preview */}
              {upNextQueue.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <ListMusic className="w-3.5 h-3.5" /> Up Next
                    </span>
                    <span className="text-[11px] lowercase text-zinc-500 font-normal">
                      {upNextQueue.length} remaining
                    </span>
                  </div>

                  <div className="space-y-1">
                    {upNextQueue.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => playSong(item)}
                        className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 transition cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="truncate">
                            <div className="text-white font-medium truncate">{item.title}</div>
                            <div className="text-[11px] text-zinc-400 truncate">{item.artist}</div>
                          </div>
                        </div>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {formatTime(item.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
