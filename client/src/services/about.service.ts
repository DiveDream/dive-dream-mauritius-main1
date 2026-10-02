import type { AboutPage, Activity } from '@/types';
import type { StrapiMedia, StrapiSingleResponse } from '@/types/strapi';
import { ABOUT_PAGE } from '@/content';
import { fetchAPI } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { mapSectionHeading, normalizeStringArray, resolveStrapiMediaUrl, unwrapSingle, type RawSectionHeading } from '@/lib/strapiMappers';

// NOTE: `about-page` is live in Strapi. Its `mission`/`conservation`
// components each nest the reusable section-heading component under a
// `heading` sub-field (confirmed against the live API response) rather than
// spreading eyebrow/title/description directly on the section — unlike
// `hero`, which *is* a section-heading component so it's flat. Mixing these
// two shapes up is what caused a production crash: mapSectionHeading(raw)
// falls back `title: raw?.title ?? raw?.heading`, so when `heading` is an
// object (not a string alias) instead of undefined, the whole raw component
// object — `{id, eyebrow, title, description}` — got assigned as `title`
// and rendered straight into JSX (React error #31).
interface RawActivity {
  id?: number;
  documentId?: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  image?: StrapiMedia | null;
}

interface RawSectionWithHeading {
  heading?: RawSectionHeading | null;
  points?: unknown;
  initiatives?: RawActivity[];
  image?: StrapiMedia | null;
}

interface RawAboutPage {
  hero?: RawSectionHeading | null;
  heroImage?: StrapiMedia | null;
  mission?: RawSectionWithHeading | null;
  conservation?: RawSectionWithHeading | null;
}

function mapActivity(raw: RawActivity, index: number): Activity {
  return {
    id: raw.documentId ?? String(raw.id ?? index),
    title: raw.title,
    description: raw.description ?? undefined,
    icon: raw.icon ?? undefined,
    image: raw.image ? resolveStrapiMediaUrl(raw.image) : undefined,
  };
}

// Each section below falls back to the matching local section as a whole
// (rather than the whole page bailing to ABOUT_PAGE) so an editor can fill
// in just e.g. `heroImage` in Strapi without also having to author mission
// and conservation copy for the page to keep rendering real content.
export async function getAboutPage(): Promise<AboutPage> {
  try {
    // `populate=*` only goes one level deep, so without these the section
    // images inside mission/conservation never arrive and the page silently
    // shows the local placeholder photos instead of the uploaded ones.
    const raw = await fetchAPI<StrapiSingleResponse<RawAboutPage>>(ENDPOINTS.aboutPage, {
      'populate[mission][populate]': '*',
      'populate[conservation][populate]': '*',
    });
    const entry = unwrapSingle(raw);
    return {
      hero: entry.hero ? mapSectionHeading(entry.hero) : ABOUT_PAGE.hero,
      heroImage: resolveStrapiMediaUrl(entry.heroImage) || ABOUT_PAGE.heroImage,
      mission: entry.mission
        ? {
            ...mapSectionHeading(entry.mission.heading),
            points: entry.mission.points ? normalizeStringArray(entry.mission.points) : ABOUT_PAGE.mission.points,
            image: resolveStrapiMediaUrl(entry.mission.image) || ABOUT_PAGE.mission.image,
          }
        : ABOUT_PAGE.mission,
      conservation: entry.conservation
        ? {
            ...mapSectionHeading(entry.conservation.heading),
            initiatives: entry.conservation.initiatives?.length
              ? entry.conservation.initiatives.map(mapActivity)
              : ABOUT_PAGE.conservation.initiatives,
            image: resolveStrapiMediaUrl(entry.conservation.image) || ABOUT_PAGE.conservation.image,
          }
        : ABOUT_PAGE.conservation,
    };
  } catch (err) {
    console.warn('[Strapi] about-page request failed, using local content fallback', err);
    return ABOUT_PAGE;
  }
}
