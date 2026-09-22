"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny signal for "the intro overlay has finished".
 *
 * The hero reveal used to start on mount, which is the same moment the intro
 * overlay covers the screen — so the animation played behind it and the headline
 * was already settled by the time the overlay cleared. Anything that should be
 * watched rather than merely happen waits on this instead of on mount.
 */
let done = false;
let armed = false;
const listeners = new Set<() => void>();

/** Fallback so the page is never left waiting on an overlay that never mounted. */
const SAFETY_MS = 2500;

export function markIntroDone() {
  if (done) {
    return;
  }
  done = true;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Armed by the first subscriber so the timer cannot run during SSR.
  if (!armed) {
    armed = true;
    window.setTimeout(markIntroDone, SAFETY_MS);
  }
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroDone(): boolean {
  // Server snapshot false keeps hydration identical; subscribers are notified
  // when the loader calls markIntroDone.
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
