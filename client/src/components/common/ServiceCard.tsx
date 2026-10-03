import { Link } from 'wouter';
import { ArrowRight, Anchor, Camera, Plane, Compass, Coffee } from 'lucide-react';
import type { Service } from '@/types';
import { serviceHref } from '@shared/seo';

interface ServiceCardProps {
  service: Service;
  /** 'compact' = Home.tsx teaser grid; 'full' = the dedicated Services.tsx listing. */
  variant?: 'compact' | 'full';
}

const SERVICE_ICONS: Record<string, typeof Plane> = {
  'airport-transfer': Plane,
  'private-charter': Anchor,
  'snorkeling-trips': Compass,
  'underwater-photography': Camera,
};

export function ServiceCard({ service, variant = 'full' }: ServiceCardProps) {
  if (variant === 'compact') {
    return (
      <div className="glass-panel overflow-hidden group flex flex-col h-full border-gold/30 bg-gold/5 hover:border-gold/60 transition-colors">
        <div className="h-48 overflow-hidden relative">
          <img
            src={service.image}
            loading="lazy"
            decoding="async"
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-gold transition-colors flex-grow">
            {service.title}
          </h3>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">{service.price}</span>
            <Link
              href={serviceHref(service.id)}
              className="text-xs text-gold font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1 py-2.5 -my-2.5"
            >
              View Details<span className="sr-only"> for {service.title}</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Icon = SERVICE_ICONS[service.id] ?? Coffee;

  return (
    <div className="glass-panel overflow-hidden group flex flex-col h-full justify-between border-gold/30 bg-gold/5 hover:border-gold/60 transition-colors">
      <div>
        <div className="h-52 overflow-hidden relative">
          <img
            src={service.image}
            loading="lazy"
            decoding="async"
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center z-20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
            {service.title}
          </h3>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground block">Pricing Standard</span>
            <span className="text-sm font-bold text-foreground mt-0.5 block">{service.price}</span>
          </div>
          <Link
            href={serviceHref(service.id)}
            className="btn-premium-gold !px-4 !py-2 text-xs uppercase tracking-wider font-bold"
          >
            View Details<span className="sr-only"> for {service.title}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
