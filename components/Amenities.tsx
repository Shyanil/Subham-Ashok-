import { site } from '@/content/site';
import { Accent } from './Accent';
import { AmenityIcon } from './AmenityIcon';
import { SparkIcon } from './icons';

/** A calm icon-led amenity list, followed by the everyday essentials. */
export function Amenities() {
  const a = site.amenities;
  const lifestyle = a.groups[0];
  const essentials = a.groups[1];
  return (
    <section id="amenities" aria-labelledby="amenities-title" className="section" data-track-section="amenities">
      <div className="container-x">
        <div className="mb-9 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12" data-reveal>
          <div>
            <p className="kicker"><SparkIcon className="size-3" /> {a.eyebrow}</p>
            <h2 id="amenities-title" className="h2 mt-5"><Accent text={a.title} /></h2>
          </div>
          <p className="max-w-lg text-[16px] leading-relaxed text-muted">{a.body}</p>
        </div>
        <div aria-labelledby="lifestyle-title">
          <h3 id="lifestyle-title" className="text-[11px] font-bold uppercase tracking-[0.2em] text-terra">{lifestyle.title}</h3>
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
        <div className="on-dark mt-9 rounded-[2rem] bg-deep px-5 py-7 sm:px-8 sm:py-8 lg:mt-12 lg:px-10 lg:py-9" aria-labelledby="essentials-title">
          <div className="flex items-center gap-4">
            <h3 id="essentials-title" className="font-serif text-[28px] !text-white sm:text-[32px]">{essentials.title}</h3>
            <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-3 lg:gap-x-10">
            {essentials.items.map((item) => (
              <li key={item.name} className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:gap-4">
                <AmenityIcon name={item.icon} className="size-6 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-relaxed text-white sm:text-[14px]">{item.name}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/60">{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
