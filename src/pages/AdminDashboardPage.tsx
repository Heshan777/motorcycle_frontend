import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import type { Booking, BookingStatus, Inquiry, InquiryStatus, User } from '../types';

interface DashboardStatsResponse {
  success: boolean;
  stats: {
    motorcycles: number;
    bookings: number;
    inquiries: number;
    users: number;
    pendingBookings: number;
    newInquiries: number;
  };
}

interface UsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

interface InquiriesResponse {
  success: boolean;
  count: number;
  inquiries: Inquiry[];
}

interface BookingsResponse {
  success: boolean;
  count: number;
  bookings: Booking[];
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsResponse['stats'] | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, usersRes, inquiriesRes, bookingsRes] = await Promise.all([
        api.get<DashboardStatsResponse>('/dashboard/stats'),
        api.get<UsersResponse>('/auth/users'),
        api.get<InquiriesResponse>('/inquiries'),
        api.get<BookingsResponse>('/bookings'),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setInquiries(inquiriesRes.data.inquiries);
      setBookings(bookingsRes.data.bookings);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateUserRole = async (id: string, role: 'user' | 'admin') => {
    try {
      await api.put(`/auth/users/${id}/role`, { role });
      setUsers((current) => current.map((user) => (user._id === id ? { ...user, role } : user)));
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      setInquiries((current) => current.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((current) => current.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  };

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <section className="space-y-6">
      <h1>Admin Dashboard</h1>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/motorcycles"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Manage Motorcycles
        </Link>
        <Link
          to="/admin/users"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/feedback"
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
        >
          Manage Feedback
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Motorcycles</h3>
            <p className="text-3xl font-semibold">{stats.motorcycles}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Bookings</h3>
            <p className="text-3xl font-semibold">{stats.bookings}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Inquiries</h3>
            <p className="text-3xl font-semibold">{stats.inquiries}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Users</h3>
            <p className="text-3xl font-semibold">{stats.users}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pending Bookings</h3>
            <p className="text-3xl font-semibold">{stats.pendingBookings}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">New Inquiries</h3>
            <p className="text-3xl font-semibold">{stats.newInquiries}</p>
          </article>
        </div>
      )}

      <h2>Users</h2>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    onClick={() => updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                  >
                    Make {user.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Inquiries</h2>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{inquiry.name}</td>
                <td className="px-4 py-3">{inquiry.subject}</td>
                <td className="px-4 py-3">{inquiry.status}</td>
                <td className="px-4 py-3">
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-sm"
                    value={inquiry.status}
                    onChange={(event) => updateInquiryStatus(inquiry._id, event.target.value as InquiryStatus)}
                  >
                    <option value="new">new</option>
                    <option value="in-progress">in-progress</option>
                    <option value="closed">closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Bookings</h2>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Motorcycle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{booking.name}</td>
                <td className="px-4 py-3">{booking.motorcycle?.name}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-sm"
                    value={booking.status}
                    onChange={(event) => updateBookingStatus(booking._id, event.target.value as BookingStatus)}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
