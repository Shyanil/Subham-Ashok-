/**
 * All page copy lives here. Facts, figures and contact details are taken from
 * the Subham Ashok Heights e-brochure. Sales placeholders (price, possession,
 * budgets) live in src/config/project.ts.
 */
import { projectConfig } from '@/src/config/project';

export const project = {
  name: 'Subham Ashok Heights',
  shortName: 'Ashok Heights',
  developer: 'Subham Group',
  developerTagline: 'A unit of Lohia group',
  area: 'Beharbari',
  city: 'Guwahati',
  state: 'Assam',
};

const P = project;

export const site = {
  title: `${P.name}, ${P.area} — 2, 3 and 4 BHK residences in ${P.city}`,
  description: `${P.name} in ${P.area}, ${P.city}: 2, 3 and 4 BHK residences and penthouses with a clubhouse, swimming pool, gym and landscaped lawns. A ${P.developer} project.`,

  nav: [
    { label: 'Overview', href: '#overview' },
    { label: 'Floor Plans', href: '#floor-plans' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location', href: '#location' },
    { label: 'Developer', href: '#developer' },
  ],

  hero: {
    presents: `${P.developer} presents`,
    headline: `2, 3 and 4 BHK Homes in _${P.area}_, ${P.city}`,
    sub: `Two blocks of homes and penthouses around a green lawn, a pool and a clubhouse. Carpet area 635 – 1,680 sq.ft.`,
    location: `${P.area} · ${P.city}`,
    imageLine: 'Rising above the greens of Beharbari',
    primaryCta: 'Download Brochure',
    visitCta: 'Book a Site Visit',
    formTitle: 'Download the brochure',
    footnote: '*Terms apply. Taxes and statutory charges extra.',
  },

  marquee: [
    '2, 3 and 4 BHK residences',
    'Infinity-edge pool',
    'Clubhouse and banquet hall',
    'Green lawn and amphitheatre',
    'RERA registered',
    'Since 2007',
    '24×7 security and power backup',
    'Minutes from schools and hospitals',
  ],

  trust: [
    { value: 18, suffix: '', label: 'Completed projects' },
    { value: 6100, suffix: '+', label: 'Happy residents' },
    { value: 34.5, suffix: ' lakh', label: 'Sq.ft built', decimals: 1 },
    { value: 2007, suffix: '', label: 'Building since', plain: true },
  ],

  overview: {
    eyebrow: `${P.area} · ${P.city}`,
    title: 'A Greener Way to Live in _Beharbari_',
    body: `${P.area}'s first thoughtfully designed, health-centric community. Children play in sight of home, evenings are spent by the water, and schools, hospitals and markets are minutes away.`,
    personas: [
      { kicker: 'For families', title: 'Celebrate', body: 'A clubhouse and banquet hall, an amphitheatre under the sky and a grand lift lobby to welcome guests home.', tone: 'dark' },
      { kicker: 'For children', title: 'Play', body: "A safe, landscaped play area and an open green lawn — always in view of home.", tone: 'image', image: 'kids-play-day' },
      { kicker: 'For wellness', title: 'Unwind', body: 'An infinity-edge pool, a garden-facing gym and an open-air workout zone, steps from your door.', tone: 'terra' },
    ],
    stats: [
      { value: '2', unit: 'blocks', label: 'Block A and Block B' },
      { value: '2 – 4', unit: 'BHK', label: 'Plus penthouses' },
      { value: '635 – 1,680', unit: 'sq.ft', label: 'Carpet area' },
      { value: '11', unit: 'floors', label: 'Block B, rising highest' },
    ],
    cta: 'Book a Site Visit',
  },

  floorPlans: {
    eyebrow: 'Floor plans and price',
    title: 'Homes Planned for _Light and Air_',
    body: 'The master plan and every unit type across Block A and Block B. Areas are in square feet. Tap “Reveal price” for the current price of any unit.',
    specsTitle: 'Specifications',
  },

  amenities: {
    eyebrow: 'Amenities',
    title: 'Every Day, _Well Spent_',
    body: 'A clubhouse for celebrations, a pool for slow evenings, and open lawns where children grow up outdoors.',
    groups: [
      {
        title: 'Lifestyle',
        items: [
          { icon: 'pool', name: 'Swimming pool', note: 'Infinity edge with sun deck' },
          { icon: 'gym', name: 'Gymnasium', note: 'Garden-facing fitness centre' },
          { icon: 'club', name: 'Clubhouse', note: 'Community and banquet hall' },
          { icon: 'games', name: 'Indoor games', note: 'Billiards, table tennis, chess' },
          { icon: 'kids', name: "Kids' play area", note: 'Safe, landscaped and in view' },
          { icon: 'lawn', name: 'Green lawn', note: 'Stepping stones and planters' },
          { icon: 'opengym', name: 'Open gym', note: 'Workouts in fresh air' },
          { icon: 'amphi', name: 'Amphitheatre', note: 'Gatherings under the sky' },
          { icon: 'lobby', name: 'Grand lift lobby', note: 'OTIS / KONE / Schindler lifts' },
          { icon: 'parking', name: 'Parking', note: 'Drop-off and open parking' },
        ],
      },
      {
        title: 'Everyday Essentials',
        items: [
          { icon: 'security', name: '24×7 manned security', note: 'Guarded entry and exit' },
          { icon: 'power', name: '24×7 power backup', note: 'For common areas and homes' },
          { icon: 'cctv', name: 'CCTV surveillance', note: 'Across common areas' },
          { icon: 'rain', name: 'Rainwater harvesting', note: 'Built for the monsoon' },
          { icon: 'stp', name: 'Sewage treatment plant', note: 'On-site STP' },
          { icon: 'fire', name: 'Fire safety', note: 'As per fire safety norms' },
        ],
      },
    ],
  },

  tower: {
    eyebrow: 'Interactive 3D model',
    title: 'Explore the Homes _in 3D_',
    body: 'Drag to rotate the model. Change the view or select an amenity to explore the community.',
    cta: 'Download Brochure',
    fallbackNote: 'Explore the artist impressions in the gallery below.',
  },

  gallery: {
    eyebrow: 'Gallery',
    title: 'A Closer _Look_',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'interiors', label: 'Interiors' },
      { id: 'outdoors', label: 'Outdoors' },
      { id: 'living', label: 'Living' },
      { id: 'top', label: 'Top views' },
    ],
  },

  location: {
    eyebrow: 'Location',
    title: 'Close to _Everything That Matters_',
    body: 'Sonkuchi Path, Beharbari, Lalmati. Schools, hospitals, showrooms and markets are minutes from home.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Sonkuchi+Path+Beharbari+Lalmati+Guwahati+781029',
    directionsLink: 'https://www.google.com/maps/dir/?api=1&destination=Sonkuchi+Path+Beharbari+Lalmati+Guwahati+781029',
  },

  contact: {
    phone: projectConfig.PHONE,
    email: projectConfig.EMAIL,
    web: 'subhamgroup.com',
    siteAddress: ['Sonkuchi Path, Beharbari, Lalmati', 'Guwahati, Assam — 781029'],
    corporateAddress: ['Subham Velocity, 5th Floor, Hanuram Boro Path', 'GS Road, Guwahati — 781005'],
    social: [
      { label: 'Facebook', handle: '@subhamgroup', href: 'https://www.facebook.com/subhamgroup' },
      { label: 'Instagram', handle: 'subhamgroupguwahati', href: 'https://www.instagram.com/subhamgroupguwahati' },
    ],
    rera: projectConfig.RERA,
    reraHref: projectConfig.RERA_URL,
  },

  finalCta: {
    eyebrow: 'Enquire',
    title: 'Book Your _Site Visit_',
    body: 'Share your details and our team will send the price list and brochure, and fix a site visit at a time that suits your family.',
    perks: projectConfig.PERKS,
  },

  developer: {
    eyebrow: 'The legacy since 2007',
    title: 'Time-Bound Projects and Timeless _Relationships_',
    body: `Since 2007, ${P.developer} has been a premier real estate builder and developer based out of Guwahati. Known for innovation, time-bound projects and after-sale customer service, the team works with a passion to deliver the utmost value to residential and commercial property investors and end customers — keeping the promise of its motto: time-bound projects and timeless relationships.`,
    stats: [
      { value: 18, suffix: '', label: 'Completed projects' },
      { value: 34.5, suffix: ' Lac', label: 'Sq.ft constructed', decimals: 1 },
      { value: 8.75, suffix: ' Lac', label: 'Sq.ft ongoing', decimals: 2 },
      { value: 6100, suffix: '+', label: 'Happy residents' },
    ],
    note: {
      title: "Chairman's Note",
      quote:
        'Growing up, we all had the opportunity to enjoy nature at its best. Open fields, fresh air, and tons of playtime with our friends. That’s why we wanted to gift families a present that would be enjoyed by their loved ones for years to come — ample space, airy abodes, and a club where merry times become merrier.',
      name: 'Mr. Kailash Chandra Lohia',
      role: 'Chairman',
    },
    architect: {
      name: 'Banka and Associates',
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
