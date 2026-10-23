import { project, site } from '@/content/site';
import { ReplayIntroButton } from './Intro';

/** Slim site footer: logos, disclaimer, RERA, replay intro. */
export function Footer() {
  const c = site.contact;
  return (
    <footer className="container-x footer__base">
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ashok-heights-logo.webp" alt={project.name} className="footer__logo" width={480} height={210} loading="lazy" decoding="async" />
      </div>
      <div className="footer__disclaimer">
        <p>{site.footer.disclaimer}</p>
        <p className="mt-2">
          RERA: {c.rera} ·{' '}
          <a href={c.reraHref} target="_blank" rel="noopener noreferrer" className="link-underline">
            rera.assam.gov.in
          </a>
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 lg:items-end">
        <ReplayIntroButton />
        <p className="label text-[var(--muted)]">
          © {new Date().getFullYear()} {project.developer}
        </p>
      </div>
    </footer>
  );
}
