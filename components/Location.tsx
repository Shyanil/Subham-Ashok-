'use client';

import { BrochureMotif } from './BrochureMotif';
import { site } from '@/content/site';
import { NeighbourhoodCarousel } from './NeighbourhoodCarousel';
import { BrandChakra } from './BrandChakra';
import { Accent } from './Accent';
import { ArrowUpRight, PinIcon } from './icons';

const PROJECT_MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4898.190329965421!2d91.7727819!3d26.109481499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5f00669e8a27%3A0x32b1d7ab340fd50f!2sSUBHAM%20ASHOK%20HEIGHTS!5e0!3m2!1sen!2sin!4v1794293160476!5m2!1sen!2sin';

export function Location() {
  const l = site.location;
  const c = site.contact;
  return (
    <section id="location" aria-labelledby="location-title" className="section relative overflow-hidden bg-cream" data-track-section="location">
      <BrochureMotif kind="corner" className="brochure-location-corner" />
      <BrandChakra subtle className="pointer-events-none absolute -right-24 top-10 size-[160px] rotate-12 sm:-right-32 sm:top-16 sm:size-[400px]" />
      <BrandChakra subtle className="pointer-events-none absolute -left-24 bottom-12 size-[160px] -rotate-12 sm:-left-32 sm:bottom-20 sm:size-[380px]" />
      <div className="container-x relative z-10">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div>
            <p className="kicker"><PinIcon className="size-3.5" /> Project Location</p>
            <h2 id="location-title" className="h2 mt-5 max-w-3xl"><Accent text={l.title} /></h2>
          </div>
          <p className="flex shrink-0 items-center gap-2 text-[13px] font-semibold text-terra lg:pb-2">
            <span className="size-1.5 rounded-full bg-terra" aria-hidden="true" /> Beharbari · Guwahati
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] bg-deep lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div className="brochure-address-panel on-dark flex flex-col justify-center p-6 text-white sm:p-9 lg:p-10">
            <span className="grid size-11 place-items-center rounded-full border border-gold/30 text-gold" aria-hidden="true"><PinIcon className="size-5" /></span>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Your address</p>
            <h3 className="mt-3 font-serif text-[30px] leading-tight !text-white sm:text-[36px]">Subham Ashok Heights</h3>
            <address className="mt-4 text-[15px] not-italic leading-relaxed text-white/75">{c.siteAddress[0]}<br />{c.siteAddress[1]}</address>
            <div className="mt-7 flex flex-col items-start gap-4">
              <a href={l.directionsLink} target="_blank" rel="noopener noreferrer" className="btn !bg-gold !text-deep">Get Directions <ArrowUpRight className="arrow size-4" /></a>
              <a href={l.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-[12px] font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">Open in Google Maps <ArrowUpRight className="size-3.5" /></a>
            </div>
          </div>
          <div id="neighbourhood-map" className="relative min-w-0 scroll-mt-24 bg-white">
            <iframe
              title="Subham Ashok Heights location in Guwahati"
              src={PROJECT_MAP}
              width="600"
              height="450"
              className="block h-[360px] w-full border-0 lg:h-full lg:min-h-[450px]"
              style={{ colorScheme: 'light' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a href={l.mapLink} target="_blank" rel="noopener noreferrer" className="absolute bottom-8 left-4 inline-flex min-h-11 max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-brand px-4 py-3 text-left text-[13px] font-semibold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra">
              <PinIcon className="size-5 shrink-0" /> Subham Ashok Heights <ArrowUpRight className="size-4 shrink-0" />
            </a>
          </div>
        </div>
        <NeighbourhoodCarousel />
      </div>
    </section>
  );
}
