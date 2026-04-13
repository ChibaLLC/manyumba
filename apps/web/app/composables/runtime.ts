import type { WatchSource } from "vue";

export function isWatchable<T extends WatchSource>(value: any): value is T {
  if (value == null) return false;

  // getter function
  if (typeof value === "function") return true;

  // ref
  if (isRef(value)) return true;

  // reactive object
  if (isReactive(value)) return true;

  // arrays of valid sources (watch supports this)
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isWatchable);
  }

  return false;
}