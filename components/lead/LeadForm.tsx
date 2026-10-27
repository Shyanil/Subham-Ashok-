'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { leadSchema, priorityLeadSchema, type LeadInput } from '@/lib/lead';
import { getAttribution } from '@/lib/attribution';
import { track } from '@/lib/analytics';
import { project } from '@/content/site';
import { projectConfig } from '@/src/config/project';
import { useLead } from './LeadProvider';

export type LeadFormVariant = 'inline' | 'modal' | 'floating' | 'sticky';

type Props = {
  variant: LeadFormVariant;
  /** "quick" = name, mobile, looking-for + consent. "full" adds budget; "priority" adds email and pincode. */
  fields?: 'quick' | 'full' | 'priority';
  source: string;
  unit?: string;
  defaultConfiguration?: string;
  submitLabel?: string;
  /** Tone of the surrounding surface, so labels keep contrast. */
  tone?: 'light' | 'dark';
  /** Floating priority form only: control rendered at the end of the field row (the close button). */
  trailing?: ReactNode;
  onSuccess?: () => void;
};

type Values = { name: string; phone: string; email: string; configuration: string; pincode: string; budget: string; consent: boolean };
type Errors = Partial<Record<keyof Values | 'form', string>>;

export const BROCHURE_URL = '/brochure/subham-ashok-heights-brochure.pdf';

const fieldError = (values: Values, key: keyof Values): string | undefined => {
  const shape = priorityLeadSchema.shape[key];
  const r = shape.safeParse(values[key]);
  return r.success ? undefined : r.error.issues[0]?.message;
};

/**
 * The one lead form used everywhere. Validated with
 * the same zod schema the API uses, honeypot included.
 */
