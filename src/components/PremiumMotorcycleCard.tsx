import { useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Motorcycle } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { getAverageRating, getReviewsForMotorcycle } from '../lib/reviews';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  isComparisonMode?: boolean;
  onComparisonToggle?: (id: string) => void;
  isSelected?: boolean;
  style?: CSSProperties;
}

export function PremiumMotorcycleCard({
  motorcycle,
  isComparisonMode = false,
  onComparisonToggle,
  isSelected = false,
  style,
}: MotorcycleCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const inWishlist = isInWishlist(motorcycle._id);
  const reviews = getReviewsForMotorcycle(motorcycle._id);
  const avgRating = getAverageRating(motorcycle._id);

  const stockStatus = useMemo(() => {
    if (motorcycle.stock === 0) return { label: 'Out of Stock', color: 'bg-red-500' };
    if (motorcycle.stock <= 2) return { label: 'Limited Stock', color: 'bg-amber-500' };
    return { label: 'In Stock', color: 'bg-emerald-500' };
  }, [motorcycle.stock]);

  return (
    <Link className="group block text-inherit animate-in fade-in slide-in-from-bottom-2" style={style} to={`/motorcycles/${motorcycle.slug}`}>
      <article
        className={`surface-hover h-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.1)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)] ${
          isSelected ? 'ring-2 ring-sky-500 ring-inset' : ''
        }`}
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <img
            className={`h-full w-full object-cover transition duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            src={motorcycle.images[0] || 'https://placehold.co/400x300?text=Motorcycle'}
            alt={motorcycle.name}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-200" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/90 backdrop-blur px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
              {motorcycle.category}
            </span>
            {motorcycle.isFeatured && (
              <span className="rounded-full bg-amber-400/90 backdrop-blur px-2 py-1 text-xs font-bold text-slate-900">⭐ Featured</span>
            )}
          </div>

          <div className={`absolute right-3 top-3 rounded-full ${stockStatus.color} px-2.5 py-1 text-xs font-bold text-white`}>
            {stockStatus.label}
          </div>

          {!isComparisonMode && (
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleWishlist(motorcycle._id);
              }}
              className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur p-2.5 shadow-lg transition hover:bg-white hover:scale-110"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <span className="text-lg">{inWishlist ? '❤️' : '🤍'}</span>
            </button>
          )}

          {isComparisonMode && (
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onComparisonToggle?.(motorcycle._id);
              }}
              className={`absolute bottom-3 right-3 rounded-full p-2.5 shadow-lg transition ${
                isSelected ? 'bg-sky-500 text-white' : 'bg-white/90 text-slate-900 hover:bg-white'
              }`}
              aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
            >
              <span>{isSelected ? '✓' : '+'}</span>
            </button>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition line-clamp-1 text-lg">
              {motorcycle.name}
            </h3>
            <p className="text-xs text-slate-500 group-hover:text-slate-700 transition">
              {motorcycle.brand} · {motorcycle.engine}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(avgRating) ? '⭐' : '☆'}>
                </span>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {avgRating} ({reviews.length})
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-slate-50 p-2 transition group-hover:bg-slate-100/90">
              <p className="font-bold text-slate-900">{motorcycle.horsepower}hp</p>
              <p className="text-slate-500 text-[10px]">Power</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 transition group-hover:bg-slate-100/90">
              <p className="font-bold text-slate-900">{motorcycle.topSpeed}km/h</p>
              <p className="text-slate-500 text-[10px]">Top Speed</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 transition group-hover:bg-slate-100/90">
              <p className="font-bold text-slate-900">${(motorcycle.price / 100).toFixed(0)}k</p>
              <p className="text-slate-500 text-[10px]">Price</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <strong className="text-sky-600 font-bold">
              ${motorcycle.price.toLocaleString()}
            </strong>
            <span className="text-xs text-slate-400 font-medium">
              {motorcycle.images.length} photos
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
