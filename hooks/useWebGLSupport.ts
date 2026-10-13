'use client';

import { useEffect } from 'react';
import { useGLStatus } from '@/lib/store';

function detect() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Detects WebGL once on the client; adds `no-webgl` to <html> for the CSS fallback. */
export function useWebGLSupport() {
  const supported = useGLStatus((s) => s.supported);
  const setSupported = useGLStatus((s) => s.setSupported);
  useEffect(() => {
    if (supported !== null) return;
    const ok = detect();
    document.documentElement.classList.toggle('no-webgl', !ok);
    setSupported(ok);
  }, [supported, setSupported]);
  return supported;
}
