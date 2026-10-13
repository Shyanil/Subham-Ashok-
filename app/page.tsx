import { config, project, site } from '@/content/site';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Overview } from '@/components/Overview';
import { Perspective } from '@/components/Perspective';
import { Amenities } from '@/components/Amenities';
import { Marquee } from '@/components/Marquee';
import { Gallery } from '@/components/Gallery';
import { FloorPlans } from '@/components/FloorPlans';
import { Location } from '@/components/Location';
import { Contact } from '@/components/Contact';
import { Developer } from '@/components/Developer';
import { Footer } from '@/components/Footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  name: project.name,
  description: site.description,
  url: config.siteUrl,
  image: `${config.siteUrl}/images/og.jpg`,
  telephone: '+91 98540 41000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sonkuchi Path, Beharbari, Lalmati',
    addressLocality: project.city,
    addressRegion: project.state,
    postalCode: '781029',
    addressCountry: 'IN',
  },
};

/** Section order follows the nav: Overview → Amenities → Gallery → Floor Plans → Location → Contact → About Developer. */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Overview />
        <Perspective />
        <Amenities />
        <Marquee />
        <Gallery />
        <FloorPlans />
        <Location />
        <Contact />
        <Developer />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
