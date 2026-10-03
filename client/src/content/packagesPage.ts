import type { PackagesPage } from '@/types';
import { shared } from './media';

export const PACKAGES_PAGE: PackagesPage = {
  hero: {
    eyebrow: 'Dive Expeditions',
    title: 'Dive Packages in Mauritius',
    description: 'Explore our curated, high-value dive packages for boat diving in Mauritius. Whether you are seeking a single dive to test the waters or a comprehensive multi-day odyssey, our packages offer professional guiding and premium gear.',
  },
  heroImage: shared.diveBoat,
  notice: {
    title: 'Pre-requisites & Rental Standards',
    description: 'All divers must present a valid physical or digital certification card from a recognized agency (SDI, TDI, PADI, SSI, etc.) and logbook before boarding. For packages without equipment included, premium Scubapro rental gear is available at the dive center reception for $20/day.',
  },
};
