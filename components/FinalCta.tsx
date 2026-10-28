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
      <div className="container-x relative z-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <div className="lg:pt-8">
          <p className="kicker !text-gold"><SparkIcon className="size-3" /> {f.eyebrow}</p>
          <h2 id="enquire-title" className="h2 mt-5 !text-white sm:whitespace-nowrap"><Accent text={f.title} /></h2>
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

        <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-lift)] sm:rounded-[2.5rem] sm:p-10 lg:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-terra">Private enquiry</p>
          <h3 className="mt-2 text-[34px] leading-none text-ink sm:text-[40px]">Let Us Help You Find Your Home</h3>
          <div className="mt-7">
            <LeadForm variant="inline" fields="priority" source="final_form" submitLabel="Confirm Enquiry" />
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 border-t border-line pt-5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            <ShieldIcon className="size-4 text-leaf" /> Secure · RERA verified project
          </p>
        </div>
      </div>
    </section>
  );
}
