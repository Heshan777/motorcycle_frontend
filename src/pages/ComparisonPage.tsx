import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import type { Motorcycle } from '../types';
import { PremiumMotorcycleCard } from '../components/PremiumMotorcycleCard';

interface MotorcyclesResponse {
  success: boolean;
  total: number;
  motorcycles: Motorcycle[];
}

export function ComparisonPage() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAllMotorcycles = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<MotorcyclesResponse>('/motorcycles?limit=100');
      setMotorcycles(response.data.motorcycles);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.size >= 3 && !selectedIds.has(id)) {
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selected = motorcycles.filter((m) => selectedIds.has(m._id));

  if (motorcycles.length === 0 && !loading) {
    loadAllMotorcycles();
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-slate-50 p-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Compare Motorcycles</h1>
        <p className="mt-2 text-slate-600">Select up to 3 motorcycles to compare side-by-side specifications</p>
        {selectedIds.size > 0 && (
          <p className="mt-3 text-sm font-semibold text-sky-600">
            {selectedIds.size} of 3 selected
          </p>
        )}
      </div>

      {selectedIds.size > 0 && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-4 text-left font-bold text-slate-900 sticky left-0 bg-slate-50">Specification</th>
                {selected.map((m) => (
                  <th key={m._id} className="px-4 py-4 text-center">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">{m.brand}</div>
                    <p className="font-bold text-slate-900">{m.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Price', key: 'price', format: (v: number) => `$${v.toLocaleString()}` },
                { label: 'Category', key: 'category', format: (v: string) => v },
                { label: 'Horsepower', key: 'horsepower', format: (v: number) => `${v} hp` },
                { label: 'Torque', key: 'torque', format: (v: number) => `${v} Nm` },
                { label: 'Top Speed', key: 'topSpeed', format: (v: number) => `${v} km/h` },
                { label: 'Mileage', key: 'mileage', format: (v: number) => `${v} kmpl` },
                { label: 'Engine', key: 'engine', format: (v: string) => v },
              ].map((spec) => (
                <tr key={spec.key} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-4 font-semibold text-slate-900 sticky left-0 bg-white">
                    {spec.label}
                  </td>
                  {selected.map((m) => (
                    <td
                      key={m._id}
                      className="px-4 py-4 text-center text-slate-700 font-medium bg-white"
                    >
                      {spec.format((m[spec.key as keyof Motorcycle] as unknown) as never)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {loading ? 'Loading motorcycles...' : `${motorcycles.length} motorcycles available`}
        </h2>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {motorcycles.map((motorcycle) => (
            <PremiumMotorcycleCard
              key={motorcycle._id}
              motorcycle={motorcycle}
              isComparisonMode
              isSelected={selectedIds.has(motorcycle._id)}
              onComparisonToggle={toggleSelection}
            />
          ))}
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-5 right-5 flex gap-3 z-40">
          <button
            onClick={() => setSelectedIds(new Set())}
            className="rounded-full bg-white border border-slate-200 px-6 py-3 font-semibold text-slate-900 shadow-lg hover:bg-slate-50 transition"
          >
            Clear
          </button>
          <button
            onClick={() => {
              const ids = Array.from(selectedIds).join(',');
              navigate(`/?compare=${ids}`);
            }}
            className="rounded-full bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-sky-600 transition"
          >
            View Comparison
          </button>
        </div>
      )}
    </section>
  );
}
