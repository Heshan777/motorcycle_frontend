import { useState } from 'react';
import type { FormEvent } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import type { Feedback } from '../types';

const avatarEmojis = ['😊', '😍', '🥰', '🎉', '👍', '⭐'];

interface FeedbackFormProps {
  motorcycleId?: string;
  onSuccess?: () => void;
}

export function FeedbackForm({ motorcycleId, onSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarEmojis[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { submitFeedback } = useFeedback();
  const { addToast } = useToast();
  const { user } = useAuth();

  const getUserAvatarUrl = () => {
    if (user?.avatarUrl) return user.avatarUrl;
    if (user?._id) {
      const storedAvatar = localStorage.getItem(`profile-avatar-${user._id}`);
      if (storedAvatar) return storedAvatar;
    }
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsLoading(true);
      const feedbackData: Omit<Feedback, '_id' | 'createdAt' | 'updatedAt'> = {
        author: String(formData.get('author')).trim(),
        email: String(formData.get('email')).trim(),
        rating,
        text: String(formData.get('text')).trim(),
        avatarEmoji: selectedAvatar,
        authorImageUrl: getUserAvatarUrl(),
        isApproved: false,
        motorcycle: motorcycleId ? { _id: motorcycleId, name: '', slug: '', brand: '' } : null,
      };

      await submitFeedback(feedbackData);
      addToast('Thank you for your feedback!', 'success');
      event.currentTarget.reset();
      setRating(5);
      setSelectedAvatar(avatarEmojis[0]);
      onSuccess?.();
    } catch (error) {
      addToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      {/* Avatar Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">Pick Your Mood</label>
        <div className="flex gap-2">
          {avatarEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedAvatar(emoji)}
              className={`text-3xl transition-all duration-200 ${
                selectedAvatar === emoji
                  ? 'scale-125 drop-shadow-lg'
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Author Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="author"
          required
          placeholder="Enter your name"
          maxLength={50}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]"
        />
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">Rating</label>
        <div className="flex gap-3 text-4xl">
          {Array.from({ length: 5 }).map((_, i) => {
            const starRating = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starRating)}
                onMouseEnter={() => setHoveredRating(starRating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-150 hover:scale-125"
              >
                <span className={hoveredRating > 0 ? (starRating <= hoveredRating ? '⭐' : '☆') : starRating <= rating ? '⭐' : '☆'}>
                </span>
              </button>
            );
          })}
          <span className="text-lg ml-2 text-sky-600 font-semibold">{rating}/5</span>
        </div>
      </div>

      {/* Feedback Text */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Your Feedback <span className="text-red-500">*</span>
        </label>
        <textarea
          name="text"
          required
          minLength={10}
          maxLength={500}
          placeholder="Share your experience with us... (10-500 characters)"
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)] resize-none"
        />
        <p className="text-xs text-slate-500">min 10 characters</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isLoading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
