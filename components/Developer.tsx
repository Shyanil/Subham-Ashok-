import { project, site } from '@/content/site';
import { Accent } from './Accent';
import { Counter } from './Counter';
import { SparkIcon } from './icons';

/** Developer story, chairman's note, proof points, and an expandable portfolio. */
export function Developer() {
  const d = site.developer;

  return (
    <section id="developer" aria-labelledby="developer-title" className="section bg-white" data-track-section="developer">
      <div className="container-x">
        <div className="grid gap-6 border-b border-line pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="kicker"><SparkIcon className="size-3" /> {d.eyebrow}</p>
            <h2 id="developer-title" className="h2 mt-5 max-w-[16ch]"><Accent text={d.title} /></h2>
          </div>
          <p className="max-w-2xl text-[16px] leading-[1.8] text-muted lg:pb-1">{d.body}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="dark-card on-dark overflow-hidden rounded-[2rem] p-7 sm:rounded-[3rem] sm:p-10" data-reveal="3d">
            <div className="flex flex-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/subham-logo-light.webp" width={328} height={311} alt={`${project.developer} — ${project.developerTagline}`} loading="lazy" decoding="async" className="h-16 w-auto self-start" />
              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{d.note.title}</p>
              <blockquote className="mt-4 font-serif text-[27px] italic leading-[1.24] text-white sm:text-[33px]">“{d.note.quote}”</blockquote>
              <div className="mt-8 border-t border-white/15 pt-5">
                <p className="font-semibold text-white">{d.note.name}</p>
                <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.18em] text-white/60">{d.note.role}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {d.stats.map((s, i) => (
              <div key={s.label} className={`flex min-h-[175px] flex-col justify-between rounded-[2rem] p-5 sm:p-6 ${i === 0 ? 'bg-brand text-white' : 'bg-cream text-ink'}`}>
                <span className={`text-[11px] font-bold uppercase tracking-[0.16em] ${i === 0 ? 'text-white/65' : 'text-terra'}`}>0{i + 1}</span>
                <div>
                  <p className="font-serif text-[38px] italic leading-none sm:text-[45px]"><Counter value={s.value} suffix={s.suffix} decimals={s.decimals} /></p>
                  <p className={`mt-2 text-[12px] font-semibold leading-snug ${i === 0 ? 'text-white/80' : 'text-muted'}`}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="kicker">Since 2007</p>
              <h3 className="mt-3 text-[42px] leading-none sm:text-[54px]">The Subham portfolio</h3>
            </div>
            <p className="max-w-sm text-[14px] text-muted">Explore our ongoing, completed, and commercial projects.</p>
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
