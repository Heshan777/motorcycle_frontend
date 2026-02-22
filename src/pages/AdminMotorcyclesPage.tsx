import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import { isSupabaseConfigured, supabase, supabaseStorageBucket, resolveMotorcycleImageUrl } from '../lib/supabase';
import type { Motorcycle, MotorcycleCategory, MotorcycleStatus } from '../types';

interface MotorcycleFormData {
  name: string;
  slug: string;
  brand: string;
  category: MotorcycleCategory;
  price: number;
  engine: string;
  horsepower: number;
  torque: number;
  topSpeed: number;
  mileage: number;
  stock: number;
  status: MotorcycleStatus;
  isFeatured: boolean;
  description: string;
  images: string;
}

const initialFormData: MotorcycleFormData = {
  name: '',
  slug: '',
  brand: '',
  category: 'sport',
  price: 0,
  engine: '',
  horsepower: 0,
  torque: 0,
  topSpeed: 0,
  mileage: 0,
  stock: 0,
  status: 'available',
  isFeatured: false,
  description: '',
  images: '',
};

export function AdminMotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MotorcycleFormData>(initialFormData);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState('');

  const imageUrls = formData.images
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; motorcycles: Motorcycle[] }>(
        '/motorcycles?limit=1000'
      );
      setMotorcycles(response.data.motorcycles);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        images: imageUrls,
      };

      if (editingId) {
        await api.put(`/motorcycles/${editingId}`, payload);
      } else {
        await api.post('/motorcycles', payload);
      }

      await fetchMotorcycles();
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setImageUploadMessage('Configure Supabase environment variables to upload images.');
      event.target.value = '';
      return;
    }

    try {
      setImageUploadLoading(true);
      setImageUploadMessage('');

      const files = Array.from(fileList);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const extension = file.name.split('.').pop() || 'jpg';
        const safeName = file.name
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 8);
        const folder = formData.slug?.trim() || 'uncategorized';
        const path = `${folder}/${timestamp}-${random}-${safeName}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(supabaseStorageBucket)
          .upload(path, file, { upsert: false, contentType: file.type });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(path);
        if (data.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      setFormData((prev) => {
        const next = prev.images
          ? `${prev.images}\n${uploadedUrls.join('\n')}`
          : uploadedUrls.join('\n');
        return { ...prev, images: next };
      });

      setImageUploadMessage(`${uploadedUrls.length} image(s) uploaded successfully.`);
    } catch (uploadError) {
      setImageUploadMessage(getErrorMessage(uploadError));
    } finally {
      setImageUploadLoading(false);
      event.target.value = '';
    }
  };

  const removeImage = (urlToRemove: string) => {
    setFormData((prev) => {
      const next = prev.images
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url && url !== urlToRemove)
        .join('\n');
      return {
        ...prev,
        images: next,
      };
    });
  };

  const handleEdit = (motorcycle: Motorcycle) => {
    setEditingId(motorcycle._id);
    setFormData({
      name: motorcycle.name,
      slug: motorcycle.slug,
      brand: motorcycle.brand,
      category: motorcycle.category,
      price: motorcycle.price,
      engine: motorcycle.engine,
      horsepower: motorcycle.horsepower,
      torque: motorcycle.torque,
      topSpeed: motorcycle.topSpeed,
      mileage: motorcycle.mileage,
      stock: motorcycle.stock,
      status: motorcycle.status,
      isFeatured: motorcycle.isFeatured,
      description: motorcycle.description,
      images: motorcycle.images.join('\n'),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this motorcycle?')) {
      return;
    }

    try {
      await api.delete(`/motorcycles/${id}`);
      await fetchMotorcycles();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData);
    setError('');
    setImageUploadMessage('');
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p>Loading motorcycles...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Manage Motorcycles</h1>
          <p className="text-sm text-slate-600">Create, update, and manage inventory.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add New Motorcycle
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2 className="mb-4 text-2xl font-semibold">
            {editingId ? 'Edit Motorcycle' : 'Add New Motorcycle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Name *
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Slug *
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Brand *
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Category *
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="sport">Sport</option>
                  <option value="cruiser">Cruiser</option>
                  <option value="adventure">Adventure</option>
                  <option value="scooter">Scooter</option>
                  <option value="electric">Electric</option>
                  <option value="commuter">Commuter</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Price *
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Engine *
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Horsepower
                <input
                  type="number"
                  name="horsepower"
                  value={formData.horsepower}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Torque
                <input
                  type="number"
                  name="torque"
                  value={formData.torque}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Top Speed (km/h)
                <input
                  type="number"
                  name="topSpeed"
                  value={formData.topSpeed}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Mileage (km/l)
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Stock
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Status *
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="available">Available</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              Featured Motorcycle
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="min-h-27.5 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </label>

            <div className="space-y-3">
              <span className="text-sm font-semibold">Motorcycle Images</span>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={imageUploadLoading}
                    className="text-sm"
                  />
                  {imageUploadLoading && <span className="text-sm">Uploading images...</span>}
                  {!isSupabaseConfigured && (
                    <span className="text-sm text-amber-700">
                      Supabase not configured. Add env variables to enable upload.
                    </span>
                  )}
                </div>

                {imageUploadMessage && (
                  <p
                    className={`mt-3 text-sm font-medium ${
                      imageUploadMessage.includes('successfully') ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {imageUploadMessage}
                  </p>
                )}

                {imageUrls.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {imageUrls.map((url) => (
                      <div key={url} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img
                          src={resolveMotorcycleImageUrl(url)}
                          alt="Uploaded motorcycle"
                          className="h-28 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="w-full rounded-none bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  name="images"
                  value={formData.images}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Uploaded image URLs appear here automatically"
                  className="mt-4 min-h-27.5 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-xs shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitLoading}
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {submitLoading ? 'Saving...' : editingId ? 'Update Motorcycle' : 'Add Motorcycle'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {motorcycles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No motorcycles found. Add your first motorcycle above.
                </td>
              </tr>
            ) : (
              motorcycles.map((motorcycle) => (
                <tr key={motorcycle._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{motorcycle.name}</div>
                    <div className="text-xs text-slate-500">{motorcycle.slug}</div>
                  </td>
                  <td className="px-4 py-3">{motorcycle.brand}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {motorcycle.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">${motorcycle.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{motorcycle.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        motorcycle.status === 'available'
                          ? 'bg-emerald-100 text-emerald-700'
                          : motorcycle.status === 'upcoming'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {motorcycle.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleEdit(motorcycle)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(motorcycle._id)}
                        className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
