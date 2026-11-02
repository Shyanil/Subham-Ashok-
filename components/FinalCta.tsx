import { site } from '@/content/site';
import { Accent } from './Accent';
import { LeadForm } from './lead/LeadForm';
import { CheckIcon, PinIcon, ShieldIcon, SparkIcon } from './icons';
import { BrandChakra } from './BrandChakra';

/** A joined enquiry card inspired by the group's residential sites. */
export function FinalCta() {
  const f = site.finalCta;
  return (
    <section id="enquire" aria-labelledby="enquire-title" className="section enquiry-section" data-track-section="final_cta">
      <div className="container-x">
        <div className="enquiry-shell">
          <div className="enquiry-story on-dark">
            <BrandChakra subtle className="-bottom-20 -right-24 size-[340px]" />
            <div className="relative z-10">
              <p className="enquiry-eyebrow"><SparkIcon className="size-3.5" /> Exclusive enquiry</p>
              <h2 id="enquire-title" className="enquiry-heading"><Accent text={f.title} /></h2>
              <p className="enquiry-description">{f.body}</p>
              <ul className="enquiry-perks">
                {f.perks.map((perk) => (
                  <li key={perk}><CheckIcon className="size-4 shrink-0" />{perk}</li>
                ))}
              </ul>
            </div>
            <div className="enquiry-location">
              <span className="enquiry-location-icon"><PinIcon className="size-5" /></span>
              <div><span className="enquiry-location-label">Come home to</span><p>Beharbari, Guwahati</p></div>
            </div>
          </div>
          <div className="enquiry-card enquiry-panel">
            <div className="enquiry-panel-heading">
              <p className="enquiry-eyebrow">Your next chapter starts here</p>
              <h3>Let Us Help You<br className="hidden sm:block" /> Find Your Home</h3>
              <p>Leave a few details. We’ll take care of the rest.</p>
            </div>
            <LeadForm variant="inline" fields="priority" source="final_form" submitLabel="Confirm Enquiry" />
            <p className="enquiry-security"><ShieldIcon className="size-4 shrink-0" /> Secure · RERA verified project</p>
          </div>
        </div>
      </div>
    </section>
  );
}
