import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { project, site } from '@/content/site';
import { projectConfig } from '@/src/config/project';
import { LeadProvider } from '@/components/lead/LeadProvider';
import { ThreeDPreloader } from '@/components/ThreeDPreloader';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: 'variable', style: ['normal', 'italic'], variable: '--ff-serif', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], weight: 'variable', variable: '--ff-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(projectConfig.SITE_URL),
  title: site.title,
  description: site.description,
  applicationName: project.name,
  keywords: [project.name, project.area, project.city, '2 BHK', '3 BHK', '4 BHK', 'apartments', 'flats in Guwahati', project.developer, 'real estate'],
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
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LeadProvider>
          <ThreeDPreloader />
          {children}
        </LeadProvider>

        {GA4 && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="lazyOnload" />
            <Script id="ga4" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4}');`}
            </Script>
          </>
        )}
        {PIXEL && (
          <Script id="meta-pixel" strategy="lazyOnload">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
