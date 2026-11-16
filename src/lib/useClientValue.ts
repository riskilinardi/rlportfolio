import { useSyncExternalStore } from "react";

const subscribeNothing = () => () => {};

/**
 * A value that only exists in the browser (the URL, the platform). Returns
 * `serverValue` during server rendering and hydration, so the markup matches.
 */
export function useClientValue<T>(getValue: () => T, serverValue: T) {
  return useSyncExternalStore(subscribeNothing, getValue, () => serverValue);
}
