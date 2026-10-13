/**
 * All page copy lives here. Headline strings use `_underscores_` to mark the
 * italic serif accent, e.g. "RISING IN _grandeur._". Arrays are explicit lines.
 *
 * Facts, figures and contact details are taken from the Subham Ashok Heights e-brochure.
 */
export const project = {
  name: 'Subham Ashok Heights',
  shortName: 'Ashok Heights',
  developer: 'Subham Group',
  developerTagline: 'A unit of Lohia group',
  area: 'Beharbari',
  city: 'Guwahati',
  state: 'Assam',
};

/** Contact + deployment settings (kept here instead of .env). */
export const config = {
  /** Public URL, used for metadata, Open Graph and the sitemap. */
  siteUrl: 'https://subhambeharbari.com',
  /** WhatsApp number in international format, digits only (brochure marketing line). */
  whatsappNumber: '919854041000',
};

const P = project;

export const site = {
  title: `${P.name}, ${P.area} — 2, 3 & 4 BHK residences in ${P.city}`,
  description: `${P.name} in ${P.area}, ${P.city}: 2, 3 & 4 BHK residences and penthouses with a clubhouse, swimming pool, gym and landscaped lawns. A ${P.developer} project.`,

  intro: {
    eyebrow: `${P.developer} presents`,
    wordmark: ['ASHOK', 'HEIGHTS'],
    caption: `${P.area} · ${P.city}`,
    skip: 'Skip intro ↗',
    replay: 'Replay intro ↗',
  },

  /** Landing-page order: Overview → Amenities → Gallery → Floor Plans → Location → Contact → About Developer. */
  nav: [
    { label: 'Overview', href: '#overview' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Floor Plans', href: '#floor-plans' },
    { label: 'Location', href: '#location' },
    { label: 'Contact', href: '#contact' },
    { label: 'About Developer', href: '#developer' },
  ],

  hero: {
    eyebrow: `${P.area} · ${P.city}`,
    headline: ['RISING IN', '_grandeur._'],
    sub: `Premium 2, 3 & 4 BHK residences and penthouses. A ${P.developer} project.`,
    cta: 'Explore the project ↓',
    side: 'Stability · Grandeur · Harmony',
    caption: "Artist's impression",
    reframe: P.shortName,
  },

  overview: {
    label: '01 / Overview',
    location: `${P.area} · ${P.city} / ${P.state}`,
    headline: ['ROOTED IN', '_peace._'],
    lead: `${P.area}'s first thoughtfully designed, health-centric community.`,
    body: `Two blocks of 2, 3 and 4 BHK homes and penthouses around a green lawn, an infinity-edge pool and a clubhouse. Amenities are spread across three zones, so every pace of life has its place.`,
    stats: [
      { values: [2], unit: 'blocks', label: 'Block A & Block B' },
      { values: [2, 4], joiner: '–', unit: 'BHK', label: 'Plus penthouses' },
      { values: [635, 1680], joiner: '–', unit: 'sq.ft', label: 'Carpet area' },
      { values: [11], unit: 'floors', label: 'Block B, rising highest' },
    ],
  },

  perspective: {
    eyebrow: 'Through the wheel of time',
    headline: ['Every chakra', '_aligns._'],
    sub: 'Life moves in a sacred circle. At its centre lies balance.',
    cue: 'Scroll to explore ↓',
  },

  amenities: {
    label: '02 / Amenities',
    headline: ['LUXURY AT', '_the peak._'],
    body: 'A clubhouse for celebrations, a pool for slow evenings, and open lawns where children grow up outdoors.',
    groups: [
      {
        title: 'Lifestyle',
        items: [
          { icon: 'pool', name: 'Swimming pool', note: 'Infinity edge with sun deck' },
          { icon: 'gym', name: 'Gymnasium', note: 'Garden-facing fitness centre' },
          { icon: 'club', name: 'Clubhouse', note: 'Community & banquet hall' },
          { icon: 'games', name: 'Indoor games', note: 'Billiards, table tennis, chess' },
          { icon: 'kids', name: "Kids' play area", note: 'Safe, landscaped and in view' },
          { icon: 'lawn', name: 'Green lawn', note: 'Stepping stones & planters' },
          { icon: 'opengym', name: 'Open gym', note: 'Workouts in fresh air' },
          { icon: 'amphi', name: 'Amphitheatre', note: 'Gatherings under the sky' },
          { icon: 'lobby', name: 'Grand lift lobby', note: 'OTIS / KONE / Schindler lifts' },
          { icon: 'parking', name: 'Parking', note: 'Drop-off and open parking' },
        ],
      },
      {
        title: 'Everyday essentials',
        items: [
          { icon: 'security', name: '24×7 manned security', note: 'Guarded entry & exit' },
          { icon: 'power', name: '24×7 power backup', note: 'For common areas & homes' },
          { icon: 'cctv', name: 'CCTV surveillance', note: 'Across common areas' },
          { icon: 'rain', name: 'Rainwater harvesting', note: 'Built for the monsoon' },
          { icon: 'stp', name: 'Sewage treatment plant', note: 'On-site STP' },
          { icon: 'fire', name: 'Fire safety', note: 'As per fire safety norms' },
        ],
      },
    ],
  },

  gallery: {
    label: '03 / Gallery',
    headline: ['IMAGINE', '_living here._'],
    body: (n: number) => `${n} views of the project. Open any image in full.`,
    filters: [
      { id: 'all', label: 'All images' },
      { id: 'interiors', label: 'Interiors' },
      { id: 'outdoors', label: 'Outdoors' },
      { id: 'living', label: 'Living' },
      { id: 'top', label: 'Top views' },
    ],
    viewFull: 'View full image ↗',
  },

  floorPlans: {
    label: '04 / Floor Plans',
    headline: ['YOUR SPACE.', '_Your way._'],
    body: 'The master plan, every floor plate and every unit type across Block A and Block B. Areas are in square feet.',
    specsTitle: 'Specifications',
  },

  location: {
    label: '05 / Location',
    headline: ['EVERYTHING', '_within reach._'],
    body: 'Sonkuchi Path, Beharbari, Lalmati. Schools, hospitals, showrooms and markets are minutes from home.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Sonkuchi+Path+Beharbari+Lalmati+Guwahati+781029',
  },

  contact: {
    label: '06 / Contact',
    headline: ['A NEW DIRECTION', '_for living._'],
    body: `Book a site visit or ask for prices and availability at ${P.name}. Our team will get back to you.`,
    cta: 'Chat on WhatsApp',
    whatsappMessage: `Hello! I'd like to know more about ${P.name}.`,
    phone: '98540 41000',
    phoneHref: 'tel:+919854041000',
    email: 'marketing@subhamgroup.com',
    web: 'subhamgroup.com',
    siteAddress: ['Sonkuchi Path, Beharbari, Lalmati', 'Guwahati, Assam — 781029'],
    corporateAddress: ['Subham Velocity, 5th Floor, Hanuram Boro Path', 'GS Road, Guwahati — 781005'],
    social: [
      { label: 'Facebook', handle: '@subhamgroup', href: 'https://www.facebook.com/subhamgroup' },
      { label: 'Instagram', handle: 'subhamgroupguwahati', href: 'https://www.instagram.com/subhamgroupguwahati' },
    ],
    rera: 'RERAA KM 281 of 2026–2027',
    reraHref: 'https://www.rera.assam.gov.in',
  },

  developer: {
    label: '07 / About Developer',
    headline: ['ROOTED IN TRUST.', '_Driven by excellence._'],
    body: `Since 2007, ${P.developer} has been a premier real estate builder and developer based out of Guwahati. Known for innovation, time-bound projects and after-sale customer service, the team works with a passion to deliver the utmost value to residential and commercial property investors and end customers — keeping the promise of its motto: time-bound projects and timeless relationships.`,
    stats: [
      { value: '18', label: 'Completed projects' },
      { value: '34.5 Lac', label: 'Sq.ft constructed' },
      { value: '8.75 Lac', label: 'Sq.ft ongoing' },
      { value: '6100+', label: 'Happy residents' },
    ],
    note: {
      title: "Developer's note",
      quote:
        'Growing up, we all had the opportunity to enjoy nature at its best. Open fields, fresh air, and tons of playtime with our friends. That’s why we wanted to gift families a present that would be enjoyed by their loved ones for years to come — ample space, airy abodes, and a club where merry times become merrier.',
      name: 'Mr. Kailash Chandra Lohia',
      role: 'Chairman',
    },
    architect: {
      name: 'Banka & Associates',
      body: 'A trusted one-window architectural practice in Guwahati for 27 years, known for top-quality design, striking aesthetics and timely delivery.',
    },
    projects: [
      {
        title: 'Ongoing',
        items: ['Subham Park, Bongaigaon', 'Subham Ashray, near Guwahati Airport', 'Subham Park, Sonarigaon', 'The Peak, Guwahati', 'Subham Kishori Heights, Dibrugarh'],
      },
      {
        title: 'Completed',
        items: [
          'Subham Heights, Kahilipara',
          'Subham Enclave, Hatigaon',
          'Subham Park View, Fatasil',
          'Subham Elite, Gandhibasti',
          'Subham Sapphire, Nalapara',
          'Subham Garden, Jorhat',
          'Subham Classic, Ambikagiri Nagar',
          'Subham Manjushree, Datalpara',
          'Subham Regency, Hengrabari',
          'Subham Residency, Kharguli',
          'Subham Solitaire, Agartala',
          'Subham Greens, Lokhra',
          'Subham Buildwell, Zoo Road',
          'Subham Garden, Kalapahar',
        ],
      },
      {
        title: 'Commercial',
        items: ['Subham Velocity, G.S. Road', 'Subham Red Stone, Downtown', 'Bijay Crescent, Pibco', 'Subham Square, Lokhra'],
      },
    ],
  },

  footer: {
    disclaimer: `Illustrative images and artist's impressions. Furniture, décor and landscaping are styling suggestions. Plans, specifications and amenities are subject to change; please confirm details with ${P.developer}.`,
  },
};

export type FilterId = (typeof site.gallery.filters)[number]['id'];
