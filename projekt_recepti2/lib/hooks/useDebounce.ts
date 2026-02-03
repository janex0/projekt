import { useEffect, useState } from "react";

/**
 * Custom hook za debounce funkcionalnost
 * Zamuja posodobitev vrednosti za določeno število milisekund
 * @param value - Vrednost za debounce
 * @param delay - Zamuda v milisekundah
 * @returns Debounced vrednost
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}