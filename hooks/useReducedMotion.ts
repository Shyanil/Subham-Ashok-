'use client';

import { useMotion } from '@/lib/store';

/** true when the user enabled "Reduce animations" or the OS prefers reduced motion. */
export const useReducedMotion = () => useMotion((s) => s.reduced);
