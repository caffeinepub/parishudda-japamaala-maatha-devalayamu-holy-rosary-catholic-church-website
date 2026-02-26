import { useEffect } from 'react';
import { X, User, Calendar, BookOpen } from 'lucide-react';
import type { SpiritualMessage } from '../backend';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: SpiritualMessage;
}

export default function SpiritualMessageModal({ isOpen, onClose, message }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedDate = message.date
    ? new Date(Number(message.date) / 1_000_000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ animation: 'fade-in 0.3s ease forwards' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-ivory rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl card-gold-border"
        style={{ animation: 'slide-up 0.4s ease forwards' }}
      >
        {/* Header */}
        <div className="bg-navy px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-gold" />
            <h2 className="font-heading text-xl font-bold text-white">{message.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors ml-4 flex-shrink-0"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Meta */}
        <div className="px-6 py-3 bg-navy/5 border-b border-gold/20 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <User size={14} className="text-gold" />
            <span className="font-body text-navy font-semibold text-sm">{message.author}</span>
          </div>
          {formattedDate && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-navy/50" />
              <span className="font-body text-navy/60 text-sm">{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[55vh] scrollbar-thin">
          <div className="text-gold/30 font-heading text-6xl leading-none mb-2 select-none">"</div>
          <p className="font-body text-navy/80 text-base leading-relaxed whitespace-pre-wrap">
            {message.fullText}
          </p>
          <div className="text-gold/30 font-heading text-6xl leading-none text-right mt-2 select-none">"</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-navy text-white font-cinzel text-sm tracking-wider uppercase hover:bg-navy-light transition-colors rounded-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
