import { useEffect, useEffectEvent } from "react";

export function useDebounce<T>(value: T, fn: () => void, delay: number) {
  const handleFn = useEffectEvent(() => {
    const timeout = setTimeout(() => {
      fn();
    }, delay);

    return timeout;
  });

  useEffect(() => {
    const timeout = handleFn();

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);
}
