export interface Service {
  /** URL slug used in /services/:id. */
  id: string;
  /** Strapi documentId, which older /services/:id URLs used before slugs. */
  legacyId?: string;
  title: string;
  description: string;
  /** Feature bullets shown on the service's detail page. */
  highlights?: string[];
  price: string;
  image: string;
}
