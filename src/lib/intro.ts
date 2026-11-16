import { useSyncExternalStore } from "react";

/**
 * Shared state between the intro overlay and the Hero.
 *
 * pending  → not decided yet (also the server-rendered state)
 * playing  → the intro is running; the Hero waits underneath
 * handoff  → the intro is fading out and the Hero animates in
 * done     → the intro is gone, or was skipped
 */
export type IntroPhase = "pending" | "playing" | "handoff" | "done";

export interface IntroState {
  phase: IntroPhase;
  /** The intro is animating the headline, so the Hero skips its own entrance for it. */
  headlineFromIntro?: boolean;
  /**
   * The Source cards are flying into the stats and the honours line, so the
   * Hero skips their entrances. False on phones, where there are no cards.
   */
  targetsFromIntro?: boolean;
}

const SERVER_STATE: IntroState = { phase: "pending" };

let state: IntroState = SERVER_STATE;
const listeners = new Set<() => void>();

export const introStore = {
  get: () => state,
  set(next: Partial<IntroState>) {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useIntro() {
  return useSyncExternalStore(
    introStore.subscribe,
    introStore.get,
    () => SERVER_STATE,
  );
}
