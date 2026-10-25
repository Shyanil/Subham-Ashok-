/**
 * Depth-photo site model: the day and night aerial renders, each with a depth map, shown as a
 * 2.5D scene. Positions are top-left image UVs (0..1) on each render — the two renders are shot
 * from different sides, so every point has a day and a night position.
 */
export type UV = [number, number];

export const SCENES = {
  day: { slug: 'aerial-day-view', src: '/images/exterior/aerial-day-view-1920.webp', depth: '/images/exterior/aerial-day-view-depth.webp' },
  night: { slug: 'aerial-night-view', src: '/images/exterior/aerial-night-view-1920.webp', depth: '/images/exterior/aerial-night-view-depth.webp' },
} as const;

export type ViewId = 'aerial' | 'towers' | 'courtyard';
export const VIEWS: { id: ViewId; label: string; short: string; zoom: number; day: UV; night: UV }[] = [
  { id: 'aerial', label: 'Aerial view', short: 'Aerial', zoom: 1.04, day: [0.5, 0.5], night: [0.5, 0.5] },
  { id: 'towers', label: 'Block B towers', short: 'Towers', zoom: 1.75, day: [0.47, 0.34], night: [0.55, 0.36] },
  { id: 'courtyard', label: 'Courtyard and Block A', short: 'Courtyard', zoom: 2, day: [0.54, 0.6], night: [0.43, 0.62] },
];

export type Hotspot = { id: string; icon: string; name: string; note: string; day: UV; night: UV };

export const HOTSPOTS: Hotspot[] = [
  { id: 'gate', icon: 'security', name: 'Entry gate and security', note: '24×7 manned entry and exit on the 9 m road', day: [0.7, 0.83], night: [0.35, 0.87] },
  { id: 'lobby', icon: 'lobby', name: 'Block A lift lobby', note: 'Grand lobby with OTIS / KONE / Schindler lifts', day: [0.595, 0.58], night: [0.405, 0.66] },
  { id: 'lawn', icon: 'lawn', name: 'Green lawn', note: 'Stepping stones and planters', day: [0.497, 0.6], night: [0.47, 0.52] },
  { id: 'kids', icon: 'kids', name: "Kids' play area", note: 'Safe, landscaped and in view', day: [0.475, 0.545], night: [0.437, 0.56] },
  { id: 'amphi', icon: 'amphi', name: 'Amphitheatre', note: 'Gatherings under the sky', day: [0.518, 0.625], night: [0.383, 0.82] },
  { id: 'opengym', icon: 'opengym', name: 'Open gym', note: 'Workouts in fresh air', day: [0.455, 0.615], night: [0.47, 0.59] },
  { id: 'pool', icon: 'pool', name: 'Swimming pool', note: 'Infinity edge with sun deck, on the Block B podium', day: [0.5, 0.47], night: [0.508, 0.478] },
  { id: 'club', icon: 'club', name: 'Clubhouse and indoor games', note: 'Banquet hall, billiards, table tennis, chess', day: [0.543, 0.73], night: [0.54, 0.555] },
  { id: 'gym', icon: 'gym', name: 'Gymnasium', note: 'Garden-facing fitness centre, Block B 1st floor', day: [0.43, 0.57], night: [0.565, 0.6] },
  { id: 'parking', icon: 'parking', name: 'Parking and drop-off', note: 'Drop-off areas and open parking', day: [0.344, 0.6], night: [0.617, 0.62] },
];
