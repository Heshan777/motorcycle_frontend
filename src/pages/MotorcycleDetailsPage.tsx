import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import { resolveMotorcycleImageUrl } from '../lib/supabase';
import type { Motorcycle } from '../types';

interface MotorcycleResponse {
  success: boolean;
  motorcycle: Motorcycle;
}

export function MotorcycleDetailsPage() {
  const { identifier } = useParams();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const bookingFormRef = useRef<HTMLFormElement>(null);
  const inquiryFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const loadMotorcycle = async () => {
      if (!identifier) {
        setError('Invalid motorcycle identifier');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<MotorcycleResponse>(`/motorcycles/${identifier}`);
        setMotorcycle(response.data.motorcycle);
        setActiveImage(resolveMotorcycleImageUrl(response.data.motorcycle.images[0] || ''));
      } catch (fetchError) {
        setError(getErrorMessage(fetchError));
      } finally {
        setLoading(false);
      }
    };

    loadMotorcycle();
  }, [identifier]);

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!motorcycle) return;

    const formData = new FormData(event.currentTarget);

    try {
      await api.post('/bookings', {
        motorcycle: motorcycle._id,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        preferredDate: formData.get('preferredDate'),
        notes: formData.get('notes'),
      });
      setBookingMessage('Booking request submitted successfully.');
      if (bookingFormRef.current) {
        bookingFormRef.current.reset();
      }
    } catch (submitError) {
      setBookingMessage(getErrorMessage(submitError));
    }
  };

  const handleInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!motorcycle) return;

    const formData = new FormData(event.currentTarget);

    try {
      await api.post('/inquiries', {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        motorcycle: motorcycle._id,
      });
      setInquiryMessage('Inquiry sent successfully.');
      if (inquiryFormRef.current) {
        inquiryFormRef.current.reset();
      }
    } catch (submitError) {
      setInquiryMessage(getErrorMessage(submitError));
    }
  };

  if (loading) return <p>Loading motorcycle...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!motorcycle) return <p>Motorcycle not found</p>;

  const displayImages = motorcycle.images.map((imageUrl) => resolveMotorcycleImageUrl(imageUrl));

  return (
    <section className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid gap-3">
          <img
            className="h-105 w-full rounded-3xl border border-slate-200 object-cover shadow-[0_20px_50px_rgba(15,23,42,0.15)]"
            src={activeImage || 'https://placehold.co/1200x700?text=Motorcycle'}
            alt={motorcycle.name}
          />

          {displayImages.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-4">
              {displayImages.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  className={
                    imageUrl === activeImage
                      ? 'overflow-hidden rounded-2xl border border-slate-900 bg-white p-1 shadow-[0_0_0_2px_rgba(15,23,42,0.4)]'
                      : 'overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 transition hover:border-slate-400'
                  }
                  onClick={() => setActiveImage(imageUrl)}
                >
                  <img
                    className="h-20 w-full rounded-xl object-cover"
                    src={imageUrl}
                    alt={`${motorcycle.name} view ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h1 className="mb-2 text-3xl font-semibold">{motorcycle.name}</h1>
          <p className="mt-0 text-sm text-slate-600">
            {motorcycle.brand} · {motorcycle.category} · {motorcycle.engine}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <strong>Price</strong>
              <p>${motorcycle.price.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <strong>Status</strong>
              <p>{motorcycle.status}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <strong>Top Speed</strong>
              <p>{motorcycle.topSpeed} km/h</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <strong>Power</strong>
              <p>{motorcycle.horsepower} hp</p>
            </div>
          </div>
          <p>{motorcycle.description || 'No description available.'}</p>
        </article>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2>Book Test Ride</h2>
          <form ref={bookingFormRef} className="grid gap-3" onSubmit={handleBooking}>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="name"
              placeholder="Your name"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="email"
              type="email"
              placeholder="Your email"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="phone"
              placeholder="Phone"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="city"
              placeholder="City"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="preferredDate"
              type="date"
            />
            <textarea
              className="min-h-27.5 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              name="notes"
              placeholder="Notes (optional)"
            />
            <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Submit booking
            </button>
          </form>
          {bookingMessage && <p>{bookingMessage}</p>}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2>Send Inquiry</h2>
          <form ref={inquiryFormRef} className="grid gap-3" onSubmit={handleInquiry}>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="name"
              placeholder="Your name"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="email"
              type="email"
              placeholder="Your email"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              name="phone"
              placeholder="Phone (optional)"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="subject"
              placeholder="Subject"
            />
            <textarea
              className="min-h-27.5 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
              name="message"
              placeholder="Message"
            />
            <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Send inquiry
            </button>
          </form>
          {inquiryMessage && <p>{inquiryMessage}</p>}
        </article>
      </div>
    </section>
  );
}
