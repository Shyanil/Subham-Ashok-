'use client';

import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
