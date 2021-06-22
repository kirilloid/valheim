import { useEffect, useRef } from "react";

export function useThrottleEffect<S>(state: S, fn: (arg: S) => void, timeout: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
    if (timerRef.current == null) {
      timerRef.current = setTimeout(() => {
        fn(stateRef.current);
        timerRef.current = undefined;
      }, timeout);
    }
    return () => timerRef.current != null ? clearTimeout(timerRef.current) : void 0;
  }, [state]);
}
