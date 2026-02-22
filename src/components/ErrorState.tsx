import React from 'react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-slate-600">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while processing your request.',
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-red-200 bg-red-50 px-6 py-16 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h3 className="mb-2 text-xl font-bold text-red-900">{title}</h3>
      <p className="mb-6 max-w-sm text-red-700">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorState
            title="Page Error"
            message={this.state.error?.message || 'An unexpected error occurred.'}
            action={{
              label: 'Reload Page',
              onClick: () => window.location.reload(),
            }}
          />
        )
      );
    }

    return this.props.children;
  }
}
