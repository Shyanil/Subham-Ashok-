'use client';

import { useTexture } from '@react-three/drei';
import type { Texture } from 'three';

/**
 * Reference counting for textures shared between planes (useTexture caches by URL).
 * When the last plane releases a texture it is disposed from the GPU and evicted
 * from the loader cache after a short grace period, so scrolling back and forth
 * does not thrash uploads.
 */
const refs = new Map<string, number>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const GRACE_MS = 4000;

export function retainTexture(url: string) {
  clearTimeout(timers.get(url));
  timers.delete(url);
  refs.set(url, (refs.get(url) ?? 0) + 1);
}

export function releaseTexture(url: string, texture: Texture) {
  const n = (refs.get(url) ?? 1) - 1;
  refs.set(url, n);
  if (n > 0) return;
  timers.set(
    url,
    setTimeout(() => {
      if ((refs.get(url) ?? 0) > 0) return;
      texture.dispose();
      useTexture.clear(url);
      refs.delete(url);
      timers.delete(url);
    }, GRACE_MS),
  );
}
