import { Bell, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { useAnnouncement } from '../hooks/useQueries';

export default function AnnouncementsBanner() {
  const { data: announcement } = useAnnouncement();
  const [dismissed, setDismissed] = useState(false);

  if (!announcement || !announcement.active || dismissed) return null;

  const eventDate = announcement.eventDate
    ? new Date(Number(announcement.eventDate) / 1_000_000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 mt-0"
      style={{ background: 'linear-gradient(90deg, #0f1f3d, #1a3260, #0f1f3d)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Bell size={16} className="text-gold flex-shrink-0 animate-pulse" />
          <p className="text-white/95 text-sm font-body truncate">
            <span className="text-gold font-semibold mr-2">Announcement:</span>
            {announcement.text}
          </p>
          {eventDate && (
            <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 bg-gold/20 px-2.5 py-0.5 rounded-full">
              <Calendar size={12} className="text-gold" />
              <span className="text-gold text-xs font-medium">{eventDate}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
