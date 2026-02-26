import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpiritualMessage } from '../hooks/useQueries';
import SectionHeader from './SectionHeader';
import SpiritualMessageModal from './SpiritualMessageModal';
import { BookOpen, User, Calendar } from 'lucide-react';

export default function SpiritualMessage() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: message, isLoading } = useSpiritualMessage();
  const [modalOpen, setModalOpen] = useState(false);

  const formattedDate = message?.date
    ? new Date(Number(message.date) / 1_000_000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <section
      id="spiritual-message"
      className="py-20"
      style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3260 50%, #0f1f3d 100%)' }}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionHeader title="Daily Spiritual Message" subtitle="Words of wisdom and faith" light />

        {isLoading ? (
          <div className="h-48 bg-white/10 rounded-xl animate-pulse" />
        ) : !message ? (
          <div className="text-center py-12">
            <p className="font-body text-white/50 italic">No spiritual message available yet.</p>
          </div>
        ) : (
          <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-8 md:p-10 card-gold-border">
            {/* Quote Mark */}
            <div className="absolute top-4 left-6 text-gold/30 font-heading text-8xl leading-none select-none">
              "
            </div>

            <div className="relative z-10">
              {/* Title */}
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                {message.title}
              </h3>

              {/* Preview Text */}
              <p className="font-body text-white/80 text-base md:text-lg leading-relaxed mb-6 line-clamp-4">
                {message.fullText}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gold" />
                  <span className="font-body text-gold text-sm font-medium">{message.author}</span>
                </div>
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-white/50" />
                    <span className="font-body text-white/50 text-sm">{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* Read More */}
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold hover:bg-gold-light transition-all duration-300 rounded-sm shadow-gold"
              >
                <BookOpen size={16} />
                Read Full Message
              </button>
            </div>
          </div>
        )}
      </div>

      {message && (
        <SpiritualMessageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={message}
        />
      )}
    </section>
  );
}
