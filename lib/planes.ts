'use client';

import { create } from 'zustand';
import type { MediaItem } from './media';
import { scheduler } from './runtime';

/**
 * A "plane slot" is a DOM element that owns one or more photos. The DOM renders
 * next/image as an accessible fallback; when WebGL is live, the persistent canvas
 * draws a shader plane exactly over the slot's bounding box and the DOM image
 * fades out once the GPU frame is ready.
 */
export type PlaneOptions = {
  /** 'step' = ripple transition between images by index, 'mix' = scrubbed cross-dissolve of images[0] → images[1]. */
  mode: 'step' | 'mix';
  /** Corner radius in CSS px (framed planes). */
  radius: number;
  /** Base darkening 0..1. */
  dim: number;
  /** Light-refraction overlay strength 0..1. */
  refract: number;
  /** Depth-map displacement strength (mouse parallax). 0 disables depth maps. */
  depth: number;
  /** Mesh tilt toward the pointer (framed planes only). */
  tilt: boolean;
  /** World-space z. Negative values sit deeper; size is compensated so the plane still matches the DOM box. */
  z: number;
};

export const defaultPlaneOptions: PlaneOptions = {
  mode: 'step',
  radius: 0,
  dim: 0,
  refract: 0,
  depth: 0.018,
  tilt: false,
  z: 0,
};

export type PlaneValues = { mix: number; zoom: number; hover: number; dim: number; alpha: number; radius: number; /** 0..1 runtime tilt amount (adds to opts.tilt). */ tilt: number };

export type PlaneController = {
  values: PlaneValues;
  el: HTMLElement | null;
  /** Update values; mirrors them to CSS custom properties so the DOM fallback animates too. */
  set(v: Partial<PlaneValues>): void;
};

export function createPlaneController(initial: Partial<PlaneValues> = {}): PlaneController {
  const ctrl: PlaneController = {
    values: { mix: 0, zoom: 1, hover: 0, dim: 0, alpha: 1, radius: 0, tilt: 0, ...initial },
    el: null,
    set(v) {
      Object.assign(ctrl.values, v);
      const el = ctrl.el;
      if (el) {
        if (v.mix !== undefined) el.style.setProperty('--mix', String(v.mix));
        if (v.zoom !== undefined) el.style.setProperty('--zoom', String(v.zoom));
        if (v.dim !== undefined) el.style.setProperty('--dim', String(v.dim));
        if (v.radius !== undefined) el.style.setProperty('--radius', `${v.radius}px`);
      }
      scheduler.bump();
    },
  };
  return ctrl;
}

export type PlaneSlot = {
  id: string;
  el: HTMLElement;
  images: MediaItem[];
  opts: PlaneOptions;
  ctrl: PlaneController;
  setReady(ready: boolean): void;
};

type PlanesState = {
  slots: Record<string, PlaneSlot>;
  index: Record<string, number>;
  near: Record<string, boolean>;
  register(slot: PlaneSlot): void;
  unregister(id: string, slot: PlaneSlot): void;
  setIndex(id: string, i: number): void;
  setNear(id: string, near: boolean): void;
};

export const usePlanes = create<PlanesState>((set, get) => ({
  slots: {},
  index: {},
  near: {},
  register: (slot) => set((s) => ({ slots: { ...s.slots, [slot.id]: slot } })),
  unregister: (id, slot) => {
    if (get().slots[id] !== slot) return;
    set((s) => {
      const slots = { ...s.slots };
      delete slots[id];
      return { slots };
    });
  },
  setIndex: (id, i) => {
    if (get().index[id] === i) return;
    set((s) => ({ index: { ...s.index, [id]: i } }));
    scheduler.bump(4);
  },
  setNear: (id, near) => {
    if (get().near[id] === near) return;
    set((s) => ({ near: { ...s.near, [id]: near } }));
  },
}));
