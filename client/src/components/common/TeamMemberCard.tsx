import { Calendar, Globe } from 'lucide-react';
import type { TeamMember } from '@/types';

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="glass-panel overflow-hidden group flex flex-col h-full justify-between border-gold/30 bg-gold/5 hover:border-gold/60 transition-colors">
      <div>
        <div className="h-72 overflow-hidden relative">
          <img
            src={member.image}
            loading="lazy"
            decoding="async"
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-widest block">{member.position}</span>
            <h3 className="text-2xl font-serif font-bold text-foreground mt-1">{member.name}</h3>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed italic">"{member.biography}"</p>

          <div className="space-y-3 pt-4 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span><strong>Experience:</strong> {member.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary shrink-0" />
              <span><strong>Languages:</strong> {member.languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="border-t border-border pt-4">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Specializations</span>
          <div className="flex flex-wrap gap-1">
            {member.specializations.map((spec, idx) => (
              <span key={idx} className="bg-secondary border border-border text-foreground px-2 py-0.5 rounded text-[10px]">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
