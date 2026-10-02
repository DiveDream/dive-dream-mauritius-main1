import type { Homepage } from '@/types';
import { home } from './media';

export const HOMEPAGE: Homepage = {
  hero: {
    eyebrow: 'Discover Mauritius Diving',
    titleLine1: 'Discover the',
    titleLine2: 'Underwater World',
    description: 'Professional SDI & TDI Training, 40+ Pristine Dive Sites, and Unforgettable Marine Adventures in Mauritius since 2004.',
    primaryCta: { label: 'Book Your Dive', href: '/reservations', variant: 'gold' },
    secondaryCta: { label: 'Explore Dive Safaris', href: '/dive-safaris', variant: 'secondary' },
    trustBadge: { years: '20+', label: 'Trusted by Divers Worldwide', ratingCount: 5 },
  },
  heroSlides: [
    { image: home.heroSlides[0], title: 'Explore Crystal Waters', subtitle: 'Dive into 40+ pristine sites across Mauritius', href: '/dive-safaris' },
    { image: home.heroSlides[1], title: 'Historic Wreck Diving', subtitle: 'Discover fascinating underwater relics and marine ecosystems', href: '/dive-safaris' },
    { image: home.heroSlides[2], title: 'Vibrant Coral Gardens', subtitle: 'Swim through some of the Indian Ocean\'s richest reefs', href: '/dive-safaris' },
    { image: home.heroSlides[3], title: 'Professional Training', subtitle: 'SDI & TDI certified courses from beginner to instructor', href: '/services' },
    { image: home.heroSlides[4], title: 'Luxury Dive Vessel', subtitle: 'Set sail on our custom-built catamaran for every expedition' },
  ],
  trustStats: [
    { id: 'safety', title: 'Safety First', description: '100% Safety Record', icon: 'Shield' },
    { id: 'training', title: 'SDI & TDI 5-Star Center', description: 'Elite Training Facility', icon: 'Award' },
    { id: 'sites', title: '40+ Dive Safaris', description: 'From Coral Reefs to Wrecks', icon: 'Anchor' },
    { id: 'experiences', title: 'Premium Experiences', description: 'Small Groups, Big Adventures', icon: 'Compass' },
  ],
  promotionBanner: {
    eyebrow: 'Limited Time Campaign',
    promotionId: 'early-booking',
    countdown: { days: '05', hours: '14', mins: '32' },
    ctaLabel: 'Claim Offer',
  },
  featuredDiveSafaris: {
    heading: 'Explore Mauritius\' Best Dive Safaris',
    ctaLabel: 'View All Dive Safaris',
  },
  quickFeatures: [
    { id: 'boat-dives', title: 'Daily Boat Dives', description: 'Departures every day', icon: 'Anchor' },
    { id: 'hotel-transfers', title: 'Hotel Transfers', description: 'Available on request', icon: 'MapPin' },
    { id: 'premium-equipment', title: 'Premium Equipment', description: 'Well maintained & modern', icon: 'Shield' },
    { id: 'passionate-team', title: 'Passionate Team', description: 'Local knowledge, global standards', icon: 'Compass' },
  ],
  packagesSection: {
    eyebrow: 'Exclusive Expeditions',
    title: 'Popular Dive Packages',
    description: 'Choose from our premium curated dive packages. Whether you want a single dive or a multi-day underwater odyssey, we have the perfect itinerary.',
    ctaLabel: 'View All Packages',
  },
  coursesSection: {
    eyebrow: 'Professional Training',
    title: 'SDI & TDI Scuba Courses',
    description: 'Get certified or expand your technical diving capabilities with our world-renowned SDI and TDI training programs, taught in English, French & German.',
    coreCoursesLabel: 'Core Courses',
    specialtyCoursesLabel: 'Specialty Courses',
    coreCourses: [
      { id: 'open-water', name: 'Open Water Diver Course', overview: 'The foundation of recreational diving. Learn essential skills to dive safely to 18 metres independently with a buddy.', detailPath: '/courses/open-water' },
      { id: 'advanced-open-water', name: 'Advanced Open Water Diver Course', overview: 'Build on your Open Water skills with advanced techniques and deeper diving capabilities up to 30 metres.', detailPath: '/courses/advanced-open-water' },
      { id: 'rescue-diver', name: 'Rescue Diver Course', overview: 'Develop rescue techniques and emergency response skills to assist other divers in distress.', detailPath: '/courses/rescue-diver' },
      { id: 'dive-master', name: 'Dive Master Course', overview: 'Professional-level training to lead dives and assist with instruction — the gateway to a diving career.' },
    ],
    specialtyNames: ['Wreck Diving', 'Underwater Photography', 'Night Dive', 'Deep Diver', 'Drift Diving', 'Enriched Air (Nitrox)'],
    ctaLabel: 'View All Courses',
  },
  promotionsSection: {
    eyebrow: 'Exclusive Offers',
    title: 'Promotions & Special Deals',
    description: 'Take advantage of our seasonal campaigns and loyalty rewards. Book smarter and save on your next diving adventure.',
    ctaLabel: 'View All Promotions',
  },
  servicesSection: {
    eyebrow: 'VIP Logistics',
    title: 'Premium Services',
    description: 'Beyond elite diving. Airport transfers, private charters, snorkeling safaris, underwater photography, and luxury onboard catering.',
    ctaLabel: 'View All Services',
  },
  testimonialsSection: {
    eyebrow: 'Guest Experiences',
    title: 'What Our Divers Say',
    description: 'We pride ourselves on providing the highest standards of safety, professionalism, and luxury. Read reviews from our global diving community.',
  },
  gallerySection: {
    eyebrow: 'Our World',
    title: 'Gallery',
    description: 'A glimpse into the breathtaking underwater landscapes and marine encounters that await you in Mauritius.',
  },
  contactSection: {
    eyebrow: 'Have Questions?',
    title: 'Get in Touch',
    description: 'Our professional dive operations team is here to help you plan your next underwater expedition.',
    primaryCtaLabel: 'Send a Message',
    secondaryCtaLabel: 'Book Now',
    mapEyebrow: 'Physical Headquarters',
    mapTitle: 'Visit Our Dive Center',
  },
};

// Home.tsx's rotating background slideshow images (the dark hero panel), kept
// separate from `heroSlides` above (a different, unrelated carousel further
// down the page).
export const HOME_HERO_BACKGROUNDS = home.heroBackgrounds;
