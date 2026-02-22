import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Feedback } from '../types';
import { api, getErrorMessage } from '../lib/api';

interface FeedbackContextType {
  feedbacks: Feedback[];
  loading: boolean;
  error: string;
  submitFeedback: (feedback: Omit<Feedback, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  loadFeedbacks: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<{ success: boolean; feedbacks: Feedback[] }>(
        '/feedback'
      );
      setFeedbacks(response.data.feedbacks || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('feedbacks');
      if (stored) {
        try {
          setFeedbacks(JSON.parse(stored));
        } catch {
          setFeedbacks([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const submitFeedback = async (feedback: Omit<Feedback, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post<{ success: boolean; feedback: Feedback }>(
        '/feedback',
        feedback
      );
      setFeedbacks((current) => [response.data.feedback, ...current]);
      // Also store locally
      const stored = localStorage.getItem('feedbacks');
      const allFeedbacks = stored ? JSON.parse(stored) : [];
      localStorage.setItem('feedbacks', JSON.stringify([response.data.feedback, ...allFeedbacks]));
    } catch (submitError) {
      // Fallback to localStorage
      const newFeedback: Feedback = {
        ...feedback,
        _id: Date.now().toString(),
        isApproved: true,
        createdAt: new Date().toISOString(),
      };
      setFeedbacks((current) => [newFeedback, ...current]);
      const stored = localStorage.getItem('feedbacks');
      const allFeedbacks = stored ? JSON.parse(stored) : [];
      localStorage.setItem('feedbacks', JSON.stringify([newFeedback, ...allFeedbacks]));
      throw submitError;
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks((current) => current.filter((f) => f._id !== id));
      // Also update localStorage
      const stored = localStorage.getItem('feedbacks');
      const allFeedbacks = stored ? JSON.parse(stored) : [];
      const updated = allFeedbacks.filter((f: Feedback) => f._id !== id);
      localStorage.setItem('feedbacks', JSON.stringify(updated));
    } catch (deleteError) {
      // Fallback to localStorage
      const stored = localStorage.getItem('feedbacks');
      const allFeedbacks = stored ? JSON.parse(stored) : [];
      const updated = allFeedbacks.filter((f: Feedback) => f._id !== id);
      localStorage.setItem('feedbacks', JSON.stringify(updated));
      setFeedbacks((current) => current.filter((f) => f._id !== id));
    }
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, loading, error, submitFeedback, deleteFeedback, loadFeedbacks }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
}
