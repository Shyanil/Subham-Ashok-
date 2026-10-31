import Image from 'next/image';
import { project, site } from '@/content/site';
import { Accent } from './Accent';
import { Counter } from './Counter';
import { SparkIcon } from './icons';

/** Developer story, chairman's note, proof points, and an expandable portfolio. */
export function Developer() {
  const d = site.developer;

  return (
    <section id="developer" aria-labelledby="developer-title" className="section bg-cream" data-track-section="developer">
      <div className="container-x">
        <div className="grid gap-5 border-b border-line pb-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-8">
          <div>
            <p className="kicker"><SparkIcon className="size-3" /> {d.eyebrow}</p>
            <h2 id="developer-title" className="h2 mt-4 max-w-xl"><Accent text={d.title} /></h2>
          </div>
          <div className="lg:px-4 lg:pb-1">
            <p className="max-w-xl text-[15px] leading-relaxed text-muted">{d.body}</p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-terra">{project.developer}<span aria-hidden="true" className="mx-2">/</span>{project.developerTagline}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-8">
          <div className="dark-card on-dark flex flex-col gap-5 overflow-hidden rounded-3xl p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7">
            <Image src="/images/kailash-lohia-chairperson.webp" alt="Mr. Kailash Chandra Lohia, Chair Person of Subham Group" width={361} height={477} unoptimized className="h-36 w-28 shrink-0 self-start rounded-2xl object-cover object-top sm:h-48 sm:w-36 sm:self-center" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">A vision for better living</p>
              <blockquote className="mt-3 font-serif text-[21px] leading-relaxed text-white sm:text-[23px]">&ldquo;{d.note.quote}&rdquo;</blockquote>
              <div className="mt-5 border-t border-white/15 pt-4">
                <p className="text-[14px] font-semibold text-white">{d.note.name}</p>
                <p className="mt-1 text-[11px] text-white/60">{d.note.role}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 px-2 py-3 sm:px-4">
            {d.stats.map((s) => (
              <div key={s.label} className="border-l-2 border-terra/25 pl-4">
                <p className="font-serif text-[32px] leading-none text-brand sm:text-[40px]"><Counter value={s.value} suffix={s.suffix} decimals={s.decimals} /></p>
                <p className="mt-2 text-[12px] font-medium text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="kicker">Since 2007</p>
              <h3 className="h2 mt-3">The Subham Portfolio</h3>
            </div>
            <p className="max-w-sm text-[14px] text-muted">Explore our ongoing and completed projects.</p>
          </div>
          <div className="mt-7 grid gap-3">
            {d.projects.map((g) => (
              <details key={g.title} className="group rounded-[1.5rem] border border-line bg-white open:bg-cream/50" open={g.title === 'Ongoing'}>
                <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-4 px-5 sm:px-7">
                  <span className="font-serif text-[27px] leading-none sm:text-[32px]">{g.title} <span className="ml-2 font-sans text-[12px] font-bold text-terra">{g.items.length}</span></span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-brand transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <ul className="grid gap-x-8 gap-y-3 border-t border-line px-5 py-6 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
                  {g.items.map((item) => <li key={item} className="border-l-2 border-terra/40 pl-3 text-[14px] text-ink/80">{item}</li>)}
                </ul>
              </details>
            ))}
          </div>
          <p className="mt-7 border-l-2 border-terra pl-5 text-[14px] leading-relaxed text-muted">
            Architect: <strong className="text-ink">{d.architect.name}</strong> — {d.architect.body}
          </p>
        </div>
      </div>
    </section>
  );
}
