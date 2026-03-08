"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[ForgeCost SW] Registered:", reg.scope);

          // Check for updates every 60 minutes
          setInterval(() => reg.update(), 60 * 60 * 1000);
        })
        .catch((err) => {
          console.error("[ForgeCost SW] Registration failed:", err);
        });
    });
  }, []);

  return null;
}