import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { usePrayersByLanguage } from '../hooks/useQueries';
import SectionHeader from './SectionHeader';
import { BookOpen, Search } from 'lucide-react';

type Language = 'Telugu' | 'English';

export default function PrayerModule() {
  const { ref, isVisible } = useScrollAnimation();
  const [language, setLanguage] = useState<Language>('Telugu');
  const [search, setSearch] = useState('');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const { data: prayers, isLoading } = usePrayersByLanguage(language);

  const filtered = prayers
    ? prayers.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.content.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <section
      id="prayers"
      className="py-20 bg-ivory-dark"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionHeader title="Sacred Prayers" subtitle="Prayers in Telugu & English" />

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-sm border border-gold overflow-hidden">
            {(['Telugu', 'English'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setExpandedIdx(null);
                }}
                className={`px-8 py-2.5 font-cinzel text-sm tracking-wider uppercase transition-all duration-200 ${
                  language === lang
                    ? 'bg-gold text-navy font-semibold'
                    : 'bg-transparent text-navy hover:bg-gold/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            type="text"
            placeholder="Search prayers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gold/30 rounded-sm font-body text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Prayers List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={40} className="mx-auto text-gold/40 mb-3" />
            <p className="font-body text-navy/50 italic">
              {search ? 'No prayers match your search.' : `No ${language} prayers available yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((prayer, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg card-gold-border overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gold/5 transition-colors"
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={14} className="text-gold" />
                    </div>
                    <span className="font-heading text-navy font-semibold text-base">
                      {prayer.title}
                    </span>
                  </div>
                  <span className={`text-gold transition-transform duration-300 ${expandedIdx === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedIdx === idx && (
                  <div className="px-6 pb-5 pt-1 border-t border-gold/20">
                    <p className="font-body text-navy/75 text-sm leading-relaxed whitespace-pre-wrap">
                      {prayer.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
