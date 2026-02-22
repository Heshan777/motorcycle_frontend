import { useEffect, useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import type { Feedback } from '../types';

export function CreativeFeedbackGallery() {
  const { feedbacks, loading } = useFeedback();
  const [displayFeedbacks, setDisplayFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    // Filter approved feedbacks and limit to 8
    const approved = feedbacks.filter((f) => f.isApproved !== false).slice(0, 8);
    setDisplayFeedbacks(approved);
  }, [feedbacks]);

  const getInitials = (name: string) => {
    if (!name?.trim()) return 'U';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  };

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-56 rounded-3xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (displayFeedbacks.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center">
        <p className="text-lg font-semibold text-slate-600">Be the first to share your experience! 🚀</p>
        <p className="mt-2 text-sm text-slate-500">Your feedback helps us improve and guides other riders in their decisions.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-2">
      {displayFeedbacks.map((feedback, index) => (
        <div
          key={feedback._id || index}
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.1)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)] hover:-translate-y-2 transition-all duration-300"
          style={{
            animationDelay: `${Math.min(index * 60, 300)}ms`,
          } as React.CSSProperties}
        >
          {/* Gradient Background Accent */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-blue-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-2xl" aria-hidden="true" />
          
          {/* Content Container */}
          <div className="relative z-10 h-full overflow-hidden p-6 flex flex-col">
            {/* Header: Author Avatar + Name + Rating */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                {/* Profile Image */}
                <div className="flex-shrink-0 h-12 w-12 rounded-full border-2 border-slate-200 bg-sky-500 overflow-hidden shadow-md">
                  {feedback.authorImageUrl ? (
                    <img
                      src={feedback.authorImageUrl}
                      alt={feedback.author}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-sky-600 text-xs font-bold text-white">
                      {getInitials(feedback.author)}
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{feedback.author}</p>
                  <p className="text-xs text-slate-500 truncate">{feedback.email}</p>
                </div>
              </div>

              {/* Star Rating Display */}
              <div className="flex gap-0.5 text-lg flex-shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < feedback.rating ? '⭐' : '☆'} />
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <p className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-3 italic flex-1">
              "{feedback.text}"
            </p>

            {/* Motorcycle Info */}
            {feedback.motorcycle && (
              <div className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 w-fit">
                {feedback.motorcycle.brand} {feedback.motorcycle.name}
              </div>
            )}

            {/* Mood Emoji + Date Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-2xl">{feedback.avatarEmoji || '⭐'}</span>
              {feedback.createdAt && (
                <span className="text-xs text-slate-400">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Hover Overlay with Full Feedback */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/95 via-sky-600/95 to-blue-600/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-5 rounded-3xl backdrop-blur-sm z-20">
            <div className="text-center text-white space-y-2">
              <p className="text-4xl">{feedback.avatarEmoji || '⭐'}</p>
              <div className="flex gap-0.5 justify-center text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < feedback.rating ? '⭐' : '☆'}</span>
                ))}
              </div>
              <p className="font-semibold text-sm">{feedback.author}</p>
              <p className="text-sm leading-relaxed italic">"{feedback.text}"</p>
            </div>
          </div>
        </div>
      ))}

      {/* Empty Slot for CTA */}
      {displayFeedbacks.length < 8 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 delay-300 rounded-3xl border-2 border-dashed border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 p-6 flex items-center justify-center min-h-56 group cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-2">
          <div className="text-center">
            <p className="text-4xl mb-2 group-hover:scale-110 transition-transform">✍️</p>
            <p className="font-semibold text-sky-900 text-sm">Share Your Feedback</p>
            <p className="text-xs text-slate-600 mt-1">Help others make better decisions</p>
          </div>
        </div>
      )}
    </div>
  );
}
