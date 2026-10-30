import { site } from '@/content/site';
import { AmenityIcon } from './AmenityIcon';
import { BrandChakra } from './BrandChakra';
import { SectionHeading } from './SectionHeading';

export function Specifications() {
  const essentials = site.amenities.groups[1].items;

  return (
    <section id="specifications" aria-labelledby="specifications-title" className="section relative overflow-hidden bg-white" data-track-section="specifications">
      <BrandChakra subtle className="pointer-events-none absolute -right-20 top-8 size-[160px] rotate-45 sm:-right-28 sm:top-14 sm:size-[380px]" />
      <BrandChakra subtle className="pointer-events-none absolute -left-20 bottom-8 size-[150px] -rotate-12 sm:-left-28 sm:bottom-12 sm:size-[340px]" />
      <div className="container-x relative z-10">
        <SectionHeading id="specifications-title" eyebrow="Specifications" title="Built for _Everyday Comfort_" oneLine />
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {essentials.map((item) => (
            <div key={item.icon} className="rounded-2xl border border-line bg-cream p-6">
              <AmenityIcon name={item.icon} className="mb-4 size-7 text-terra" />
              <dt className="text-[17px] font-semibold text-brand">{item.name}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{item.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
