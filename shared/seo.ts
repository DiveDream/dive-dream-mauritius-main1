// Per-route SEO metadata, shared by the client (RouteSeo.tsx updates <head>
// on client-side navigation) and the build (vite-plugin-seo.ts bakes the
// same tags into a static HTML file per route, plus sitemap.xml/robots.txt).
// Keep this file free of client-only imports (no `@/` aliases) so the Vite
// config can load it at build time.

export const SITE_URL = 'https://divedreammauritius.com';
export const SITE_NAME = 'Dive Dream Divers';

// Group of divers on the Dive Dream boat (Strapi homepage "Professional
// Training" slide), cropped by Cloudinary to the 1200x630 social-card size.
export const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/dvyxak16/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/v1783629794/519_A3_E47_12_C9_43_BA_95_E5_2_AB_3040_BB_256_6c3b87cf02.jpg';

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  /** Excluded from sitemap.xml and tagged `noindex, follow`. */
  noindex?: boolean;
  /** sitemap.xml hint, 0.0-1.0. */
  priority?: number;
  /** Social preview image; falls back to DEFAULT_OG_IMAGE. */
  image?: string;
}

// Cloudinary URLs are cropped to the 1200x630 social-card size; other hosts
// are used as-is.
export function socialImage(url?: string | null): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/') && !url.includes('/upload/c_')) {
    return url.replace('/image/upload/', '/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/');
  }
  return url;
}

