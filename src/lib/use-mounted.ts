"use client";

import { useSyncExternalStore } from "react";

/**
 * True only after hydration. Gate any render output that depends on
 * client-only state (matchMedia, dimensions) behind this so the first client
 * render is byte-identical to the server HTML — otherwise React reports a
 * hydration mismatch and throws the server DOM away.
 *
 * useSyncExternalStore is the hydration-safe mount signal: the server snapshot
 * (false) is what hydration renders, and the client snapshot (true) takes over
 * on the immediately following read — no effect, no cascading setState.
 */
const subscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
