import { useEffect, useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useToast } from '../context/ToastContext';

export function AdminFeedbackPage() {
  const { feedbacks, deleteFeedback, loadFeedbacks, loading } = useFeedback();
  const { addToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const getInitials = (name: string) => {
    if (!name?.trim()) return 'U';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filter === 'approved') return f.isApproved;
    if (filter === 'pending') return !f.isApproved;
    return true;
  });

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      setIsDeleting(id);
      await deleteFeedback(id);
      addToast('Feedback deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete feedback', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading feedback...</div>;
  }

  return (
    <section className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Customer Feedback</h1>
        <p className="text-slate-600">Review and manage customer feedback and testimonials</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        {(['all', 'approved', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filter === f
                ? 'bg-sky-500 text-white shadow-md'
                : 'border border-slate-200 text-slate-600 hover:border-sky-300'
            }`}
          >
            {f === 'all' ? 'All' : f === 'approved' ? 'Approved' : 'Pending'} ({filteredFeedbacks.length})
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Total Feedback</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{feedbacks.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Approved</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {feedbacks.filter((f) => f.isApproved).length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Pending Review</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">
            {feedbacks.filter((f) => !f.isApproved).length}
          </p>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center">
          <p className="text-lg font-semibold text-slate-600">No feedback found</p>
          <p className="text-sm text-slate-500 mt-1">Check back later for customer feedback</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="animate-in fade-in slide-in-from-bottom-2 rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div className="space-y-4">
                  {/* Header with Avatar */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Profile Avatar */}
                      <div className="flex-shrink-0 h-14 w-14 rounded-full border-2 border-slate-200 bg-sky-500 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        {feedback.authorImageUrl ? (
                          <img
                            src={feedback.authorImageUrl}
                            alt={feedback.author}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-sky-600 text-sm font-bold text-white">
                            {getInitials(feedback.author)}
                          </div>
                        )}
                      </div>

                      {/* Author Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{feedback.author}</p>
                        <p className="text-xs text-slate-500">{feedback.email}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-0.5 text-lg flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < feedback.rating ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-sm text-slate-700 leading-relaxed italic bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    "{feedback.text}"
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {feedback.motorcycle && (
                      <span className="rounded-full bg-sky-100 text-sky-700 px-3 py-1.5 font-medium">
                        🏍️ {feedback.motorcycle.brand} {feedback.motorcycle.name}
                      </span>
                    )}
                    {feedback.createdAt && (
                      <span className="rounded-full bg-slate-100 text-slate-600 px-3 py-1.5 font-medium">
                        📅 {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1.5 font-semibold ${
                        feedback.isApproved
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {feedback.isApproved ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:justify-start">
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    disabled={isDeleting === feedback._id}
                    className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 transition-all duration-200"
                  >
                    {isDeleting === feedback._id ? '⏳ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
