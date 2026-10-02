import type { CTAButton, ContactInfo, NavLink, SectionHeading, SocialLink } from './common';
import type { Course } from './course';
import type { Activity } from './activity';

// ─── Website-wide settings (nav, footer, contact) — Strapi single type ────

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  navLinks: NavLink[];
  secondaryLinks: NavLink[];
  utilityBadges: string[];
  /** Languages spoken, shown as a compact flag group in the nav bar. */
  languages: { lang: string; flag: string; label: string }[];
  footer: {
    description: string;
    badges: string[];
    columns: { title: string; links: NavLink[] }[];
    legalLinks: NavLink[];
    copyrightText: string;
  };
}

// ─── Homepage — Strapi single type ─────────────────────────────────────────

export interface Homepage {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: CTAButton;
    secondaryCta: CTAButton;
    trustBadge: { years: string; label: string; ratingCount: number };
  };
  heroSlides: { image: string; title: string; subtitle: string; href?: string }[];
  trustStats: Activity[];
  promotionBanner: {
    eyebrow: string;
    promotionId: string;
    countdown: { days: string; hours: string; mins: string };
    ctaLabel: string;
  };
  featuredDiveSafaris: {
    heading: string;
    ctaLabel: string;
  };
  quickFeatures: Activity[];
  packagesSection: SectionHeading & { ctaLabel: string };
  coursesSection: SectionHeading & {
    coreCoursesLabel: string;
    specialtyCoursesLabel: string;
    coreCourses: Pick<Course, 'id' | 'name' | 'overview' | 'detailPath'>[];
    specialtyNames: string[];
    ctaLabel: string;
  };
  promotionsSection: SectionHeading & { ctaLabel: string };
  servicesSection: SectionHeading & { ctaLabel: string };
  testimonialsSection: SectionHeading;
  gallerySection: SectionHeading;
  contactSection: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    mapEyebrow: string;
    mapTitle: string;
  };
}

// ─── About page — Strapi single type ───────────────────────────────────────

export interface AboutPage {
  hero: SectionHeading;
  heroImage: string;
  mission: SectionHeading & { points: string[]; image: string };
  conservation: SectionHeading & { initiatives: Activity[]; image: string };
}

// ─── Contact page — Strapi single type ─────────────────────────────────────

export interface ContactPage {
  hero: SectionHeading;
  channelsHeading: string;
  safetyNote: { title: string; description: string };
  formHeading: string;
  mapConfig: { center: { lat: number; lng: number }; zoom: number; markerTitle: string };
}

// ─── Simpler "hero + sections" pages — each a Strapi single type ──────────

export interface BoatPage {
  hero: SectionHeading;
  vesselImage: string;
  specsSection: SectionHeading & {
    description: string;
    specs: { label: string; value: string }[];
  };
  featureCards: (Activity & { items: string[] })[];
}

export interface CoursesPage {
  hero: SectionHeading;
  heroImage: string;
  languagesSection: SectionHeading & { languages: string[] };
  coreCoursesHeading: string;
  coreCourses: Course[];
  specialtyCoursesHeading: string;
  specialtyCourses: Course[];
  additionalCoursesHeading: string;
  additionalCourses: Course[];
  specialtyDivesHeading: string;
  specialtyDives: { name: string; icon: string }[];
  ctaSection: { title: string; description: string; primaryCtaLabel: string; secondaryCtaLabel: string };
}

export interface DiveSafarisPage {
  hero: SectionHeading;
  mapSection: SectionHeading;
  mapImage: string;
  highlightsSection: SectionHeading;
  certLevels: string[];
  diveTypes: string[];
}

export interface RebreatherDivingPage {
  hero: SectionHeading;
  heroImage: string;
  whatIsItSection: SectionHeading & { points: string[] };
  whoIsItForSection: SectionHeading & { prerequisites: string[] };
  offeringsSection: SectionHeading & { offerings: Activity[] };
  ctaSection: { heading: string; description: string; ctaLabel: string };
}

export interface PackagesPage {
  hero: SectionHeading;
  heroImage: string;
  notice: { title: string; description: string };
}

export interface PromotionsPage {
  hero: SectionHeading;
}

export interface FAQPage {
  hero: SectionHeading;
  categories: string[];
  emergencyNotice: { title: string; description: string; hotlineLabel: string };
}

export interface ServicesPage {
  hero: SectionHeading;
  heroImage: string;
}

export interface CrewPage {
  hero: SectionHeading;
}
