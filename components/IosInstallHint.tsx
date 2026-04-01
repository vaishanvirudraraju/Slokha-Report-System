"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sloka-ios-install-hint-dismissed";

function isAppleMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPhone|iPad|iPod/.test(ua);
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mode = window.matchMedia("(display-mode: standalone)").matches;
  const legacy = (
    navigator as Navigator & { standalone?: boolean }
  ).standalone;
  return mode || legacy === true;
}

export function IosInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isAppleMobile() || isStandaloneDisplay()) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setShow(true);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="border-b border-[#004d40]/15 bg-[#004d40] px-4 py-3 text-white shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm leading-snug text-white/95">
          <strong className="font-bold text-[#f9c200]">Install on iPhone &amp; iPad:</strong>{" "}
          tap{" "}
          <span className="inline-flex items-center gap-0.5 font-semibold text-white">
            <ShareIcon className="inline size-4 text-[#f9c200]" />
            Share
          </span>
          , then{" "}
          <span className="font-semibold text-[#f9c200]">Add to Home Screen</span>
          . Opens like an app with no address bar.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 self-start rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/20 sm:self-center"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}
