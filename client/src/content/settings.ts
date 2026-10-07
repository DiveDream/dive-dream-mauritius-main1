import type { WebsiteSettings } from '@/types';
import { branding } from './media';

// Single source of truth for nav, footer, and contact info. Update contact
// details here only — Layout.tsx, Contact.tsx, and Home.tsx's map section
// all read from this one object, so nothing else needs to change.
export const WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'Dive Dream Divers',
  tagline: 'UNDERWATER FEELS LIKE HOME',
  logo: branding.logo,
  contact: {
    phone: ['+230 57535352', '+230 58310098'],
    email: 'reservations@divedreammauritius.com',
    address: 'Becosy Hotel, Royal Road, Trou aux Biches',
    whatsapp: 'https://wa.me/23057535352',
    operatingHours: 'Daily: 08:30 AM - 04:30 PM',
  },
  socialLinks: [
    { platform: 'instagram', url: 'https://www.instagram.com/divedreamdivers.mu?stkn=MW9tNnN1a2N5c2ZteA==' },
    { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61591723436810' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@dive.dream.center?_r=1&_t=ZS-9ALhFhFciVl' },
  ],
  navLinks: [
    { href: '/', label: 'Home' },
    { href: '/dive-safaris', label: 'Dive Safaris' },
    { href: '/packages', label: 'Packages' },
    { href: '/courses', label: 'Courses' },
    { href: '/services', label: 'Services' },
    { href: '/rebreather-diving', label: 'Rebreather Diving' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  secondaryLinks: [
    { href: '/promotions', label: 'Promotions' },
    { href: '/crew', label: 'Our Crew' },
    { href: '/faq', label: 'FAQs' },
  ],
  utilityBadges: ['SDI / TDI 5-Star Dive Center', 'Nitrox Membrane Station'],
  languages: [
    { lang: 'English', flag: '🇬🇧', label: 'EN' },
    { lang: 'Français', flag: '🇫🇷', label: 'FR' },
    { lang: 'Deutsch', flag: '🇩🇪', label: 'DE' },
  ],
  footer: {
    description: 'Dive Dream Divers offers professional SDI/TDI training and guided diving expeditions in Mauritius since 2004. Experience over 40 pristine dive sites with our certified instructors and elite crew.',
    badges: ['SDI 5-Star', 'TDI Facility'],
    columns: [
      {
        title: 'Explore',
        links: [
          { href: '/dive-safaris', label: 'Dive Safaris' },
          { href: '/courses', label: 'Courses' },
          { href: '/rebreather-diving', label: 'Rebreather Diving' },
          { href: '/packages', label: 'Dive Packages' },
          { href: '/promotions', label: 'Promotions' },
          { href: '/services', label: 'Services' },
          { href: '/reservations', label: 'Book a Dive' },
        ],
      },
      {
        title: 'Information',
        links: [
          { href: '/about', label: 'About Us' },
          { href: '/crew', label: 'Our Crew' },
          { href: '/faq', label: 'FAQs' },
          { href: '/contact', label: 'Contact' },
        ],
      },
    ],
    legalLinks: [
      { href: '#', label: 'Privacy Policy' },
      { href: '#', label: 'Terms of Service' },
      { href: '#', label: 'Safety Liability' },
    ],
    copyrightText: 'Dive Dream Divers. All rights reserved. Professional SDI & TDI 5-Star Facility.',
  },
};
