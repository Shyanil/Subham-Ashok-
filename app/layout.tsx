import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Mono, Manrope } from 'next/font/google';
import { config, project, site } from '@/content/site';
import { Providers } from '@/components/Providers';
import { Intro } from '@/components/Intro';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--ff-serif',
  display: 'swap',
});
const sans = Manrope({ subsets: ['latin'], weight: ['400', '500'], variable: '--ff-sans', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400'], variable: '--ff-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: site.title,
  description: site.description,
  applicationName: project.name,
  keywords: [project.name, project.area, project.city, 'apartments', 'residences', project.developer, 'real estate'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: project.name,
    title: site.title,
    description: site.description,
    locale: 'en_IN',
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: `${project.name} — aerial view of the towers` }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: ['/images/og.jpg'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#461a13',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint: enables JS-only reveal styles.
 * Failsafe: if the app never hydrates, reveal styles are removed after 4s.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.dataset.hydrated){d.classList.remove('js');d.dataset.intro='seen'}},4000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Intro />
          <div className="page-curtain" aria-hidden="true" />
          <div id="page">{children}</div>
        </Providers>
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
      </body>
    </html>
  );
}
