/**
 * Stylised site model derived from the brochure master plan.
 * Units: 1 = ~3 m (one storey). +x = east, −z = north, the 9 m road runs along +z (south).
 * Block A: the stem of the "T", nearest the road, stilt + 6 floors (incl. penthouse level).
 * Block B: the long northern block — a podium (parking, clubhouse, pool, gym) with
 * Tower 1 and Tower 2 rising to 11 floors.
 */
export type Vec3 = [number, number, number];

export type ViewId = 'aerial' | 'east' | 'north';
export const VIEWS: { id: ViewId; label: string; short: string; camera: Vec3; target: Vec3 }[] = [
  { id: 'aerial', label: 'Aerial view', short: 'Aerial', camera: [30, 26, 34], target: [0, 3, -1] },
  { id: 'east', label: 'East-facing homes', short: 'East-facing', camera: [40, 9, -2], target: [0, 5, -2] },
  { id: 'north', label: 'North-facing homes', short: 'North-facing', camera: [6, 10, -44], target: [0, 5, -6] },
];

export type Hotspot = { id: string; icon: string; name: string; note: string; at: Vec3; camera: Vec3 };

export const HOTSPOTS: Hotspot[] = [
  { id: 'gate', icon: 'security', name: 'Entry gate and security', note: '24×7 manned entry and exit on the 9 m road', at: [0, 1.4, 14.2], camera: [10, 6, 26] },
  { id: 'lobby', icon: 'lobby', name: 'Block A lift lobby', note: 'Grand lobby with OTIS / KONE / Schindler lifts', at: [0, 1, 8], camera: [12, 5, 18] },
  { id: 'lawn', icon: 'lawn', name: 'Green lawn', note: 'Stepping stones and planters', at: [-0.5, 0.4, 0.5], camera: [10, 9, 12] },
  { id: 'kids', icon: 'kids', name: "Kids' play area", note: 'Safe, landscaped and in view', at: [-2.6, 0.8, -2.4], camera: [-10, 8, 8] },
  { id: 'amphi', icon: 'amphi', name: 'Amphitheatre', note: 'Gatherings under the sky', at: [2, 0.6, 1.6], camera: [12, 7, 10] },
  { id: 'opengym', icon: 'opengym', name: 'Open gym', note: 'Workouts in fresh air', at: [2.6, 0.7, -2.6], camera: [12, 7, 4] },
  { id: 'pool', icon: 'pool', name: 'Swimming pool', note: 'Infinity edge with sun deck, on the Block B podium', at: [0, 2.5, -9.6], camera: [10, 22, 8] },
  { id: 'club', icon: 'club', name: 'Clubhouse and indoor games', note: 'Banquet hall, billiards, table tennis, chess', at: [0, 3.4, -7], camera: [-6, 10, 4] },
  { id: 'gym', icon: 'gym', name: 'Gymnasium', note: 'Garden-facing fitness centre, Block B 1st floor', at: [-3, 1.6, -5.9], camera: [-12, 7, 6] },
  { id: 'parking', icon: 'parking', name: 'Parking and drop-off', note: 'Drop-off areas and open parking', at: [12.4, 0.6, -9], camera: [24, 8, 2] },
];
