import { site } from '@/content/site';
import { AmenityIcon } from './AmenityIcon';
import { SectionHeading } from './SectionHeading';

export function Specifications() {
  const essentials = site.amenities.groups[1].items;

  return (
    <section id="specifications" aria-labelledby="specifications-title" className="section bg-white" data-track-section="specifications">
      <div className="container-x">
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
