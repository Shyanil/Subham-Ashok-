/**
 * Depth-photo site model: the day and night aerial renders, each with a depth map, shown as a
 * 2.5D scene. Positions are top-left image UVs (0..1) on each render — the two renders are shot
 * from different sides, so every point has a day and a night position.
 */
export type UV = [number, number];

export const SCENES = {
  day: { slug: 'aerial-day-view', src: '/images/exterior/aerial-day-view-2560.webp', depth: '/images/exterior/aerial-day-view-depth.webp' },
  night: { slug: 'aerial-night-view', src: '/images/exterior/aerial-night-view-2560.webp', depth: '/images/exterior/aerial-night-view-depth.webp' },
} as const;

export type ViewId = 'aerial' | 'towers' | 'courtyard';
export const VIEWS: { id: ViewId; label: string; short: string; zoom: number; day: UV; night: UV }[] = [
  { id: 'aerial', label: 'Aerial view', short: 'Aerial', zoom: 1.04, day: [0.5, 0.5], night: [0.5, 0.5] },
  { id: 'towers', label: 'Block B towers', short: 'Towers', zoom: 1.75, day: [0.47, 0.34], night: [0.55, 0.36] },
  { id: 'courtyard', label: 'Courtyard and Block A', short: 'Courtyard', zoom: 2, day: [0.54, 0.6], night: [0.43, 0.62] },
];

/** Zoom used when an amenity is selected, and the range the +/− controls move within. */
export const HOTSPOT_ZOOM = 1.75;
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 2.4;

export type Hotspot = { marker: string; plan: 'master' | 'block-b'; id: string; icon: string; name: string; note: string; day: UV; night: UV; nightVisible?: boolean };

/** Outdoor anchors checked against the brochure master plan; indoor anchors use the Block B first-floor plan.
 * Hidden courtyard features are not labelled through Block A in the reverse night render.
 * Outdoor marker numbers match brochure page 14. Indoor letter markers reference page 16. */
export const HOTSPOTS: Hotspot[] = [
  { marker: '1', plan: 'master', id: 'gate', icon: 'security', name: 'Entry gate and security', note: '24×7 manned entry and exit on the 9 m road', day: [0.699, 0.856], night: [0.347, 0.843] },
  { marker: 'L', plan: 'master', id: 'lobby', icon: 'lobby', name: 'Block A lift lobby', note: 'Grand lobby with OTIS / KONE / Schindler lifts', day: [0.648, 0.824], night: [0.434, 0.751] },
  { marker: '5', plan: 'master', id: 'lawn', icon: 'lawn', name: 'Green lawn', note: 'Landscaped courtyard beside the play area', day: [0.495, 0.615], night: [0.473, 0.554], nightVisible: false },
  { marker: '6', plan: 'master', id: 'kids', icon: 'kids', name: "Kids' play area", note: 'Play area beside the green lawn', day: [0.471, 0.622], night: [0.459, 0.542], nightVisible: false },
  { marker: '8', plan: 'master', id: 'amphi', icon: 'amphi', name: 'Amphitheatre', note: 'Gatherings under the sky', day: [0.514, 0.607], night: [0.47, 0.586] },
  { marker: '7', plan: 'master', id: 'opengym', icon: 'opengym', name: 'Open gym', note: 'Workouts in fresh air', day: [0.517, 0.562], night: [0.482, 0.535], nightVisible: false },
  { marker: 'P', plan: 'block-b', id: 'pool', icon: 'pool', name: 'Swimming pool', note: 'Infinity edge with sun deck, on the Block B podium', day: [0.5, 0.476], night: [0.509, 0.482] },
  { marker: 'CH', plan: 'block-b', id: 'club', icon: 'club', name: 'Club House and indoor games', note: "Block B, 1st floor: Club House and indoor play area", day: [0.461, 0.515], night: [0.552, 0.535] },
  { marker: 'G', plan: 'block-b', id: 'gym', icon: 'gym', name: 'Gymnasium', note: "Block B, 1st floor, beside the swimming pool", day: [0.535, 0.45], night: [0.48, 0.463] },
  { marker: '4', plan: 'master', id: 'parking', icon: 'parking', name: 'Basement, Ground and Open parking', note: 'Parking across basement, ground and open areas', day: [0.664, 0.85], night: [0.384, 0.808] },
  { marker: '10', plan: 'master', id: 'stones', icon: 'lawn', name: 'Stepping stones', note: 'Landscaped path beside the green lawn', day: [0.493, 0.585], night: [0.476, 0.537] },
  { marker: '9', plan: 'master', id: 'openparking', icon: 'parking', name: 'Open parking', note: 'Parking bays along the side of Block B', day: [0.332, 0.584], night: [0.637, 0.621] },
];
