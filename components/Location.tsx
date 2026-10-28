import { site } from '@/content/site';
import { NeighbourhoodCarousel } from './NeighbourhoodCarousel';
import { Accent } from './Accent';
import { ArrowUpRight, PinIcon } from './icons';

export function Location() {
  const l = site.location;
  const c = site.contact;
  return (
    <section id="location" aria-labelledby="location-title" className="section bg-cream" data-track-section="location">
      <div className="container-x">
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
          <div className="on-dark flex flex-col justify-center p-6 text-white sm:p-9 lg:p-10">
            <span className="grid size-11 place-items-center rounded-full border border-gold/30 text-gold" aria-hidden="true"><PinIcon className="size-5" /></span>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Your address</p>
            <h3 className="mt-3 font-serif text-[30px] leading-tight !text-white sm:text-[36px]">Subham Ashok Heights</h3>
            <address className="mt-4 text-[15px] not-italic leading-relaxed text-white/75">{c.siteAddress[0]}<br />{c.siteAddress[1]}</address>
            <div className="mt-7 flex flex-col items-start gap-4">
              <a href={l.directionsLink} target="_blank" rel="noopener noreferrer" className="btn !bg-gold !text-deep">Get Directions <ArrowUpRight className="arrow size-4" /></a>
              <a href={l.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-[12px] font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">Open in Google Maps <ArrowUpRight className="size-3.5" /></a>
            </div>
          </div>
          <div className="min-w-0 bg-white">
            <iframe title="Subham Ashok Heights location — Sonkuchi Path, Guwahati" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.7488664727616!2d91.7719754!3d26.1071153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5ebf33930b25%3A0xa404824650859840!2sSonkuchi%20Path%2C%20Guwahati%2C%20Assam%20781029!5e0!3m2!1sen!2sin!4v1793202092069!5m2!1sen!2sin" width="600" height="450" className="block h-[360px] w-full border-0 lg:h-full lg:min-h-[450px]" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        </div>
        <NeighbourhoodCarousel />
      </div>
    </section>
  );
}
