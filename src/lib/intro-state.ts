"use client";

import { useEffect, useState } from "react";

/**
 * Tiny signal for "the intro overlay has finished".
 *
 * The hero reveal used to start on mount, which is the same moment the intro
 * overlay covers the screen — so the animation played behind it and the headline
 * was already settled by the time the overlay cleared. Anything that should be
 * watched rather than merely happen waits on this instead of on mount.
 */

let done = false;
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

export function useIntroDone(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    if (done) {
      setValue(true);
      return;
    }

    const listener = () => setValue(true);
    listeners.add(listener);
    const timer = window.setTimeout(markIntroDone, SAFETY_MS);

    return () => {
      listeners.delete(listener);
      window.clearTimeout(timer);
    };
  }, []);

  return value;
}
