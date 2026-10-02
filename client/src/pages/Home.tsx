import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { ArrowRight, Star, Award, MapPin, Waves, Flame, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { useHomepage, useHomeHeroBackgrounds } from '@/hooks/useHomepage';
import { useDiveSafaris } from '@/hooks/useDiveSafaris';
import { usePackages } from '@/hooks/usePackages';
import { usePromotions } from '@/hooks/usePromotions';
import { useServices } from '@/hooks/useServices';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { PackageCard, ServiceCard, PromotionCard, CourseCard, DiveSafariCard, TestimonialCard, IconFeatureGrid, PageLoader, PageError } from '@/components/common';

export default function Home() {
  const homepageResult = useHomepage();
  const heroBackgroundsResult = useHomeHeroBackgrounds();
  const diveSafarisResult = useDiveSafaris();
  const packagesResult = usePackages();
  const promotionsResult = usePromotions();
  const servicesResult = useServices();
  const testimonialsResult = useTestimonials();
  const galleryImagesResult = useGalleryImages();
  const settingsResult = useWebsiteSettings();

  const { data: homepage } = homepageResult;
  const { data: heroBackgrounds } = heroBackgroundsResult;
  const { data: diveSafaris } = diveSafarisResult;
  const { data: packages } = packagesResult;
  const { data: promotions } = promotionsResult;
  const { data: services } = servicesResult;
  const { data: testimonials } = testimonialsResult;
  const { data: galleryImages } = galleryImagesResult;
  const { data: settings } = settingsResult;

  const featuredSites = (diveSafaris ?? []).slice(0, 4);
  const heroSlides = homepage?.heroSlides ?? [];
  const backgrounds = heroBackgrounds ?? [];

  const [heroBgIndex, setHeroBgIndex] = useState(0);

  useEffect(() => {
    backgrounds.forEach((bg) => {
      const img = new Image();
      img.src = bg.url;
    });
  }, [backgrounds]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches || backgrounds.length === 0) return;

    const id = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(id);
  }, [backgrounds.length]);

  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', slidesToScroll: 1 },
    [autoplayPlugin.current],
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideTweens, setSlideTweens] = useState<number[]>([]);


  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const updateTweens = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const styles = emblaApi.scrollSnapList().map((snap, idx) => {
      let diff = snap - scrollProgress;
      engine.slideLooper.loopPoints.forEach((lp) => {
        const target = lp.target();
        if (idx === lp.index && target !== 0) {
          const sign = Math.sign(target);
          if (sign === -1) diff = snap - (1 + scrollProgress);
          if (sign === 1) diff = snap + (1 - scrollProgress);
        }
      });
      return Math.min(Math.abs(diff * 3.5), 1);
    });
    setSlideTweens(styles);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', updateTweens);
    emblaApi.on('reInit', updateTweens);
    onSelect();
    updateTweens();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', updateTweens);
      emblaApi.off('reInit', updateTweens);
    };
  }, [emblaApi, updateTweens]);


  const galleryAutoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
  const [galleryRef, galleryApi] = useEmblaCarousel(
    { loop: true, align: 'center', slidesToScroll: 1 },
    [galleryAutoplay.current],
  );
  const [galleryActiveSlide, setGalleryActiveSlide] = useState(0);
  const [galleryTweens, setGalleryTweens] = useState<number[]>([]);

  const scrollToGallery = useCallback((index: number) => galleryApi?.scrollTo(index), [galleryApi]);

  const updateGalleryTweens = useCallback(() => {
    if (!galleryApi) return;
    const engine = galleryApi.internalEngine();
    const scrollProgress = galleryApi.scrollProgress();
    const styles = galleryApi.scrollSnapList().map((snap, idx) => {
      let diff = snap - scrollProgress;
      engine.slideLooper.loopPoints.forEach((lp) => {
        const target = lp.target();
        if (idx === lp.index && target !== 0) {
          const sign = Math.sign(target);
          if (sign === -1) diff = snap - (1 + scrollProgress);
          if (sign === 1) diff = snap + (1 - scrollProgress);
        }
      });
      return Math.min(Math.abs(diff * 3.5), 1);
    });
    setGalleryTweens(styles);
  }, [galleryApi]);

  useEffect(() => {
    if (!galleryApi) return;
    const onSelect = () => setGalleryActiveSlide(galleryApi.selectedScrollSnap());
    galleryApi.on('select', onSelect);
    galleryApi.on('scroll', updateGalleryTweens);
    galleryApi.on('reInit', updateGalleryTweens);
    onSelect();
    updateGalleryTweens();
    return () => {
      galleryApi.off('select', onSelect);
      galleryApi.off('scroll', updateGalleryTweens);
      galleryApi.off('reInit', updateGalleryTweens);
    };
  }, [galleryApi, updateGalleryTweens]);

  const mainPromotion = (promotions ?? []).find((p) => p.id === homepage?.promotionBanner.promotionId) ?? promotions?.[0];

  const { isLoading, error } = combineAsyncStates(
    homepageResult,
    heroBackgroundsResult,
    diveSafarisResult,
    packagesResult,
    promotionsResult,
    servicesResult,
    testimonialsResult,
    galleryImagesResult,
    settingsResult,
  );
  if (isLoading) return <PageLoader />;
  if (error || !homepage) return <PageError />;

  return (
    <Layout>
      {/* 1. HERO SECTION - Full-bleed cinematic */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {backgrounds.map((bg, idx) => (
            <img
              key={bg.url}
              src={bg.url}
              alt={bg.alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: bg.objectPosition ?? 'center',
                opacity: idx === heroBgIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        </div>

        <div className="container relative z-10 pt-40 pb-32 md:pt-48 md:pb-40">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Waves className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">{homepage.hero.eyebrow}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 font-serif leading-tight">
              {homepage.hero.titleLine1} <br />
              <span className="text-sky-300">{homepage.hero.titleLine2}</span>
            </h1>

            <p className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
              {homepage.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href={homepage.hero.primaryCta.href} className="btn-premium-gold w-full sm:w-auto text-base flex items-center justify-center gap-2">
                {homepage.hero.primaryCta.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={homepage.hero.secondaryCta.href} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium border border-white/30 text-white hover:bg-white/10 transition-colors w-full sm:w-auto text-base">
                {homepage.hero.secondaryCta.label}
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Floating trust badge */}
          <div className="hidden md:flex absolute right-6 lg:right-12 bottom-8 items-center gap-3 max-w-[240px] bg-foreground/70 backdrop-blur-md border border-gold/30 rounded-2xl px-5 py-4 animate-float" style={{ animationDuration: '6s' }}>
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gold/15 border border-gold/40 shrink-0">
              <span className="font-serif text-lg font-bold text-gold leading-none">{homepage.hero.trustBadge.years}</span>
              <span className="text-[8px] text-gold uppercase tracking-wider">Years</span>
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(homepage.hero.trustBadge.ratingCount)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                ))}
              </div>
              <span className="block text-xs font-semibold text-white leading-tight">{homepage.hero.trustBadge.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1b. TRUST STATS BAR - dark continuation of hero */}
      <section className="bg-foreground relative border-t border-white/10">
        <div className="container py-8">
          <IconFeatureGrid items={homepage.trustStats} variant="darkRow" />
        </div>
      </section>

      {/* 2. EARLY BOOKING DISCOUNT BANNER */}
      {mainPromotion && (
        <section className="py-12 bg-gold/5 border-y border-gold/20 relative">
          <div className="container flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-gold animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {homepage.promotionBanner.eyebrow}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-foreground mt-1">{mainPromotion.title} — {mainPromotion.discount}</h2>
                <p className="text-sm text-muted-foreground max-w-xl mt-1">{mainPromotion.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0 w-full lg:w-auto">
              <div className="bg-background/80 border border-gold/20 px-4 py-2 rounded-lg text-center shrink-0">
                <span className="block font-serif text-lg font-bold text-gold">{homepage.promotionBanner.countdown.days}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Days</span>
              </div>
              <div className="bg-background/80 border border-gold/20 px-4 py-2 rounded-lg text-center shrink-0">
                <span className="block font-serif text-lg font-bold text-gold">{homepage.promotionBanner.countdown.hours}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Hrs</span>
              </div>
              <div className="bg-background/80 border border-gold/20 px-4 py-2 rounded-lg text-center shrink-0">
                <span className="block font-serif text-lg font-bold text-gold">{homepage.promotionBanner.countdown.mins}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Mins</span>
              </div>
              <Link href="/promotions" className="btn-premium-gold px-6 py-3 text-sm shrink-0 w-full sm:w-auto text-center">
                {homepage.promotionBanner.ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 1b. FEATURED IMAGE CAROUSEL */}
      <section className="py-16 relative overflow-hidden">
        <div className="container max-w-6xl relative">
          {/* Carousel viewport */}
          <div
            ref={emblaRef}
            className="overflow-hidden"
            onMouseEnter={() => autoplayPlugin.current.stop()}
            onMouseLeave={() => autoplayPlugin.current.play()}
          >
            <div className="flex -ml-4">
              {heroSlides.map((slide, idx) => {
                const tweenVal = slideTweens[idx] ?? 1;
                const scale = 1 - tweenVal * 0.15;
                const opacity = 1 - tweenVal * 0.5;
                return (
                  <div
                    key={idx}
                    className="min-w-0 shrink-0 grow-0 pl-4"
                    style={{ flex: '0 0 70%' }}
                  >
                    {(() => {
                      const cardClassName = `block rounded-xl overflow-hidden border border-border/40 shadow-2xl shadow-black/30 transition-shadow duration-500 ${slide.href ? 'cursor-pointer' : ''}`;
                      const cardStyle = {
                        transform: `scale(${scale})`,
                        opacity,
                        transition: 'transform 0.35s ease-out, opacity 0.35s ease-out',
                        boxShadow: tweenVal < 0.15
                          ? '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px -8px oklch(0.65 0.18 200 / 0.15)'
                          : undefined,
                      };
                      const cardContent = (
                        <div className="aspect-[16/9] relative">
                          <img
                            src={slide.image}
                            loading="lazy"
                            decoding="async"
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                          <div
                            className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 transition-opacity duration-300"
                            style={{ opacity: tweenVal < 0.3 ? 1 : 0 }}
                          >
                            <p className="text-xl sm:text-3xl font-serif font-bold tracking-wide text-white mb-2">{slide.title}</p>
                            <p className="text-sm sm:text-base text-white/75 max-w-lg">{slide.subtitle}</p>
                          </div>
                        </div>
                      );
                      return slide.href ? (
                        <Link href={slide.href} className={cardClassName} style={cardStyle}>
                          {cardContent}
                        </Link>
                      ) : (
                        <div className={cardClassName} style={cardStyle}>
                          {cardContent}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-all duration-200 z-10 shadow-lg shadow-black/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-all duration-200 z-10 shadow-lg shadow-black/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="relative p-2.5 before:content-[''] before:absolute before:inset-0"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-8 bg-gold' : 'w-2 bg-border hover:bg-primary/40'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DIVE SAFARIS */}
      <section className="py-24 relative">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground uppercase tracking-wide flex items-center justify-center gap-4">
              <span className="w-8 h-px bg-gold hidden sm:block" />
              {homepage.featuredDiveSafaris.heading}
              <span className="w-8 h-px bg-gold hidden sm:block" />
            </h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSites.map((site) => (
                <DiveSafariCard key={site.id} site={site} />
              ))}
            </div>

            {/* Decorative nav arrows (desktop) */}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card border border-border items-center justify-center text-foreground shadow-md shadow-black/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card border border-border items-center justify-center text-foreground shadow-md shadow-black/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-12 text-center">
            <Link href="/dive-safaris" className="btn-premium-secondary text-sm inline-flex items-center gap-2">
              {homepage.featuredDiveSafaris.ctaLabel}
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3b. QUICK FEATURE STRIP */}
      <section className="py-10 border-t border-b border-border">
        <div className="container">
          <IconFeatureGrid items={homepage.quickFeatures} variant="lightColumn" />
        </div>
      </section>

      {/* 4. POPULAR DIVE PACKAGES */}
      <section className="py-24 bg-secondary/40 relative">
        <div className="container text-center max-w-5xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.packagesSection.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-foreground">{homepage.packagesSection.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            {homepage.packagesSection.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {(packages ?? []).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} variant="compact" />
            ))}
          </div>

          <div className="mt-12">
            <Link href="/packages" className="btn-premium-secondary text-sm inline-flex items-center gap-2">
              {homepage.packagesSection.ctaLabel}
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SDI / TDI TRAINING COURSES */}
      <section className="py-24 relative">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.coursesSection.eyebrow}</span>
              <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-foreground">{homepage.coursesSection.title}</h2>
              <p className="text-muted-foreground max-w-xl">
                {homepage.coursesSection.description}
              </p>
            </div>
            <Link href="/courses" className="btn-premium-secondary text-sm flex items-center gap-2 shrink-0">
              {homepage.coursesSection.ctaLabel}
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>

          {/* Core Courses */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {homepage.coursesSection.coreCoursesLabel}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homepage.coursesSection.coreCourses.map((course) => (
                <CourseCard key={course.id} course={course} variant="compact" />
              ))}
            </div>
          </div>

          {/* Specialty Courses */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Award className="w-4 h-4" /> {homepage.coursesSection.specialtyCoursesLabel}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {homepage.coursesSection.specialtyNames.map((name) => (
                <div key={name} className="glass-panel p-4 text-center hover:border-primary/40 transition-all duration-300">
                  <span className="text-sm text-foreground font-semibold">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROMOTIONS & SPECIAL OFFERS */}
      <section className="py-24 bg-secondary/40 relative">
        <div className="container text-center max-w-5xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.promotionsSection.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-foreground">{homepage.promotionsSection.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            {homepage.promotionsSection.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {(promotions ?? []).map((promo) => (
              <PromotionCard key={promo.id} promotion={promo} variant="compact" />
            ))}
          </div>

          <div className="mt-12">
            <Link href="/promotions" className="btn-premium-secondary text-sm inline-flex items-center gap-2">
              {homepage.promotionsSection.ctaLabel}
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6b. PREMIUM SERVICES */}
      <section className="py-24 relative">
        <div className="container text-center max-w-5xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.servicesSection.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-foreground">{homepage.servicesSection.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            {homepage.servicesSection.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {(services ?? []).slice(0, 3).map((srv) => (
              <ServiceCard key={srv.id} service={srv} variant="compact" />
            ))}
          </div>

          <div className="mt-12">
            <Link href="/services" className="btn-premium-secondary text-sm inline-flex items-center gap-2">
              {homepage.servicesSection.ctaLabel}
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-secondary/40 relative">
        <div className="container text-center max-w-5xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.testimonialsSection.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-foreground">{homepage.testimonialsSection.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            {homepage.testimonialsSection.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {(testimonials ?? []).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* 8b. PHOTO GALLERY */}
      <section className="py-24 relative overflow-hidden">
        <div className="container text-center max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.gallerySection.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-foreground">{homepage.gallerySection.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            {homepage.gallerySection.description}
          </p>

          <div className="relative">
            <div
              ref={galleryRef}
              className="overflow-hidden"
              onMouseEnter={() => galleryAutoplay.current.stop()}
              onMouseLeave={() => galleryAutoplay.current.play()}
            >
              <div className="flex -ml-4">
                {(galleryImages ?? []).map((image, idx) => {
                  const tweenVal = galleryTweens[idx] ?? 1;
                  const scale = 1 - tweenVal * 0.15;
                  const opacity = 1 - tweenVal * 0.5;
                  return (
                    <div
                      key={image.id}
                      className="min-w-0 shrink-0 grow-0 pl-4"
                      style={{ flex: '0 0 70%' }}
                    >
                      <div
                        className="rounded-xl overflow-hidden border border-border/40 shadow-2xl shadow-black/30"
                        style={{
                          transform: `scale(${scale})`,
                          opacity,
                          transition: 'transform 0.35s ease-out, opacity 0.35s ease-out',
                          boxShadow: tweenVal < 0.15
                            ? '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px -8px oklch(0.65 0.18 200 / 0.15)'
                            : undefined,
                        }}
                      >
                        <div className="aspect-[16/9] relative">
                          <img
                            src={image.url}
                            loading="lazy"
                            decoding="async"
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => galleryApi?.scrollPrev()}
              className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-all duration-200 z-10 shadow-lg shadow-black/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => galleryApi?.scrollNext()}
              className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:border-primary/40 transition-all duration-200 z-10 shadow-lg shadow-black/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {(galleryImages ?? []).map((image, idx) => (
                <button
                  key={image.id}
                  onClick={() => scrollToGallery(idx)}
                  aria-label={`Go to gallery image ${idx + 1}`}
                  className="relative p-2.5 before:content-[''] before:absolute before:inset-0"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      idx === galleryActiveSlide ? 'w-8 bg-gold' : 'w-2 bg-border hover:bg-primary/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. QUICK CONTACT & INTERACTIVE MAP */}
      <section className="py-24 relative border-t border-border">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Get in Touch */}
            <div className="glass-panel p-8 md:p-10 text-left flex flex-col justify-center h-full">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{homepage.contactSection.eyebrow}</span>
              <h2 className="text-2xl md:text-4xl font-serif mt-2 mb-4 text-foreground">{homepage.contactSection.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {homepage.contactSection.description}
              </p>

              <div className="flex flex-col gap-4">
                <Link href="/contact" className="btn-premium-primary w-full py-3 text-sm font-semibold uppercase tracking-widest text-center">
                  {homepage.contactSection.primaryCtaLabel}
                </Link>
                <Link href="/reservations" className="btn-premium-gold w-full py-3 text-sm font-semibold uppercase tracking-widest text-center">
                  {homepage.contactSection.secondaryCtaLabel}
                </Link>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="glass-panel overflow-hidden flex flex-col h-full min-h-[450px]">
              <div className="p-6 border-b border-border bg-secondary/40">
                <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {homepage.contactSection.mapEyebrow}
                </span>
                <h3 className="text-lg font-serif font-bold text-foreground mt-1">{homepage.contactSection.mapTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">{settings?.contact.address}</p>
              </div>
              <div className="flex-grow relative bg-slate-900">
                <iframe
                  // Address-query embed (geocodes live, no API key or fixed
                  // coordinates needed) — swap for a precise Place ID embed
                  // once the exact Becosy Hotel Google Maps listing is confirmed.
                  src="https://www.google.com/maps?q=Becosy+Hotel%2C+Royal+Road%2C+Trou+aux+Biches%2C+Mauritius&output=embed"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dive Dream Divers Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
