import { useEffect } from "react";

export function useDebounceEffect<S>(state: S, fn: (arg: S) => void, timeout: number) {
  useEffect(() => {
    const timer = setTimeout(() => fn(state), timeout);
    return () => clearTimeout(timer);
  }, [state, fn]);
}
