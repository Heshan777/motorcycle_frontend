import type { FormEvent } from 'react';
import { useState } from 'react';

export function ContactUsPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Thanks! Your message has been received. We will contact you shortly.');
    event.currentTarget.reset();
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_35px_rgba(15,23,42,0.08)] sm:p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Contact Us</h1>
        <p className="mt-2 text-sm text-slate-600">
          Have questions about motorcycles, bookings, or leasing? Send us a message and we’ll get back to you.
        </p>

        <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
          <input
            required
            name="name"
            placeholder="Your name"
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Your email"
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <input
            name="subject"
            placeholder="Subject"
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Message"
            className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Send Message
          </button>
        </form>

        {message && <p className="mt-3 text-sm font-medium text-emerald-600">{message}</p>}
      </article>

      <article className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.3)] sm:p-8">
        <h2 className="text-2xl font-semibold">Reach us directly</h2>
        <div className="mt-5 space-y-3 text-sm text-slate-200">
          <p>Email: support@motorcyclehub.com</p>
          <p>Phone: +94 74 3552735</p>
          <p>Address: 31/1, Gampola.</p>
          <p>Working Hours: Mon - Sat, 9:00 AM - 7:00 PM</p>
        </div>
      </article>
    </section>
  );
}
