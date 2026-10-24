import Image from 'next/image';
import { site } from '@/content/site';
import { keyDistances } from '@/content/plans';
import { Accent } from './Accent';
import { SectionHeading } from './SectionHeading';
import { ArrowUpRight, PinIcon } from './icons';

const ICON: Record<string, string> = {
  Education: 'M4 10l8-4 8 4-8 4-8-4Zm3 1.5V16c0 1 2.2 2 5 2s5-1 5-2v-4.5',
  Hospitals: 'M12 6v12M6 12h12',
  'Sports and leisure': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-6 6h12M6 15h12',
  'Shopping and markets': 'M6 8h12l-1 12H7L6 8Zm3 0a3 3 0 0 1 6 0',
  Showrooms: 'M5 16l1.5-5h11L19 16M4 16h16v3H4zM7 19v1M17 19v1',
  Banks: 'M4 10h16L12 5 4 10Zm2 0v7m4-7v7m4-7v7m4-7v7M4 19h16',
  Civic: 'M6 21V4m0 1h11l-2 3 2 3H6',
  Temples: 'M12 3l2 4H10l2-4Zm-5 6h10v11H7zM10 20v-5h4v5',
};

/** Distance cards with pill badges, then a dark "Project location" block with the map. */
export function Location() {
  const l = site.location;
  const c = site.contact;
  return (
    <section id="location" aria-labelledby="location-title" className="section" data-track-section="location">
      <div className="container-x">
        <SectionHeading id="location-title" eyebrow={l.eyebrow} title={l.title} body={l.body} />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyDistances.map((g) => (
            <li key={g.group} className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)]" data-reveal="3d" data-tilt>
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-deep text-gold">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={ICON[g.group] ?? 'M12 12h.01'} />
                  </svg>
                </span>
                <p className="text-right font-serif text-[24px] italic leading-none text-ink">{g.group}</p>
              </div>
              <ul className="grid gap-2.5">
                {g.items.map(([name, d]) => (
                  <li key={name} className="flex items-center justify-between gap-3 text-[14px] font-medium text-ink/90">
                    <span>{name}</span>
                    <span className="shrink-0 rounded-md border border-terra/20 bg-terra/[0.07] px-2 py-0.5 text-[12px] font-black uppercase tracking-[0.12em] text-terra tabular">{d}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="bleed mt-16">
        <div className="dark-card on-dark grid gap-10 rounded-[2rem] p-7 sm:rounded-[3rem] sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-16" data-reveal="3d">
          <div>
            <p className="kicker !text-gold">Strategically positioned</p>
            <h3 className="mt-5 text-[52px] uppercase leading-[0.9] !text-white sm:text-[72px]">
              <Accent text="Project _Location_" />
            </h3>
            <p className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-gold">
              <PinIcon className="size-4" /> The address
            </p>
            <p className="mt-2 text-[20px] font-semibold leading-snug text-white">
              {c.siteAddress[0]},
              <br />
              {c.siteAddress[1]}
            </p>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/65">Home types</p>
              <p className="mt-2 font-serif text-[26px] italic text-gold">2 BHK · 3 BHK · 4 BHK · Penthouses</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={l.directionsLink} target="_blank" rel="noopener noreferrer" className="btn">
                Get Directions <ArrowUpRight className="arrow size-4" />
              </a>
              <a href={l.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                Open in Google Maps
              </a>
            </div>
          </div>
          <a href="/brochure/location-map.webp" target="_blank" rel="noopener noreferrer" aria-label="Open the location map full size" className="block overflow-hidden rounded-[1.75rem] bg-white p-2 ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.01]">
            <Image
              src="/brochure/location-map.webp"
              alt="Location map of Subham Ashok Heights off Beharbari road, showing nearby schools, hospitals, showrooms, banks and markets"
              width={2311}
              height={1418}
              sizes="(min-width: 1024px) 700px, 100vw"
              className="h-auto w-full rounded-[1.25rem]"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
