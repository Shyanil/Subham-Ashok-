import type { FilterId } from './site';

/**
 * Editorial metadata per image, keyed by the slug the prep script derives from
 * the file name ("SWIMMING POOL VIEW.webp" → "swimming-pool-view").
 *
 * focus / mobileFocus work like CSS object-position (0–1 on each axis) and are
 * used by both next/image and the WebGL shaders. mobileFocus drives portrait crops.
 * Images without an entry still work — they get a title derived from the file name.
 */
export type ImageMeta = {
  title: string;
  alt: string;
  focus?: [number, number];
  mobileFocus?: [number, number];
  tags: Exclude<FilterId, 'all'>[];
};

export const imageMeta: Record<string, ImageMeta> = {
  'aerial-day-view': {
    title: 'The Towers by Day',
    alt: 'Aerial daytime view of the three residential towers surrounded by lush green trees and low-rise neighbourhood homes',
    focus: [0.5, 0.45],
    mobileFocus: [0.5, 0.5],
    tags: ['outdoors', 'top'],
  },
  'aerial-night-view': {
    title: 'Evenings, Softly Lit',
    alt: 'Aerial night view of the towers glowing with warm façade lighting beside a lit avenue',
    focus: [0.5, 0.5],
    mobileFocus: [0.5, 0.5],
    tags: ['outdoors', 'top'],
  },
  'gate-view': {
    title: 'An Arrival Worth the Wait',
    alt: 'Main entrance gate with a canopy, carved stone pillars and residents walking in at golden hour',
    focus: [0.55, 0.5],
    mobileFocus: [0.62, 0.5],
    tags: ['outdoors'],
  },
  'kids-play-day': {
    title: 'Room to Run Free',
    alt: 'Landscaped lawn with a children’s play area, blossoming trees and families at sunset',
    focus: [0.4, 0.6],
    mobileFocus: [0.28, 0.6],
    tags: ['outdoors', 'living'],
  },
  'road-elevation-view': {
    title: 'A Skyline of Its Own',
    alt: 'Street-level elevation of the residential towers against a clear blue sky',
    focus: [0.45, 0.45],
    mobileFocus: [0.42, 0.45],
    tags: ['outdoors'],
  },
  'swimming-pool-view': {
    title: 'Golden Hour by the Pool',
    alt: 'Infinity-edge swimming pool with sun loungers, a resident swimming and a warm sunset over the trees',
    focus: [0.5, 0.6],
    mobileFocus: [0.42, 0.6],
    tags: ['outdoors', 'living'],
  },
  'club-house': {
    title: 'A Clubhouse for Every Celebration',
    alt: 'Clubhouse banquet hall with round dining tables, cove lighting and floor-to-ceiling windows',
    focus: [0.5, 0.55],
    mobileFocus: [0.48, 0.55],
    tags: ['interiors', 'living'],
  },
  gym: {
    title: 'Strength, in Natural Light',
    alt: 'Fitness centre with treadmills, cross-trainers and free weights beside large garden-facing windows',
    focus: [0.45, 0.55],
    mobileFocus: [0.42, 0.55],
    tags: ['interiors'],
  },
  'indoor-games': {
    title: 'Play, Unhurried',
    alt: 'Indoor games lounge with a billiards table, table tennis and a chess corner under timber ceiling slats',
    focus: [0.6, 0.55],
    mobileFocus: [0.72, 0.6],
    tags: ['interiors', 'living'],
  },
  'lift-lobby': {
    title: 'A Lobby That Welcomes You Home',
    alt: 'Double-height lift lobby with marble floors, timber-panelled walls and a concierge desk',
    focus: [0.5, 0.5],
    mobileFocus: [0.5, 0.5],
    tags: ['interiors'],
  },
};
