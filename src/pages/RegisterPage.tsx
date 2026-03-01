import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) {
      return { label: 'Weak', barClass: 'w-1/4 bg-rose-500', textClass: 'text-rose-600' };
    }
    if (score <= 2) {
      return { label: 'Fair', barClass: 'w-2/4 bg-amber-500', textClass: 'text-amber-600' };
    }
    if (score <= 3) {
      return { label: 'Good', barClass: 'w-3/4 bg-sky-500', textClass: 'text-sky-600' };
    }
    return { label: 'Strong', barClass: 'w-full bg-emerald-500', textClass: 'text-emerald-600' };
  }, [password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      setError('');
      await register(
        String(formData.get('name') || ''),
        String(formData.get('email') || ''),
        String(formData.get('password') || ''),
        String(formData.get('phone') || ''),
      );
      navigate('/');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed');
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
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-[0_25px_60px_rgba(15,23,42,0.45)]">
        <img
          className="h-full w-full object-cover opacity-80"
          src="/registerpage.png"
          alt="Motorcycle lifestyle"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-950/95 via-slate-900/65 to-slate-950/15" />
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <h1 className="mb-2 text-3xl font-semibold text-slate-900">Create Account</h1>
        <p className="mb-6 text-sm text-slate-600">Join in seconds and start managing your rides smarter.</p>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              required
              name="name"
              placeholder="Alex Morgan"
              autoComplete="name"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="email">Email</label>
            <input
              id="email"
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              required
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 pr-24 text-sm shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
                minLength={6}
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {password && (
              <div className="space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.barClass}`} />
                </div>
                <p className={`text-xs font-semibold ${passwordStrength.textClass}`}>Strength: {passwordStrength.label}</p>
              </div>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="phone">Phone (Optional)</label>
            <input
              id="phone"
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              name="phone"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating your account...' : 'Create account'}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

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
            text="signup_with"
            logo_alignment="center"
          />
        </div>

        <p className="mt-5 text-sm text-slate-600">
          Already registered?{' '}
          <Link className="font-semibold text-sky-600 transition hover:text-sky-700" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