export const ROUTE_SEO: RouteSeo[] = [
  {
    path: '/',
    title: 'Scuba Diving Mauritius | SDI & TDI Dive Centre | Dive Dream',
    description:
      'Scuba diving in Mauritius with an SDI & TDI 5-Star dive centre in Trou aux Biches, North Mauritius. Boat dives, courses and packages since 2004.',
    priority: 1.0,
  },
  {
    path: '/dive-safaris',
    title: 'Mauritius Dive Sites & Dive Safaris | Dive Dream Divers',
    description:
      'Dive Mauritius\' best dive sites: Coin de Mire, Île Plate, Round Island and Passe St-Jacques. Reef, wall and wreck dives by boat from Trou aux Biches.',
    priority: 0.9,
  },
  {
    path: '/packages',
    title: 'Dive Packages Mauritius | Boat Diving | Dive Dream Divers',
    description:
      'Dive packages in Mauritius: single dives, double-tank trips and 5 or 10 dive packages by boat from Trou aux Biches. SDI/TDI 5-Star centre. Book online.',
    priority: 0.9,
  },
  {
    path: '/courses',
    title: 'SDI & TDI Certification Courses Mauritius | Dive Dream',
    description:
      'Get SDI or TDI certified in Mauritius: Open Water to technical diving courses at our 5-Star dive centre in Trou aux Biches. English, French, German.',
    priority: 0.9,
  },
  {
    path: '/courses/open-water',
    title: 'SDI Open Water Course Mauritius | Beginner Scuba Diving',
    description:
      'Beginner scuba diving in Mauritius: get SDI Open Water certified at Dive Dream Divers, an SDI/TDI 5-Star dive centre in Trou aux Biches.',
    priority: 0.8,
  },
  {
    path: '/courses/advanced-open-water',
    title: 'Advanced Diver Course Mauritius | Advanced Open Water',
    description:
      'Advanced diver course in Trou aux Biches, Mauritius: five adventure dives to build skills and dive deeper, with an SDI/TDI 5-Star dive centre.',
    priority: 0.7,
  },
  {
    path: '/courses/rescue-diver',
    title: 'SDI Rescue Diver Course Mauritius | Dive Dream Divers',
    description:
      'SDI Rescue Diver course in Trou aux Biches, Mauritius. Learn rescue techniques and emergency response with SDI/TDI 5-Star instructors.',
    priority: 0.7,
  },
  {
    path: '/courses/deep-diver',
    title: 'SDI Deep Diver Course Mauritius | Dive Dream Divers',
    description:
      'SDI Deep Diver specialty course in Mauritius. Train to plan and safely conduct deeper dives with Dive Dream Divers in Trou aux Biches.',
    priority: 0.7,
  },
  {
    path: '/courses/nitrox',
    title: 'SDI Enriched Air Nitrox Course Mauritius | Dive Dream Divers',
    description:
      'SDI Enriched Air Nitrox (EANx) course in Trou aux Biches, Mauritius. Learn to dive nitrox for longer bottom times at our SDI/TDI 5-Star centre.',
    priority: 0.7,
  },
  {
    path: '/courses/wreck-diver',
    title: 'Wreck Diving Mauritius | SDI Wreck Diver Course',
    description:
      'Wreck diving in Mauritius: SDI Wreck Diver specialty course in Trou aux Biches. Learn to explore shipwrecks safely with SDI/TDI 5-Star instructors.',
    priority: 0.7,
  },
  {
    path: '/courses/extended-range',
    title: 'TDI Technical Diving Mauritius | Extended Range Course',
    description:
      'TDI technical diving in Mauritius: SDI/TDI Extended Range (XR) course in Trou aux Biches, training planned decompression dives. TDI certification.',
    priority: 0.7,
  },
  {
    path: '/courses/discover-scuba-diving',
    title: 'Discover Scuba Diving Mauritius | Dive Dream Divers',
    description:
      'Beginner scuba diving in Trou aux Biches, Mauritius, with no certification needed: safety briefing, confined water practice and a guided dive to 12 m.',
    priority: 0.8,
  },
  {
    path: '/rebreather-diving',
    title: 'Rebreather Diving in Mauritius | Dive Dream Divers',
    description:
      'Closed-circuit rebreather diving in Mauritius with Dive Dream Divers, an SDI/TDI 5-Star dive centre in Trou aux Biches. Longer, quieter dives.',
    priority: 0.7,
  },
  {
    path: '/services',
    title: 'Snorkeling Mauritius & Boat Charters | Dive Dream Divers',
    description:
      'Guided snorkeling safaris, private boat charters, underwater photography and transfers from Dive Dream Divers in Trou aux Biches, Mauritius.',
    priority: 0.7,
  },
  {
    path: '/promotions',
    title: 'Diving Offers & Promotions | Dive Dream Divers Mauritius',
    description:
      'Current diving offers and seasonal promotions from Dive Dream Divers, an SDI/TDI 5-Star dive centre in Trou aux Biches, Mauritius.',
    priority: 0.6,
  },
  {
    path: '/about',
    title: 'About Dive Dream Divers | Trou aux Biches Dive Centre',
    description:
      'Dive Dream Divers has offered SDI and TDI scuba training and guided dives in Trou aux Biches, Mauritius, since 2004. Meet the dive centre.',
    priority: 0.6,
  },
  {
    path: '/crew',
    title: 'Our Dive Instructors & Crew | Dive Dream Divers Mauritius',
    description:
      'Meet the multilingual SDI and TDI instructors and crew at Dive Dream Divers in Trou aux Biches, Mauritius.',
    priority: 0.5,
  },
  {
    path: '/faq',
    title: 'Scuba Diving FAQs | Dive Dream Divers Mauritius',
    description:
      'Answers on certifications, medical requirements, safety and bookings for diving with Dive Dream Divers in Trou aux Biches, Mauritius.',
    priority: 0.5,
  },
  {
    path: '/contact',
    title: 'Contact Dive Dream Divers | Trou aux Biches, Mauritius',
    description:
      'Contact Dive Dream Divers at Becosy Hotel, Royal Road, Trou aux Biches, Mauritius. Call, WhatsApp or email us to plan your dives and courses.',
    priority: 0.6,
  },
  {
    path: '/reservations',
    title: 'Book a Dive in Mauritius | Dive Dream Divers',
    description:
      'Request a booking for dives, packages or SDI/TDI courses with Dive Dream Divers in Trou aux Biches, Mauritius. We confirm your itinerary by email.',
    priority: 0.8,
  },
  {
    path: '/thank-you',
    title: 'Booking Request Received | Dive Dream Divers',
    description: 'Your booking request with Dive Dream Divers has been received.',
    noindex: true,
  },
  {
    path: '/loyalty-claim',
    title: 'Loyalty Claim | Dive Dream Divers',
    description: 'Returning diver loyalty claim form for Dive Dream Divers, Trou aux Biches, Mauritius.',
    noindex: true,
  },
];

