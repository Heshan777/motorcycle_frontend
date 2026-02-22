import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import { SkeletonGrid, SkeletonHero } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/ErrorState';
import { PremiumMotorcycleCard } from '../components/PremiumMotorcycleCard';
import { FeedbackForm } from '../components/FeedbackForm';
import { CreativeFeedbackGallery } from '../components/CreativeFeedbackGallery';
import { testimonials } from '../lib/content';
import type { Motorcycle } from '../types';

interface MotorcyclesResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  motorcycles: Motorcycle[];
}

const categories = ['all', 'sport', 'cruiser', 'adventure', 'scooter', 'electric', 'commuter'];
const heroImages = ['/bike.jpg', '/bike2.jpg', '/pub2.jpg', '/pub3.jpg', '/pub4.jpg', '/public1.jpg', '/vite.svg'];

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<MotorcyclesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadedHeroImages, setLoadedHeroImages] = useState<Set<number>>(() => new Set([0]));
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page') || '1');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '8');
    params.set('sort', 'newest');

    if (search.trim()) {
      params.set('search', search.trim());
    }

    if (category !== 'all') {
      params.set('category', category);
    }

    return params.toString();
  }, [category, page, search]);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get<MotorcyclesResponse>(`/motorcycles?${queryString}`);
        setData(response.data);
      } catch (fetchError) {
        setError(getErrorMessage(fetchError));
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycles();
  }, [queryString]);

  useEffect(() => {
    if (heroImages.length === 0) return;

    let mounted = true;

    heroImages.forEach((src, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;

      const markLoaded = () => {
        if (!mounted) return;
        setLoadedHeroImages((prev) => {
          if (prev.has(index)) {
            return prev;
          }
          const next = new Set(prev);
          next.add(index);
          return next;
        });
      };

      if (image.complete) {
        markLoaded();
        return;
      }

      image.onload = markLoaded;
      image.onerror = () => {
        if (!mounted) return;
        setLoadedHeroImages((prev) => {
          if (prev.has(index)) {
            return prev;
          }
          const next = new Set(prev);
          next.add(index);
          return next;
        });
      };
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (heroImages.length === 0 || loadedHeroImages.size <= 1) return;

    const intervalId = window.setInterval(() => {
      setHeroIndex((prev) => {
        let next = (prev + 1) % heroImages.length;
        let attempts = 0;

        while (!loadedHeroImages.has(next) && attempts < heroImages.length) {
          next = (next + 1) % heroImages.length;
          attempts += 1;
        }

        return loadedHeroImages.has(next) ? next : prev;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [loadedHeroImages]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch = String(formData.get('search') || '').trim();

    const params = new URLSearchParams(searchParams);
    if (nextSearch) {
      params.set('search', nextSearch);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategory = (nextCategory: string) => {
    const params = new URLSearchParams(searchParams);
    if (nextCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', nextCategory);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const changePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(nextPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-8 animate-in fade-in">
      {/* Hero Section */}
      {loading && !data ? (
        <SkeletonHero />
      ) : (
        <div className="relative grid min-h-96 items-center overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_25px_60px_rgba(15,23,42,0.45)] animate-in fade-in slide-in-from-bottom-2">
          <div className="absolute inset-0" aria-hidden="true">
            {heroImages.map((src, index) => (
              <img
                key={src}
                className={
                  index === heroIndex
                    ? 'absolute inset-0 h-full w-full object-cover opacity-100 scale-100 transition-[opacity,transform,filter] duration-[1400ms] ease-out will-change-[opacity,transform]'
                    : 'absolute inset-0 h-full w-full object-cover opacity-0 scale-[1.04] transition-[opacity,transform,filter] duration-[1400ms] ease-out will-change-[opacity,transform]'
                }
                src={src}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                draggable={false}
                alt=""
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-linear-to-br from-slate-950/95 via-slate-900/75 to-slate-950/40" />
          <div className="relative z-10 space-y-4 px-6 py-12 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
              ≡ Ride the Next Horizon
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both delay-100">
              Find Your Perfect Motorcycle
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-white/80 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-200">
              Explore premium motorcycles, compare specifications, and book your test ride in minutes.
            </p>
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both delay-300">
              <Link to="#catalog" className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md">
                Explore Now 
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 delay-100" id="catalog">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Motorcycle Catalog</h2>
            <p className="text-slate-600 mt-1">
              {data?.total ? `${data.total} motorcycles available` : 'Browse our collection'}
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
          <input
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)] placeholder-slate-400"
            defaultValue={search}
            name="search"
            placeholder="Search by name, brand, or model..."
          />
          <button
            type="submit"
            className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                item === category
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm'
              }`}
              onClick={() => handleCategory(item)}
            >
              {item === 'all' ? 'All' : item}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && !data && <SkeletonGrid count={8} />}

      {/* Error State */}
      {error && !loading && (
        <ErrorState
          title="Failed to Load Motorcycles"
          message={error}
          action={{
            label: 'Try Again',
            onClick: () => window.location.reload(),
          }}
        />
      )}

      {/* Empty State */}
      {!loading && data?.motorcycles.length === 0 && (
        <EmptyState
          icon="≡ƒöì"
          title="No Motorcycles Found"
          description={
            search || category !== 'all'
              ? 'Try adjusting your search filters or browse all motorcycles.'
              : 'Check back soon for new motorcycles!'
          }
          action={
            search || category !== 'all'
              ? {
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchParams({});
                  },
                }
              : undefined
          }
        />
      )}

      {/* Motorcycles Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-500">
        {data?.motorcycles.map((motorcycle, index) => (
          <PremiumMotorcycleCard
            key={motorcycle._id}
            motorcycle={motorcycle}
            style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
          />
        ))}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 py-6">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => changePage(page - 1)}
          >
             Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, data.pages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => changePage(pageNum)}
                  className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                    page === pageNum
                      ? 'bg-sky-500 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {data.pages > 5 && <span className="text-slate-500">...</span>}
          </div>

          <button
            type="button"
            disabled={page >= data.pages}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => changePage(page + 1)}
          >
            Next 
          </button>
        </div>
      )}

      {/* Testimonials Section */}
      <section className="py-12 space-y-6 animate-in fade-in slide-in-from-bottom-2 delay-200">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Loved by Riders Everywhere</h2>
          <p className="text-slate-600">Join thousands of satisfied customers</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="surface-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{testimonial.author}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-sm"></span>
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Creative Feedback Gallery */}
      <section className="py-12 space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">✨ Fresh Feedback</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What Riders Say</h2>
          <p className="text-slate-600">Real experiences from our amazing community</p>
        </div>
        
        <CreativeFeedbackGallery />
      </section>

      {/* Feedback Form Section */}
      <section className="py-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 delay-200">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* CTA Card */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 p-8 flex flex-col justify-center">
            <p className="text-4xl mb-3">✍️</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Share Your Experience</h3>
            <p className="text-slate-600 mb-5">Your feedback helps us improve and guides other riders in their decision.</p>
            <button
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              className="self-start rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md"
            >
              {showFeedbackForm ? 'Hide Form' : 'Write a Review'}
            </button>
          </div>

          {/* Form */}
          {showFeedbackForm && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <FeedbackForm onSuccess={() => setShowFeedbackForm(false)} />
            </div>
          )}
        </div>
      </section>

      {/* CTA: Compare & FAQ */}
      <section className="grid gap-6 py-8 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 delay-300">
        <Link
          to="/compare"
          className="surface-hover group rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 p-8 text-center hover:shadow-lg"
        >
          <p className="text-4xl mb-3">⚖</p>
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition mb-2">
            Compare Bikes
          </h3>
          <p className="text-slate-600">Side-by-side specs and features</p>
        </Link>

        <Link
          to="/faq"
          className="surface-hover group rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center hover:shadow-lg"
        >
          <p className="text-4xl mb-3">?</p>
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition mb-2">
            Help & FAQ
          </h3>
          <p className="text-slate-600">Get answers to all your questions</p>
        </Link>
      </section>
    </section>
  );
}
