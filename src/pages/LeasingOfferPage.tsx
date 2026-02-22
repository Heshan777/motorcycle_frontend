import { Link } from 'react-router-dom';

const plans = [
  {
    title: 'Starter Lease',
    monthly: '$189/mo',
    duration: '24 months',
    downPayment: '$799',
    mileage: '8,000 km/year',
  },
  {
    title: 'Performance Lease',
    monthly: '$259/mo',
    duration: '36 months',
    downPayment: '$1,199',
    mileage: '12,000 km/year',
  },
  {
    title: 'Premium Lease',
    monthly: '$349/mo',
    duration: '48 months',
    downPayment: '$1,999',
    mileage: '15,000 km/year',
  },
];

export function LeasingOfferPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-600 to-sky-500 p-6 text-white shadow-[0_20px_55px_rgba(14,116,144,0.35)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Flexible Financing</p>
        <h1 className="mt-2 text-4xl font-semibold">Leasing Offer</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Ride your dream motorcycle with affordable monthly plans, low upfront costs, and easy upgrade options.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_35px_rgba(15,23,42,0.08)]"
          >
            <h2 className="text-xl font-semibold text-slate-900">{plan.title}</h2>
            <p className="mt-2 text-2xl font-bold text-sky-600">{plan.monthly}</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              <li>Duration: {plan.duration}</li>
              <li>Down payment: {plan.downPayment}</li>
              <li>Mileage: {plan.mileage}</li>
              <li>Insurance support included</li>
            </ul>
            <Link
              to="/contact-us"
              className="mt-5 inline-flex rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Enquire this plan
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
