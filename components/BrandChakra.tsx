import Image from 'next/image';

/** Transparent brochure artwork used only as a non-interactive background accent. */
export function BrandChakra({ className, subtle = false }: { className: string; subtle?: boolean }) {
  return (
    <div className={`pointer-events-none absolute select-none ${className}`} aria-hidden="true">
      <Image src="/brand/ashok-chakra.png" alt="" fill sizes="(max-width: 639px) 160px, 420px" className={`object-contain ${subtle ? 'opacity-[0.05] sm:opacity-[0.08]' : 'opacity-[0.07] sm:opacity-[0.12]'}`} />
    </div>
  );
}
