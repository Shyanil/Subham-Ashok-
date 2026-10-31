import { site } from '@/content/site';
import { Accent } from './Accent';
import { LeadForm } from './lead/LeadForm';
import { CheckIcon, PinIcon, ShieldIcon, SparkIcon } from './icons';
import { BrandChakra } from './BrandChakra';

/** Full-width enquiry section with a clear form surface. */
export function FinalCta() {
  const f = site.finalCta;

  return (
    <section id="enquire" aria-labelledby="enquire-title" className="section on-dark relative isolate overflow-hidden bg-deep" data-track-section="final_cta">
      <BrandChakra subtle className="-bottom-12 -left-20 size-[160px] -rotate-12 sm:-bottom-24 sm:-left-40 sm:size-[420px]" />
      <div className="container-x relative z-10 grid gap-10 lg:grid-cols-[minmax(280px,1fr)_minmax(0,840px)] lg:items-start lg:gap-5">
        <div className="lg:pt-8">
          <p className="kicker !text-gold"><SparkIcon className="size-3" /> {f.eyebrow}</p>
          <h2 id="enquire-title" className="h2 mt-5 !text-white"><Accent text={f.title} /></h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/75">{f.body}</p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {f.perks.map((p) => (
              <li key={p} className="flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[13px] text-white/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold" aria-hidden="true"><CheckIcon /></span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-9 inline-flex items-center gap-2 border-t border-white/15 pt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-white/70">
            <PinIcon className="size-4 text-gold" /> Beharbari, Guwahati
          </p>
        </div>

        <div className="enquiry-card w-full min-w-0 max-w-[840px] justify-self-center rounded-[1.5rem] bg-white p-5 shadow-[var(--shadow-lift)] sm:p-6 lg:justify-self-end lg:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-terra">Private enquiry</p>
          <h3 className="mt-2 text-[28px] leading-tight text-ink sm:text-[32px]">Let Us Help You Find Your Home</h3>
          <div className="mt-5">
            <LeadForm variant="inline" fields="priority" source="final_form" submitLabel="Confirm Enquiry" />
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 border-t border-line pt-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            <ShieldIcon className="size-4 text-leaf" /> Secure · RERA verified project
          </p>
        </div>
      </div>
    </section>
  );
}
