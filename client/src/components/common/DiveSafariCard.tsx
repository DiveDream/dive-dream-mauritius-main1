import { Link } from 'wouter';
import { Waves, Award } from 'lucide-react';
import type { DiveSafari } from '@/types';

// The photo-caption dive-safari card used in Home.tsx's featured grid. All 4
// dedicated dive-safari pages/detail views use a different layout (see
// DiveSafaris.tsx), so this one is Home-specific rather than shared further.
export function DiveSafariCard({ site }: { site: DiveSafari }) {
  return (
    <Link
      href="/dive-safaris"
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md shadow-black/10 border border-gold/40 hover:border-gold/70 transition-colors block"
    >
      <img
        src={site.image}
        loading="lazy"
        decoding="async"
        alt={site.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-base font-serif font-bold text-white mb-1.5">{site.name}</h3>
        <div className="flex items-center gap-3 text-[11px] text-white/80">
          <span className="flex items-center gap-1">
            <Waves className="w-3 h-3" /> Depth: {site.maxDepth}
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3" /> {site.certificationLevel}
          </span>
        </div>
      </div>
    </Link>
  );
}
