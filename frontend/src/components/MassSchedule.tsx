import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useMassSchedule } from '../hooks/useQueries';
import SectionHeader from './SectionHeader';
import { Clock, Calendar } from 'lucide-react';

const SERVICE_COLORS: Record<string, string> = {
  'Telugu Mass': 'bg-navy/10 text-navy border-navy/20',
  'English Mass': 'bg-gold/10 text-gold-dark border-gold/30',
  'Confession': 'bg-purple-50 text-purple-700 border-purple-200',
  'Adoration': 'bg-amber-50 text-amber-700 border-amber-200',
};

const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function MassSchedule() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: schedule, isLoading } = useMassSchedule();

  const sortedSchedule = schedule
    ? [...schedule].sort((a, b) => {
        const dayA = DAYS_ORDER.indexOf(a.day);
        const dayB = DAYS_ORDER.indexOf(b.day);
        if (dayA !== dayB) return dayA - dayB;
        return a.time.localeCompare(b.time);
      })
    : [];

  return (
    <section
      id="mass-schedule"
      className="py-20 bg-ivory"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionHeader
          title="Mass Schedule"
          subtitle="Join us in prayer and worship"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-ivory-dark rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sortedSchedule.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-navy/50 italic">Mass schedule will be updated soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedSchedule.map((timing, idx) => {
              const colorClass = SERVICE_COLORS[timing.serviceType] || 'bg-navy/10 text-navy border-navy/20';
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-5 card-gold-border hover:shadow-gold transition-all duration-300 group"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gold" />
                      <span className="font-cinzel text-navy font-semibold text-sm tracking-wide">
                        {timing.day}
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}>
                      {timing.serviceType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gold" />
                    <span className="font-heading text-2xl font-bold text-navy">
                      {timing.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rosary Background Accent */}
        <div className="mt-12 text-center">
          <img
            src="/assets/generated/divider-ornament.dim_800x80.png"
            alt=""
            className="mx-auto max-w-xs opacity-60"
          />
        </div>
      </div>
    </section>
  );
}