export const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: 'Page Not Found | Dive Dream Divers',
  description: 'The page you are looking for could not be found.',
  noindex: true,
};

// Used for /services/:slug. The runtime and build both call this so the
// per-service title stays identical in the prerendered HTML and after
// hydration.
// Keyword-targeted titles for services whose topic matches a search term;
// the rest fall back to the Strapi title. Keep each under ~60 characters.
const SERVICE_TITLE_OVERRIDES: Record<string, string> = {
  'guided-snorkeling-safaris': 'Guided Snorkeling in Mauritius | Dive Dream Divers',
  'private-boat-charters': 'Private Dive Boat Charter Mauritius | Dive Dream Divers',
};

export function serviceDetailSeo(slug: string, title: string, description?: string, image?: string | null): RouteSeo {
  const clean = title.trim();
  const short = clean.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const candidates = [
    `${clean} | Dive Dream Divers Mauritius`,
    `${clean} | Dive Dream Divers`,
    `${short} | Dive Dream Divers Mauritius`,
    `${short} | Dive Dream Divers`,
  ];
  return {
    path: `/services/${slug}`,
    title: SERVICE_TITLE_OVERRIDES[slug] ?? candidates.find((candidate) => candidate.length <= 60) ?? short,
    description: truncate(
      description?.replace(/\s+/g, ' ').trim() || `${clean} from Dive Dream Divers, an SDI/TDI 5-Star dive centre in Trou aux Biches, Mauritius.`,
      155,
    ),
    priority: 0.6,
    image: socialImage(image),
  };
}

// Strapi services whose topic already has a dedicated top-level page. Their
// /services/:slug URL 301s there (vercel.json, server/index.ts), service
// cards link there directly, and they are not prerendered or listed in the
// sitemap as separate pages.
export const SERVICE_PAGE_OVERRIDES: Record<string, string> = {
  'rebreather-diving': '/rebreather-diving',
};

export function serviceHref(slug: string): string {
  return SERVICE_PAGE_OVERRIDES[slug] ?? `/services/${slug}`;
}

export function findRouteSeo(path: string): RouteSeo | undefined {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return ROUTE_SEO.find((route) => route.path === normalized);
}

export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

// ─── Structured data ────────────────────────────────────────────────
// Mirrors client/src/content/settings.ts and the live Strapi
// website-settings entry. Update both if the business details change.
// Opening hours use the Strapi value (what the live site displays),
// which differs from the local fallback in settings.ts (08:30).
export const BUSINESS = {
  name: SITE_NAME,
  telephone: ['+230 57535352', '+230 58310098'],
  email: 'reservations@divedreammauritius.com',
  streetAddress: 'Becosy Hotel, Royal Road',
  locality: 'Trou aux Biches',
  country: 'MU',
  opens: '08:00',
  closes: '16:30',
  foundingYear: '2004',
};

export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS.name,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/dreamdivelogo.jpg`,
    image: DEFAULT_OG_IMAGE,
    description:
      'SDI & TDI 5-Star dive centre in Trou aux Biches, Mauritius, offering boat dives, scuba courses, technical and rebreather diving.',
    telephone: BUSINESS.telephone[0],
    email: BUSINESS.email,
    foundingDate: BUSINESS.foundingYear,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressCountry: BUSINESS.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: BUSINESS.opens,
        closes: BUSINESS.closes,
      },
    ],
    // TODO: add `geo` ({ latitude, longitude }) once the exact Becosy Hotel
    // pin is confirmed; content/contact.ts only has approximate town-centre
    // coordinates. Add `sameAs` once real social profile URLs exist
    // (settings.ts socialLinks are still '#').
  };
}
