import Image from 'next/image';
import type { CSSProperties } from 'react';
import { site } from '@/content/site';
import { getImage, objectPosition } from '@/lib/media';
import { isSet, projectConfig } from '@/src/config/project';
import { Accent } from './Accent';
import { HeroDepthLayer } from './HeroDepthLayer';
import { LeadButton } from './lead/LeadButton';
import { ArrowUpRight, ShieldIcon } from './icons';

const d = (n: number) => ({ ['--d' as string]: n }) as CSSProperties;

/**
 * Editorial split hero. The daylight render bleeds to the right edge of the viewport with
 * one sculpted corner; a rotating "Reveal price" seal sits on the seam and a glass card
 * carries the key numbers, so the text column stays short.
 */
export function Hero() {
  const h = site.hero;
  const img = getImage('gate-view');
  const priced = isSet(projectConfig.STARTING_PRICE);
  const stats = [
    { v: '2', k: 'Blocks' },
    { v: '11', k: 'Floors' },
    { v: '635–1,680', k: 'Sq.ft' },
  ];
  const sealText = priced ? `Starting ₹${projectConfig.STARTING_PRICE}* · Download brochure · ` : 'Reveal price · Download brochure · ';

  return (
    <section id="top" aria-labelledby="hero-title" className="hero relative overflow-hidden bg-white" data-track-section="hero">
      <div className="lg:grid lg:min-h-[min(880px,calc(100svh-68px))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
        {/* Image — first on mobile, right half (edge to edge) on desktop */}
        <div className="relative lg:order-2">
          <div className="hero-media relative isolate h-[36svh] min-h-[280px] overflow-hidden rounded-b-[2.5rem] bg-tan sm:h-[42svh] sm:min-h-[320px] lg:absolute lg:inset-0 lg:h-auto lg:rounded-b-none lg:rounded-bl-[200px]">
            {/* No blur placeholder: swapping blur → sharp mid-animation is what flickered on reload. */}
            <div className="enter-media absolute inset-0">
              <Image
                src="/images/exterior/gate-view-2560.webp"
                alt={img.alt}
                fill
                preload
                sizes="(min-width: 1024px) 1800px, 80vh"
                quality={90}
                className="object-cover"
                style={{ objectPosition: objectPosition(img.focus) }}
              />
              <HeroDepthLayer src="/images/exterior/gate-view-2560.webp" depth="/images/exterior/gate-view-depth.webp" focus={img.focus} />
            </div>
            <div className="absolute inset-0 hidden bg-gradient-to-t from-[#1f0b08]/65 via-transparent to-[#1f0b08]/5 lg:block" aria-hidden="true" />

            <p className="glass enter absolute right-4 top-4 hidden items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink lg:inline-flex lg:right-6 lg:top-6" style={d(6)}>
              <ShieldIcon className="size-4 text-leaf" /> RERA registered
            </p>

            <div className="absolute bottom-10 right-10 hidden lg:block">
              <p className="enter mb-3 text-right font-serif text-[30px] italic leading-tight text-white" style={d(7)}>
                {h.imageLine}
              </p>
              <dl className="glass enter grid grid-cols-3 divide-x divide-ink/10 rounded-[1.25rem] py-3 sm:min-w-[420px] sm:rounded-[1.5rem] sm:py-3.5" style={d(8)}>
                {stats.map((s) => (
                  <div key={s.k} className="px-2 text-center sm:px-5">
                    <dd className="whitespace-nowrap font-serif text-[22px] leading-none text-ink sm:text-[32px]">{s.v}</dd>
                    <dt className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-terra">{s.k}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-right text-[12px] text-white/80">{h.caption}</p>
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
            <span className="relative grid size-12 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:rotate-45 lg:size-14">
              <ArrowUpRight className="size-5" />
            </span>
            <span className="sr-only">{priced ? `Starting price ₹${projectConfig.STARTING_PRICE}. Download the brochure` : 'Reveal the price'}</span>
          </LeadButton>
        </div>

        {/* Text */}
        <div className="hero-copy relative flex flex-col pb-10 pt-8 sm:pt-10 lg:order-1 lg:justify-start lg:pb-16 lg:pt-12">
          <p className="enter inline-flex w-fit items-center gap-2.5 rounded-full border border-line bg-cream/60 px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-terra lg:text-[10px] lg:tracking-[0.12em] xl:text-[12px] xl:tracking-[0.18em]" style={d(0)}>
            <span className="size-1.5 rounded-full bg-terra" aria-hidden="true" />
            <span className="hidden sm:inline">{h.presents} · </span>
            {h.location}
          </p>

          <h1 id="hero-title" className="hero-title mt-6 text-[46px] leading-[0.95] tracking-[-0.01em] sm:text-[68px] lg:text-[56px] xl:text-[80px] 2xl:text-[88px]">
            <span className="line-mask"><span className="line" style={d(1)}>2, 3 and 4 BHK Homes</span></span>
            <span className="line-mask"><span className="line" style={d(2)}>in <Accent text="_Beharbari_" />,</span></span>
            <span className="line-mask"><span className="line text-muted" style={d(3)}>Guwahati</span></span>
          </h1>

          <p className="enter mt-7 max-w-[31rem] text-[17px] leading-relaxed text-muted" style={d(4)}>
            {h.sub}
          </p>

          <div className="enter mt-8 lg:hidden" style={d(5)}>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              <ShieldIcon className="size-4 text-leaf" /> RERA registered
            </p>
            <p className="mt-5 font-serif text-[28px] italic leading-tight text-ink">{h.imageLine}</p>
            <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-cream py-4">
              {stats.map((s) => (
                <div key={s.k} className="px-1 text-center sm:px-3">
                  <dd className="whitespace-nowrap font-serif text-[26px] leading-none text-ink sm:text-[32px]">{s.v}</dd>
                  <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-terra sm:text-[12px]">{s.k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-right text-[12px] text-muted">{h.caption}</p>
          </div>

          <div className="enter mt-9 flex flex-col gap-3 sm:flex-row lg:items-start lg:flex-col xl:flex-row" style={d(5)}>
            <LeadButton intent="brochure" source="hero" className="btn">
              {h.primaryCta} <ArrowUpRight className="arrow size-4" />
            </LeadButton>
            <LeadButton intent="visit" source="hero_visit" className="btn btn--outline">
              {h.visitCta}
            </LeadButton>
          </div>

          <div className="enter mt-10 hidden items-center gap-4 border-t border-line pt-6 lg:flex" style={d(6)}>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-leaf" aria-hidden="true">
              <ShieldIcon className="size-5" />
            </span>
            <p className="text-[13px] leading-snug text-muted">
              <span className="block font-semibold text-ink">{projectConfig.RERA}</span>
              18 projects delivered by Subham Group since 2007
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
