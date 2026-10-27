import { project, site } from '@/content/site';
import { projectConfig } from '@/src/config/project';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { Overview } from '@/components/Overview';
import { TowerViewer3D } from '@/components/TowerViewer3D';
import { CtaBand } from '@/components/CtaBand';
import { FloorPlans } from '@/components/FloorPlans';
import { Amenities } from '@/components/Amenities';
import { Gallery } from '@/components/Gallery';
import { Location } from '@/components/Location';
import { Developer } from '@/components/Developer';
import { FinalCta } from '@/components/FinalCta';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { StickyBar } from '@/components/StickyBar';
import { ChatBot } from '@/components/ChatBot';
import { Motion } from '@/components/Motion';

const url = projectConfig.SITE_URL;
const address = {
  '@type': 'PostalAddress',
  streetAddress: 'Sonkuchi Path, Beharbari, Lalmati',
  addressLocality: project.city,
  addressRegion: project.state,
  postalCode: '781029',
  addressCountry: 'IN',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${url}/#developer`,
      name: project.developer,
      description: `${project.developer}, ${project.developerTagline}. Real estate developer in Guwahati since 2007.`,
      url: 'https://subhamgroup.com',
      logo: `${url}/brand/subham-logo-light.png`,
      foundingDate: '2007',
      email: projectConfig.EMAIL,
      telephone: projectConfig.PHONE_E164,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Subham Velocity, 5th Floor, Hanuram Boro Path, GS Road',
        addressLocality: project.city,
        addressRegion: project.state,
        postalCode: '781005',
        addressCountry: 'IN',
      },
      sameAs: site.contact.social.map((s) => s.href),
    },
    {
      '@type': ['ApartmentComplex', 'Residence'],
      '@id': `${url}/#project`,
      name: project.name,
      description: site.description,
      url,
      image: `${url}/images/og.jpg`,
      telephone: projectConfig.PHONE_E164,
      address,
      amenityFeature: site.amenities.groups.flatMap((g) =>
        g.items.map((i) => ({ '@type': 'LocationFeatureSpecification', name: i.name, value: true })),
      ),
      floorSize: { '@type': 'QuantitativeValue', minValue: 635, maxValue: 1680, unitText: 'sq.ft carpet' },
      identifier: { '@type': 'PropertyValue', name: 'RERA', value: projectConfig.RERA },
      provider: { '@id': `${url}/#developer` },
    },
  ],
};

/** Lead-first order: Hero → Marquee → Overview → 3D model → Plans → Amenities → Gallery → Location → Developer → Enquire. */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Overview />
        <TowerViewer3D />
        <FloorPlans />
        <Amenities />
        <Gallery />
        <CtaBand source="cta_after_gallery" title="Like What You See? _Download the Brochure_" body="Floor plans and project details, ready to download." />
        <Location />
        <Developer />
        <FinalCta />
      </main>
      <Footer />
      <FloatingCTA />
      <StickyBar />
      <ChatBot />
      <Motion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
