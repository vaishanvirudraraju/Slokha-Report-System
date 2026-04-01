"use client";

import { useEffect } from "react";

function isAppleMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    /* iOS: only register in standalone (home screen); Safari tab has no install UI */
    if (isAppleMobile() && !isStandaloneDisplay()) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
