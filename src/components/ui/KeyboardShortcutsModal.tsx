"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Command } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export function KeyboardShortcutsModal() {
  const { isShortcutsOpen, setIsShortcutsOpen } = usePlayer();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: "Space", desc: "Play or Pause" },
    { key: "← / →", desc: "Seek backward or forward 5s" },
    { key: "↑ / ↓", desc: "Volume up or down 5%" },
    { key: "M", desc: "Mute or unmute audio" },
    { key: "F", desc: "Toggle full-screen Now Playing view" },
    { key: "S", desc: "Toggle shuffle mode" },
    { key: "R", desc: "Cycle repeat (Off → All → One)" },
    { key: "?", desc: "Toggle this keyboard shortcuts cheatsheet" },
    { key: "Esc", desc: "Close any open dialog or modal" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md p-6 rounded-3xl glass-panel bg-zinc-950/95 border border-zinc-800 shadow-2xl"
        >
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-zinc-400">Streamline your listening experience</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {shortcuts.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-xs"
              >
                <span className="text-zinc-300">{item.desc}</span>
                <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] font-semibold text-emerald-400 shadow-sm">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsShortcutsOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition"
            >
              Close (Esc)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
