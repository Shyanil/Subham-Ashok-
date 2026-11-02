import { site } from '@/content/site';
import { Accent } from './Accent';
import { AmenityIcon } from './AmenityIcon';
import { SparkIcon } from './icons';
import { BrandChakra } from './BrandChakra';

/** Icon-led amenities beneath the section introduction. */
export function Amenities() {
  const a = site.amenities;
  const lifestyle = a.groups[0];
  return (
    <section id="amenities" aria-labelledby="amenities-title" className="section relative overflow-hidden" data-track-section="amenities">
      <BrandChakra wheel className="-right-28 top-8 size-[240px] sm:-right-40 sm:top-10 sm:size-[420px]" />
      <div className="container-x relative">
        <div className="mb-9 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12" data-reveal>
          <div>
            <p className="kicker"><SparkIcon className="size-3" /> {a.eyebrow}</p>
            <h2 id="amenities-title" className="h2 mt-5"><Accent text={a.title} /></h2>
          </div>
          <p className="max-w-lg text-[16px] leading-relaxed text-muted">{a.body}</p>
        </div>
        <div>
          <ul className="mt-4 grid grid-cols-2 gap-x-5 sm:grid-cols-3 sm:gap-x-7 lg:grid-cols-5">
            {lifestyle.items.map((item) => (
              <li key={item.name} className="min-w-0 border-b border-line py-6">
                <AmenityIcon name={item.icon} className="size-7 text-terra" />
                <p className="mt-4 font-serif text-[22px] leading-tight text-ink">{item.name}</p>
                <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-muted">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
