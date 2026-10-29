import Image from 'next/image';
import type { CSSProperties } from 'react';
import { site } from '@/content/site';
import { getImage, objectPosition } from '@/lib/media';
import { isSet, projectConfig } from '@/src/config/project';
import { Accent } from './Accent';
import { AmenityIcon } from './AmenityIcon';
import { HeroDepthLayer } from './HeroDepthLayer';
import { LeadButton } from './lead/LeadButton';
import { ArrowUpRight, PinIcon, SparkIcon } from './icons';

/** The desktop panel is taller than the 16:9 render, so it crops sideways: keep the whole tower and gate in frame. */
const HERO_FOCUS: [number, number] = [0.59, 0.5];

const d = (n: number) => ({ ['--d' as string]: n }) as CSSProperties;

/**
 * Editorial split hero. The daylight render bleeds to the right edge of the viewport with
 * one sculpted corner; a rotating "Reveal price" seal sits on the seam and a glass card
 * carries the key numbers, so the text column stays short.
 */
export function Hero() {
  const h = site.hero;
  const img = getImage('ashok-heights-at-golden-hour');
  const mobileImg = getImage('road-elevation-view');
  const priced = isSet(projectConfig.STARTING_PRICE);
  const highlights = [
    { icon: 'lawn', label: 'Landscaped lawns' },
    { icon: 'pool', label: 'Infinity-edge pool' },
    { icon: 'club', label: 'Clubhouse' },
  ];
  const sealText = priced ? `Starting ₹${projectConfig.STARTING_PRICE}* · Price list · ` : 'Reveal price · Launch offer · Price list · ';

  return (
    <section id="top" aria-labelledby="hero-title" className="hero relative overflow-hidden bg-white" data-track-section="hero">
      <div className="lg:grid lg:min-h-[min(880px,calc(100svh-68px))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
        {/* Image — first on mobile, right half (edge to edge) on desktop */}
        <div className="relative lg:order-2">
          {/* Mobile/tablet: the full street elevation at its native 16:9, uncropped. */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-b-[2rem] bg-tan lg:hidden">
            <div className="enter-media absolute inset-0">
              <Image
                src="/images/exterior/road-elevation-view-1920.webp"
                alt={mobileImg.alt}
                fill
                preload
                sizes="100vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </div>
          <div className="hero-media relative isolate hidden overflow-hidden bg-tan lg:absolute lg:inset-0 lg:block lg:rounded-bl-[200px]">
            {/* No blur placeholder: swapping blur → sharp mid-animation is what flickered on reload. */}
            <div className="enter-media absolute inset-0">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                preload
                sizes="1800px"
                quality={90}
                className="object-cover"
                style={{ objectPosition: objectPosition(HERO_FOCUS) }}
              />
              <HeroDepthLayer src={img.src} depth="/images/exterior/ashok-heights-at-golden-hour-depth.webp" focus={HERO_FOCUS} />
            </div>
            <div className="absolute inset-0 hidden bg-gradient-to-t from-[#1f0b08]/65 via-transparent to-[#1f0b08]/5 lg:block" aria-hidden="true" />

            <div className="absolute bottom-10 right-10 hidden lg:block">
              <p className="enter mb-1 text-right font-serif text-[30px] italic leading-tight text-white" style={d(7)}>
                {h.imageLine}
              </p>
            </div>
          </div>

          {/* Rotating price seal on the seam between text and image */}
          <LeadButton
            intent="reveal"
            source="hero_seal"
            className="seal enter group absolute z-10 hidden place-items-center rounded-full bg-brand text-white shadow-[0_24px_50px_-18px_rgb(20_8_6/0.75)] ring-[6px] ring-white xl:left-0 xl:top-[58%] xl:grid xl:size-[150px] xl:-translate-x-1/2"
            style={d(9)}
          >
            <svg viewBox="0 0 200 200" className="seal-ring absolute inset-0 size-full" aria-hidden="true">
              <defs>
                <path id="seal-path" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
              </defs>
              <text className="fill-gold text-[15.5px] font-bold uppercase" style={{ letterSpacing: '0.22em' }}>
                <textPath href="#seal-path">{sealText}</textPath>
              </text>
            </svg>
            <span className="relative grid size-12 place-items-center rounded-full bg-white font-serif text-[28px] leading-none text-brand transition-transform duration-300 group-hover:scale-110 lg:size-14 lg:text-[32px]" aria-hidden="true">
              ₹
            </span>
            <span className="sr-only">{priced ? `Starting price ₹${projectConfig.STARTING_PRICE}. Get the price list` : 'Reveal the price'}</span>
          </LeadButton>
        </div>

        {/* Text */}
        <div className="hero-copy relative flex flex-col pb-10 pt-8 sm:pt-10 lg:order-1 lg:justify-start lg:pb-16 lg:pt-12">
          <p className="enter mb-5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-terra sm:text-[14px]" style={d(0)}>
            <SparkIcon className="size-3 shrink-0" />
            <span>Subham Group presents</span>
          </p>
          <h1 id="hero-title" className="hero-title h2 tracking-[-0.01em]">
            <span className="line-mask"><span className="line" style={d(1)}>Come Home to</span></span>
            <span className="line-mask"><span className="line" style={d(2)}><Accent text="a _Greener Everyday_" /></span></span>
          </h1>

          <p className="enter mt-4 max-w-[31rem] text-[15.5px] lg:mt-7 lg:text-[17px] leading-relaxed text-muted" style={d(4)}>
            {h.sub}
          </p>

          <div className="enter mt-7 flex flex-wrap items-center gap-x-5 gap-y-4 lg:mt-9" style={d(5)}>
            {/* Mobile/tablet: a richer brochure card-button; desktop keeps the classic pill. */}
            <LeadButton
              intent="brochure"
              source="hero"
              className="cta-shine group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand to-deep p-2.5 pr-3 text-left text-white shadow-[0_18px_36px_-16px_rgb(46_17_12/0.75)] ring-1 ring-gold/30 active:scale-[0.98] sm:w-auto lg:hidden"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold text-deep" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-bold tracking-[0.02em]">{h.primaryCta}</span>
                <span className="mt-0.5 block text-[12px] text-white/70">Floor plans · Price list · Amenities</span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/20" aria-hidden="true">
                <ArrowUpRight className="size-4" />
              </span>
            </LeadButton>
            <LeadButton intent="brochure" source="hero" className="btn hidden w-fit lg:inline-flex">
              {h.primaryCta} <ArrowUpRight className="arrow size-4" />
            </LeadButton>
            <p className="flex items-center gap-2.5 py-2 text-[17px] font-medium leading-snug text-brand">
              <PinIcon className="size-5 shrink-0 text-terra" />
              <span className="border-b border-gold/70 pb-1">Beharbari <span className="px-1 text-terra" aria-hidden="true">·</span> Guwahati</span>
            </p>
          </div>

          <div className="enter mt-9 w-full max-w-[31rem] lg:mt-12" style={d(7)}>
            <div className="flex items-center gap-5">
              <span className="h-16 w-0.5 shrink-0 bg-terra/50" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra sm:text-[14px]">Find your space</p>
                <p className="mt-2 font-serif text-[38px] leading-tight text-ink sm:text-[44px]">2, 3 and 4 <span className="text-[25px] italic sm:text-[30px]">BHK Homes</span></p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted sm:text-[16px]">With penthouse options for a different perspective.</p>
              </div>
            </div>
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
              {highlights.map((item) => (
                <li key={item.icon} className="flex items-center gap-2 text-leaf">
                  <AmenityIcon name={item.icon} className="size-5 shrink-0" />
                  <span className="text-[14px] text-muted">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
