# Wavefy 🎵 - Minimalist Ad-Free YouTube & Music Streaming Web App

A clean, modern, anti-slop YouTube Music / Spotify clone built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

Designed to stream any YouTube link or search query with zero audio interruptions, native dark mode, and seamless integration with browser ad blockers (like Brave Shields or uBlock Origin in Chrome/Firefox).

---

## ✨ Features

- **⚡ Instant YouTube URL Streaming**:
  - Paste any YouTube URL (`youtube.com/watch?v=...`, `youtu.be/...`, `music.youtube.com/...`, shorts, or video ID) directly in the top bar to play immediately.
- **🛡️ Browser Extension & Shield Detection**:
  - Automatically detects whether Brave Shields or an adblock extension (uBlock Origin, AdGuard, etc.) is active.
  - Displays a live glowing status badge (*"🦁 Brave Shields: Ad-Free Mode"* or *"🛡️ AdBlock: Freemium Active"*).
  - Because it streams through the browser's embedded player, video and audio ads are filtered directly at the browser level—no paid subscription required!
- **🎨 Anti-Slop, Clean Minimalist UI**:
  - Deep obsidian dark theme (`#090a0f`), glassmorphism panels, and subtle emerald accents.
  - Responsive across mobile, tablet, and desktop with a slide-over navigation drawer.
- **🎧 Expanded "Now Playing" View**:
  - Rotating vinyl turntable animation synced to playback state.
  - Live animated equalizer waveform visualization.
  - Video toggle button (PiP preview mode) if you want to watch the music video.
- **🔍 YouTube Search & Suggestions**:
  - Fast live search with quick suggestion chips.
  - Searches YouTube results and local curated tracks.
- **📑 Playlists & Library**:
  - Create, rename, and manage custom playlists.
  - Liked Songs / Favorites with 1-click heart toggle.
  - LocalStorage persistence so your playlists are always saved.
- **🎛️ Full Audio Controls**:
  - Shuffle, loop (repeat one / repeat all / off), seekbar with hover time tooltip, and volume slider.
  - Play Queue drawer with reordering and removal.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```
