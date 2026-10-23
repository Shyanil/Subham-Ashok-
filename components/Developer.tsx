'use client';

import { useRef } from 'react';
import { project, site } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import { Headline } from './Headline';

/** About Subham Group: track record, chairman's note, architect, portfolio. */
export function Developer() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const d = site.developer;

  return (
    <section ref={root} id="developer" className="developer" aria-labelledby="developer-title">
      <div className="container-x">
        <div className="chapter__grid">
          <div className="chapter__meta">
            <p className="label text-[var(--gold)]" data-reveal>
              {d.label}
            </p>
          </div>
          <Headline lines={d.headline} id="developer-title" className="chapter__title developer__title" />
          <div className="chapter__copy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/subham-logo-light.webp" width={328} height={311} loading="lazy" decoding="async" alt={`${project.developer} — ${project.developerTagline}`} className="developer__logo" data-reveal />
            <p className="chapter__body" data-reveal>
              {d.body}
            </p>
          </div>
        </div>

        <dl className="developer__stats">
          {d.stats.map((s) => (
            <div key={s.label} data-reveal>
              <dt className="label">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="developer__notes">
          <figure className="developer__note" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brochure/chairman.webp" alt={d.note.name} className="developer__portrait" loading="lazy" />
            <div>
              <p className="label text-[var(--gold)]">{d.note.title}</p>
              <blockquote className="developer__quote">“{d.note.quote}”</blockquote>
              <figcaption className="label text-[var(--muted)]">
                {d.note.name} · {d.note.role}
              </figcaption>
            </div>
          </figure>
          <div className="developer__architect" data-reveal>
            <p className="label text-[var(--gold)]">Architect</p>
            <p className="developer__architect-name">{d.architect.name}</p>
            <p className="text-[var(--muted)]">{d.architect.body}</p>
          </div>
        </div>

        <div className="developer__projects">
          {d.projects.map((g) => (
            <div key={g.title} data-reveal>
              <p className="label text-[var(--gold)]">
                {g.title} · {String(g.items.length).padStart(2, '0')}
              </p>
              <ul>
                {g.items.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
