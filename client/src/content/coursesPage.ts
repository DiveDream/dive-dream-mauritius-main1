import type { CoursesPage } from '@/types';
import { shared } from './media';

// Courses.tsx listing page content. These course blurbs are intentionally
// independent from content/courses.ts and content/coursesDetail.ts — each
// page (homepage teaser, this listing, the detail page) already had its own
// editorial copy for the same course before this refactor, and de-duplicating
// them is a content decision left for later, not a side effect of relocating
// hardcoded strings into typed data.
export const COURSES_PAGE: CoursesPage = {
  hero: {
    eyebrow: 'Professional Training',
    title: 'Diving Courses',
    description: 'Comprehensive training programs from beginner to professional levels. All courses taught by certified instructors with extensive experience.',
  },
  heroImage: shared.scubaTraining,
  languagesSection: {
    title: 'Languages Offered',
    description: 'Courses and instruction available in:',
    languages: ['English', 'German', 'French'],
  },
  coreCoursesHeading: 'Core Courses',
  coreCourses: [
    { id: 'open-water', name: 'Open Water Diver Course', overview: 'The foundation of recreational diving. Learn essential skills and knowledge to dive safely to 40 meters.', detailPath: '/courses/open-water' },
    { id: 'advanced-open-water', name: 'Advanced Open Water Diver Course', overview: 'Build on your Open Water skills with advanced techniques and deeper diving capabilities up to 30 meters.', detailPath: '/courses/advanced-open-water' },
    { id: 'rescue-diver', name: 'Rescue Diver Course', overview: 'Develop rescue techniques and emergency response skills to assist other divers in distress.', detailPath: '/courses/rescue-diver' },
    { id: 'dive-master', name: 'Dive Master Course', overview: 'Professional-level training to lead dives and assist with instruction. The gateway to diving careers.' },
  ],
  specialtyCoursesHeading: 'Specialty Courses',
  specialtyCourses: [
    { id: 'wreck-diving', name: 'Wreck Diving Specialty', overview: 'Learn specialized techniques for exploring shipwrecks and artificial structures safely.', detailPath: '/courses/wreck-diver' },
    { id: 'underwater-photography', name: 'Underwater Photography Specialty', overview: 'Capture stunning underwater images with professional photography techniques and equipment.' },
    { id: 'night-dive', name: 'Night Dive Specialty', overview: 'Master the unique challenges and wonders of diving in low-light conditions.' },
    { id: 'deep-diver', name: 'Deep Diver Specialty', overview: 'Extend your depth limits and learn advanced decompression and safety procedures.', detailPath: '/courses/deep-diver' },
    { id: 'drift-diving', name: 'Drift Diving Specialty', overview: 'Navigate currents and drift dives with confidence and efficiency.' },
    { id: 'nitrox', name: 'Enriched Air Specialty (Nitrox)', overview: 'Learn to use enriched air mixes for extended bottom times and safer diving profiles.', detailPath: '/courses/nitrox' },
    { id: 'extended-range', name: 'Extended Range Diver (XR)', overview: 'The gateway into technical diving. Train for planned decompression dives to depths of 45-65 metres.', detailPath: '/courses/extended-range' },
  ],
  additionalCoursesHeading: 'Additional Courses',
  additionalCourses: [
    { id: 'bubble-maker', name: 'Bubble Maker License', overview: 'For children starting at age 8. Introduction to scuba diving in controlled environments.' },
    { id: 'discover-scuba', name: 'Discover Scuba Diving', overview: 'Try scuba diving without certification. Perfect for beginners wanting to experience the underwater world.', detailPath: '/courses/discover-scuba-diving' },
    { id: 'skin-diving', name: 'Skin Diving', overview: 'Learn freediving and snorkeling techniques for exploring shallow waters.' },
    { id: 'efr', name: 'Emergency First Response (EFR) Training', overview: 'Essential first aid and CPR certification for divers and non-divers alike.' },
    { id: 'multi-level', name: 'Multi-Level Diving', overview: 'Optimize your dive profiles and extend bottom times with multi-level diving techniques.' },
    { id: 'peak-performance', name: 'Peak Performance Buoyancy', overview: 'Master buoyancy control for safer, more efficient, and more enjoyable diving.' },
    { id: 'scuba-review', name: 'Scuba Review Course', overview: 'Refresh your skills if you haven\'t dived in a while. Get back in the water with confidence.' },
  ],
  specialtyDivesHeading: 'Specialty Training Dives Offered',
  specialtyDives: [
    { name: 'Night Dives', icon: '🌙' },
    { name: 'Deep Dives', icon: '⬇️' },
    { name: 'Underwater Photography', icon: '📸' },
    { name: 'Wreck Dives', icon: '⚓' },
    { name: 'Drift Dives', icon: '🌊' },
    { name: 'Nitrox (Enriched Air)', icon: '💨' },
  ],
  ctaSection: {
    title: 'Ready to Start Your Diving Journey?',
    description: 'Contact us today to book your course or get more information about our training programs.',
    primaryCtaLabel: 'Book a Course',
    secondaryCtaLabel: 'Contact Us',
  },
};
