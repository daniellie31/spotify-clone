"use client";

import { useState } from "react";
import { Search, Link as LinkIcon, Radio, Loader2, Play, Menu } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { AdBlockBadge } from "./AdBlockBadge";
import { extractYouTubeId } from "@/lib/utils";

interface NavbarProps {
  onNavigate: (view: "dashboard" | "search" | "library") => void;
  activeView: string;
  onOpenMobileSidebar?: () => void;
}

export function Navbar({ onNavigate, activeView, onOpenMobileSidebar }: NavbarProps) {
  const { playFromYouTubeUrl, isLoading } = usePlayer();
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState(false);

  const handleQuickPlay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const vid = extractYouTubeId(urlInput);
    if (!vid) {
      setUrlError(true);
      setTimeout(() => setUrlError(false), 2500);
      return;
    }

    const success = await playFromYouTubeUrl(urlInput);
    if (success) {
      setUrlInput("");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-zinc-800/80 bg-zinc-950/80 px-3 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition"
          title="Open Library & Playlists"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Wavefy
            </span>
          </div>
        </div>

        {/* Center: Paste any YouTube URL or Search Quick Input */}
        <div className="flex-1 max-w-xl mx-1 sm:mx-2">
          <form onSubmit={handleQuickPlay} className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400">
              <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500/80" />
            </div>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste any YouTube URL or ID to play..."
              className={`w-full h-9 sm:h-10 pl-8 sm:pl-10 pr-16 sm:pr-24 text-xs sm:text-sm rounded-full bg-zinc-900/90 text-zinc-200 placeholder:text-zinc-500 border transition-all duration-200 focus:outline-none focus:ring-1 ${
                urlError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-zinc-800 focus:border-emerald-500/60 focus:ring-emerald-500/40"
              }`}
            />

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="absolute right-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-zinc-950 flex items-center gap-1 sm:gap-1.5 transition cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>
          </form>

          {urlError && (
            <p className="absolute mt-1 text-[11px] text-red-400 pl-3">
              Please enter a valid YouTube link (e.g. youtube.com/watch?v=... or youtu.be/...)
            </p>
          )}
        </div>

        {/* Right: Adblock / Extension Status & Search Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => onNavigate("search")}
            className={`p-2 rounded-full border transition ${
              activeView === "search"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
            }`}
            title="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <AdBlockBadge />
        </div>
      </div>
    </header>
  );
}
