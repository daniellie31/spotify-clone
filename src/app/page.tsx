"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PlayerProvider } from "@/context/PlayerContext";
import { PlaylistProvider, usePlaylists } from "@/context/PlaylistContext";
import { Navbar } from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SearchView } from "@/components/search/SearchView";
import { PlaylistView } from "@/components/playlist/PlaylistView";
import { PlayerBar } from "@/components/player/PlayerBar";
import { YouTubePlayer } from "@/components/player/YouTubePlayer";
import { NowPlayingModal } from "@/components/player/NowPlayingModal";
import { QueueDrawer } from "@/components/player/QueueDrawer";
import { CreatePlaylistModal } from "@/components/playlist/CreatePlaylistModal";
import { Toast } from "@/components/ui/Toast";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";

function MainApp() {
  const [activeView, setActiveView] = useState<"dashboard" | "search" | "library" | "playlist">(
    "dashboard"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { setActivePlaylistId } = usePlaylists();

  const handleNavigate = (view: "dashboard" | "search" | "library" | "playlist") => {
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  };

  const handlePlaylistCreated = (id: string) => {
    setActivePlaylistId(id);
    setActiveView("playlist");
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Top Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        activeView={activeView}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Container: Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            activeView={activeView}
            onNavigate={handleNavigate}
            openCreateModal={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Mobile Sidebar Slide-over Drawer */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative z-10 w-72 bg-zinc-950 border-r border-zinc-800 h-full flex flex-col justify-between"
              >
                <div className="p-4 flex items-center justify-between border-b border-zinc-800">
                  <span className="text-sm font-bold text-white">Menu & Playlists</span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <Sidebar
                    activeView={activeView}
                    onNavigate={handleNavigate}
                    openCreateModal={() => {
                      setIsMobileSidebarOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Views */}
        <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          {activeView === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
          {activeView === "search" && <SearchView />}
          {activeView === "playlist" && <PlaylistView />}
          {activeView === "library" && <Dashboard onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Persistent Bottom Player Controls */}
      <PlayerBar />

      {/* Background/Embedded YouTube Stream Handler */}
      <YouTubePlayer />

      {/* Expanded Now Playing View (Modal / Turntable) */}
      <NowPlayingModal />

      {/* Slide-out Queue Drawer */}
      <QueueDrawer />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handlePlaylistCreated}
      />

      {/* Toast Feedback */}
      <Toast />

      {/* Keyboard Shortcuts Cheatsheet */}
      <KeyboardShortcutsModal />
    </div>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <PlaylistProvider>
        <MainApp />
      </PlaylistProvider>
    </PlayerProvider>
  );
}
