import type { Course, Price } from '@/types';
import type { StrapiCollectionResponse, StrapiEntryBase, StrapiMedia } from '@/types/strapi';
import { COURSES, COURSE_DETAILS } from '@/content';
import { fetchAPI } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeStringArray, unwrapCollection } from '@/lib/strapiMappers';

// NOTE: the `courses` collection in Strapi is currently empty, so this
// mapper is written to the field names specified in the original CMS
// content-model prompt but hasn't been verified against a real entry yet.
// Worth a spot-check once the first real Course is published — every field
// here is read defensively (optional chaining), so a mismatch will surface
// as a missing field, not a crash.
interface RawSectionHeading {
  eyebrow?: string;
  heading?: string;
  title?: string;
  description?: string;
}

interface RawHighlightCard {
  title: string;
  text: string;
  icon?: string | null;
  notes?: unknown;
}

export interface RawCourse extends StrapiEntryBase {
  name: string;
  overview: string;
  slug?: string | null;
  category?: { name?: string } | null;
  agency?: Course['agency'] | null;
  eyebrow?: string | null;
  heroDescription?: string | null;
  overviewSection?: RawSectionHeading | null;
  highlightCard?: RawHighlightCard | null;
  prerequisites?: string | null;
  prerequisitesList?: unknown;
  prerequisitesSection?: RawSectionHeading | null;
  duration?: string | null;
  certificationAwarded?: string | null;
  includedMaterials?: unknown;
  price?: { amount?: number; currency?: Price['currency']; unitLabel?: string | null } | null;
  schedule?: string | null;
  learningPoints?: unknown;
  learningPointsSection?: RawSectionHeading | null;
  requiredDives?: unknown;
  optionalDives?: unknown;
  courseStructureSection?: RawSectionHeading | null;
  courseStructureNote?: string | null;
  ctaHeading?: string | null;
  ctaDescription?: string | null;
  image?: StrapiMedia | null;
}

function mapSectionHeading(raw?: RawSectionHeading | null): { eyebrow: string; heading: string } | undefined {
  if (!raw) return undefined;
  return { eyebrow: raw.eyebrow ?? '', heading: raw.heading ?? raw.title ?? '' };
}

export function mapCourseFromStrapi(raw: RawCourse): Course {
  return {
    id: raw.documentId,
    name: raw.name,
    overview: raw.overview,
    detailPath: raw.slug ? `/courses/${raw.slug}` : undefined,
    category: (raw.category?.name as Course['category']) ?? undefined,
    agency: raw.agency ?? undefined,
    eyebrow: raw.eyebrow ?? undefined,
    heroDescription: raw.heroDescription ?? undefined,
    overviewSection: raw.overviewSection
      ? {
          eyebrow: raw.overviewSection.eyebrow ?? '',
          title: raw.overviewSection.title ?? '',
          description: raw.overviewSection.description ?? '',
        }
      : undefined,
    highlightCard: raw.highlightCard
      ? {
          title: raw.highlightCard.title,
          text: raw.highlightCard.text,
          icon: raw.highlightCard.icon ?? undefined,
          notes: normalizeStringArray(raw.highlightCard.notes),
        }
      : undefined,
    prerequisites: raw.prerequisites ?? undefined,
    prerequisitesList: normalizeStringArray(raw.prerequisitesList),
    prerequisitesSection: mapSectionHeading(raw.prerequisitesSection),
    duration: raw.duration ?? undefined,
    certificationAwarded: raw.certificationAwarded ?? undefined,
    includedMaterials: normalizeStringArray(raw.includedMaterials),
    price: raw.price
      ? { amount: raw.price.amount ?? 0, currency: raw.price.currency ?? 'MUR', unitLabel: raw.price.unitLabel }
      : undefined,
    schedule: raw.schedule ?? undefined,
    learningPoints: normalizeStringArray(raw.learningPoints),
    learningPointsSection: mapSectionHeading(raw.learningPointsSection),
    requiredDives: normalizeStringArray(raw.requiredDives),
    optionalDives: normalizeStringArray(raw.optionalDives),
    courseStructureSection: mapSectionHeading(raw.courseStructureSection),
    courseStructureNote: raw.courseStructureNote ?? undefined,
    ctaHeading: raw.ctaHeading ?? undefined,
    ctaDescription: raw.ctaDescription ?? undefined,
  };
}

export async function getCourses(): Promise<Course[]> {
  try {
    const raw = await fetchAPI<StrapiCollectionResponse<RawCourse>>(ENDPOINTS.courses);
    return unwrapCollection(raw).map(mapCourseFromStrapi);
  } catch (err) {
    console.warn('[Strapi] courses unavailable, using local content fallback', err);
    return COURSES;
  }
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const courses = await getCourses();
  return courses.find((course) => course.id === id);
}

// Course detail pages (courses/*.tsx) look up by slug. Once the `courses`
// collection has real entries, this queries Strapi directly by its `slug`
// field; until then it falls back to the local COURSE_DETAILS map keyed the
// same way (see content/coursesDetail.ts for why those ids intentionally
// don't match content/courses.ts's ids).
export async function getCourseDetailBySlug(slug: string): Promise<Course | undefined> {
  try {
    const raw = await fetchAPI<StrapiCollectionResponse<RawCourse>>(ENDPOINTS.courses, {
      'filters[slug][$eq]': slug,
    });
    const entries = unwrapCollection(raw);
    if (entries.length === 0) throw new Error(`No course found with slug "${slug}"`);
    return mapCourseFromStrapi(entries[0]);
  } catch (err) {
    console.warn(`[Strapi] course detail for "${slug}" unavailable, using local content fallback`, err);
    return COURSE_DETAILS[slug];
  }
}
