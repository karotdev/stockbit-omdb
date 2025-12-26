import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps<T extends Element> {
  target: React.RefObject<T | null>;
  onIntersect: () => void;
  enabled?: boolean;
}

export function useIntersectionObserver<T extends Element>({
  target,
  onIntersect,
  enabled = true,
}: UseIntersectionObserverProps<T>) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    });

    if (target.current) {
      observerRef.current.observe(target.current);
    }

    return () => observerRef.current?.disconnect();
  }, [target, onIntersect, enabled]);
}
