'use client';

import { useRef, useState } from 'react';
import { BrochureMotif } from './BrochureMotif';
import { site } from '@/content/site';
import { NeighbourhoodCarousel } from './NeighbourhoodCarousel';
import { BrandChakra } from './BrandChakra';
import { Accent } from './Accent';
import { ArrowUpRight, PinIcon } from './icons';

export function Location() {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const map = useRef<HTMLDivElement>(null);
  const showNearbyPlace = (name: string) => {
    setSelectedPlace(name);
    setAddressOpen(false);
    map.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  };
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
          <div ref={map} id="neighbourhood-map" className="relative min-w-0 scroll-mt-24 bg-white">
            <iframe title={selectedPlace ? selectedPlace + " location in Guwahati" : "Subham Ashok Heights location, Sonkuchi Path, Guwahati"} src={selectedPlace ? `https://www.google.com/maps?q=${encodeURIComponent(selectedPlace + ", Guwahati, Assam")}&output=embed` : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11464.796372712837!2d91.7719754!3d26.1071153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5ebf33930b25%3A0xa404824650859840!2sSonkuchi%20Path%2C%20Guwahati%2C%20Assam%20781029!5e0!3m2!1sen!2sin!4v1793202092069!5m2!1sen!2sin"} width="600" height="450" className="block h-[360px] w-full border-0 lg:h-full lg:min-h-[450px]" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            {addressOpen && (
              <div id="project-map-address" role="region" aria-label="Project address" className="absolute left-4 right-4 top-4 rounded-2xl border border-line bg-white p-5 pr-12 shadow-xl sm:right-auto sm:max-w-[320px]">
                <button type="button" aria-label="Close address popup" onClick={() => setAddressOpen(false)} className="absolute right-2 top-2 grid size-9 place-items-center rounded-full text-brand hover:bg-cream">&#215;</button>
                <h3 className="font-serif text-[23px] text-brand">Subham Ashok Heights</h3>
                <address className="mt-2 text-[14px] not-italic leading-relaxed text-muted">{c.siteAddress[0]}<br />{c.siteAddress[1]}</address>
                <a href={l.directionsLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-2 text-[13px] font-semibold text-terra underline underline-offset-4">Get Directions <ArrowUpRight className="size-4" /></a>
              </div>
            )}
            <button type="button" aria-expanded={addressOpen} aria-controls="project-map-address" onClick={() => { setSelectedPlace(null); setAddressOpen(selectedPlace !== null || !addressOpen); }} className="absolute bottom-8 left-4 inline-flex min-h-11 max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-brand px-4 py-3 text-left text-[13px] font-semibold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra">
              <PinIcon className="size-5 shrink-0" /> Subham Ashok Heights
            </button>
          </div>
        </div>
        <NeighbourhoodCarousel onSelectPlace={showNearbyPlace} selectedPlace={selectedPlace} />
      </div>
    </section>
  );
}
