'use client';

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') ?? c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/** Auto-run 3D only when: deviceMemory ≥ 4 (where reported), ≥ 4 cores, no Save-Data, no reduced motion, WebGL. */
export function capable3d() {
  const n = navigator as Nav;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (n.connection?.saveData) return false;
  if (n.deviceMemory !== undefined && n.deviceMemory < 4) return false;
  if ((n.hardwareConcurrency ?? 0) < 4) return false;
  return hasWebGL();
}
