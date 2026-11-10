"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Video, X } from "lucide-react";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: unknown }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => unknown;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function YouTubePlayer() {
  const {
    currentSong,
    setPlayerInstance,
    onPlayerStateChange,
    onPlayerDurationChange,
    isVideoMode,
    toggleVideoMode,
  } = usePlayer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerId = "youtube-iframe-player";

  useEffect(() => {
    // 1. Inject YouTube IFrame API if not already added
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    function initPlayer() {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player(containerId, {
          videoId: currentSong?.id || "4NRXx6U8ABQ",
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 0,
            fs: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          },
          events: {
            onReady: (event: { target: unknown }) => {
              setPlayerInstance(event.target);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const d = (event.target as any).getDuration();
              if (d) onPlayerDurationChange(d);
            },
            onStateChange: (event: { data: number }) => {
              onPlayerStateChange(event.data);
            },
            onError: (err: { data: number }) => {
              console.warn("YouTube Player error:", err.data);
            },
          },
        });
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }
  }, [currentSong?.id, onPlayerDurationChange, onPlayerStateChange, setPlayerInstance]);

  return (
    <>
      {/* Floating Video Mode Container */}
      <div
        className={`fixed z-40 transition-all duration-300 ${
          isVideoMode
            ? "bottom-24 right-6 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700 bg-zinc-950 p-2"
            : "fixed -left-[9999px] -top-[9999px] w-[200px] h-[200px] opacity-0 pointer-events-none"
        }`}
      >
        {isVideoMode && (
          <div className="flex items-center justify-between px-2 py-1.5 mb-1.5 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-white truncate max-w-[200px]">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              {currentSong?.title}
            </span>
            <button
              onClick={toggleVideoMode}
              className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              title="Close video view"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className={`relative w-full ${isVideoMode ? "aspect-video rounded-xl overflow-hidden" : ""}`}>
          <div id={containerId} className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
