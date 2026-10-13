'use client';

import { useMemo, useRef } from 'react';
import { site } from '@/content/site';
import { keyDistances } from '@/content/plans';
import { useReveal } from '@/hooks/useReveal';
import { Headline } from './Headline';

const km = (d: string) => parseFloat(d);

/**
 * Location: the brochure map in the same frame size as the floor plans, a
 * "nearest" panel of equal height beside it, then every key distance in an
 * even four-column grid.
 */
export function Location() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const l = site.location;
  const c = site.contact;
  const nearest = useMemo(
    () =>
      keyDistances
        .flatMap((g) => g.items.map(([name, d]) => ({ name, d })))
        .sort((x, y) => km(x.d) - km(y.d))
        .slice(0, 6),
    [],
  );

  return (
    <section ref={root} id="location" className="location surface-light" aria-labelledby="location-title">
      <div className="container-x">
        <div className="chapter__rule" data-reveal aria-hidden="true" />
        <div className="chapter__grid">
          <div className="chapter__meta">
            <p className="label text-[var(--accent-ink)]" data-reveal>
              {l.label}
            </p>
          </div>
          <Headline lines={l.headline} id="location-title" className="chapter__title" />
          <div className="chapter__copy">
            <p className="chapter__body" data-reveal>
              {l.body}
            </p>
          </div>
        </div>

        <div className="frame-row">
          <figure className="frame" data-reveal>
            <a href="/brochure/location-map.webp" target="_blank" rel="noopener noreferrer" className="frame__media" aria-label="Open the location map full size">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brochure/location-map.webp"
                alt="Location map of Subham Ashok Heights off Beharbari road, showing nearby schools, hospitals, showrooms, banks and markets"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>

          <aside className="panel panel--dark" data-reveal>
            <p className="label panel__eyebrow">Site address</p>
            <p className="panel__title">
              {c.siteAddress[0]}
              <br />
              {c.siteAddress[1]}
            </p>
            <p className="label panel__eyebrow mt-2">Nearest</p>
            <ul className="distance-list">
              {nearest.map((n) => (
                <li key={n.name}>
                  <span>{n.name}</span>
                  <span className="distance-list__km">{n.d}</span>
                </li>
              ))}
            </ul>
            <a href={l.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold panel__cta">
              Open in Google Maps ↗
            </a>
          </aside>
        </div>

        <div className="distances">
          <h3 className="sub-title" data-reveal>
            Key distances
          </h3>
          <div className="distances__grid">
            {keyDistances.map((g) => (
              <div key={g.group} className="distances__group" data-reveal>
                <p className="distances__group-title">{g.group}</p>
                <ul className="distance-list">
                  {g.items.map(([name, d]) => (
                    <li key={name}>
                      <span>{name}</span>
                      <span className="distance-list__km">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
