import { Accent } from './Accent';
import { LeadButton } from './lead/LeadButton';
import { LeadForm } from './lead/LeadForm';
import { ArrowUpRight } from './icons';

type Props = {
  source: string;
  title: string;
  body?: string;
  /** "buttons" (default) or a one-row quick form on desktop. */
  kind?: 'buttons' | 'form';
};

/** Conversion band between sections: a white pill-card with a serif line and a single brochure action. */
export function CtaBand({ source, title, body, kind = 'buttons' }: Props) {
  return (
    <aside className="section relative isolate clear-both bg-sand" aria-label={title.replace(/_/g, '')} data-track-section={source}>
      <div className="container-x">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white px-6 py-7 shadow-[var(--shadow-soft)] md:px-9 md:py-8">
        <div className={`relative grid gap-6 ${kind === 'buttons' ? 'lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12' : ''}`}>
          <div className="min-w-0 border-l-2 border-terra/30 pl-5 sm:pl-6">
            <p className="max-w-[740px] font-serif text-[28px] leading-[1.2] text-ink sm:text-[32px] xl:text-[34px]">
              <Accent text={title} />
            </p>
            {body && <p className="mt-3 text-[14px] leading-relaxed text-muted">{body}</p>}
          </div>
          {kind === 'form' ? (
            <>
              <div className="hidden lg:block">
                <LeadForm variant="sticky" fields="quick" source={source} submitLabel="Download Brochure" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:hidden">
                <LeadButton intent="visit" source={source} title="Book A Site Visit" submitLabel="Book A Site Visit" className="btn">
                  Book a Site Visit <ArrowUpRight className="arrow size-4" />
                </LeadButton>
                <LeadButton intent="brochure" source={source} title="Download The Brochure" submitLabel="Download The Brochure" className="btn btn--outline">
                  Download Brochure
                </LeadButton>
              </div>
            </>
          ) : (
            <div className="flex shrink-0 lg:justify-end">
              <LeadButton intent="brochure" source={source} title="Download The Brochure" submitLabel="Download The Brochure" className="btn w-full whitespace-nowrap sm:w-auto lg:min-h-[54px] lg:px-7">
                Download Brochure <ArrowUpRight className="arrow size-4" />
              </LeadButton>
            </div>
          )}
        </div>
      </div>
      </div>
    </aside>
  );
}
