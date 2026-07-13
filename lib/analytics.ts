"use client";

/**
 * Shared event-tracking helper. Fires to both GA4 and Vercel Analytics
 * together so the two tools never silently drift apart again.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("sign_up", { method: "email", product: "vetsai" });
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    va?: (event: string, name: string, data?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // GA4
  try {
    window.gtag?.("event", name, params);
  } catch (e) {
    console.error("GA4 trackEvent failed:", e);
  }

  // Vercel Analytics (custom events use their own naming convention:
  // Title Case, no underscores, per Vercel's convention)
  try {
    window.va?.("event", toVercelEventName(name), params);
  } catch (e) {
    console.error("Vercel trackEvent failed:", e);
  }
}

function toVercelEventName(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
