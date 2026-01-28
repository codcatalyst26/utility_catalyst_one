import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (
      state === null ||
      state === undefined ||
      (typeof state === "string" && !state.trim())
    ) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] as const;
}
