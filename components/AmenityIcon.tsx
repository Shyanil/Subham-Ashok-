import type { ReactNode } from 'react';

/** Thin line icons in the brochure's map-icon style (24px grid, currentColor). */
const paths: Record<string, ReactNode> = {
  pool: (
    <>
      <path d="M7 15V5a2 2 0 0 1 4 0M13 15V5a2 2 0 0 1 4 0M7 8h6M7 12h6" />
      <path d="M2 18c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.6-1 3.3-1 1.7 1 3.3 1 1.7-1 3.4-1 1.6 1 3.3 1M2 21.5c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.6-1 3.3-1 1.7 1 3.3 1 1.7-1 3.4-1 1.6 1 3.3 1" />
    </>
  ),
  gym: <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11M1.5 12h2M20.5 12h2" />,
  club: (
    <>
      <path d="M3 21h18M5 21V9l7-5 7 5v12" />
      <path d="M10 21v-5h4v5M9 11h.01M15 11h.01" />
    </>
  ),
  games: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="13.5" cy="10.5" r="1.2" />
      <circle cx="14" cy="14" r="1.2" />
      <path d="M3 9h1M20 9h1M3 15h1M20 15h1" />
    </>
  ),
  kids: (
    <>
      <path d="M4 21 8 4h8l4 17M6 13h12" />
      <path d="M12 4v6M10.5 10h3l-.5 3h-2z" />
    </>
  ),
  lawn: (
    <>
      <path d="M12 21v-7M12 14c-3.5 0-6-2.4-6-5.5S8.5 3 12 3s6 2.4 6 5.5-2.5 5.5-6 5.5Z" />
      <path d="M12 11l-2.5-2.5M12 9.5l2.5-2.5M3 21h18" />
    </>
  ),
  opengym: (
    <>
      <path d="M8 8a4 4 0 0 1 8 0" />
      <path d="M6.5 10h11l-1.6 9.2a2 2 0 0 1-2 1.8H10.1a2 2 0 0 1-2-1.8z" />
      <path d="M3 4.5 5 6M21 4.5 19 6M12 2v2" />
    </>
  ),
  amphi: (
    <>
      <path d="M2 20a10 10 0 0 1 20 0M5.5 20a6.5 6.5 0 0 1 13 0M9 20a3 3 0 0 1 6 0" />
    </>
  ),
  lobby: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18M7.5 10l1.5-2 1.5 2M13.5 14l1.5 2 1.5-2" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5" />
    </>
  ),
  security: (
    <>
      <path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  power: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
  cctv: (
    <>
      <path d="M3 7.5 16 4l2 6-13 3.5z" />
      <path d="M17 7.5 21 9l-1 3.5-3-1M7 12.5 8 17H3M3 14v6" />
    </>
  ),
  rain: (
    <>
      <path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11Z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  stp: (
    <>
      <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" />
      <path d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" />
    </>
  ),
  fire: (
    <>
      <path d="M12 22c4 0 7-2.6 7-6.6C19 10 13 7.5 13 2c-3 2-4.5 5-4 8-1.5-.5-2.5-2-2.5-3.5C5 8.5 5 11 5 15.4 5 19.4 8 22 12 22Z" />
      <path d="M12 22c-1.7 0-3-1.2-3-3 0-2 3-4 3-4s3 2 3 4c0 1.8-1.3 3-3 3Z" />
    </>
  ),
};

export function AmenityIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
