import Layout from '@/components/Layout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useCourseDetail } from '@/hooks/useCourses';
import { getIcon } from '@/components/common/iconRegistry';
import { PageLoader, PageError } from '@/components/common';

// Same layout as the other course pages (see OpenWater.tsx), but every
// section is optional: the Strapi entry for this course currently only has
// name/eyebrow/overview filled in, so sections appear as the CMS fields are
// completed instead of rendering empty headings.
export default function DiscoverScubaDiving() {
  const { data: course, isLoading, error } = useCourseDetail('discover-scuba-diving');

  if (isLoading) return <PageLoader />;
  if (error || !course) return <PageError />;
  const Icon = getIcon(course.highlightCard?.icon);
  const learningPoints = course.learningPoints ?? [];

  return (
    <Layout>
      {/* Header */}
      <section className="relative py-24 border-b border-border">
        <div className="container text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{course.eyebrow}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mt-2 mb-4">{course.name}</h1>
          <p className="text-muted-foreground">
            {course.heroDescription || course.overview}
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/reservations?course=${course.id}`} className="btn-premium-primary text-sm">
              Book This Experience
            </Link>
            <Link href="/contact" className="btn-premium-secondary text-sm flex items-center justify-center gap-2">
              Ask a Question <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      {course.overviewSection?.title && (
        <section className="py-24">
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{course.overviewSection.eyebrow}</span>
                <h2 className="text-3xl font-serif font-bold text-foreground">{course.overviewSection.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.overviewSection.description}
                </p>
              </div>

              {course.highlightCard && (
                <div className="glass-panel p-8 space-y-6 text-left border-primary/20 bg-primary/5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground">{course.highlightCard.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {course.highlightCard.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* What You'll Do */}
      {learningPoints.length > 0 && (
        <section className="py-24 bg-secondary/40">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{course.learningPointsSection?.eyebrow}</span>
              <h2 className="text-3xl font-serif font-bold text-foreground mt-2">
                {course.learningPointsSection?.heading || 'What to Expect'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPoints.map((point) => (
                <div key={point} className="glass-panel p-6 flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            {course.ctaHeading || 'Ready for Your First Breath Underwater?'}
          </h2>
          {course.ctaDescription && (
            <p className="text-muted-foreground mb-8">
              {course.ctaDescription}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/reservations?course=${course.id}`} className="btn-premium-primary px-8 py-3 text-base">
              Book This Experience
            </Link>
            <Link href="/courses/open-water" className="btn-premium-secondary px-8 py-3 text-base flex items-center justify-center gap-2">
              Get Fully Certified <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
