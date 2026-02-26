import { useState, useEffect, useCallback } from 'react';

export function useDraftState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setStateInternal] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch {
      // ignore parse errors
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [key, state]);

  const setState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStateInternal((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        return next;
      });
    },
    []
  );

  const clearDraft = useCallback(() => {
    localStorage.removeItem(key);
    setStateInternal(initialValue);
  }, [key, initialValue]);

  return [state, setState, clearDraft];
}
