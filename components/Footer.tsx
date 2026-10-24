import { project, site } from '@/content/site';
import { MailIcon } from './icons';

/** Centred footer: logos, address columns, RERA, disclaimer. */
export function Footer() {
  const c = site.contact;
  const col = 'text-[12px] font-bold uppercase leading-relaxed tracking-[0.14em] text-ink/80';
  return (
    <footer className="border-t border-line bg-paper pb-10 pt-16 text-center" data-track-section="footer">
      <div className="container-x">
        <div className="flex items-center justify-center gap-4">
          <span className="rounded-2xl bg-deep px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/ashok-heights-logo.webp" alt={project.name} width={480} height={210} loading="lazy" decoding="async" className="h-12 w-auto" />
          </span>
        </div>
        <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.4em] text-muted">
          A {project.developer} project · {project.developerTagline}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted">Site address</p>
            <address className={`mt-3 not-italic ${col}`}>
              {c.siteAddress[0]}
              <br />
              {c.siteAddress[1]}
            </address>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted">Corporate address</p>
            <address className={`mt-3 not-italic ${col}`}>
              {c.corporateAddress[0]}
              <br />
              {c.corporateAddress[1]}
            </address>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted">RERA number</p>
            <p className={`mt-3 ${col}`}>{c.rera}</p>
            <a href={c.reraHref} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[12px] font-semibold text-terra underline-offset-4 hover:underline">
              rera.assam.gov.in
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-semibold text-ink/80">
          <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 hover:text-terra">
            <MailIcon className="size-4" /> {c.email}
          </a>
          {c.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-terra">
              {s.label}
            </a>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-[12px] leading-relaxed text-muted">{site.footer.disclaimer}</p>
        <p className="mt-4 text-[12px] text-muted">
          © {new Date().getFullYear()} {project.developer}
        </p>
      </div>
    </footer>
  );
}
