'use client';

import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/** Subtle finishing pass: soft bloom on highlights, light vignette and film grain. */
export function Effects({ multisampling = 0 }: { multisampling?: number }) {
  return (
    <EffectComposer multisampling={multisampling} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.32} luminanceThreshold={0.88} luminanceSmoothing={0.18} radius={0.7} />
      <Vignette offset={0.32} darkness={0.5} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
    </EffectComposer>
  );
}
