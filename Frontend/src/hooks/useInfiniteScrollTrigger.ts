import { useEffect, useRef } from "react";

type UseInfiniteScrollTriggerParams = {
  onIntersect: () => void;
  enabled: boolean;
};

/**
 * Renvoie un ref à placer sur un élément "sentinelle" en bas de la liste.
 * Quand cette sentinelle devient visible, onIntersect() est appelé
 * (typiquement fetchNextPage() de TanStack Query).
 */
export function useInfiniteScrollTrigger({
  onIntersect,
  enabled,
}: UseInfiniteScrollTriggerParams) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: "400px" } // on déclenche un peu avant que l'utilisateur atteigne le bas
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
