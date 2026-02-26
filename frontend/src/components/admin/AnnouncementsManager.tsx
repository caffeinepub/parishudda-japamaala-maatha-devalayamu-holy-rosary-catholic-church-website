import { useEffect, useState } from 'react';
import { useAnnouncement, useUpdateAnnouncement } from '../../hooks/useQueries';
import { useDraftState } from '../../hooks/useDraftState';
import { Bell, Save, CheckCircle, AlertCircle, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface DraftAnnouncement {
  text: string;
  eventDate: string;
  active: boolean;
}

const initialDraft: DraftAnnouncement = {
  text: '',
  eventDate: '',
  active: false,
};

export default function AnnouncementsManager() {
  const { data: existing, isLoading } = useAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const [draft, setDraft, clearDraft] = useDraftState<DraftAnnouncement>(
    'announcementDraft',
    initialDraft
  );
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Load existing data into draft only once on first load (if draft is empty)
  useEffect(() => {
    if (existing && !loaded) {
      setLoaded(true);
      const hasDraft = draft.text || draft.eventDate;
      if (!hasDraft) {
        const dateStr = existing.eventDate
          ? new Date(Number(existing.eventDate) / 1_000_000).toISOString().split('T')[0]
          : '';
        setDraft({
          text: existing.text,
          eventDate: dateStr,
          active: existing.active,
        });
      }
    }
  }, [existing, loaded]);

  const handleLoadExisting = () => {
    if (existing) {
      const dateStr = existing.eventDate
        ? new Date(Number(existing.eventDate) / 1_000_000).toISOString().split('T')[0]
        : '';
      setDraft({
        text: existing.text,
        eventDate: dateStr,
        active: existing.active,
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const eventDateMs = draft.eventDate
        ? new Date(draft.eventDate).getTime()
        : Date.now();
      const eventDateNs = BigInt(eventDateMs) * BigInt(1_000_000);

      await updateMutation.mutateAsync({
        text: draft.text,
        eventDate: eventDateNs,
        active: draft.active,
      });

      setSuccess(
        draft.active
          ? 'Announcement saved and is now LIVE on the website!'
          : 'Announcement saved (currently hidden — toggle Active to show it).'
      );
      clearDraft();
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      setError('Failed to save announcement. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gold/30 shadow-sacred overflow-hidden">
        <div className="bg-navy px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-gold" />
            <h2 className="font-heading text-white font-semibold">Manage Announcement</h2>
          </div>
          {existing && (
            <button
              type="button"
              onClick={handleLoadExisting}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-body transition-colors"
            >
              <RefreshCw size={12} />
              Load Saved
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-ivory-dark rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-ivory rounded-lg border border-gold/20">
              <div>
                <p className="font-body text-navy font-medium text-sm">Show Announcement Banner</p>
                <p className="font-body text-navy/50 text-xs mt-0.5">
                  Toggle to show or hide the announcement on the website
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDraft((p) => ({ ...p, active: !p.active }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  draft.active ? 'bg-gold' : 'bg-navy/20'
                }`}
                role="switch"
                aria-checked={draft.active}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                    draft.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-body ${
                draft.active
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-navy/5 border border-navy/10 text-navy/50'
              }`}
            >
              {draft.active ? (
                <>
                  <Eye size={14} />
                  <span>Banner will be <strong>visible</strong> on the website</span>
                </>
              ) : (
                <>
                  <EyeOff size={14} />
                  <span>Banner is <strong>hidden</strong> from the website</span>
                </>
              )}
            </div>

            {/* Announcement Text */}
            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                Announcement Text <span className="text-red-400">*</span>
              </label>
              <textarea
                value={draft.text}
                onChange={(e) => setDraft((p) => ({ ...p, text: e.target.value }))}
                placeholder="e.g., Feast of the Holy Rosary starts Oct 7th. All are welcome to join us for special prayers and celebrations."
                rows={4}
                className="w-full px-4 py-3 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold transition-colors resize-y"
                required
              />
              <p className="font-body text-navy/40 text-xs mt-1">
                {draft.text.length} characters
              </p>
            </div>

            {/* Event Date */}
            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                Event Date
              </label>
              <input
                type="date"
                value={draft.eventDate}
                onChange={(e) => setDraft((p) => ({ ...p, eventDate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors"
              />
              <p className="font-body text-navy/40 text-xs mt-1">
                Optional — displayed alongside the announcement text
              </p>
            </div>

            {/* Feedback */}
            {success && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-sm px-4 py-3">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="font-body text-green-700 text-sm">{success}</p>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <AlertCircle size={16} className="text-red-600" />
                <p className="font-body text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending || !draft.text}
                className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-gold-light transition-all disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Announcement
                  </>
                )}
              </button>
              <p className="font-body text-navy/40 text-xs">Draft auto-saved to browser</p>
            </div>
          </form>
        )}
      </div>

      {/* Live Preview */}
      {draft.text && (
        <div className="rounded-xl border border-gold/20 overflow-hidden">
          <div className="bg-navy/5 px-4 py-2 border-b border-gold/10">
            <p className="font-cinzel text-gold text-xs tracking-wider uppercase">
              Banner Preview
            </p>
          </div>
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(90deg, #0f1f3d, #1a3260, #0f1f3d)' }}
          >
            <Bell size={14} className="text-gold flex-shrink-0" />
            <p className="text-white/95 text-sm font-body flex-1 truncate">
              <span className="text-gold font-semibold mr-2">Announcement:</span>
              {draft.text}
            </p>
            {draft.eventDate && (
              <div className="hidden sm:flex items-center gap-1.5 bg-gold/20 px-2.5 py-0.5 rounded-full flex-shrink-0">
                <span className="text-gold text-xs font-medium">
                  {new Date(draft.eventDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
          {!draft.active && (
            <div className="bg-amber-50 border-t border-amber-200 px-4 py-2">
              <p className="font-body text-amber-700 text-xs flex items-center gap-1.5">
                <EyeOff size={12} />
                This banner is currently hidden. Enable "Show Announcement Banner" to display it.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Current Saved Announcement Info */}
      {existing && (
        <div className="bg-white rounded-xl border border-gold/20 p-5">
          <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-3">
            Currently Saved on Website
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-body text-navy/50 text-xs w-20">Status:</span>
              <span
                className={`text-xs font-cinzel px-2 py-0.5 rounded-full ${
                  existing.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-navy/10 text-navy/50'
                }`}
              >
                {existing.active ? 'LIVE' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-body text-navy/50 text-xs w-20 flex-shrink-0">Text:</span>
              <span className="font-body text-navy/70 text-xs line-clamp-2">{existing.text}</span>
            </div>
            {existing.eventDate && (
              <div className="flex items-center gap-2">
                <span className="font-body text-navy/50 text-xs w-20">Date:</span>
                <span className="font-body text-navy/70 text-xs">
                  {new Date(Number(existing.eventDate) / 1_000_000).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
