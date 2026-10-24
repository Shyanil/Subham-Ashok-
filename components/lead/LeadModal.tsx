'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { project } from '@/content/site';
import { getImage } from '@/lib/media';
import { possessionLabel, priceLabel, projectConfig } from '@/src/config/project';
import { LeadForm } from './LeadForm';
import type { LeadRequestOptions } from './LeadProvider';
import { CheckIcon, CloseIcon, ShieldIcon } from '../icons';

const COPY: Record<LeadRequestOptions['intent'], { title: string; sub: string; submit: string }> = {
  price: { title: 'Download the brochure', sub: 'Current prices, offers and floor plans, sent to your phone.', submit: 'Download Brochure' },
  reveal: { title: 'Reveal price', sub: 'We will share the current price and availability for this home.', submit: 'Reveal Price' },
  brochure: { title: 'Download the brochure', sub: 'Get the full e-brochure with plans and specifications.', submit: 'Download Brochure' },
  visit: { title: 'Book a free site visit', sub: 'Pick up from the gate and a guided walk-through with our team.', submit: 'Book Site Visit' },
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Native <dialog> (top layer, page inert) + an explicit Tab trap, Esc / backdrop / × to close. */
export function LeadModal({ request, onClose }: { request: LeadRequestOptions | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = !!request;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
      // Focus the first field rather than the close button so typing can start straight away.
      requestAnimationFrame(() => d.querySelector<HTMLElement>('input:not([tabindex="-1"])')?.focus());
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const handleClose = () => {
    document.documentElement.style.overflow = '';
    onClose();
    opener.current?.focus?.({ preventScroll: true });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return;
    const nodes = Array.from(ref.current!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const copy = request ? COPY[request.intent] : COPY.price;
  const img = getImage('gate-view');

  return (
    <dialog
      ref={ref}
      className="lead-dialog"
      aria-labelledby="lead-dialog-title"
      onClose={handleClose}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === ref.current && handleClose()}
    >
      {request && (
        <div className="lead-dialog__panel relative grid max-h-[92dvh] overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl md:grid-cols-[0.85fr_1.15fr] md:overflow-hidden md:rounded-[2.5rem]">
          <div className="relative hidden md:block">
            <Image src={img.src} alt="" fill sizes="380px" className="object-cover" placeholder="blur" blurDataURL={img.blurDataURL} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c0907] via-[#1c0907]/55 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="font-serif text-[34px] italic leading-none">{project.name}</p>
              <p className="mt-2 text-[13px] text-white/75">
                {priceLabel} · {possessionLabel}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em] ring-1 ring-white/15">
                <ShieldIcon className="size-4" /> RERA: {projectConfig.RERA}
              </p>
            </div>
          </div>

          <div className="p-6 pb-[calc(24px+env(safe-area-inset-bottom))] sm:p-10 md:max-h-[92dvh] md:overflow-y-auto">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line md:hidden" aria-hidden="true" />
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-paper text-ink hover:bg-sand"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            <p className="kicker">Enquire</p>
            <h2 id="lead-dialog-title" className="mt-3 pr-10 text-[40px] leading-[0.95]">
              {copy.title}
            </h2>
            <p className="mt-1 text-[15px] text-muted">
              {request.unit ? <strong className="font-semibold text-ink">{request.unit}. </strong> : null}
              {copy.sub}
            </p>
            <div className="mt-5">
              <LeadForm
                key={`${request.intent}-${request.source}-${request.unit ?? ''}`}
                variant="modal"
                source={request.source}
                unit={request.unit}
                defaultConfiguration={request.configuration}
                submitLabel={copy.submit}
              />
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
              {projectConfig.PERKS.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5">
                  <CheckIcon className="size-3.5 text-terra" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </dialog>
  );
}
