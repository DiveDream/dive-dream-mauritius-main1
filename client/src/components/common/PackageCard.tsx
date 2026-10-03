import { Link } from 'wouter';
import { Star, CheckCircle2 } from 'lucide-react';
import type { DivePackage } from '@/types';
import { formatPrice } from '@/utils';

interface PackageCardProps {
  pkg: DivePackage;
  /** 'compact' = Home.tsx teaser grid; 'full' = the dedicated Packages.tsx listing. */
  variant?: 'compact' | 'full';
}

// EXPERIMENTAL — not final. Trying a gold/yellow accent across every
// package card. Revert by dropping the gold classes below back to the
// neutral/primary treatment.
export function PackageCard({ pkg, variant = 'full' }: PackageCardProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`glass-panel p-6 flex flex-col justify-between h-full relative ${
          pkg.isBestValue ? 'border-gold/70 bg-gold/5 shadow-lg shadow-gold/15' : 'border-gold/30 bg-gold/5'
        }`}
      >
        {pkg.isBestValue && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/40 shadow-md shadow-gold/20">
            Best Value
          </span>
        )}
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">{pkg.duration}</span>
          <h3 className="text-lg font-serif font-bold text-foreground mb-4">{pkg.name}</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-serif font-bold text-foreground">{formatPrice(pkg.price)}</span>
            <span className="text-xs text-muted-foreground">/ package</span>
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground mb-8">
            <li className="flex items-center gap-2 text-foreground">
              <Star className="w-4 h-4 text-primary shrink-0" />
              <span><strong>{pkg.divesCount}</strong> Ocean Dives Included</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary shrink-0" />
              <span>{pkg.equipmentIncluded ? 'Premium Gear Included' : 'Gear Rental Available'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary shrink-0" />
              <span>Free Nitrox Fills (Up to 32%)</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary shrink-0" />
              <span>Professional Dive Guide</span>
            </li>
          </ul>
        </div>

        <Link
          href={`/reservations?package=${pkg.id}`}
          className="w-full text-center py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors bg-gold text-gold-foreground hover:bg-gold/90"
        >
          Book Package
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel p-8 flex flex-col justify-between h-full relative transition-all duration-300 bg-gold/5 ${
        pkg.isBestValue ? 'border-gold/70 shadow-xl shadow-gold/15 scale-102 z-10' : 'border-gold/30 hover:border-gold/60'
      }`}
    >
      {pkg.isBestValue && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/40 shadow-lg">
          Best Value Package
        </span>
      )}

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">{pkg.duration}</span>
        <h3 className="text-xl font-serif font-bold text-foreground mb-4">{pkg.name}</h3>

        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-4xl font-serif font-bold text-foreground">{formatPrice(pkg.price)}</span>
          <span className="text-xs text-muted-foreground">/ package</span>
        </div>

        <ul className="space-y-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          <li className="flex items-center gap-2.5 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{pkg.divesCount} Guided Ocean Dives</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{pkg.equipmentIncluded ? 'Full Premium Gear Included' : 'Gear Rental Available'}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Free Nitrox Fills (Up to 32%)</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Refreshments & Fruits Onboard</span>
          </li>
        </ul>
      </div>

      <Link
        href={`/reservations?package=${pkg.id}`}
        className="w-full text-center py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 block bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg shadow-gold/20 hover:shadow-gold/30"
      >
        Book This Package<span className="sr-only">: {pkg.name}</span>
      </Link>
    </div>
  );
}
