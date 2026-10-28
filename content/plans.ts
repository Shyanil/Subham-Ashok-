/**
 * Unit plans and areas (sq.ft) from the e-brochure. Plan images are extracted
 * by scripts/extract-brochure.py into public/brochure/.
 */
export type Unit = {
  id: string;
  block: 'A' | 'B';
  type: string;
  baths: number;
  penthouse?: boolean;
  units: string;
  carpet: number;
  balcony: number;
  bua: number;
  sbua: number;
  terrace?: number;
  image: string;
};

export const units: Unit[] = [
  { id: 'a-101', block: 'A', type: '3 BHK', baths: 3, units: '101, 201, 301, 401, 501', carpet: 1100, balcony: 93, bua: 1261, sbua: 1677, image: 'unit-21' },
  { id: 'a-102', block: 'A', type: '2 BHK', baths: 2, units: '102, 202, 302, 402, 502', carpet: 635, balcony: 53, bua: 739, sbua: 983, image: 'unit-22' },
  { id: 'a-103', block: 'A', type: '3 BHK', baths: 3, units: '103, 203, 303, 403, 503', carpet: 1025, balcony: 112, bua: 1206, sbua: 1604, image: 'unit-23' },
  { id: 'a-601', block: 'A', type: '3 BHK', baths: 3, penthouse: true, units: '601', carpet: 1109, balcony: 50, bua: 1260, sbua: 1676, terrace: 408, image: 'unit-24' },
  { id: 'a-602', block: 'A', type: '3 BHK', baths: 3, penthouse: true, units: '602', carpet: 1203, balcony: 66, bua: 1354, sbua: 1801, terrace: 221, image: 'unit-25' },
  { id: 'b-101', block: 'B', type: '3 BHK', baths: 3, units: '101, 201, 301, 401, 501, 601, 701, 801, 901, 1001, 1101', carpet: 1035, balcony: 108, bua: 1219, sbua: 1621, image: 'unit-26' },
  { id: 'b-202', block: 'B', type: '3 BHK', baths: 3, units: '202, 302, 402, 502, 602, 702, 802, 902, 1002, 1102', carpet: 1108, balcony: 92, bua: 1272, sbua: 1691, image: 'unit-27' },
  { id: 'b-203', block: 'B', type: '3 BHK', baths: 3, units: '203, 303, 403, 503, 603, 703, 803, 903, 1003, 1103', carpet: 1108, balcony: 92, bua: 1272, sbua: 1692, image: 'unit-28' },
  { id: 'b-102', block: 'B', type: '3 BHK', baths: 3, units: '102, 204, 304, 404, 504, 604, 704, 804, 904, 1004', carpet: 978, balcony: 72, bua: 1115, sbua: 1483, image: 'unit-29' },
  { id: 'b-205', block: 'B', type: '3 BHK', baths: 3, units: '205, 305, 405, 505, 605, 705, 805, 905, 1005', carpet: 970, balcony: 73, bua: 1109, sbua: 1474, image: 'unit-30' },
  { id: 'b-103', block: 'B', type: '4 BHK', baths: 3, units: '103, 206, 306, 406, 506, 606, 706, 806, 906, 1006', carpet: 1338, balcony: 140, bua: 1566, sbua: 2082, image: 'unit-31' },
  { id: 'b-1104', block: 'B', type: '4 BHK', baths: 4, penthouse: true, units: '1104', carpet: 1680, balcony: 100, bua: 1881, sbua: 2501, terrace: 344, image: 'unit-32' },
  { id: 'b-1105', block: 'B', type: '3 BHK', baths: 3, penthouse: true, units: '1105', carpet: 1113, balcony: 216, bua: 1421, sbua: 1890, terrace: 117, image: 'unit-33' },
];

/** Typical floor plates (brochure pages 15–20). */
export type Floor = { id: string; block: 'A' | 'B'; title: string; note?: string; image: string };

export const floors: Floor[] = [
  { id: 'fa-1', block: 'A', title: '1st – 5th floor', note: '2 and 3 BHK', image: 'floor-15-l' },
  { id: 'fa-6', block: 'A', title: '6th floor', note: 'Penthouses', image: 'floor-15-r' },
  { id: 'fb-1', block: 'B', title: '1st floor', note: 'Clubhouse, pool and gym', image: 'floor-16' },
  { id: 'fb-2-t1', block: 'B', title: '2nd floor', note: 'Tower 1', image: 'floor-17-l' },
  { id: 'fb-2-t2', block: 'B', title: '2nd floor', note: 'Tower 2', image: 'floor-17-r' },
  { id: 'fb-3-t1', block: 'B', title: '3rd, 4th, 5th, 6th, 8th and 10th', note: 'Tower 1', image: 'floor-18-l' },
  { id: 'fb-3-t2', block: 'B', title: '3rd, 4th, 5th, 6th, 8th and 10th', note: 'Tower 2', image: 'floor-18-r' },
  { id: 'fb-7-t1', block: 'B', title: '7th and 9th floor', note: 'Tower 1', image: 'floor-19-l' },
  { id: 'fb-7-t2', block: 'B', title: '7th and 9th floor', note: 'Tower 2', image: 'floor-19-r' },
  { id: 'fb-11-t1', block: 'B', title: '11th floor', note: 'Tower 1', image: 'floor-20-l' },
  { id: 'fb-11-t2', block: 'B', title: '11th floor', note: 'Tower 2 · Penthouses', image: 'floor-20-r' },
];

