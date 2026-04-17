import { useState, useEffect } from "react";

/**
 * useDebounce — delays propagating a value until it stops changing.
 * Used to prevent a new API call on every keystroke in range inputs.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
