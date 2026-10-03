import type { DiveSafarisPage } from '@/types';
import { diveSafaris as diveSafariImages } from './media';

export const DIVE_SAFARIS_PAGE: DiveSafarisPage = {
  hero: {
    eyebrow: 'Marine Expeditions',
    title: 'Mauritius Dive Sites & Dive Safaris',
    description: 'Explore Mauritius dive sites with our curated selection of pristine coral reefs, historic wrecks, and dramatic drop-offs. Filter by difficulty or type to find your perfect dive.',
  },
  mapSection: {
    eyebrow: 'Complete Map',
    title: 'All 47 Dive Safaris',
    description: 'From shallow coral gardens to deep wrecks and dramatic walls — explore the full range of dive sites across Northern Mauritius, Flic en Flac, Round Island, and the South Safari route.',
  },
  mapImage: diveSafariImages.map,
  highlightsSection: {
    eyebrow: 'Handpicked',
    title: 'Featured Dive Sites in Mauritius',
    description: 'Our top picks for unforgettable underwater experiences. Filter by certification or environment to find your perfect dive.',
  },
  certLevels: ['All', 'Beginner', 'Intermediate', 'Advanced', 'Technical'],
  diveTypes: ['All', 'Wreck', 'Reef', 'Deep', 'Drift', 'Wall', 'Night'],
};
