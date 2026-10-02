import React from 'react';
import Layout from '@/components/Layout';
import { AlertCircle } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import { usePackagesPage } from '@/hooks/usePackagesPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { PackageCard, PageHeader, PageLoader, PageError } from '@/components/common';

export default function Packages() {
  const packagesResult = usePackages();
  const pageResult = usePackagesPage();
  const { data: packages } = packagesResult;
  const { data: page } = pageResult;

  const { isLoading, error } = combineAsyncStates(packagesResult, pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !packages || !page) return <PageError />;

  return (
    <Layout>
      <PageHeader eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} image={page.heroImage} />

      {/* Packages Grid */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <h2 className="sr-only">Dive packages and prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left items-stretch">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} variant="full" />
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-16 bg-secondary border border-border rounded-xl p-6 text-left flex gap-4 items-start max-w-3xl mx-auto">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-serif font-semibold tracking-wide text-foreground">{page.notice.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {page.notice.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
