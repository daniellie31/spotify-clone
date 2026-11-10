import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wavefy - Minimalist YouTube & Music Player",
  description: "Ad-free personal music player powered by YouTube with instant URL playback, playlists, and recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
