'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { project } from '@/content/site';
import { getImage, objectPosition } from '@/lib/media';
import { projectConfig } from '@/src/config/project';
import { LeadForm } from './LeadForm';
import type { LeadRequestOptions } from './LeadProvider';
import { CloseIcon, ShieldIcon } from '../icons';

const COPY: Record<LeadRequestOptions['intent'], { title: string; sub: string; submit: string; kicker: string }> = {
  price: {
    kicker: 'Price Details',
    title: 'Download The Brochure',
    sub: 'Current prices, launch offers and floor plans, sent directly to your phone.',
    submit: 'Download The Brochure',
  },
  reveal: {
    kicker: 'Property Enquiry',
    title: 'Download Brochure',
    sub: 'Explore the floor plans, amenities and specifications in our brochure.',
    submit: 'Download Brochure',
  },
  brochure: {
    kicker: 'Project Brochure',
    title: 'Download The Brochure',
    sub: 'Leave your details to download the brochure.',
    submit: 'Download The Brochure',
  },
  visit: {
    kicker: 'Schedule A Visit',
    title: 'Schedule A Site Visit',
    sub: 'Pick up from the gate and an exclusive guided walk-through with our team.',
    submit: 'Schedule A Site Visit',
  },
};

/** Converts any sentence to Title Case (Capitalizes each word) */
export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => {
      if (!word) return '';
      const lower = word.toLowerCase();
      if (['bhk', 'pdf', 'rera', 'sms', 'dnd', 'crm'].includes(lower)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

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

  const fallback = request ? COPY[request.intent] : COPY.price;
  // Dynamically adapt heading and submit button based on the clicked CTA (in Title Case)
  const modalTitle = request?.title ? toTitleCase(request.title) : fallback.title;
  const modalSubmit = request?.submitLabel ? toTitleCase(request.submitLabel) : fallback.submit;

  // Original full-resolution night aerial render, served without another lossy encode.
  const img = getImage('aerial-night-view');

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
        <div className="lead-dialog__panel relative grid w-full max-h-[92dvh] overflow-y-auto rounded-t-[1.75rem] bg-white shadow-2xl md:grid-cols-[0.75fr_1.25fr] md:rounded-[2rem]">
          {/* Left: High Definition Tower Render */}
          <div className="relative hidden md:block">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              preload
              unoptimized
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
              style={{ objectPosition: objectPosition(img.focus) }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c0907] via-[#1c0907]/45 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="font-serif text-[28px] italic leading-none">{project.name}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ring-1 ring-white/20">
                <ShieldIcon className="size-3.5" /> RERA: {projectConfig.RERA}
              </p>
            </div>
          </div>

          {/* Right: Form Panel (Capitalized Headings & Fits in One View) */}
          <div className="relative min-w-0 p-6 pt-12 sm:p-8 sm:pt-12 md:p-9 md:pt-12">
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-line md:hidden" aria-hidden="true" />
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-full bg-paper text-ink transition-colors hover:bg-sand"
              aria-label="Close"
            >
              <CloseIcon className="size-4" />
            </button>

            <div>
              <h2 id="lead-dialog-title" className="pr-4 font-serif text-[30px] leading-tight text-ink sm:text-[34px]">
                {modalTitle}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {fallback.sub}
              </p>
              {request.unit && <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-[12px] leading-relaxed text-muted">{request.unit}</p>}
            </div>

            <div className="mt-6">
              <LeadForm
                key={`${request.intent}-${request.source}-${request.unit ?? ''}-${modalTitle}`}
                variant="modal"
                source={request.source}
                unit={request.unit}
                defaultConfiguration={request.configuration}
                submitLabel={modalSubmit}
              />
            </div>

          </div>
        </div>
      )}
    </dialog>
  );
}
