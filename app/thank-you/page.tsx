import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ThankYouTracking } from '@/components/ThankYouTracking';
import { project } from '@/content/site';
import { projectConfig, telHref } from '@/src/config/project';

export const metadata: Metadata = {
  title: `Thank you | ${project.name}`,
  description: 'Your enquiry has been received. We look forward to helping you find your new home.',
  alternates: { canonical: '/thank-you' },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <main id="main" className="min-h-svh bg-cream">
      <ThankYouTracking />
      <div className="container-x py-6 sm:py-8">
        <Link href="/" aria-label={`${project.name} home`} className="inline-flex rounded-2xl bg-brand px-5 py-3">
          <Image src="/brand/ashok-heights-logo.webp" alt={project.name} width={180} height={100} unoptimized className="h-16 w-auto object-contain" />
        </Link>
        <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_24px_80px_-40px_rgba(70,26,19,0.25)] lg:grid-cols-[1.1fr_1fr]">
          <div className="px-6 py-12 sm:p-12 lg:p-16">
            <div className="mb-8 grid size-16 place-items-center rounded-full border border-leaf/20 bg-leaf/10 text-leaf">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="kicker">Your next chapter starts here</p>
            <h1 className="mt-4 font-serif text-[54px] leading-none text-brand sm:text-[76px]">Thank you.<br /><span className="italic text-terra">You’re one step closer.</span></h1>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted">We’ve received your enquiry for {project.name}. Our team will call you shortly to share the details and help plan your visit.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/brochure/subham-ashok-heights-brochure.pdf" download className="btn">Download Brochure <span aria-hidden="true">↓</span></a>
              <a href={telHref} className="btn btn--outline" data-source="thank_you">Call Our Team</a>
            </div>
            <p className="mt-6 text-[13px] text-muted">Prefer to speak now? <a href={telHref} className="font-semibold text-brand" data-source="thank_you">+91 {projectConfig.PHONE}</a></p>
            <div className="mt-10 border-t border-line pt-6"><Link href="/" className="text-[13px] font-semibold text-terra">← Back to {project.name}</Link></div>
          </div>
          <div className="relative min-h-[300px] bg-brand lg:min-h-full">
            <Image src="/images/exterior/aerial-day-view-2560.webp" alt="Aerial view of Subham Ashok Heights surrounded by greenery" fill preload unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white sm:bottom-12 sm:left-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Beharbari · Guwahati</p>
              <p className="mt-3 font-serif text-[38px] italic leading-tight sm:text-[46px]">A greener everyday.<br />A place to call your own.</p>
            </div>
          </div>
        </div>
        <p className="py-8 text-center text-[12px] text-muted">{project.name} · {project.developer}</p>
      </div>
    </main>
  );
}
