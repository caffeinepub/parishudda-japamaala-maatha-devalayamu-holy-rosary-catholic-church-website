import { useState } from 'react';
import { useMassSchedule, useAddMassTiming } from '../../hooks/useQueries';
import { useDraftState } from '../../hooks/useDraftState';
import { Plus, Trash2, Clock, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DraftForm {
  day: string;
  time: string;
  serviceType: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SERVICE_TYPES = ['Telugu Mass', 'English Mass', 'Confession', 'Adoration', 'Rosary Prayer', 'Special Mass'];

const initialDraft: DraftForm = { day: 'Sunday', time: '06:30', serviceType: 'Telugu Mass' };

export default function MassScheduleManager() {
  const { data: schedule, isLoading } = useMassSchedule();
  const addMutation = useAddMassTiming();
  const [draft, setDraft, clearDraft] = useDraftState<DraftForm>('massScheduleDraft', initialDraft);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await addMutation.mutateAsync({
        day: draft.day,
        time: draft.time,
        serviceType: draft.serviceType,
      });
      setSuccess(`Added: ${draft.day} at ${draft.time} — ${draft.serviceType}`);
      clearDraft();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to add mass timing. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Add New Timing */}
      <div className="bg-white rounded-xl border border-gold/30 shadow-sacred overflow-hidden">
        <div className="bg-navy px-6 py-4 flex items-center gap-3">
          <Plus size={18} className="text-gold" />
          <h2 className="font-heading text-white font-semibold">Add Mass Timing</h2>
        </div>
        <form onSubmit={handleAdd} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">Day</label>
              <select
                value={draft.day}
                onChange={(e) => setDraft((p) => ({ ...p, day: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">Time</label>
              <input
                type="time"
                value={draft.time}
                onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">Service Type</label>
              <select
                value={draft.serviceType}
                onChange={(e) => setDraft((p) => ({ ...p, serviceType: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors"
              >
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
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

          <button
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-gold-light transition-all disabled:opacity-50"
          >
            {addMutation.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Adding...</>
            ) : (
              <><Plus size={16} /> Add Timing</>
            )}
          </button>
        </form>
      </div>

      {/* Current Schedule */}
      <div className="bg-white rounded-xl border border-gold/30 shadow-sacred overflow-hidden">
        <div className="bg-navy/5 px-6 py-4 border-b border-gold/20 flex items-center gap-3">
          <Calendar size={18} className="text-gold" />
          <h2 className="font-heading text-navy font-semibold">Current Schedule</h2>
          {schedule && (
            <span className="ml-auto bg-gold/10 text-gold text-xs font-cinzel px-2.5 py-1 rounded-full">
              {schedule.length} entries
            </span>
          )}
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-ivory-dark rounded animate-pulse" />
              ))}
            </div>
          ) : !schedule || schedule.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="mx-auto text-navy/20 mb-2" />
              <p className="font-body text-navy/40 text-sm italic">No mass timings added yet.</p>
              <p className="font-body text-navy/30 text-xs mt-1">
                Default data (Sunday 6:30 AM Telugu Mass, 8:30 AM English Mass) will be seeded on first load.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedule.map((timing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 bg-ivory rounded-lg border border-gold/20 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gold" />
                      <span className="font-cinzel text-navy text-sm font-semibold">{timing.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gold" />
                      <span className="font-body text-navy text-sm">{timing.time}</span>
                    </div>
                    <span className="hidden sm:inline-block bg-gold/10 text-gold-dark text-xs px-2.5 py-0.5 rounded-full border border-gold/20">
                      {timing.serviceType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
