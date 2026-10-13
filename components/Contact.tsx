'use client';

import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { config, project, site } from '@/content/site';
import { runtime, scheduler } from '@/lib/runtime';
import { useReveal } from '@/hooks/useReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Headline } from './Headline';
import { Magnetic } from './Magnetic';
import { CrystalLogo } from './CrystalLogo';

const waLink = (text: string) => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3Z" />
  </svg>
);

/** Closing chapter: enquiry → WhatsApp, phone/email, addresses, RERA. Hosts the 3D crystal. */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const gemBox = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', phone: '', interest: '3 BHK' });
  const c = site.contact;
  useReveal(root, { start: 'top 70%' });

  // Feeds the 3D crystal (components/three/FooterGem) only while this section is on screen.
  useGSAP(
    () => {
      if (reduced) return;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (s) => {
          runtime.footer.progress = Math.min(1, s.progress * 1.8);
          scheduler.bump();
        },
        onToggle: (s) => {
          runtime.footer.active = s.isActive;
          scheduler.bump(3);
        },
      });
      runtime.footer.active = st.isActive;
      runtime.footer.el = gemBox.current;
      return () => {
        st.kill();
        runtime.footer.active = false;
        runtime.footer.el = null;
      };
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello! I'm interested in ${project.name}.\nName: ${form.name}\nPhone: ${form.phone}\nLooking for: ${form.interest}`;
    window.open(waLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <section ref={root} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="footer__gem-fallback" aria-hidden="true">
        <CrystalLogo />
      </div>
      <div className="container-x contact__main">
        <div ref={gemBox} className="contact__gem" aria-hidden="true" />
        <p className="label text-[var(--gold)]" data-reveal>
          {c.label}
        </p>
        <Headline lines={c.headline} id="contact-title" className="footer__title" />
        <p className="footer__body" data-reveal>
          {c.body}
        </p>

        <div className="contact__grid">
          <form className="contact__form" onSubmit={submit} data-reveal>
            <label className="field">
              <span className="label">Name</span>
              <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="field">
              <span className="label">Phone</span>
              <input
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="[0-9+\s\-]{8,15}"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <fieldset className="field">
              <legend className="label">Looking for</legend>
              <div className="contact__choices">
                {['2 BHK', '3 BHK', '4 BHK', 'Penthouse'].map((o) => (
                  <label key={o} className="chip contact__choice">
                    <input type="radio" name="interest" value={o} checked={form.interest === o} onChange={() => setForm({ ...form, interest: o })} />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <button type="submit" className="btn btn--gold">
                  <WhatsAppIcon />
                  Send enquiry
                </button>
              </Magnetic>
              <a href={c.phoneHref} className="btn btn--ghost">
                Call {c.phone}
              </a>
            </div>
          </form>

          <div className="contact__info" data-reveal>
            <div>
              <p className="label text-[var(--gold)]">Marketing</p>
              <p className="contact__big">
                <a href={c.phoneHref} className="link-underline">
                  {c.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${c.email}`} className="link-underline">
                  {c.email}
                </a>
              </p>
              <p>
                <a href={waLink(c.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {c.cta} ↗
                </a>
              </p>
            </div>
            <div>
              <p className="label text-[var(--gold)]">Site address</p>
              {c.siteAddress.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div>
              <p className="label text-[var(--gold)]">Corporate office</p>
              {c.corporateAddress.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div>
              <p className="label text-[var(--gold)]">RERA registration</p>
              <p>
                <a href={c.reraHref} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {c.rera} ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
