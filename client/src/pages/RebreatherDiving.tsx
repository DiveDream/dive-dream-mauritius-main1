import Layout from '@/components/Layout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useRebreatherDivingPage } from '@/hooks/useRebreatherDivingPage';
import { PageLoader, PageError, IconFeatureGrid, PageHeader } from '@/components/common';

// TODO: this page is built entirely from placeholder copy — see
// content/rebreatherDiving.ts for every spot marked TODO that needs real
// content (program names, prerequisites, pricing) before launch.
export default function RebreatherDiving() {
  const { data: page, isLoading, error } = useRebreatherDivingPage();

  if (isLoading) return <PageLoader />;
  if (error || !page) return <PageError />;

  return (
    <Layout>
      <PageHeader eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} image={page.heroImage} />

      {/* What Is It */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.whatIsItSection.eyebrow}</span>
              <h2 className="text-3xl font-serif font-bold text-foreground">{page.whatIsItSection.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {page.whatIsItSection.description}
              </p>
              <div className="pt-4 flex gap-4">
                <Link href="/reservations" className="btn-premium-primary text-sm">
                  {page.ctaSection.ctaLabel}
                </Link>
                <Link href="/contact" className="btn-premium-secondary text-sm flex items-center gap-2">
                  Ask a Question <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="glass-panel p-8 space-y-4 text-left border-primary/20 bg-primary/5">
              {page.whatIsItSection.points.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For / Prerequisites */}
      <section className="py-24 bg-secondary/40">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.whoIsItForSection.eyebrow}</span>
            <h2 className="text-3xl font-serif font-bold text-foreground mt-2 mb-4">{page.whoIsItForSection.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {page.whoIsItForSection.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.whoIsItForSection.prerequisites.map((prerequisite) => (
              <div key={prerequisite} className="glass-panel p-6 flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90">{prerequisite}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses & Dives Offered */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.offeringsSection.eyebrow}</span>
            <h2 className="text-3xl font-serif font-bold text-foreground mt-2 mb-4">{page.offeringsSection.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {page.offeringsSection.description}
            </p>
          </div>
          <IconFeatureGrid items={page.offeringsSection.offerings} variant="lightColumn" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">{page.ctaSection.heading}</h2>
          <p className="text-muted-foreground mb-8">
            {page.ctaSection.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations" className="btn-premium-primary px-8 py-3 text-base">
              {page.ctaSection.ctaLabel}
            </Link>
            <Link href="/courses" className="btn-premium-secondary px-8 py-3 text-base flex items-center justify-center gap-2">
              Explore All SDI &amp; TDI Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
