'use client';

import { useEffect } from 'react';
import { useGLStatus } from '@/lib/store';

function detect() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    // Software rasterisers (SwiftShader, llvmpipe) can't run the shaders at a usable frame rate.
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
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
