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

/** Conversion band between sections: a white pill-card with a serif line and the three actions. */
export function CtaBand({ source, title, body, kind = 'buttons' }: Props) {
  return (
    <aside className="container-x py-4" aria-label={title.replace(/_/g, '')} data-track-section={source}>
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white px-6 py-7 shadow-[var(--shadow-soft)] sm:rounded-[2.5rem] md:px-10 md:py-9" data-reveal="3d">
        <span className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-terra/[0.07]" aria-hidden="true" />
        <div className={`relative flex flex-col gap-5 ${kind === 'buttons' ? 'lg:flex-row lg:items-center lg:justify-between' : ''}`}>
          <div>
            <p className="font-serif text-[32px] leading-[1.02] text-ink md:text-[40px]">
              <Accent text={title} />
            </p>
            {body && <p className="mt-2 text-[16px] text-muted">{body}</p>}
          </div>
          {kind === 'form' ? (
            <>
              <div className="hidden lg:block">
                <LeadForm variant="sticky" fields="quick" source={source} submitLabel="Download Brochure" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:hidden">
                <LeadButton intent="visit" source={source} className="btn">
                  Book a Site Visit <ArrowUpRight className="arrow size-4" />
                </LeadButton>
                <LeadButton intent="brochure" source={source} className="btn btn--outline">
                  Download Brochure
                </LeadButton>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LeadButton intent="visit" source={source} className="btn">
                Book a Site Visit <ArrowUpRight className="arrow size-4" />
              </LeadButton>
              <LeadButton intent="brochure" source={source} className="btn btn--outline">
                Download Brochure
              </LeadButton>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
