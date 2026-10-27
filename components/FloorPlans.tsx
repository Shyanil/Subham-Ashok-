'use client';

import Image from 'next/image';
import { useState } from 'react';
import { site } from '@/content/site';
import { floors, masterPlanLegend, planSize, unitConfiguration, unitLabel, units, type Unit } from '@/content/plans';
import { getImage } from '@/lib/media';
import { Accent } from './Accent';
import { SectionHeading } from './SectionHeading';
import { LeadButton } from './lead/LeadButton';
import { useLead } from './lead/LeadProvider';
import { ArrowUpRight } from './icons';

type Tab = 'master' | 'A' | 'B';
const TABS: { id: Tab; label: string; note: string }[] = [
  { id: 'master', label: 'Master plan', note: 'Site layout' },
  { id: 'A', label: 'Block A', note: '5 unit types' },
  { id: 'B', label: 'Block B', note: '8 unit types' },
];

const fmt = (n?: number) => (n ? n.toLocaleString('en-IN') : '—');

function Plan({ image, alt }: { image: string; alt: string }) {
  const src = `/brochure/${image}.webp`;
  const { width, height } = planSize(image);
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open full size: ${alt}`} className="group relative block overflow-hidden rounded-[1.5rem] bg-[#f1e8e2]">
      <Image key={src} src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 760px, 100vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
      <span className="glass absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
        Full size <ArrowUpRight className="size-3.5" />
      </span>
    </a>
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

  const reveal = (u: Unit) => openLead({ intent: 'reveal', source: 'floor_plans', unit: unitLabel(u), configuration: unitConfiguration(u) });

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    document.getElementById(`plans-tab-${next.id}`)?.focus();
  };

  return (
    <section id="floor-plans" aria-labelledby="floor-plans-title" className="section bg-cream" data-track-section="floor_plans">
      <div className="container-x">
        <SectionHeading
          id="floor-plans-title"
          oneLine
          eyebrow={f.eyebrow}
          title={f.title}
          body={f.body}
          action={
            <LeadButton intent="brochure" source="floor_plans" className="btn btn--outline btn--sm">
              Download Brochure <ArrowUpRight className="arrow size-4" />
            </LeadButton>
          }
        />

        {/* Segmented tabs */}
        <div role="tablist" aria-label="Plans" className="mb-6 grid w-full grid-cols-3 gap-1 rounded-[1.25rem] bg-white p-1 shadow-[var(--shadow-soft)] sm:inline-flex sm:w-auto sm:rounded-[1.5rem] sm:p-1.5">
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
              className="flex min-h-[52px] min-w-0 flex-col items-center justify-center rounded-[1rem] px-2 py-2 text-center transition-colors hover:bg-cream aria-selected:bg-brand aria-selected:text-white sm:flex-none sm:items-start sm:rounded-[1.1rem] sm:px-5 sm:text-left"
            >
              <span className="whitespace-nowrap text-[13.5px] font-semibold leading-tight sm:text-[14.5px]">{t.label}</span>
              <span className="mt-0.5 whitespace-nowrap text-[11px] leading-tight opacity-70 sm:text-[12px]">{t.note}</span>
            </button>
          ))}
        </div>

        <div id="plans-panel" role="tabpanel" aria-labelledby={`plans-tab-${tab}`}>
          <div className={`grid gap-4 lg:grid-cols-[1.5fr_1fr] ${tab === 'master' ? '' : 'hidden'}`}>
              <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[var(--shadow-soft)]" data-reveal="3d">
                <Plan image="master-plan" alt="Master plan of Subham Ashok Heights showing Block A, Block B, green lawn, kids' play area, amphitheatre and driveways" />
              </div>

              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-4">
                <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)]" data-reveal="3d" data-tilt>
                  <p className="kicker">Legend</p>
                  <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {masterPlanLegend.map((l, i) => (
                      <li key={l} className="flex items-center gap-2.5 text-[14.5px] text-ink/90">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-bold text-white">{i + 1}</span>
                        {l}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="grid grid-cols-3 gap-3" data-reveal>
                  {[
                    ['2', 'Blocks'],
                    ['11', 'Floors'],
                    ['9 m', 'Road'],
                  ].map(([v, k]) => (
                    <div key={k} className="rounded-[1.5rem] bg-brand px-4 py-5 text-center text-white" data-tilt>
                      <p className="font-serif text-[36px] leading-none">{v}</p>
                      <p className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-gold">{k}</p>
                    </div>
                  ))}
                </div>
                <LeadButton intent="visit" source="master_plan" className="btn btn--block">
                  Book a Site Visit <ArrowUpRight className="arrow size-4" />
                </LeadButton>
              </div>
            </div>
          {tab !== 'master' && (
            <>
              {/* Unit configurator: compact 2-up grid on phones, horizontal snap rail from sm up */}
              <ul className="grid grid-cols-2 gap-2 pb-2 [&>li:last-child:nth-child(odd)]:col-span-2 sm:flex sm:snap-x sm:snap-mandatory sm:gap-3 sm:overflow-x-auto sm:pb-4 sm:[scrollbar-width:thin]" aria-label={`Block ${tab} unit types`}>
                {blockUnits.map((u) => {
                  const active = u.id === selectedId;
                  return (
                    <li key={u.id} className="min-w-0 sm:w-[230px] sm:shrink-0 sm:snap-start">
                      <button
                        type="button"
                        aria-pressed={active}
                        data-tilt
                        onClick={() => pick(u.id)}
                        className={`flex h-full w-full flex-col rounded-2xl p-3.5 text-left transition-all duration-300 sm:rounded-[1.5rem] sm:p-5 ${active ? 'bg-brand text-white shadow-[var(--shadow-lift)]' : 'bg-white text-ink shadow-[var(--shadow-soft)] hover:-translate-y-1'}`}
                      >
                        <span className={`truncate text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[12px] sm:tracking-[0.14em] ${active ? 'text-gold' : 'text-terra'}`}>
                          {u.penthouse ? 'Penthouse' : `Unit ${u.units.split(', ')[0]}${u.units.includes(',') ? ' series' : ''}`}
                        </span>
                        <span className="mt-1.5 font-serif text-[26px] leading-none sm:mt-2 sm:text-[34px]">{u.type}</span>
                        <span className={`mt-2.5 text-[11px] sm:mt-4 sm:text-[13px] ${active ? 'text-white/70' : 'text-muted'}`}>Carpet area</span>
                        <span className="mt-0.5 font-serif text-[19px] leading-none tabular sm:mt-0 sm:text-[26px]">
                          {fmt(u.carpet)} <span className="font-sans text-[11px] sm:text-[13px]">sq.ft</span>
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

        <Architecture />
      </div>
    </section>
  );
}

/** Dark image card with glass stat tiles. */
function Architecture() {
  const img = getImage('road-elevation-view');
  const tiles = [
    ['Structure', '2 Blocks'],
    ['Block B', '11 Floors'],
    ['Architect', 'Banka and Assoc.'],
  ];
  return (
    <div className="on-dark relative mt-16 overflow-hidden rounded-[2rem] sm:rounded-[3rem]" data-reveal="3d">
      <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1280px) 1340px, 100vw" className="object-cover" placeholder="blur" blurDataURL={img.blurDataURL} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f0b08]/95 via-[#1f0b08]/70 to-[#1f0b08]/10" aria-hidden="true" />
      <div className="relative flex flex-col gap-8 p-6 sm:p-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-lg">
          <span className="block h-0.5 w-12 bg-gold" aria-hidden="true" />
          <h3 className="h2 mt-6 !text-white">
            <Accent text="Built to _Last_" />
          </h3>
          <p className="mt-5 text-[16px] leading-relaxed text-white/80">
            Earthquake-resistant RCC towers with branded lifts, vitrified flooring and a clean, well-lit façade — designed by Banka and Associates, Guwahati.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          {tiles.map(([k, v]) => (
            <li key={k} className="min-w-0 rounded-[1.5rem] bg-white/10 px-4 py-4 last:col-span-2 sm:min-w-[130px] sm:px-5 text-center ring-1 ring-white/15 backdrop-blur-md">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/70">{k}</p>
              <p className="mt-1 font-serif text-[24px] leading-none text-white">{v}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
