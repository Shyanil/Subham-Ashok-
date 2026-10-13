/**
 * Mutable, per-frame runtime values shared by the DOM layer and the WebGL layer.
 * Kept outside React on purpose: these change every frame.
 */
export const runtime = {
  /** Pointer in normalised device coords (-1..1), y up. */
  pointer: { x: 0, y: 0 },
  /** Smoothed scroll velocity, roughly -1..1 (written by the canvas from velocityTarget). */
  velocity: 0,
  /** Raw scroll velocity from Lenis, normalised. */
  velocityTarget: 0,
  /** Perspective chapter: 0..1 progress across the section, `active` while in view. */
  perspective: { progress: 0, active: false },
  /** Hero pin progress (drives ambient gold motes). */
  hero: { progress: 0, active: true },
  /** Contact chapter: drives the 3D crystal, drawn inside the `el` box (layout-anchored). */
  footer: { progress: 0, active: false, el: null as HTMLElement | null },
};


/**
 * Frame scheduler for the persistent canvas. The canvas runs with
 * frameloop="demand"; the GSAP ticker asks `needsFrame()` once per tick and
 * advances the renderer only when something on screen needs it:
 *  - full rate while scrolling / pointer moving / transitions / 3D chapters
 *  - ~20fps for idle ambient motion when only photo planes are on screen
 *  - nothing at all when no plane or scene is visible
 */
const inView = new Set<string>();
let pending = 0;
let lastActivity = 0;
let tick = 0;
const IDLE_MS = 1200;

const sceneActive = () => runtime.perspective.active || runtime.footer.active;

export const scheduler = {
  setInView(id: string, visible: boolean) {
    if (visible) inView.add(id);
    else inView.delete(id);
    pending = Math.max(pending, 3);
  },
  /** Request a few more frames (scroll, pointer, state change). */
  bump(frames = 2) {
    pending = Math.max(pending, frames);
    lastActivity = performance.now();
  },
  needsFrame() {
    tick++;
    if (pending > 0) {
      pending--;
      return true;
    }
    if (sceneActive()) return true;
    if (inView.size > 0 || runtime.hero.active) {
      if (performance.now() - lastActivity < IDLE_MS) return true;
      return tick % 3 === 0;
    }
    return false;
  },
  get busy() {
    return inView.size > 0 || sceneActive() || runtime.hero.active;
  },
};
