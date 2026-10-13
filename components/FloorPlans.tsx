'use client';

import { useMemo, useRef, useState } from 'react';
import { site } from '@/content/site';
import { floors, masterPlanLegend, specifications, units } from '@/content/plans';
import { useReveal } from '@/hooks/useReveal';
import { Headline } from './Headline';

type Tab = 'master' | 'A' | 'B';
const TABS: { id: Tab; label: string }[] = [
  { id: 'master', label: 'Master plan' },
  { id: 'A', label: 'Block A' },
  { id: 'B', label: 'Block B' },
];

const fmt = (n?: number) => (n ? n.toLocaleString('en-IN') : '—');

/** Master plan, every typical floor plate and every unit type from the brochure, with areas and specifications. */
export function FloorPlans() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>('master');
  const [selected, setSelected] = useState<Record<'A' | 'B', string>>({ A: 'fa-1', B: 'fb-1' });
  useReveal(root);
  const f = site.floorPlans;

  const blockFloors = useMemo(() => (tab === 'master' ? [] : floors.filter((x) => x.block === tab)), [tab]);
  const blockUnits = useMemo(() => (tab === 'master' ? [] : units.filter((u) => u.block === tab)), [tab]);
  const sel = tab === 'master' ? null : selected[tab];
  const floor = blockFloors.find((x) => x.id === sel) ?? null;
  const unit = floor ? null : blockUnits.find((u) => u.id === sel) ?? null;
  const pickPlan = (id: string) => tab !== 'master' && setSelected((s) => ({ ...s, [tab]: id }));

  const src = `/brochure/${unit?.image ?? floor?.image ?? 'master-plan'}.webp`;
  const alt = unit
    ? `Unit plan, Block ${unit.block} ${unit.type}${unit.penthouse ? ' penthouse' : ''}, units ${unit.units}`
    : floor
      ? `Floor plan, Block ${floor.block}, ${floor.title}${floor.note ? `, ${floor.note}` : ''}`
      : 'Master plan of Subham Ashok Heights showing Block A, Block B, lawn, play area and driveways';

  return (
    <section ref={root} id="floor-plans" className="plans surface-light" aria-labelledby="floor-plans-title">
      <div className="container-x">
        <div className="chapter__grid">
          <div className="chapter__meta">
            <p className="label text-[var(--accent-ink)]" data-reveal>
              {f.label}
            </p>
          </div>
          <Headline lines={f.headline} id="floor-plans-title" className="chapter__title" />
          <div className="chapter__copy">
            <p className="chapter__body" data-reveal>
              {f.body}
            </p>
          </div>
        </div>

        <div className="plans__tabs" role="tablist" aria-label="Plans" data-reveal>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`plans-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="plans-panel"
              className="chip"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="plans-panel" role="tabpanel" aria-labelledby={`plans-tab-${tab}`} className="frame-row frame-row--flip" data-reveal>
          <aside className="panel plans__side">
            {tab === 'master' ? (
              <>
                <p className="label panel__eyebrow">Legend</p>
                <ol className="plans__legend">
                  {masterPlanLegend.map((l, i) => (
                    <li key={l}>
                      <span className="plans__legend-n">{i + 1}</span>
                      {l}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <p className="label panel__eyebrow">Floor plans</p>
                <ul className="plans__units" aria-label={`Block ${tab} floor plans`}>
                  {blockFloors.map((x) => (
                    <li key={x.id}>
                      <button type="button" className="plans__unit" aria-pressed={x.id === sel} onClick={() => pickPlan(x.id)}>
                        <span className="plans__unit-type">{x.title}</span>
                        {x.note && <span className="label">{x.note}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="label panel__eyebrow plans__group">Unit plans</p>
                <ul className="plans__units" aria-label={`Block ${tab} unit plans`}>
                  {blockUnits.map((u) => (
                    <li key={u.id}>
                      <button type="button" className="plans__unit" aria-pressed={u.id === sel} onClick={() => pickPlan(u.id)}>
                        <span className="plans__unit-type">
                          {u.type}
                          {u.penthouse && <em className="accent"> penthouse</em>}
                        </span>
                        <span className="label">
                          Unit {u.units.split(', ')[0]}
                          {u.units.includes(',') ? ' series' : ''}
                        </span>
                        <span className="plans__unit-area">{fmt(u.carpet)} sq.ft</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>

          <figure className="frame">
            <a href={src} target="_blank" rel="noopener noreferrer" className="frame__media" aria-label={`Open full size: ${alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={src} src={src} alt={alt} className="plans__img" loading="lazy" decoding="async" />
            </a>
            <span className="label frame__hint" aria-hidden="true">
              Open full size ↗
            </span>
          </figure>
        </div>

        <div className="facts" aria-live="polite">
          <div className="facts__head">
            <p className="facts__title">
              {unit
                ? `Block ${unit.block} · ${unit.type} · ${unit.baths}T${unit.penthouse ? ' · Penthouse' : ''}`
                : floor
                  ? `Block ${floor.block} · ${floor.title}${floor.note ? ` · ${floor.note}` : ''}`
                  : 'Master plan'}
            </p>
            <p className="label text-[var(--muted)]">
              {unit ? `Units ${unit.units}` : floor ? 'Select a unit plan for its areas' : 'Block A & Block B on a 9 m wide road'}
            </p>
          </div>
          {unit && (
            <dl className="facts__grid">
              {[
                ['Carpet area', unit.carpet],
                ['Balcony area', unit.balcony],
                ['Built-up area', unit.bua],
                ['Super built-up', unit.sbua],
                ['Terrace area', unit.terrace],
              ].map(([k, v]) => (
                <div key={k as string} className="facts__cell">
                  <dt className="label">{k}</dt>
                  <dd>
                    {fmt(v as number | undefined)}
                    {v ? <span className="facts__unit"> sq.ft</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="specs">
          <h3 className="sub-title" data-reveal>
            {f.specsTitle}
          </h3>
          <dl className="cell-grid">
            {specifications.map((s) => (
              <div key={s.k} className="cell" data-reveal>
                <dt className="label">{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
