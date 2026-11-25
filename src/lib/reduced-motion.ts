"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** For effects and event handlers, which only ever run on the client. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(QUERY).matches;
}

function subscribe(listener: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

/**
 * The visitor's reduced-motion setting, live. The server snapshot is false, so
 * hydration renders the animated tree exactly as the server did and the static
 * branch takes over on the next read — no hydration mismatch, and a change in
 * the OS setting applies without a reload.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
