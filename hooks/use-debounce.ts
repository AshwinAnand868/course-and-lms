import { useEffect, useState } from "react";

// This hook will be used to not to exhaust the database with 
// the every key stroke that the user does to query for the 
// courses - prevent calls to database for at least delay ms
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // unmount function - when the component is unmounted
    return () => {
        clearTimeout(timer);
    }
  }, [value, delay]);

  return debouncedValue;
}
