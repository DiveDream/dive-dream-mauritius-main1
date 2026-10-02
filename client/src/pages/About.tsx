import React from 'react';
import Layout from '@/components/Layout';
import { Heart, Globe, CheckCircle2, type LucideIcon } from 'lucide-react';
import { useAboutPage } from '@/hooks/useAboutPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { PageLoader, PageError, PageHeader } from '@/components/common';

const ICONS: Record<string, LucideIcon> = { Heart, Globe };

export default function About() {
  const pageResult = useAboutPage();
  const { data: page } = pageResult;

  const { isLoading, error } = combineAsyncStates(pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !page) return <PageError />;

  return (
    <Layout>
      <PageHeader eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} image={page.heroImage} />

      {/* History & Mission */}
      <section className="py-24">
        <div className="container max-w-5xl space-y-24">
          {/* Grid: Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.mission.eyebrow}</span>
              <h2 className="text-3xl font-serif font-bold text-foreground">{page.mission.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {page.mission.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                {page.mission.points.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-2xl">
                <img
                  src={page.mission.image}
                  loading="lazy"
                  decoding="async"
                  alt="Scuba Training Session"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Grid: Marine Conservation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative lg:order-last">
              <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-2xl">
                <img
                  src={page.conservation.image}
                  loading="lazy"
                  decoding="async"
                  alt="Coral Reef Restoration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.conservation.eyebrow}</span>
              <h2 className="text-3xl font-serif font-bold text-foreground">{page.conservation.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {page.conservation.description}
              </p>

              <div className="space-y-4">
                {page.conservation.initiatives.map((initiative) => {
                  const Icon = ICONS[initiative.icon ?? ''] ?? Heart;
                  return (
                    <div key={initiative.id} className="flex items-start gap-3.5 text-sm text-muted-foreground">
                      <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block mb-0.5">{initiative.title}</strong>
                        <span>{initiative.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
