import { useSyncExternalStore } from "react";
import { useClientValue } from "@/lib/useClientValue";

/** Whether the Ask my portfolio panel is open, shared by the nav button and the panel. */
let open = false;
const listeners = new Set<() => void>();

export const askStore = {
  get: () => open,
  set(next: boolean) {
    open = next;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useAskOpen() {
  return useSyncExternalStore(askStore.subscribe, askStore.get, () => false);
}

/** "⌘K" on Apple devices, "Ctrl K" elsewhere. */
export function useShortcutLabel() {
  return useClientValue(
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    "⌘K",
  );
}
