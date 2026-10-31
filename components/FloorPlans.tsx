'use client';

import Image from 'next/image';
import { useState } from 'react';
import { site } from '@/content/site';
import { floors, planSize, unitConfiguration, unitLabel, units, type Unit } from '@/content/plans';

import { Accent } from './Accent';
import { InteractiveMasterPlan } from './InteractiveMasterPlan';
import { Lightbox } from './Lightbox';

import { LeadButton } from './lead/LeadButton';
import { useLead } from './lead/LeadProvider';
import { ArrowUpRight, SparkIcon } from './icons';

type Tab = 'master' | 'A' | 'B';
const TABS: { id: Tab; label: string; note: string }[] = [
  { id: 'master', label: 'Master plan', note: 'Site layout' },
  { id: 'A', label: 'Block A', note: '5 unit types' },
  { id: 'B', label: 'Block B', note: '8 unit types' },
];

const fmt = (n?: number) => (n ? n.toLocaleString('en-IN') : '—');

function Plan({ image, alt }: { image: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const src = `/brochure/${image}.webp`;
  const { width, height } = planSize(image);
  return (
    <>
    <button type="button" onClick={() => setOpen(true)} aria-label={`Open full size: ${alt}`} aria-haspopup="dialog" className="group relative block w-full overflow-hidden rounded-[1.5rem] bg-[#f1e8e2]">
      <Image key={src} src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 760px, 100vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
      <span className="glass absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
        Full size <ArrowUpRight className="size-3.5" />
      </span>
    </button>
    <Lightbox items={[{ slug: image, src, alt, title: alt }]} index={open ? 0 : null} onIndex={() => {}} onClose={() => setOpen(false)} />
    </>
  );
}

/** Brochure master plan and unit drawings with a unit configurator per block. */
export function FloorPlans() {
  const f = site.floorPlans;
  const [tab, setTab] = useState<Tab>('master');
  const [sel, setSel] = useState<Record<'A' | 'B', string>>({ A: 'a-101', B: 'b-101' });
  const { openLead } = useLead();

  const blockUnits = tab === 'master' ? [] : units.filter((u) => u.block === tab);
  const blockFloors = tab === 'master' ? [] : floors.filter((x) => x.block === tab);
  const selectedId = tab === 'master' ? '' : sel[tab];
  const unit = blockUnits.find((u) => u.id === selectedId);
  const floor = blockFloors.find((x) => x.id === selectedId);
  const pick = (id: string) => tab !== 'master' && setSel((s) => ({ ...s, [tab]: id }));

  const reveal = (u: Unit) =>
    openLead({
      intent: 'reveal',
      source: 'floor_plans',
      unit: unitLabel(u),
      configuration: unitConfiguration(u),
      title: 'Reveal Price',
      submitLabel: 'Reveal Price',
    });

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    document.getElementById(`plans-tab-${next.id}`)?.focus();
  };

  return (
    <section id="floor-plans" aria-labelledby="floor-plans-title" className="section relative overflow-hidden bg-cream" data-track-section="floor_plans">

      <div className="container-x">
        {/* Section Heading: Left title and Right description aligned at top, with compact gap to tabs */}
        <div className="mb-3 flex flex-col gap-5 sm:mb-4 md:flex-row md:items-start md:justify-between">
          <div data-reveal className="max-w-xl">
            <p className="kicker">
              <SparkIcon className="size-3" /> {f.eyebrow}
            </p>
            <h2 id="floor-plans-title" className="h2 mt-4 lg:whitespace-nowrap">
              <Accent text={f.title} />
            </h2>
          </div>
          <div className="flex flex-col items-start md:max-w-md lg:max-w-lg md:pt-7" data-reveal>
            <p className="side-note text-[16px] leading-relaxed text-muted">
              {f.body}
            </p>
            <div className="mt-3">
              <LeadButton
                intent="brochure"
                source="floor_plans"
                title="Download The Brochure"
                submitLabel="Download The Brochure"
                className="btn btn--outline btn--sm"
              >
                Download Brochure <ArrowUpRight className="arrow size-4" />
              </LeadButton>
            </div>
          </div>
        </div>

        {/* Segmented tabs */}
        <div role="tablist" aria-label="Plans" className="mb-5 grid w-full grid-cols-3 gap-2 border-b border-line sm:mx-auto sm:mb-7 sm:flex sm:w-fit sm:justify-center sm:gap-5">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              id={`plans-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="plans-panel"
              tabIndex={tab === t.id ? 0 : -1}
              onKeyDown={(e) => onTabKey(e, i)}
              onClick={() => setTab(t.id)}
              className="flex min-h-[58px] min-w-0 flex-col items-center justify-center border-b-2 border-transparent px-2 pb-3 pt-2 text-center text-muted transition-colors hover:text-brand aria-selected:border-brand aria-selected:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra sm:min-w-[130px] sm:flex-none sm:px-3"
            >
              <span className="whitespace-nowrap text-[13.5px] font-semibold leading-tight sm:text-[14.5px]">{t.label}</span>
              <span className="mt-0.5 whitespace-nowrap text-[11px] leading-tight opacity-70 sm:text-[12px]">{t.note}</span>
            </button>
          ))}
        </div>

        <div id="plans-panel" role="tabpanel" aria-labelledby={`plans-tab-${tab}`}>
          <div hidden={tab !== 'master'}>
            <InteractiveMasterPlan />
          </div>
          {tab !== 'master' && (
            <>
              {/* Unit configurator: compact 2-up grid on phones, horizontal snap rail from sm up */}
              <ul className="grid grid-cols-2 gap-2 pb-2 [&>li:last-child:nth-child(odd)]:col-span-2 sm:flex sm:snap-x sm:snap-mandatory sm:gap-3 sm:overflow-x-auto sm:pb-4 sm:[scrollbar-width:thin]" aria-label={`Block ${tab} unit types`}>
                {blockUnits.map((u) => {
                  const active = u.id === selectedId;
                  return (
                    <li key={u.id} className="min-w-0 sm:w-[180px] sm:shrink-0 sm:snap-start">
                      <button
                        type="button"
                        aria-pressed={active}
                        data-tilt
                        onClick={() => pick(u.id)}
                        className={`flex h-full w-full flex-col rounded-xl p-3 text-left transition-all duration-300 sm:rounded-2xl sm:p-3.5 ${active ? 'bg-brand text-white shadow-[var(--shadow-lift)]' : 'bg-white text-ink shadow-[var(--shadow-soft)] hover:-translate-y-1'}`}
                      >
                        <span className={`truncate text-[10px] font-bold uppercase tracking-[0.08em] sm:text-[11px] ${active ? 'text-gold' : 'text-terra'}`}>
                          {u.penthouse ? 'Penthouse' : `Unit ${u.units.split(', ')[0]}${u.units.includes(',') ? ' series' : ''}`}
                        </span>
                        <span className="mt-1.5 font-serif text-[24px] leading-none sm:text-[28px]">{u.type}</span>
                        <span className={`mt-2 text-[11px] sm:text-[12px] ${active ? 'text-white/70' : 'text-muted'}`}>SBUA</span>
                        <span className="mt-0.5 font-serif text-[18px] leading-none tabular sm:text-[22px]">
                          {fmt(u.sbua)} <span className="font-sans text-[11px] sm:text-[13px]">sq.ft</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:mt-2 sm:gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                {/* Re-keyed per selection so each unit / floor swings in on a 3D hinge (.plan-flip). */}
                <div key={`plan-${selectedId}`} className="plan-flip rounded-[1.75rem] bg-white p-2 sm:rounded-[2rem] sm:p-3 shadow-[var(--shadow-soft)]">
                  {unit && <Plan image={unit.image} alt={`Unit plan, ${unitLabel(unit)}, units ${unit.units}`} />}
                  {floor && <Plan image={floor.image} alt={`Floor plan, Block ${floor.block}, ${floor.title}${floor.note ? `, ${floor.note}` : ''}`} />}
                </div>

                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-4">
                  {unit && (
                    <div key={`unit-${unit.id}`} className="plan-flip plan-flip--late rounded-[1.75rem] bg-white p-5 sm:rounded-[2rem] sm:p-6 shadow-[var(--shadow-soft)]" aria-live="polite">
                      <p className="kicker">
                        Block {unit.block} · {unit.baths} baths
                      </p>
                      <p className="mt-3 font-serif text-[38px] leading-none text-ink sm:text-[44px]">
                        <Accent text={`${unit.type}${unit.penthouse ? ' _penthouse_' : ''}`} />
                      </p>
                      <dl className="mt-5 grid grid-cols-2 gap-2">
                        {[
                          ['Carpet', unit.carpet],
                          ['Balcony', unit.balcony],
                          ['Built-up', unit.bua],
                          ['Super built-up', unit.sbua],
                          ...(unit.terrace ? [['Terrace', unit.terrace] as [string, number]] : []),
                        ].map(([k, v]) => (
                          <div key={k as string} className="min-w-0 rounded-2xl bg-cream px-3.5 py-3 sm:px-4">
                            <dt className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] text-muted sm:text-[12px] sm:tracking-[0.12em]">{k}</dt>
                            <dd className="mt-0.5 font-semibold tabular text-ink">{fmt(v as number)} sq.ft</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-4 text-[13px] text-muted">Units {unit.units}</p>
                      <button type="button" className="btn btn--block mt-5" aria-haspopup="dialog" onClick={() => reveal(unit)}>
                        Reveal Price <ArrowUpRight className="arrow size-4" />
                      </button>
                    </div>
                  )}
                  <div className="rounded-[1.75rem] bg-white p-5 shadow-[var(--shadow-soft)] sm:rounded-[2rem] sm:p-6">
                    <p className="kicker !text-muted">Typical floor plates</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {blockFloors.map((x) => (
                        <button key={x.id} type="button" className="chip max-w-full !text-[13px]" aria-pressed={x.id === selectedId} onClick={() => pick(x.id)}>
                          {x.title}
                          {x.note ? ` · ${x.note}` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>


      </div>
    </section>
  );
}
