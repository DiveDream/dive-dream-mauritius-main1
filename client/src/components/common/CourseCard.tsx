import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Pick<Course, 'id' | 'name' | 'overview' | 'detailPath'>;
  /** 'compact' = Home.tsx teaser grid; 'full' = the dedicated Courses.tsx listing. */
  variant?: 'compact' | 'full';
}

export function CourseCard({ course, variant = 'full' }: CourseCardProps) {
  const href = course.detailPath ?? `/reservations?course=${course.id}`;

  if (variant === 'compact') {
    return (
      <div className="glass-panel p-6 group border-gold/30 bg-gold/5 hover:border-gold/60 transition-all duration-300 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-foreground mb-3 group-hover:text-gold transition-colors">
            {course.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{course.overview}</p>
        </div>
        <Link href={href} className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm font-semibold py-2.5 -my-2.5">
          Enroll Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 border-gold/30 bg-gold/5 hover:border-gold/60 transition-all duration-300">
      <h3 className="text-lg font-serif font-bold text-foreground mb-3">{course.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{course.overview}</p>
      <Link href={href} className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm font-semibold py-2.5 -my-2.5">
        Learn More<span className="sr-only"> about the {course.name}</span> <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
