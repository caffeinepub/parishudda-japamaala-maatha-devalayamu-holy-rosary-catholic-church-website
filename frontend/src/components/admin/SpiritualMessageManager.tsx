import { useEffect, useState } from 'react';
import { useSpiritualMessage, useUpdateSpiritualMessage } from '../../hooks/useQueries';
import { useDraftState } from '../../hooks/useDraftState';
import { BookOpen, Save, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface DraftMessage {
  title: string;
  author: string;
  fullText: string;
}

const initialDraft: DraftMessage = { title: '', author: '', fullText: '' };

export default function SpiritualMessageManager() {
  const { data: existing, isLoading } = useSpiritualMessage();
  const updateMutation = useUpdateSpiritualMessage();
  const [draft, setDraft, clearDraft] = useDraftState<DraftMessage>('spiritualMessageDraft', initialDraft);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Load existing data into draft only once on first load (if draft is empty)
  useEffect(() => {
    if (existing && !loaded) {
      setLoaded(true);
      const hasDraft = draft.title || draft.author || draft.fullText;
      if (!hasDraft) {
        setDraft({ title: existing.title, author: existing.author, fullText: existing.fullText });
      }
    }
  }, [existing, loaded]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await updateMutation.mutateAsync({
        title: draft.title,
        author: draft.author,
        fullText: draft.fullText,
      });
      setSuccess('Spiritual message updated successfully!');
      clearDraft();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to save message. Please try again.');
    }
  };

  const handleLoadExisting = () => {
    if (existing) {
      setDraft({ title: existing.title, author: existing.author, fullText: existing.fullText });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gold/30 shadow-sacred overflow-hidden">
        <div className="bg-navy px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-gold" />
            <h2 className="font-heading text-white font-semibold">Daily Spiritual Message</h2>
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
            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                Message Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., The Power of the Rosary"
                className="w-full px-4 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                Author (Pope / Priest Name) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={draft.author}
                onChange={(e) => setDraft((p) => ({ ...p, author: e.target.value }))}
                placeholder="e.g., Pope Francis / Fr. John"
                className="w-full px-4 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                Full Message Text <span className="text-red-400">*</span>
              </label>
              <textarea
                value={draft.fullText}
                onChange={(e) => setDraft((p) => ({ ...p, fullText: e.target.value }))}
                placeholder="Enter the full spiritual message here..."
                rows={8}
                className="w-full px-4 py-3 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold transition-colors resize-y"
                required
              />
              <p className="font-body text-navy/40 text-xs mt-1">
                {draft.fullText.length} characters
              </p>
            </div>

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-4 py-3">
                <CheckCircle size={16} className="text-green-600" />
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
                disabled={updateMutation.isPending || !draft.title || !draft.author || !draft.fullText}
                className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-gold-light transition-all disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={16} /> Save Message</>
                )}
              </button>
              <p className="font-body text-navy/40 text-xs">
                Draft auto-saved to browser
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Preview */}
      {(draft.title || draft.fullText) && (
        <div className="mt-6 bg-navy/5 rounded-xl border border-gold/20 p-5">
          <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-3">Preview</p>
          <h3 className="font-heading text-navy text-lg font-bold mb-1">{draft.title || 'Untitled'}</h3>
          {draft.author && (
            <p className="font-body text-gold text-sm mb-3">— {draft.author}</p>
          )}
          <p className="font-body text-navy/70 text-sm leading-relaxed line-clamp-4">
            {draft.fullText}
          </p>
        </div>
      )}
    </div>
  );
}
