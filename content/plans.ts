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
  { id: 'fa-1', block: 'A', title: '1st – 5th floor', note: '2 & 3 BHK', image: 'floor-15-l' },
  { id: 'fa-6', block: 'A', title: '6th floor', note: 'Penthouses', image: 'floor-15-r' },
  { id: 'fb-1', block: 'B', title: '1st floor', note: 'Clubhouse, pool & gym', image: 'floor-16' },
  { id: 'fb-2-t1', block: 'B', title: '2nd floor', note: 'Tower 1', image: 'floor-17-l' },
  { id: 'fb-2-t2', block: 'B', title: '2nd floor', note: 'Tower 2', image: 'floor-17-r' },
  { id: 'fb-3-t1', block: 'B', title: '3rd, 4th, 5th, 6th, 8th & 10th', note: 'Tower 1', image: 'floor-18-l' },
  { id: 'fb-3-t2', block: 'B', title: '3rd, 4th, 5th, 6th, 8th & 10th', note: 'Tower 2', image: 'floor-18-r' },
  { id: 'fb-7-t1', block: 'B', title: '7th & 9th floor', note: 'Tower 1', image: 'floor-19-l' },
  { id: 'fb-7-t2', block: 'B', title: '7th & 9th floor', note: 'Tower 2', image: 'floor-19-r' },
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

export const specifications = [
  { k: 'Structure', v: 'RCC frame with earthquake-resistant structure.' },
  { k: 'Internal walls', v: 'Wall putty.' },
  { k: 'External walls', v: 'High-quality waterproof paint.' },
  { k: 'Kitchen', v: 'Wall tiles (300 × 600 mm) dado up to 2 ft above granite counter slab, stainless-steel sink, provision for exhaust fan and water purifier.' },
  { k: 'Toilet', v: 'Anti-skid floor tiles, ceramic wall tiles up to 7 ft, provision for exhaust fan.' },
  { k: 'Sanitary & fittings', v: 'Basins and WCs of reputed brands, CP fittings of ISI quality.' },
  { k: 'Flooring', v: '600 × 600 mm vitrified tiles in all rooms, drawing and dining.' },
  { k: 'Doors & windows', v: 'Timber-framed flush doors in all rooms, toilets and kitchen; aluminium windows.' },
  { k: 'Electrical', v: 'Adequate electrical points.' },
  { k: 'Lift', v: 'Automatic passenger lifts by OTIS / KONE / Schindler or equivalent.' },
  { k: 'Fire', v: 'Firefighting arrangement as per fire safety norms.' },
];

export const keyDistances = [
  { group: 'Education', items: [['International School Guwahati', '1.1 km'], ['NPS International School', '3.8 km'], ['Royal Global University', '5.3 km'], ['Delhi Public School', '6.3 km']] },
  { group: 'Hospitals', items: [['Critical Care Hospital', '2.3 km'], ['Health City Hospital', '5.1 km'], ['Ayursundra Superspeciality Hospital', '6.2 km'], ['Boragaon ESIS Dispensary', '8.6 km'], ['Excel Care Hospital', '9.9 km']] },
  { group: 'Sports & leisure', items: [['Hockey Stadium', '1.3 km'], ['Indira Gandhi Athletic Stadium', '2.1 km'], ['Sarusajai Sports Complex', '2.1 km']] },
  { group: 'Shopping & markets', items: [['Reliance Smart Bazaar', '1.0 km'], ['Zudio', '3.0 km'], ['Unity Mall', '5.2 km']] },
  { group: 'Showrooms', items: [['Mercedes-Benz Axom Motors', '1.0 km'], ['Audi Guwahati', '1.0 km'], ['Royal Enfield Showroom', '1.4 km'], ['Tata Motors', '1.6 km'], ['Gargya Toyota', '4.3 km'], ['BMW Titanium Motorrad', '4.7 km']] },
  { group: 'Banks', items: [['HDFC Bank', '2.5 km'], ['SBI Bank', '2.9 km'], ['Central Bank of India', '3.2 km']] },
  { group: 'Civic', items: [['Basistha Police Station', '2.5 km'], ['Basistha Post Office', '3.0 km'], ['Dist. Transport Office, Kamrup', '4.3 km'], ['Garchuk Police Station', '6.6 km'], ['High Court', '12 km']] },
  { group: 'Temples', items: [['Tirupati Sri Balaji Temple', '5.3 km']] },
] as const;
