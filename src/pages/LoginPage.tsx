import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      setError('');
      await login(String(formData.get('email') || ''), String(formData.get('password') || ''));
      navigate('/');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: { credential?: string }) => {
    if (!response.credential) return;
    try {
      setError('');
      await loginWithGoogle(response.credential);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-[0_25px_60px_rgba(15,23,42,0.45)]">
        <img
          className="h-full w-full object-cover opacity-80"
          src="/bike.jpg"
          alt="Motorcycle in motion"
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-950/90 via-slate-900/60 to-slate-950/10" />
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Motorcycle Hub</p>
          <h2 className="text-3xl font-semibold leading-tight">Welcome back to the ride.</h2>
          <p className="max-w-sm text-sm text-white/80">
            Access your bookings, manage your profile, and explore the latest arrivals.
          </p>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <h1 className="mb-2 text-3xl font-semibold">Login</h1>
        <p className="mb-6 text-sm text-slate-600">Welcome back. Sign in to continue.</p>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            required
            name="email"
            type="email"
            placeholder="Email"
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            required
            name="password"
            type="password"
            placeholder="Password"
          />
          <button
            disabled={loading}
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in failed. Please try again.')}
            theme="outline"
            shape="pill"
            text="signin_with"
            logo_alignment="center"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-sm text-slate-600">
          No account? <Link className="font-semibold text-slate-900" to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}
