import React from 'react';
import Layout from '@/components/Layout';
import { useServices } from '@/hooks/useServices';
import { useServicesPage } from '@/hooks/useServicesPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { ServiceCard, PageHeader, PageLoader, PageError } from '@/components/common';

export default function Services() {
  const servicesResult = useServices();
  const pageResult = useServicesPage();
  const { data: services } = servicesResult;
  const { data: page } = pageResult;

  const { isLoading, error } = combineAsyncStates(servicesResult, pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !services || !page) return <PageError />;

  return (
    <Layout>
      <PageHeader eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} image={page.heroImage} />

      {/* Services Grid */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <h2 className="sr-only">Our services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} variant="full" />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
