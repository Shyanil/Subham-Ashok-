'use client';

import { create } from 'zustand';

/** DOM boxes that host a small 3D object in the persistent canvas. */
export type AnchorKind = 'gem' | 'orbit' | 'compass';
export type Anchor = { id: string; el: HTMLElement; kind: AnchorKind };

type AnchorsState = {
  anchors: Record<string, Anchor>;
  add(a: Anchor): void;
  remove(id: string): void;
};

export const useAnchors = create<AnchorsState>((set) => ({
  anchors: {},
  add: (a) => set((s) => ({ anchors: { ...s.anchors, [a.id]: a } })),
  remove: (id) =>
    set((s) => {
      const anchors = { ...s.anchors };
      delete anchors[id];
      return { anchors };
    }),
}));
