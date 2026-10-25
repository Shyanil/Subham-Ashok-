'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { project } from '@/content/site';
import { answerFor, QUICK_REPLIES, type ChatLink } from '@/content/chat';
import { track } from '@/lib/analytics';
import { LeadForm } from './lead/LeadForm';
import { useLead } from './lead/LeadProvider';
import { CloseIcon } from './icons';

/** Questions answered before the visitor must share their details to keep chatting. */
const FREE_ANSWERS = 2;
const TEASER_DELAY_MS = 1_500;

/** The hook that turns the chat into a form fill once the free answers are used up. */
const REVEAL =
  "The exclusive launch price, the best-value homes still available and this month's special offer are shared only with registered buyers. Fill in your name and number below to unlock them instantly.";

type Message = { id: number; from: 'bot' | 'user'; text: string; links?: ChatLink[]; cta?: boolean };

const GREETING = `Hi! I'm the ${project.shortName} assistant. Ask me about prices, floor plans, amenities, location or site visits.`;

/**
 * Keyword-matched FAQ assistant. It answers basic questions, nudges to the lead form after every
 * answer, and after a couple of answers (or straight away for price / brochure / visit) the chat
 * locks until the form is submitted.
 */
export function ChatBot() {
  const { submitted } = useLead();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [free, setFree] = useState(0);
  const [formShown, setFormShown] = useState(false);
  const pending = useRef<Message | null>(null);
  const nextId = useRef(1);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const locked = formShown && !submitted;

  const push = (m: Omit<Message, 'id'>) => setMessages((all) => [...all, { ...m, id: nextId.current++ }]);

  // The greeting label above the launcher slides in shortly after load, until dismissed.
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setTeaser(true), TEASER_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, formShown]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => field.current?.focus());
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const openChat = () => {
    setOpen(true);
    setTeaser(false);
    track('chat_open', { source: 'chatbot' });
  };

  const showForm = () => {
    setFormShown(true);
    track('form_open', { intent: 'price', source: 'chatbot' });
  };

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || typing || locked) return;
    push({ from: 'user', text: q });
    setInput('');
    setTyping(true);
    track('chat_message', { source: 'chatbot' });

    const a = answerFor(q);
    window.setTimeout(() => {
      setTyping(false);
      if (submitted) {
        push(a.lead ? { from: 'bot', text: 'Our team already has your details and will call you shortly with the price list, brochure and a site-visit slot.' } : { from: 'bot', text: a.text, links: a.links });
        return;
      }
      if (a.lead) {
        push({ from: 'bot', text: a.text });
        showForm();
        return;
      }
      if (free >= FREE_ANSWERS) {
        pending.current = { id: -1, from: 'bot', text: a.text, links: a.links };
        push({ from: 'bot', text: `I have your answer ready, and it comes with the big reveal. ${REVEAL}` });
        showForm();
        return;
      }
      const used = free + 1;
      setFree(used);
      push({ from: 'bot', text: a.text, links: a.links, cta: used < FREE_ANSWERS });
      if (used < FREE_ANSWERS) return;
      // Right after the last free answer, tease the reveal and open the form.
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        push({ from: 'bot', text: `Want to know the biggest reveal? ${REVEAL}` });
        showForm();
      }, 1100);
    }, 550);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const onLead = () => {
    const p = pending.current;
    pending.current = null;
    push({ from: 'bot', text: 'Unlocked! Our team will call you within minutes with the launch price, available units and the current offer. Feel free to keep asking questions.' });
    if (p) push({ from: 'bot', text: p.text, links: p.links });
  };

  return (
    <div data-track-section="chatbot">
      {/* The panel is positioned on its own so it always fits the viewport: a full sheet on phones, a docked card from sm up. */}
      {open && (
        <section
          role="dialog"
          aria-label={`Chat with ${project.shortName}`}
          className="fixed inset-x-2 bottom-[calc(8px+env(safe-area-inset-bottom))] top-[calc(8px+env(safe-area-inset-top))] z-[60] flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-20px_rgb(42_20_16/0.5)] ring-1 ring-line sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(640px,calc(100dvh-48px))] sm:w-[390px]"
        >
          <header className="flex items-center gap-3 bg-deep px-4 py-3 text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold font-serif text-[18px] italic text-deep" aria-hidden="true">
              AH
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[20px] leading-tight !text-white">{project.name}</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/70">
                <span className="size-2 rounded-full bg-[#4ade80]" aria-hidden="true" /> Online · replies instantly
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close chat">
              <CloseIcon />
            </button>
          </header>

          <div ref={list} className="flex-1 space-y-3 overflow-y-auto bg-cream px-3 py-4" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${m.from === 'user' ? 'rounded-br-md bg-brand text-white' : 'rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-line'}`}>
                  <p>{m.text}</p>
                  {m.links && (
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {m.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          onClick={() => l.href.startsWith('#') && window.innerWidth < 1024 && setOpen(false)}
                          className="text-[13px] font-bold text-terra underline underline-offset-2"
                        >
                          {l.label}
                        </a>
                      ))}
                    </p>
                  )}
                  {m.cta && !submitted && !formShown && (
                    <button type="button" onClick={showForm} className="mt-2.5 w-full rounded-full bg-terra px-3 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white hover:bg-terra-600">
                      Unlock the big reveal →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex" role="status" aria-label="Assistant is typing">
                <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-sm ring-1 ring-line">
                  {[0, 1, 2].map((i) => (
                    <i key={i} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </span>
              </div>
            )}

            {formShown && (
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line">
                {!submitted && <p className="mb-3 font-serif text-[22px] leading-tight text-ink">Unlock the big reveal</p>}
                <LeadForm variant="inline" fields="quick" source="chatbot" submitLabel="Unlock the reveal" onSuccess={onLead} />
              </div>
            )}
          </div>

          {!locked && (
            <div className="flex gap-1.5 overflow-x-auto border-t border-line bg-white px-3 pt-2.5 [scrollbar-width:none]">
              {QUICK_REPLIES.map((q) => (
                <button key={q} type="button" onClick={() => ask(q)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-ink hover:border-terra hover:text-terra">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 bg-white p-3">
            <label htmlFor="chat-input" className="sr-only">
              Type your question
            </label>
            <input
              id="chat-input"
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={locked}
              maxLength={300}
              autoComplete="off"
              placeholder={locked ? 'Fill in the form above to continue' : 'Type your question…'}
              className="min-w-0 flex-1 rounded-full border border-line bg-cream px-4 py-2.5 text-[16px] text-ink outline-none focus:border-terra disabled:opacity-60 sm:text-[14px]"
            />
            <button type="submit" disabled={locked || !input.trim()} className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white disabled:opacity-40" aria-label="Send">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </section>
      )}

      {!open && (
        <div className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-3 z-[45] flex flex-col items-end gap-2.5 lg:bottom-28 lg:right-6">
          {teaser && !dismissed && (
            <div className="relative animate-[chat-pop_.35s_ease-out_both]">
              <button
                type="button"
                onClick={openChat}
                className="block w-[min(260px,calc(100vw-80px))] rounded-2xl rounded-br-md bg-white px-4 py-3 text-left shadow-[0_18px_40px_-18px_rgb(42_20_16/0.55)] ring-1 ring-line"
              >
                <span className="block text-[15px] font-bold text-ink">Hi there! 👋</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted">Talk with our chat support to get your questions answered and problems fixed.</span>
              </button>
              <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss message" className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full bg-ink text-white shadow">
                <CloseIcon className="size-3" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={openChat}
            aria-label="Chat with support"
            className="relative grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_14px_30px_-10px_rgb(42_20_16/0.7)] transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand" aria-hidden="true" />
            <svg viewBox="0 0 24 24" className="relative size-7" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M4 5h16v11H8l-4 3.5z" strokeLinejoin="round" />
              <path d="M8 9.5h8M8 12.5h5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
