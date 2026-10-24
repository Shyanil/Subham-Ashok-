import * as z from 'zod/mini';
import { projectConfig } from '@/src/config/project';

/** 10-digit Indian mobile; accepts "+91 98540 41000", "098540…" and normalises to 10 digits. */
export const normalisePhone = (raw: string) => raw.replace(/\D/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '');
export const INDIAN_MOBILE = /^[6-9]\d{9}$/;

const configurations = projectConfig.CONFIGURATIONS as readonly string[];
const budgets = projectConfig.BUDGET_RANGES as readonly string[];
const max = (n: number) => z.optional(z.string().check(z.maxLength(n)));
const email = z.string().check(z.trim(), z.maxLength(254, 'Email is too long'), z.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'));
const pincode = z.string().check(z.regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode'));

/**
 * Shared by the client form and /api/lead so both validate identically.
 * zod/mini keeps this off the critical path (~a tenth of classic zod's client weight).
 */
export const leadSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, 'Please enter your full name'),
      z.maxLength(80, 'Name is too long'),
      z.regex(/^[\p{L} .'-]+$/u, 'Please use letters only'),
    ),
  phone: z.pipe(
    z.string(),
    z
      .transform(normalisePhone)
      .check(z.refine((v: string) => INDIAN_MOBILE.test(v), 'Enter a valid 10-digit mobile number')),
  ),
  configuration: z.string().check(z.refine((v) => configurations.includes(v), 'Select what you are looking for')),
  budget: z.optional(z.string().check(z.refine((v) => !v || budgets.includes(v), 'Select a budget range'))),
  email: z.optional(email),
  pincode: z.optional(pincode),
  consent: z.literal(true, { error: 'Please agree to be contacted' }),
});

export const priorityLeadSchema = z.extend(leadSchema, { email, pincode });

/** Attribution sent with every lead. Never validated against the user. */
export const metaSchema = z.object({
  source: max(60),
  unit: max(80),
  page_url: max(500),
  referrer: max(500),
  utm_source: max(120),
  utm_medium: max(120),
  utm_campaign: max(160),
  utm_term: max(160),
  utm_content: max(160),
  gclid: max(200),
  fbclid: max(200),
});

export const leadRequestSchema = z.extend(leadSchema, {
  meta: z.optional(metaSchema),
  /** Honeypot: real visitors never see or fill this. */
  website: max(200),
});

export const priorityLeadRequestSchema = z.extend(leadRequestSchema, { email, pincode });

export type LeadInput = z.input<typeof leadSchema>;
export type LeadRequest = z.input<typeof leadRequestSchema>;