export const masterPlanLegend = [
  'Entry / Exit',
  'Security room',
  'Driveway',
  'Drop-off area',
  'Green lawn',
  "Kids' play area",
  'Open gym',
  'Amphitheatre',
  'Open parking',
  'Stepping stones',
  'Planters',
];

/**
 * Centres of the numbered locations in the supplied 1323 × 1189 landscape plan.
 * Keep the brochure's verified legend numbering: some numbers in the supplied
 * illustration differ, so the interactive markers use the project legend.
 * Repeated locations deliberately share one legend selection.
 */
export const masterPlanHotspots = [
  { id: 'entry-west', number: 1, x: 12.93, y: 37.43 },
  { id: 'entry-east', number: 1, x: 11.94, y: 56.94 },
  { id: 'security-west', number: 2, x: 12.70, y: 41.38 },
  { id: 'security-east', number: 2, x: 12.32, y: 51.81 },
  { id: 'driveway-west', number: 3, x: 78.23, y: 14.63 },
  { id: 'driveway-north', number: 3, x: 91.53, y: 57.78 },
  { id: 'driveway-east', number: 3, x: 84.73, y: 88.73 },
  { id: 'driveway-central', number: 3, x: 54.12, y: 58.37 },
  { id: 'driveway-ramp', number: 3, x: 24.11, y: 35.83 },
  { id: 'dropoff-block-b-west', number: 4, x: 73.55, y: 29.44 },
  { id: 'dropoff-block-b-east', number: 4, x: 70.60, y: 75.69 },
  { id: 'dropoff-block-a', number: 4, x: 39.53, y: 58.37 },
  { id: 'green-lawn', number: 5, x: 58.05, y: 39.19 },
  { id: 'kids-play', number: 6, x: 66.36, y: 35.57 },
  { id: 'open-gym', number: 7, x: 64.32, y: 52.99 },
  { id: 'amphitheatre', number: 8, x: 56.61, y: 48.44 },
  { id: 'parking-west', number: 9, x: 78.30, y: 7.91 },
  { id: 'parking-east', number: 9, x: 88.89, y: 95.29 },
  { id: 'stepping-stones', number: 10, x: 66.67, y: 42.98 },
  { id: 'planters-north', number: 11, x: 97.43, y: 52.40 },
  { id: 'planters-west', number: 11, x: 66.82, y: 5.80 },
  { id: 'planters-central', number: 11, x: 61.15, y: 63.08 },
] as const;

export const keyDistances = [
  { group: 'Education', items: [['International School Guwahati', '1.1 km'], ['NPS International School', '3.8 km'], ['Royal Global University', '5.3 km'], ['Delhi Public School', '6.3 km']] },
  { group: 'Hospitals', items: [['Critical Care Hospital', '2.3 km'], ['Health City Hospital', '5.1 km'], ['Ayursundra Superspeciality Hospital', '6.2 km'], ['Boragaon ESIS Dispensary', '8.6 km'], ['Excel Care Hospital', '9.9 km']] },
  { group: 'Sports and leisure', items: [['Hockey Stadium', '1.3 km'], ['Indira Gandhi Athletic Stadium', '2.1 km'], ['Sarusajai Sports Complex', '2.1 km']] },
  { group: 'Shopping and markets', items: [['Reliance Smart Bazaar', '1.0 km'], ['Zudio', '3.0 km'], ['Unity Mall', '5.2 km']] },
  { group: 'Showrooms', items: [['Mercedes-Benz Axom Motors', '1.0 km'], ['Audi Guwahati', '1.0 km'], ['Royal Enfield Showroom', '1.4 km'], ['Tata Motors', '1.6 km'], ['Gargya Toyota', '4.3 km'], ['BMW Titanium Motorrad', '4.7 km']] },
  { group: 'Banks', items: [['HDFC Bank', '2.5 km'], ['SBI Bank', '2.9 km'], ['Central Bank of India', '3.2 km']] },
  { group: 'Civic', items: [['Basistha Police Station', '2.5 km'], ['Basistha Post Office', '3.0 km'], ['Dist. Transport Office, Kamrup', '4.3 km'], ['Garchuk Police Station', '6.6 km'], ['High Court', '12 km']] },
  { group: 'Temples', items: [['Tirupati Sri Balaji Temple', '5.3 km']] },
] as const;

/** Pixel size of the extracted brochure images, so next/image can reserve space (no CLS). */
export function planSize(image: string): { width: number; height: number } {
  if (image === 'master-plan') return { width: 1854, height: 1600 };
  if (image === 'floor-16') return { width: 2958, height: 1200 };
  if (image.startsWith('unit-')) return { width: 2958, height: 2062 };
  return { width: 1972, height: 1600 };
}

/** Configuration value for the lead form ("Looking for"). */
export const unitConfiguration = (u: Unit) => (u.penthouse ? 'Penthouse' : u.type);
export const unitLabel = (u: Unit) =>
  `Block ${u.block} · ${u.type}${u.penthouse ? ' penthouse' : ''} · ${u.carpet.toLocaleString('en-IN')} sq.ft carpet`;
