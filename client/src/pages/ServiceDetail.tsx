import Layout from '@/components/Layout';
import { CheckCircle2, ArrowRight, Anchor, Camera, Plane, Compass, Coffee } from 'lucide-react';
import { Link, Redirect, useParams } from 'wouter';
import { useServiceDetail } from '@/hooks/useServices';
import { PageLoader, PageError } from '@/components/common';
import { usePageSeo } from '@/components/RouteSeo';
import { serviceDetailSeo, serviceHref } from '@shared/seo';

const SERVICE_ICONS: Record<string, typeof Plane> = {
  'airport-transfer': Plane,
  'private-charter': Anchor,
  'snorkeling-trips': Compass,
  'underwater-photography': Camera,
};

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading, error } = useServiceDetail(id);
  const isOwnPage = !!service && serviceHref(service.id) === `/services/${id}`;
  usePageSeo(isOwnPage ? serviceDetailSeo(service.id, service.title, service.description, service.image) : undefined);

  if (isLoading) return <PageLoader />;
  if (error || !service) return <PageError />;
  // Old documentId URLs, and services that have a dedicated page elsewhere.
  // vercel.json 301s the known ones; this covers in-app navigation.
  if (!isOwnPage) return <Redirect to={serviceHref(service.id)} replace />;

  const Icon = SERVICE_ICONS[service.id] ?? Coffee;

  return (
    <Layout>
      {/* Header */}
      <section className="relative py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background z-10" />
        </div>
        <div className="container relative z-20 text-center max-w-3xl">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Premium Service</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mt-2 mb-4">{service.title}</h1>
          <p className="text-muted-foreground">
            {service.description}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg shadow-black/10">
              <img src={service.image} loading="lazy" decoding="async" alt={service.title} className="w-full h-full object-cover aspect-[4/3]" />
            </div>

            <div className="text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">What's Included</span>
              <h2 className="text-3xl font-serif font-bold text-foreground">Here's What You Get</h2>

              {service.highlights && service.highlights.length > 0 && (
                <ul className="space-y-3">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm text-foreground/90">
                      <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-border">
                <div className="pt-4">
                  <span className="text-xs text-muted-foreground block">Pricing Standard</span>
                  <span className="text-lg font-serif font-bold text-foreground mt-0.5 block">{service.price}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/reservations?service=${service.id}`} className="btn-premium-primary text-sm">
                  Book This Service
                </Link>
                <Link href="/services" className="btn-premium-secondary text-sm flex items-center justify-center gap-2">
                  View All Services <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">Ready to Book {service.title}?</h2>
          <p className="text-muted-foreground mb-8">
            Reserve your spot and our team will confirm every detail with you directly.
          </p>
          <Link href={`/reservations?service=${service.id}`} className="btn-premium-primary px-8 py-3 text-base">
            Book This Service
          </Link>
        </div>
      </section>
    </Layout>
  );
}
