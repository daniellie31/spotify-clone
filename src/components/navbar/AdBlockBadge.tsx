"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Sparkles, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdBlockBadge() {
  const [adBlockStatus, setAdBlockStatus] = useState<"checking" | "brave" | "adblock" | "none">("checking");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdBlock() {
      // 1. Check for Brave Browser
      try {
        if ((navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } }).brave?.isBrave) {
          const isBrave = await (navigator as unknown as { brave: { isBrave: () => Promise<boolean> } }).brave.isBrave();
          if (isBrave && isMounted) {
            setAdBlockStatus("brave");
            return;
          }
        }
      } catch {
        // continue
      }

      // 2. Check for Adblock extension (DOM bait check + fetch bait)
      try {
        const bait = document.createElement("div");
        bait.className = "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ad-links";
        bait.style.position = "absolute";
        bait.style.left = "-9999px";
        bait.style.top = "-9999px";
        bait.style.width = "1px";
        bait.style.height = "1px";
        document.body.appendChild(bait);

        const isHidden = window.getComputedStyle(bait).display === "none" || bait.offsetParent === null;
        document.body.removeChild(bait);

        if (isHidden && isMounted) {
          setAdBlockStatus("adblock");
          return;
        }

        // Network probe
        const probe = await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
          method: "HEAD",
          mode: "no-cors",
        }).catch(() => null);

        if (!probe && isMounted) {
          setAdBlockStatus("adblock");
          return;
        }
      } catch {
        if (isMounted) {
          setAdBlockStatus("adblock");
          return;
        }
      }

      if (isMounted) {
        setAdBlockStatus("none");
      }
    }

    checkAdBlock();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border cursor-pointer select-none bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 border-zinc-800 hover:border-zinc-700"
      >
        {adBlockStatus === "brave" && (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline text-orange-300">Brave Shields:</span>
            <span className="font-semibold text-white">Ad-Free Mode</span>
          </>
        )}

        {adBlockStatus === "adblock" && (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-emerald-300">AdBlock:</span>
            <span className="font-semibold text-white">Freemium Active</span>
          </>
        )}

        {adBlockStatus === "none" && (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-zinc-400">Ad Status:</span>
            <span className="text-zinc-200 group-hover:text-amber-300 transition-colors">Standard</span>
          </>
        )}

        {adBlockStatus === "checking" && (
          <span className="text-zinc-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span>
            Checking shield...
          </span>
        )}
      </button>

      {/* Info Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-2xl glass-panel bg-zinc-900/95 border border-zinc-700/60 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Browser Shield & AdBlock</h3>
                  <p className="text-xs text-zinc-400">Ad-Free Personal Music Player</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed mb-6">
                <p>
                  Because this player streams directly through the official embedded YouTube engine inside your browser,
                  <strong className="text-white"> your browser extensions control the ad experience!</strong>
                </p>

                <div className="p-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700/40 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">🦁 Brave:</span>
                    <span className="text-xs text-zinc-300">
                      Brave Shields blocks YouTube video ads out-of-the-box by default.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">🛡️ Chrome / Edge / Firefox:</span>
                    <span className="text-xs text-zinc-300">
                      Install extensions like <strong>uBlock Origin</strong> or <strong>AdGuard</strong> to enjoy 100% ad-free playback without paid subscriptions.
                    </span>
                  </div>
                </div>

                <div className="text-xs text-zinc-400">
                  Current Status:{" "}
                  {adBlockStatus === "brave" && (
                    <span className="text-orange-400 font-semibold">🦁 Brave Shields detected! Zero ads.</span>
                  )}
                  {adBlockStatus === "adblock" && (
                    <span className="text-emerald-400 font-semibold">🛡️ AdBlock extension active! Zero ads.</span>
                  )}
                  {adBlockStatus === "none" && (
                    <span className="text-amber-400 font-semibold">
                      Standard mode (no ad blocker detected). We recommend using Brave or installing uBlock Origin.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition cursor-pointer"
                >
                  Got it, Let&apos;s Listen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