export function LeadForm({
  variant,
  fields = 'full',
  source,
  unit,
  defaultConfiguration = '',
  submitLabel = 'Download Brochure',
  tone = 'light',
  trailing,
  onSuccess,
}: Props) {
  const id = useId();
  const { markSubmitted } = useLead();
  const [values, setValues] = useState<Values>({
    name: '',
    phone: '',
    email: '',
    configuration: defaultConfiguration,
    pincode: '',
    budget: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const withBudget = fields === 'full';
  const priority = fields === 'priority';
  const row = variant === 'sticky';
  const floatingPriority = priority && variant === 'floating';

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const blur = (k: keyof Values) => {
    if (values[k] === '' && k !== 'consent') return;
    setErrors((e) => ({ ...e, [k]: fieldError(values, k) }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input: LeadInput = {
      name: values.name,
      phone: values.phone,
      configuration: values.configuration,
      budget: withBudget ? values.budget || undefined : undefined,
      email: priority ? values.email : undefined,
      pincode: priority ? values.pincode : undefined,
      consent: values.consent as true,
    };
    const parsed = (priority ? priorityLeadSchema : leadSchema).safeParse(input);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Values] ??= issue.message;
      setErrors(next);
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      track('form_error', { source, reason: 'validation' });
      return;
    }

    setStatus('sending');
    setErrors({});
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '',
          meta: { source, unit, ...getAttribution() },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Errors };
      if (!res.ok || !data.ok) {
        setErrors({ ...(data.fieldErrors ?? {}), form: data.error ?? 'Something went wrong. Please try again.' });
        setStatus('idle');
        track('form_error', { source, reason: String(res.status) });
        return;
      }
      setStatus('done');
      markSubmitted();
      track('form_submit', {
        source,
        unit,
        configuration: parsed.data.configuration,
        budget: parsed.data.budget,
        form_variant: variant,
      });
      onSuccess?.();
    } catch {
      setErrors({ form: 'Network error. Please check your connection, then try again.' });
      setStatus('idle');
      track('form_error', { source, reason: 'network' });
    }
  }


  if (status === 'done') {
    return (
      <div role="status" aria-live="polite" className={`text-center ${tone === 'dark' ? 'text-cream' : ''}`}>
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-terra/10 text-terra" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={`font-serif text-[36px] leading-none ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>Thank you, {values.name.trim().split(' ')[0]}!</p>
        <p className={`mx-auto mt-2 max-w-sm text-[15px] ${tone === 'dark' ? 'text-white/75' : 'text-muted'}`}>
          {floatingPriority ? 'Our team will call you shortly to confirm your property slot.' : 'Our team will call you shortly with the price list and to fix your site visit.'}
        </p>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <a href={BROCHURE_URL} download className={`btn ${tone === 'dark' ? 'btn--ghost' : 'btn--outline'}`}>
            Download brochure (PDF)
          </a>
        </div>
      </div>
    );
  }

  const nameId = `${id}-name`;
  const phoneId = `${id}-phone`;
  const emailId = `${id}-email`;
  const cfgId = `${id}-cfg`;
  const pincodeId = `${id}-pincode`;
  const budgetId = `${id}-budget`;
  const consentId = `${id}-consent`;
  const err = (k: keyof Values) => errors[k] && (
    <p id={`${id}-${k}-err`} className="field__error">
      {errors[k]}
    </p>
  );
  const described = (k: keyof Values) => (errors[k] ? `${id}-${k}-err` : undefined);

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      data-lead-form={variant}
      className={`relative ${tone === 'dark' ? 'form-dark' : ''} ${floatingPriority ? 'priority-float' : ''}`}
      aria-describedby={errors.form ? `${id}-form-err` : undefined}
    >
      <div className={row ? 'grid gap-3 lg:grid-cols-[1.1fr_1.1fr_1fr_auto] lg:items-start' : floatingPriority ? 'grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,0.85fr)_auto_auto] items-start gap-2 xl:gap-3' : priority ? `grid gap-3.5 ${variant === 'inline' ? 'sm:grid-cols-2' : ''}` : `grid gap-3.5 ${variant === 'inline' && withBudget ? 'sm:grid-cols-2' : ''}`}>
        <div className="field">
          <label htmlFor={nameId}>
            Name <span className="text-terra" aria-hidden="true">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            className="input"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            aria-invalid={!!errors.name}
            aria-describedby={described('name')}
            required
          />
          {err('name')}
        </div>

        <div className="field">
          <label htmlFor={phoneId}>
            Phone <span className="text-terra" aria-hidden="true">*</span>
          </label>
          <div className="phone-wrap">
            <span className="phone-prefix" aria-hidden="true">
              +91
            </span>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile"
              maxLength={14}
              className="input tabular"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value.replace(/[^\d ]/g, ''))}
              onBlur={() => blur('phone')}
              aria-invalid={!!errors.phone}
              aria-describedby={described('phone') ?? (floatingPriority ? undefined : `${id}-phone-hint`)}
              required
            />
          </div>
          {!floatingPriority && (
            <span id={`${id}-phone-hint`} className="sr-only">
              Indian mobile number, country code +91 is added for you
            </span>
          )}
          {err('phone')}
        </div>

        {priority && (
          <div className="field">
            <label htmlFor={emailId}>Email <span className="text-terra" aria-hidden="true">*</span></label>
            <input id={emailId} name="email" type="email" className="input" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} aria-invalid={!!errors.email} aria-describedby={described('email')} required />
            {err('email')}
          </div>
        )}

        <div className="field">
          <label htmlFor={cfgId}>
            Home type <span className="text-terra" aria-hidden="true">*</span>
          </label>
          <select
            id={cfgId}
            name="configuration"
            className="input"
            value={values.configuration}
            onChange={(e) => set('configuration', e.target.value)}
            onBlur={() => blur('configuration')}
            aria-invalid={!!errors.configuration}
            aria-describedby={described('configuration')}
            required
          >
            <option value="" disabled>
              Select home type
            </option>
            {projectConfig.CONFIGURATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {err('configuration')}
        </div>

        {priority && (
          <div className={`field ${variant === 'inline' ? 'sm:col-span-2' : ''}`}>
            <label htmlFor={pincodeId}>Pincode <span className="text-terra" aria-hidden="true">*</span></label>
            <input id={pincodeId} name="pincode" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} className="input tabular" placeholder="6-digit pincode" value={values.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('pincode')} aria-invalid={!!errors.pincode} aria-describedby={described('pincode')} required />
            {err('pincode')}
          </div>
        )}

        {withBudget && (
          <div className="field">
            <label htmlFor={budgetId}>
              Budget range <span className="font-medium normal-case tracking-normal">(optional)</span>
            </label>
            <select
              id={budgetId}
              name="budget"
              className="input"
              value={values.budget}
              onChange={(e) => set('budget', e.target.value)}
              aria-invalid={!!errors.budget}
              aria-describedby={described('budget')}
            >
              <option value="">Select budget</option>
              {projectConfig.BUDGET_RANGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {err('budget')}
          </div>
        )}

        {(row || floatingPriority) && (
          <div className={floatingPriority ? 'pt-[17px]' : 'lg:pt-[27px]'}>
            <SubmitButton sending={status === 'sending'} label={submitLabel} />
          </div>
        )}
        {floatingPriority && trailing && <div className="pt-[17px]">{trailing}</div>}
      </div>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div className="hp" aria-hidden="true">
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={floatingPriority ? 'mt-1.5' : 'mt-3.5'}>
        <label htmlFor={consentId} className="consent">
          <input
            id={consentId}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={described('consent')}
          />
          <span>
            I agree to be contacted by {project.developer} by call, SMS or WhatsApp about this project. This overrides any DND / NDNC registration.
          </span>
        </label>
        {err('consent')}
      </div>

      {errors.form && (
        <div id={`${id}-form-err`} role="alert" className="mt-3 rounded-2xl border border-error/30 bg-error/5 p-3 text-[14px] text-error">
          {errors.form}
        </div>
      )}

      {!row && !floatingPriority && (
        <div className="mt-5">
          <SubmitButton sending={status === 'sending'} label={submitLabel} />
        </div>
      )}
    </form>
  );
}

function SubmitButton({ sending, label }: { sending: boolean; label: string }) {
  return (
    <button type="submit" className="btn btn--block" disabled={sending} aria-busy={sending}>
      {sending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Sending…
        </>
      ) : (
        label
      )}
      {!sending && (
        <span className="arrow" aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
