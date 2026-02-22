import { useState } from 'react';
import { testimonials, faqs } from '../lib/content';

export function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="space-y-12">
      <div className="rounded-4xl border border-slate-200 bg-gradient-to-br from-sky-50 via-slate-50 to-blue-50 p-8 sm:p-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Help & Support</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Find answers to common questions about motorcycles, bookings, leasing, and more.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Testimonials</h2>
        <p className="text-slate-600">Join thousands of happy riders</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{testimonial.avatar}</div>
                  <p className="font-bold text-slate-900">{testimonial.author}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <p className="text-slate-600 mb-6">Everything you need to know</p>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition hover:border-sky-300"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <h3 className="font-bold text-slate-900 text-left">{faq.question}</h3>
                <span
                  className={`text-xl text-sky-600 transition-transform flex-shrink-0 ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {expandedId === faq.id && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-slate-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-500 to-blue-600 p-8 sm:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Still have questions?</h2>
        <p className="mb-6 text-white/90">Our support team is here to help 24/7</p>
        <a
          href="/contact-us"
          className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-8 py-3 font-bold text-black  transition"
        >
          Contact Us →
        </a>
      </div>
    </section>
  );
}
