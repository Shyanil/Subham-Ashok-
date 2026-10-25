/**
 * Knowledge base for the on-page chat assistant. Answers are built from the same facts as the
 * page (content/site.ts, content/plans.ts, src/config/project.ts), matched by keyword.
 */
import { project, site } from '@/content/site';
import { possessionLabel, projectConfig } from '@/src/config/project';

export type ChatLink = { label: string; href: string };
export type ChatAnswer = {
  text: string;
  links?: ChatLink[];
  /** Answer only after the lead form — price, brochure and visit requests go straight to the form. */
  lead?: boolean;
};
type Topic = ChatAnswer & { id: string; keywords: string[] };

const amenityList = site.amenities.groups[0].items.map((i) => i.name).join(', ');

export const TOPICS: Topic[] = [
  {
    id: 'price',
    keywords: ['price', 'cost', 'rate', 'budget', 'lakh', 'lac', 'crore', 'cr', 'how much', 'offer', 'discount', 'payment', 'per sq'],
    text: 'Prices depend on the block, floor and unit, and current offers change often. Share your details and our team will send you the latest price list right away.',
    lead: true,
  },
  {
    id: 'brochure',
    keywords: ['brochure', 'pdf', 'catalogue', 'catalog'],
    text: 'Happy to send the full e-brochure with floor plans and specifications. Just fill in your details below.',
    lead: true,
  },
  {
    id: 'visit',
    keywords: ['visit', 'see the', 'tour', 'meet', 'appointment', 'book', 'sample flat', 'show flat'],
    text: 'We will gladly arrange a free site visit at a time that suits your family. Share your details to book a slot.',
    lead: true,
  },
  {
    id: 'config',
    keywords: ['bhk', 'size', 'area', 'sq', 'sqft', 'carpet', 'configuration', 'flat', 'apartment', 'unit', 'plan', 'penthouse', 'bedroom', 'room'],
    text: `${project.name} offers 2, 3 and 4 BHK homes plus penthouses, with carpet areas from 635 to 1,680 sq.ft. Block A has 6 floors (2 and 3 BHK, penthouses on top) and Block B rises to 11 floors (3 and 4 BHK).`,
    links: [{ label: 'See floor plans', href: '#floor-plans' }],
  },
  {
    id: 'amenities',
    keywords: ['amenit', 'facilit', 'pool', 'swim', 'gym', 'club', 'kids', 'play', 'lawn', 'garden', 'amphi', 'game', 'banquet'],
    text: `Amenities include: ${amenityList}. Plus 24×7 security, power backup, CCTV, rainwater harvesting and an on-site STP.`,
    links: [{ label: 'View amenities', href: '#amenities' }],
  },
  {
    id: 'location',
    keywords: ['location', 'where', 'address', 'located', 'map', 'direction', 'near', 'school', 'hospital', 'market', 'distance', 'beharbari', 'lalmati'],
    text: `The project is at ${site.contact.siteAddress.join(', ')}. Schools, hospitals, showrooms and markets are minutes away.`,
    links: [
      { label: 'Open in Google Maps', href: site.location.mapLink },
      { label: 'Location section', href: '#location' },
    ],
  },
  {
    id: 'possession',
    keywords: ['possession', 'ready', 'handover', 'complete', 'completion', 'when', 'move in', 'status', 'construction'],
    text: `${possessionLabel}. Our team can share the latest construction status and the expected handover timeline for your preferred unit.`,
  },
  {
    id: 'rera',
    keywords: ['rera', 'approved', 'approval', 'legal', 'registration', 'registered'],
    text: `Yes, the project is RERA registered: ${projectConfig.RERA}.`,
    links: [{ label: 'Assam RERA website', href: projectConfig.RERA_URL }],
  },
  {
    id: 'loan',
    keywords: ['loan', 'bank', 'emi', 'finance', 'home loan', 'mortgage'],
    text: 'Yes, we offer home-loan assistance with leading banks. Our team can help you with eligibility and EMI estimates.',
  },
  {
    id: 'developer',
    keywords: ['developer', 'builder', 'subham', 'company', 'lohia', 'track record', 'trust', 'who'],
    text: `${project.name} is by ${project.developer} (${project.developerTagline}), building in Guwahati since 2007 with 18 completed projects, 34.5 lakh sq.ft built and 6,100+ happy residents.`,
    links: [{ label: 'About the developer', href: '#developer' }],
  },
  {
    id: 'parking',
    keywords: ['parking', 'car', 'garage'],
    text: 'There are drop-off areas and open parking within the campus. Parking allotment details are shared with the price list.',
  },
  {
    id: 'safety',
    keywords: ['security', 'safe', 'cctv', 'power', 'backup', 'lift', 'elevator', 'fire', 'water'],
    text: '24×7 manned security, CCTV across common areas, 24×7 power backup, OTIS / KONE / Schindler lifts, fire safety systems and rainwater harvesting.',
  },
  {
    id: 'contact',
    keywords: ['contact', 'phone', 'call', 'number', 'email', 'whatsapp', 'talk', 'agent', 'human', 'person', 'office'],
    text: `You can call us on ${projectConfig.PHONE} or email ${projectConfig.EMAIL}. Or leave your details and we will call you back.`,
    links: [{ label: `Call ${projectConfig.PHONE}`, href: `tel:${projectConfig.PHONE_E164}` }],
  },
  {
    id: 'hello',
    keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'],
    text: `Hello! I can help with prices, floor plans, amenities, location and site visits for ${project.name}. What would you like to know?`,
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'ok', 'okay', 'great', 'nice'],
    text: 'You are welcome! Anything else I can help you with?',
  },
];

export const FALLBACK: ChatAnswer = {
  text: 'Good question — our sales team can answer that precisely. Share your details and they will call you shortly.',
  lead: true,
};

export const QUICK_REPLIES = ['Price', 'Floor plans', 'Amenities', 'Location', 'Possession', 'Book site visit'];

/** Picks the topic whose keywords best match the message. */
export function answerFor(message: string): ChatAnswer {
  const q = ` ${message.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ')} `;
  let best: Topic | null = null;
  let bestScore = 0;
  for (const t of TOPICS) {
    // Short keywords must match whole words ("hi" should not match "children").
    const score = t.keywords.reduce((n, k) => n + (k.length <= 3 ? (q.includes(` ${k} `) ? 1 : 0) : q.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      best = t;
      bestScore = score;
    }
  }
  return best ?? FALLBACK;
}
