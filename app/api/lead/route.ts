import type { NextRequest } from 'next/server';
import { leadRequestSchema, priorityLeadRequestSchema } from '@/lib/lead';
import { project } from '@/content/site';

/**
 * POST /api/lead
 *  1. zod validation (same schema as the client form)
 *  2. honeypot: bots that fill `website` get a fake 200 and nothing is forwarded
 *  3. per-IP rate limit (in-memory, per server instance — good enough to stop
 *     button mashing; put a WAF / Upstash limit in front for real abuse)
 *  4. forward JSON to FORM_ENDPOINT, and e-mail via Resend when RESEND_API_KEY is set
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Forms that require email and pincode (must match `fields="priority"` in the UI). */
const PRIORITY_SOURCES = new Set(['floating_priority', 'final_form']);

const json = (body: unknown, status = 200) => Response.json(body, { status });

async function postWithTimeout(url: string, init: RequestInit, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  if (rateLimited(ip)) return json({ ok: false, error: 'Too many requests. Please try again in a few minutes.' }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  const source = typeof body === 'object' && body !== null && 'meta' in body && typeof body.meta === 'object' && body.meta !== null && 'source' in body.meta
    ? body.meta.source
    : undefined;
  const parsed = (typeof source === 'string' && PRIORITY_SOURCES.has(source) ? priorityLeadRequestSchema : leadRequestSchema).safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, error: 'Please check the highlighted fields', fieldErrors }, 422);
  }

  const { website, meta, ...lead } = parsed.data;
  if (website) return json({ ok: true });

  const payload = {
    project: project.name,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? '',
    pincode: lead.pincode ?? '',
    configuration: lead.configuration,
    budget: lead.budget ?? '',
    consent: lead.consent,
    source: meta?.source ?? '',
    unit: meta?.unit ?? '',
    utm_source: meta?.utm_source ?? '',
    utm_medium: meta?.utm_medium ?? '',
    utm_campaign: meta?.utm_campaign ?? '',
    utm_term: meta?.utm_term ?? '',
    utm_content: meta?.utm_content ?? '',
    gclid: meta?.gclid ?? '',
    fbclid: meta?.fbclid ?? '',
    page_url: meta?.page_url ?? '',
    referrer: meta?.referrer ?? '',
    user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? '',
    timestamp: new Date().toISOString(),
  };

  const endpoint = process.env.FORM_ENDPOINT || 'https://subhamgroup.com/api/ashok-height/lead.php';
  const resendKey = process.env.RESEND_API_KEY;
  const mailTo = process.env.LEAD_EMAIL_TO;
  const jobs: Promise<boolean>[] = [];

  if (endpoint) {
    jobs.push(
      postWithTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // Apps Script answers with a 302 to the result page.
        redirect: 'follow',
      })
        .then((r) => {
          if (!r.ok) console.error('[lead] webhook responded', r.status);
          return r.ok;
        })
        .catch((e) => {
          console.error('[lead] webhook failed', e);
          return false;
        }),
    );
  }

  if (resendKey && mailTo) {
    const rows = Object.entries(payload)
      .filter(([, v]) => v !== '')
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b5048">${k}</td><td>${escapeHtml(String(v))}</td></tr>`)
      .join('');
    jobs.push(
      postWithTimeout('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_EMAIL_FROM || 'Ashok Heights Leads <onboarding@resend.dev>',
          to: mailTo.split(',').map((s) => s.trim()).filter(Boolean),
          subject: `New lead: ${payload.name} · ${payload.configuration} · ${project.shortName}`,
          html: `<table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
        }),
      })
        .then((r) => {
          if (!r.ok) console.error('[lead] resend responded', r.status);
          return r.ok;
        })
        .catch((e) => {
          console.error('[lead] resend failed', e);
          return false;
        }),
    );
  }

  if (!jobs.length) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[lead] no FORM_ENDPOINT / RESEND_API_KEY set — lead logged only:', payload);
      return json({ ok: true, dev: true });
    }
    console.error('[lead] no delivery configured; set FORM_ENDPOINT');
    return json({ ok: false, error: 'Enquiries are temporarily unavailable. Please try again shortly.' }, 503);
  }

  const results = await Promise.all(jobs);
  if (!results.some(Boolean)) {
    return json({ ok: false, error: 'We could not send your details. Please try again.' }, 502);
  }
  return json({ ok: true });
}
