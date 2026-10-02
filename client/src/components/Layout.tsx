import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Phone, Mail, Menu, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { SocialLinks } from '@/components/common';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: settings } = useWebsiteSettings();

  const openDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setIsDropdownOpen(false), 250);
  };
  // Handle scroll detection for sticky nav styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = settings?.navLinks ?? [];
  const secondaryLinks = settings?.secondaryLinks ?? [];
  const utilityBadges = settings?.utilityBadges ?? [];
  const contact = settings?.contact;
  const footer = settings?.footer;
  const socialLinks = settings?.socialLinks ?? [];
  const languages = settings?.languages ?? [];
  const languagesLabel = `Languages spoken: ${languages.map((item) => item.lang).join(', ')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Utility bar */}
      <div className="bg-foreground border-b border-white/10 py-2 text-xs text-white/70 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {contact && (
              <>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  {contact.phone.map((phone, idx) => (
                    <React.Fragment key={phone}>
                      {idx > 0 && <span className="text-white/30">/</span>}
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
                    </React.Fragment>
                  ))}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {utilityBadges[0] && (
              <span className="text-primary bg-primary/15 px-2 py-0.5 rounded-full font-medium text-[10px] tracking-wider uppercase border border-primary/30">
                {utilityBadges[0]}
              </span>
            )}
            {utilityBadges[1] && (
              <span className="text-gold bg-gold/10 px-2 py-0.5 rounded-full font-medium text-[10px] tracking-wider uppercase border border-gold/20">
                {utilityBadges[1]}
              </span>
            )}
            <SocialLinks
              links={socialLinks}
              className="flex items-center space-x-3 pl-4 border-l border-white/10"
              iconClassName="text-white/70 hover:text-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 bg-foreground ${
        isScrolled
          ? 'border-b border-white/10 shadow-lg shadow-black/20 py-3'
          : 'border-b border-transparent py-5'
      }`}>
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/40 group-hover:border-primary/60 transition-all duration-300">
              <img src={settings?.logo} alt={`${settings?.siteName ?? 'Dive Dream Divers'} Logo`} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-white block leading-none uppercase">{settings?.siteName}</span>
              <span className="text-[9px] tracking-widest text-primary uppercase font-bold block mt-1">{settings?.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href} className={`hover-link text-sm font-medium ${isActive ? 'active-link' : ''}`}>
                  {link.label}
                </Link>
              );
            })}

            {/* Secondary links dropdown */}
            <div className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <button className="hover-link text-sm font-medium flex items-center gap-1">
                More
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : 'rotate-90'}`} />
              </button>
              {/* Invisible bridge to prevent gap-caused close */}
              <div className="absolute right-0 top-full h-3 w-48" />
              <div className={`absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg shadow-black/20 py-2 transition-all duration-200 z-50 ${
                isDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}>
                {secondaryLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Languages spoken — purely decorative flags, see mobile drawer for the labeled equivalent */}
            {languages.length > 0 && (
              <div className="flex items-center gap-2 pl-4 border-l border-white/10" aria-label={languagesLabel}>
                {languages.map((item) => (
                  <span key={item.label} className="text-xl leading-none" title={item.lang} aria-hidden="true">
                    {item.flag}
                  </span>
                ))}
              </div>
            )}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/reservations" className="btn-premium-gold !px-5 !py-2 text-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] md:top-[109px] z-40 bg-foreground lg:hidden border-t border-white/10 overflow-y-auto">
          <div className="container py-6 flex flex-col space-y-6">
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold px-2">Main Navigation</span>
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold px-2">Discover More</span>
              <div className="grid grid-cols-2 gap-2">
                {secondaryLinks.map((link) => {
                  const isActive = location === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {languages.length > 0 && (
              <div className="border-t border-white/10 pt-4 flex flex-col space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold px-2">Languages Spoken</span>
                <div className="flex items-center gap-4 px-2">
                  {languages.map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5 text-sm text-white/70">
                      <span aria-hidden="true" className="text-xl leading-none">{item.flag}</span>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-6 flex flex-col space-y-4">
              <Link href="/reservations" className="btn-premium-gold w-full text-center py-3">
                Book Now
              </Link>
              {contact && (
                <div className="flex flex-col items-center space-y-2 text-sm text-white/70">
                  {contact.phone.map((phone) => (
                    <span key={phone} className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                    </span>
                  ))}
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </span>
                </div>
              )}
              <SocialLinks
                links={socialLinks}
                className="flex items-center justify-center space-x-5 pt-2"
                iconClassName="text-white/70 hover:text-primary transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-secondary/50 border-t border-border pt-20 pb-8 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand column */}
            <div className="flex flex-col space-y-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30">
                  <img src={settings?.logo} alt={`${settings?.siteName ?? 'Dive Dream Divers'} Logo`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold tracking-wide text-foreground block leading-none uppercase">{settings?.siteName}</span>
                  <span className="text-[9px] tracking-widest text-primary uppercase font-bold block mt-1">{settings?.tagline}</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {footer?.description}
              </p>
              <div className="flex items-center space-x-4">
                {footer?.badges.map((badge) => (
                  <span key={badge} className="text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 text-[10px] font-semibold uppercase tracking-wider">
                    {badge}
                  </span>
                ))}
              </div>
              <SocialLinks
                links={socialLinks}
                className="flex items-center space-x-4"
                iconClassName="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              />
            </div>

            {footer?.columns.map((column) => (
              <div key={column.title} className="flex flex-col space-y-4">
                <h2 className="text-base font-semibold text-foreground tracking-wide">{column.title}</h2>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5 text-primary" /> {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
            <div>
              &copy; {new Date().getFullYear()} {footer?.copyrightText}
            </div>
            <div className="flex space-x-6">
              {footer?.legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {contact && (
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 hover:scale-110 active:scale-95 animate-float"
          title="Chat on WhatsApp"
          onClick={() => toast.info('Opening WhatsApp secure chat...')}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M17.472 14.382c-.022-.08-.085-.184-.245-.26-.159-.077-.945-.467-1.09-.52-.145-.051-.25-.077-.35.078-.1.15-.39.52-.478.61-.088.09-.177.1-.336.02-.16-.08-.673-.248-1.282-.792-.474-.423-.794-.944-.888-1.1-.09-.158-.01-.243.07-.322.071-.072.159-.184.238-.276.08-.09.106-.15.159-.25.053-.1.026-.185-.013-.26-.04-.076-.35-.944-.48-1.262-.125-.301-.25-.26-.35-.27-.1-.005-.214-.006-.33-.006-.115 0-.305.042-.465.21-.16.168-.613.598-.613 1.46 0 .862.626 1.695.713 1.815.088.12 1.23 1.88 2.98 2.63.416.18.74.288.993.37.418.132.8.113 1.102.072.337-.045 1.036-.423 1.182-.83.147-.408.147-.758.103-.83zM12 2a10 10 0 0 0-10 10c0 1.855.494 3.6 1.36 5.12L2 22l5.31-1.39A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.116-1.125l-.295-.175-3.064.803.817-2.987-.192-.306A7.978 7.978 0 0 1 4 12a8 8 0 1 1 8 8z"/>
          </svg>
        </a>
      )}
    </div>
  );
}
