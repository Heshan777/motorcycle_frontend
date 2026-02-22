import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

function ToastItem({
  message,
  type,
  onClose,
}: {
  message: string;
  type: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  }[type] || 'bg-slate-500';

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type] || '•';

  return (
    <div
      className={`${bgColor} animate-in fade-in slide-in-from-top-4 duration-300 mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)]`}
      role="alert"
    >
      <span className="text-lg font-bold">{icon}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white transition"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm pointer-events-none sm:right-6 sm:top-6 sm:max-w-md">
      <div className="space-y-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
