import Image from 'next/image';
import { site } from '@/content/site';
import { getImage } from '@/lib/media';
import { Accent } from './Accent';
import { LeadButton } from './lead/LeadButton';
import { AmenityIcon } from './AmenityIcon';
import { ArrowUpRight, PinIcon } from './icons';
import { BrandChakra } from './BrandChakra';

const PERSONA_ICON = ['club', 'kids', 'pool'];

export function Overview() {
  const o = site.overview;
  return (
    <section id="overview" aria-labelledby="overview-title" className="section relative overflow-hidden" data-track-section="overview">
      <BrandChakra subtle className="pointer-events-none absolute -left-24 top-5 size-[160px] -rotate-12 sm:-left-28 sm:top-12 sm:size-[380px]" />
      <BrandChakra subtle className="pointer-events-none absolute -right-24 top-[22rem] size-[160px] rotate-12 sm:-right-28 sm:top-40 sm:size-[400px]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-4xl text-center">
        <p className="kicker" data-reveal>
          <PinIcon className="size-3.5" /> {o.eyebrow}
        </p>
        <h2 id="overview-title" className="h2 mx-auto mt-5 max-w-3xl !text-[36px] sm:!text-[48px] xl:!text-[58px]" data-reveal>
          <Accent text={o.title} />
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-muted sm:text-[17px]" data-reveal>
          {o.body}
        </p>

        </div>
        <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-y-8 border-y border-line py-8 sm:mt-12 lg:grid-cols-5 lg:py-10" data-reveal-group>
          {o.stats.map((s) => (
              <li
                key={s.label}
                data-reveal
                className="min-w-0 px-3 text-center even:border-l even:border-line max-lg:last:col-span-2 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-line"
              >
                <p className="font-serif text-[28px] italic leading-none text-terra sm:text-[36px]">
                  {s.value} <span className="text-[18px]">{s.unit}</span>
                </p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted sm:text-[11px]">{s.label}</p>
                {'note' in s && <p className="mt-2 text-[11px] leading-relaxed text-muted">{s.note}</p>}
              </li>
          ))}
        </ul>
        <div className="mt-7 text-center" data-reveal>
          <LeadButton
            intent="visit"
            source="overview"
            title="Book A Site Visit"
            submitLabel="Book A Site Visit"
            className="btn"
          >
            {o.cta} <ArrowUpRight className="arrow size-4" />
          </LeadButton>
        </div>
      </div>

      <div className="container-x mt-16 grid gap-4 md:grid-cols-3">
        {o.personas.map((p, i) => {
          const img = p.image ? getImage(p.image) : null;
          const base = 'group relative flex flex-col overflow-hidden rounded-[2rem] p-6 text-left sm:p-7 transition-transform duration-500 hover:-translate-y-2';
          const tone = p.tone === 'dark' ? 'dark-card' : p.tone === 'terra' ? 'bg-gradient-to-br from-[#5e3626] to-[#8a5a42] text-white' : 'bg-deep text-white';
          return (
            <article key={p.title} className={`${base} ${tone}`} data-reveal="3d" data-tilt>
              {img && (
                <>
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" placeholder="blur" blurDataURL={img.blurDataURL} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/45" aria-hidden="true" />
                </>
              )}
              <span className="relative grid size-12 place-items-center rounded-2xl bg-white/12 text-gold ring-1 ring-white/15 backdrop-blur">
                <AmenityIcon name={PERSONA_ICON[i]} className="size-6" />
              </span>
              <div className="relative mt-5">
                <p className="text-[12px] font-black uppercase tracking-[0.24em] text-white/80">{p.kicker}</p>
                <p className="mt-2 text-[16px] leading-relaxed text-white/85">{p.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
