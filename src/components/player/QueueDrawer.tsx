"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Play, ListMusic, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";

export function QueueDrawer() {
  const {
    queue,
    queueIndex,
    currentSong,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playSong,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between p-6 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Play Queue</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {queue.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {queue.length > 1 && (
                <button
                  onClick={clearQueue}
                  className="text-xs text-zinc-400 hover:text-red-400 transition cursor-pointer px-2 py-1 rounded hover:bg-zinc-900"
                >
                  Clear Queue
                </button>
              )}
              <button
                onClick={() => setIsQueueOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Queue List Scroll Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Currently Playing Track */}
            {currentSong && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-2 block">
                  Now Playing
                </span>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                  <div className="flex items-center gap-3 truncate">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSong.thumbnail}
                        alt={currentSong.title}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 h-3 bg-emerald-400 animate-pulse"></span>
                            <span className="w-0.5 h-2 bg-emerald-400 animate-pulse"></span>
                            <span className="w-0.5 h-3.5 bg-emerald-400 animate-pulse"></span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="truncate">
                      <div className="text-sm font-semibold text-white truncate">{currentSong.title}</div>
                      <div className="text-xs text-zinc-400 truncate">{currentSong.artist}</div>
                    </div>
                  </div>

                  <span className="text-xs text-zinc-400 font-mono ml-2">
                    {formatTime(currentSong.duration)}
                  </span>
                </div>
              </div>
            )}

            {/* Next in Queue */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Up Next ({Math.max(0, queue.length - 1)})
              </span>

              {queue.length <= 1 ? (
                <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                  Your queue is empty. Add songs from Search or Playlists to keep the music flowing!
                </div>
              ) : (
                <div className="space-y-1.5">
                  {queue.map((song, idx) => {
                    if (song.id === currentSong?.id && idx === queueIndex) return null;

                    return (
                      <div
                        key={`${song.id}-${idx}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition"
                      >
                        <div
                          onClick={() => playSong(song)}
                          className="flex items-center gap-3 truncate flex-1 cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="truncate">
                            <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                              {song.title}
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate">{song.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 font-mono">
                            {formatTime(song.duration)}
                          </span>
                          <button
                            onClick={() => removeFromQueue(idx)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                            title="Remove from queue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 text-center">
            <p className="text-[11px] text-zinc-500">
              Streams seamlessly in the background with ad blocker support.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
