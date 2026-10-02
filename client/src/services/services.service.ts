import type { Price, Service } from '@/types';
import type { StrapiCollectionResponse, StrapiEntryBase, StrapiMedia } from '@/types/strapi';
import { SERVICES } from '@/content';
import { shared } from '@/content/media';
import { fetchAPI } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { extractPlainText, normalizeStringArray, resolveStrapiMediaUrl, unwrapCollection } from '@/lib/strapiMappers';
import { formatPrice } from '@/utils';

interface RawService extends StrapiEntryBase {
  title: string;
  slug?: string | null;
  // May come back as a plain string or, if Strapi has this field configured
  // as Rich Text (Blocks), a JSON array of block nodes — see extractPlainText().
  description: unknown;
  highlights?: unknown;
  price?: { amount?: number; currency?: Price['currency']; unitLabel?: string } | string;
  image: StrapiMedia | null;
}

function mapServiceFromStrapi(raw: RawService): Service {
  const price =
    typeof raw.price === 'string'
      ? raw.price
      : raw.price
        ? formatPrice({ amount: raw.price.amount ?? 0, currency: raw.price.currency ?? 'USD', unitLabel: raw.price.unitLabel })
        : '';
  return {
    id: raw.slug || raw.documentId,
    legacyId: raw.documentId,
    title: raw.title,
    description: extractPlainText(raw.description),
    highlights: normalizeStringArray(raw.highlights),
    price,
    image: resolveStrapiMediaUrl(raw.image) || shared.heroUnderwater,
  };
}

export async function getServices(): Promise<Service[]> {
  try {
    const raw = await fetchAPI<StrapiCollectionResponse<RawService>>(ENDPOINTS.services);
    return unwrapCollection(raw).map(mapServiceFromStrapi);
  } catch (err) {
    console.warn('[Strapi] services unavailable, using local content fallback', err);
    return SERVICES;
  }
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((service) => service.id === id || service.legacyId === id);
}
