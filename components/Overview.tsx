'use client';

import { Fragment } from 'react';
import { site } from '@/content/site';
import { Chapter } from './Chapter';
import { CountUp } from './CountUp';

/** Project introduction with the key figures from the brochure. */
export function Overview() {
  const o = site.overview;
  return (
    <Chapter id="overview" label={o.label} meta={o.location} headline={o.headline} lead={o.lead} body={o.body} scrub object="compass">
      <dl className="stats stats--4">
        {o.stats.map((s) => (
          <div key={s.label} className="stat" data-reveal>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="stat__value">
                {s.values.map((v, i) => (
                  <Fragment key={i}>
                    {i > 0 && <em className="accent stat__joiner"> {'joiner' in s ? s.joiner : ''} </em>}
                    <CountUp value={v} />
                  </Fragment>
                ))}
                <span className="stat__unit"> {s.unit}</span>
              </span>
              <span className="stat__label label" aria-hidden="true">
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}
