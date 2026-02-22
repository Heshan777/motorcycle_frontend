import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import type { Booking } from '../types';

interface BookingsResponse {
  success: boolean;
  count: number;
  bookings: Booking[];
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get<BookingsResponse>('/bookings');
      setBookings(response.data.bookings);
      setError('');
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const deleteBooking = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((current) => current.filter((booking) => booking._id !== id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  return (
    <section className="space-y-5">
      <h1>My Bookings</h1>
      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <article
            className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            key={booking._id}
          >
            <h3 className="text-lg font-semibold">{booking.motorcycle.name}</h3>
            <p className="text-sm text-slate-600">Status: {booking.status}</p>
            <p className="text-sm text-slate-600">City: {booking.city}</p>
            <p className="text-sm text-slate-600">
              Preferred: {new Date(booking.preferredDate).toLocaleDateString()}
            </p>
            <button
              type="button"
              className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => deleteBooking(booking._id)}
            >
              Delete booking
            </button>
          </article>
        ))}
      </div>

      {!loading && bookings.length === 0 && <p>No bookings found.</p>}
    </section>
  );
}
