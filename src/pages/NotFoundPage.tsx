import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        {/* Large 404 */}
        <div className="relative">
          <div className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 select-none">
            404
          </div>
          <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-sky-500 to-cyan-500" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            The motorcycle you're looking for has ridden off into the sunset. Let's get you back on track.
          </p>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <Link
            to="/"
            className="group relative rounded-xl bg-slate-100 p-4 text-left hover:bg-slate-200 transition"
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="font-semibold text-slate-900">Home</div>
            <div className="text-xs text-slate-600">Browse all motorcycles</div>
          </Link>
          <Link
            to="/leasing-offer"
            className="group relative rounded-xl bg-sky-100 p-4 text-left hover:bg-sky-200 transition"
          >
            <div className="text-2xl mb-2">🏍️</div>
            <div className="font-semibold text-slate-900">Leasing</div>
            <div className="text-xs text-slate-600">Check our plans</div>
          </Link>
          <Link
            to="/contact-us"
            className="group relative rounded-xl bg-amber-100 p-4 text-left hover:bg-amber-200 transition"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-semibold text-slate-900">Contact</div>
            <div className="text-xs text-slate-600">Get in touch</div>
          </Link>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
