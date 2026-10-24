import Image from 'next/image';
import { site } from '@/content/site';
import { getImage } from '@/lib/media';
import { Accent } from './Accent';
import { LeadButton } from './lead/LeadButton';
import { AmenityIcon } from './AmenityIcon';
import { ArrowUpRight, PinIcon } from './icons';

const PERSONA_ICON = ['club', 'kids', 'pool'];

export function Overview() {
  const o = site.overview;
  return (
    <section id="overview" aria-labelledby="overview-title" className="section relative overflow-hidden" data-track-section="overview">
      {/* decorative rings */}
      <div className="pointer-events-none absolute -left-24 top-16 hidden size-[340px] rounded-full border-[36px] border-terra/[0.06] xl:block" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-16 hidden size-[340px] rounded-full border-2 border-dashed border-terra/15 xl:block" aria-hidden="true" />

      <div className="container-x relative text-center">
        <p className="kicker" data-reveal>
          <PinIcon className="size-3.5" /> {o.eyebrow}
        </p>
        <h2 id="overview-title" className="h2 mx-auto mt-5 max-w-4xl" data-reveal>
          <Accent text={o.title} />
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted" data-reveal>
          {o.body}
        </p>

        <ul className="mx-auto mt-10 grid max-w-[1200px] grid-cols-2 gap-3 lg:grid-cols-4" data-reveal-group>
          {o.stats.map((s, i) => {
            const dark = i % 2 === 1;
            return (
              <li
                key={s.label}
                data-reveal
                data-tilt
                className={`flex min-w-0 flex-col justify-center rounded-[1.5rem] px-4 py-5 shadow-[var(--shadow-soft)] sm:px-6 ${dark ? 'bg-deep text-white' : 'bg-white'}`}
              >
                <p className={`font-serif text-[30px] italic leading-none ${dark ? 'text-white' : 'text-terra'}`}>
                  {s.value} <span className="text-[18px]">{s.unit}</span>
                </p>
                <p className={`mt-2 text-[12px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-white/65' : 'text-muted'}`}>{s.label}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-10" data-reveal>
          <LeadButton intent="visit" source="overview" className="btn">
            {o.cta} <ArrowUpRight className="arrow size-4" />
          </LeadButton>
        </div>
        <div className="mx-auto mt-16 h-px w-40 bg-line" aria-hidden="true" />
      </div>

      <div className="container-x mt-16 grid gap-4 md:grid-cols-3">
        {o.personas.map((p, i) => {
          const img = p.image ? getImage(p.image) : null;
          const base = 'group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[2.5rem] p-8 text-left transition-transform duration-500 hover:-translate-y-2';
          const tone = p.tone === 'dark' ? 'dark-card' : p.tone === 'terra' ? 'bg-gradient-to-br from-[#5e3626] to-[#8a5a42] text-white' : 'bg-deep text-white';
          return (
            <article key={p.title} className={`${base} ${tone}`} data-reveal="3d" data-tilt>
              {img && (
                <>
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" placeholder="blur" blurDataURL={img.blurDataURL} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" aria-hidden="true" />
                </>
              )}
              <span className="absolute left-8 top-8 grid size-12 place-items-center rounded-2xl bg-white/12 text-gold ring-1 ring-white/15 backdrop-blur">
                <AmenityIcon name={PERSONA_ICON[i]} className="size-6" />
              </span>
              <div className="relative">
                <p className="text-[12px] font-black uppercase tracking-[0.24em] text-white/80">{p.kicker}</p>
                <h3 className="mt-2 text-[44px] italic leading-none !text-white">{p.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-white/85">{p.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
