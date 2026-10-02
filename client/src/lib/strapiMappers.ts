import { strapiConfig } from '@/lib/strapi';
import type { StrapiCollectionResponse, StrapiMedia, StrapiSingleResponse } from '@/types/strapi';

// Strapi v5's envelope is already flat (`{ data, meta }`), so these are
// thin, defensive unwrap points — kept as named functions (rather than
// inlining `raw.data` everywhere) so a future Strapi major version that
// changes the envelope shape only needs a change here.
export function unwrapCollection<T>(raw: StrapiCollectionResponse<T>): T[] {
  return raw?.data ?? [];
}

export function unwrapSingle<T>(raw: StrapiSingleResponse<T>): T {
  return raw?.data;
}

// Normalizes a "list of strings" field that may come back either as a plain
// string[] (JSON field / multi-value enum) or as a repeatable component
// (`{ id, value }[]`, Strapi's usual shape for a repeatable single-field
// component like `shared.list-item`). Handles both defensively since which
// shape a given field actually uses can only be confirmed once real content
// exists to inspect — see the note in each service file this is used from.
export function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === 'string' ? item : (item as { value?: string })?.value))
    .filter((value): value is string => Boolean(value));
}

export interface RawSectionHeading {
  eyebrow?: string | null;
  title?: string | null;
  heading?: string | null;
  description?: string | null;
}

// shared.section-heading shows up on nearly every single-type page. `title`
// and `heading` are treated as aliases since a couple of frontend fields use
// one name and a couple use the other (see types/pages.ts).
export function mapSectionHeading(raw?: RawSectionHeading | null): { eyebrow: string; title: string; description: string } {
  return {
    eyebrow: raw?.eyebrow ?? '',
    title: raw?.title ?? raw?.heading ?? '',
    description: raw?.description ?? '',
  };
}

interface StrapiBlockNode {
  text?: string;
  children?: StrapiBlockNode[];
}

// Some Strapi text fields are configured as Rich Text (Blocks) rather than
// plain Text, which returns a JSON array of block nodes (e.g.
// `[{ type: 'paragraph', children: [{ type: 'text', text: '...' }] }]`)
// instead of a string — even though the frontend type expects a string.
// This flattens that structure into plain text; a genuine plain string or
// null/undefined passes through unchanged (defensive against either field
// configuration, since which one a given field uses can only be confirmed
// once real content exists to inspect).
export function extractPlainText(input: unknown): string {
  if (typeof input === 'string') return input;
  if (!Array.isArray(input)) return '';

  const collectText = (node: StrapiBlockNode): string => {
    if (typeof node.text === 'string') return node.text;
    if (Array.isArray(node.children)) return node.children.map(collectText).join('');
    return '';
  };

  return (input as StrapiBlockNode[]).map(collectText).join('\n\n').trim();
}

function isBlocksArray(value: unknown): value is StrapiBlockNode[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        typeof (item as { type?: unknown }).type === 'string' &&
        Array.isArray((item as { children?: unknown }).children),
    )
  );
}

// Any Strapi text field can be flipped between plain Text and Rich Text
// (Blocks) independently in the CMS, and the two configurations round-trip
// as different JSON shapes (string vs. block-node array) — see
// extractPlainText() above. Rather than threading extractPlainText() through
// every mapper for every field that *might* be Rich Text (and re-breaking
// whenever a field's type changes later), this walks the entire response
// once at the HTTP boundary and flattens any block-node array found
// anywhere in the payload into plain text. This is what was causing
// "Minified React error #31" (object with keys {type, children}) in
// production: a Rich Text field's raw block-node array was passed straight
// through to JSX as if it were a string.
export function sanitizeStrapiRichText<T>(data: T): T {
  if (isBlocksArray(data)) {
    return extractPlainText(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeStrapiRichText(item)) as unknown as T;
  }
  if (data !== null && typeof data === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      out[key] = sanitizeStrapiRichText(value);
    }
    return out as T;
  }
  return data;
}

// Resolves a Strapi media object's relative `url` (e.g. "/uploads/foo.jpeg")
// into an absolute URL against the configured Strapi instance. Falls back
// to an empty string for a missing/null media relation so callers can use
// `media?.url ?? FALLBACK_IMAGE` patterns without null-checking this too.
export function resolveStrapiMediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media?.url) return '';
  if (media.url.startsWith('http://') || media.url.startsWith('https://')) return optimizeCloudinaryUrl(media.url);
  return `${strapiConfig.baseUrl}${media.url}`;
}

const CLOUDINARY_UPLOAD = 'res.cloudinary.com/dvyxak16/image/upload/';

// Strapi uploads to Cloudinary as original JPEGs (up to ~400 KB). Asking
// Cloudinary for f_auto/q_auto serves WebP/AVIF at a tuned quality, and
// c_limit caps the width without ever upscaling. Only untransformed URLs
// (version segment straight after /upload/) are rewritten.
function optimizeCloudinaryUrl(url: string): string {
  const idx = url.indexOf(CLOUDINARY_UPLOAD);
  if (idx === -1) return url;
  const rest = url.slice(idx + CLOUDINARY_UPLOAD.length);
  if (!/^v\d+\//.test(rest)) return url;
  return `${url.slice(0, idx + CLOUDINARY_UPLOAD.length)}f_auto,q_auto,c_limit,w_1600/${rest}`;
}
