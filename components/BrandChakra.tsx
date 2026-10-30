import Image from 'next/image';

/** Transparent brochure artwork used only as a non-interactive background accent. */
export function BrandChakra({ className, subtle = false }: { className: string; subtle?: boolean }) {
  return (
    <div className={`pointer-events-none absolute select-none ${className}`} aria-hidden="true">
      <Image
        src="/brand/ashok-chakra.png"
        alt=""
        fill
        sizes="(max-width: 639px) 160px, 420px"
        className={`object-contain ${subtle ? 'opacity-[0.025] sm:opacity-[0.04]' : 'opacity-[0.035] sm:opacity-[0.055]'}`}
      />
    </div>
  );
}
