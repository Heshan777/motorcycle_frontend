import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../lib/api';

export function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const avatarStorageKey = useMemo(() => {
    if (!user?._id) return '';
    return `profile-avatar-${user._id}`;
  }, [user?._id]);

  useEffect(() => {
    if (!user) return;

    const storedAvatar = avatarStorageKey ? localStorage.getItem(avatarStorageKey) : null;
    setAvatarPreview(user.avatarUrl || storedAvatar || '');
  }, [avatarStorageKey, user]);

  const getInitials = () => {
    if (!user?.name?.trim()) return 'U';

    const parts = user.name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError('');

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please upload a valid image file.');
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setAvatarError('Image must be 2MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setProfileSaving(true);
      setProfileMessage('');
      await api.put('/auth/me', {
        name: formData.get('name'),
        phone: formData.get('phone'),
        avatarUrl: avatarPreview || null,
      });

      if (avatarStorageKey) {
        if (avatarPreview) {
          localStorage.setItem(avatarStorageKey, avatarPreview);
        } else {
          localStorage.removeItem(avatarStorageKey);
        }
      }

      await refreshMe();
      setProfileMessage('Profile updated successfully.');
    } catch (error) {
      setProfileMessage(getErrorMessage(error));
    } finally {
      setProfileSaving(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setPasswordSaving(true);
      setPasswordMessage('');
      await api.put('/auth/change-password', {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
      });
      setPasswordMessage('Password changed successfully.');
      event.currentTarget.reset();
    } catch (error) {
      setPasswordMessage(getErrorMessage(error));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <section className="space-y-6 animate-in fade-in">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-sky-200/30 blur-2xl" aria-hidden="true" />
        <div className="relative z-10 flex flex-wrap items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/70 bg-slate-200 shadow-md">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sky-500 text-xl font-bold text-white">
                {getInitials()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
            <p className="text-sm text-slate-600">Manage your profile details, photo, and password securely.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="animate-in fade-in slide-in-from-bottom-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2 className="mb-1 text-lg font-bold text-slate-900">Update Profile</h2>
          <p className="mb-5 text-sm text-slate-600">Keep your details up to date for better booking experience.</p>

          <form className="grid gap-4" onSubmit={updateProfile}>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Profile Image</label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-lg font-semibold text-slate-600">
                      {getInitials()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    id="profile-avatar-input"
                  />
                  <label
                    htmlFor="profile-avatar-input"
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 hover:shadow-md"
                  >
                    Upload Image
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:-translate-y-0.5 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 2MB.</p>
              {avatarError && <p className="text-xs font-medium text-red-600">{avatarError}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                defaultValue={user?.name || ''}
                name="name"
                required
                placeholder="Name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                value={user?.email || ''}
                disabled
                readOnly
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                defaultValue={user?.phone || ''}
                name="phone"
                placeholder="Phone"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="mt-1 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          {profileMessage && (
            <p className={`mt-4 text-sm font-medium ${profileMessage.toLowerCase().includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
              {profileMessage}
            </p>
          )}
        </article>

        <article className="animate-in fade-in slide-in-from-bottom-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2 className="mb-1 text-lg font-bold text-slate-900">Change Password</h2>
          <p className="mb-5 text-sm text-slate-600">Use a strong password to keep your account safe.</p>

          <form className="grid gap-4" onSubmit={changePassword}>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Current Password</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                name="currentPassword"
                required
                type="password"
                placeholder="Current password"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                name="newPassword"
                required
                minLength={6}
                type="password"
                placeholder="New password"
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="mt-1 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {passwordMessage && (
            <p className={`mt-4 text-sm font-medium ${passwordMessage.toLowerCase().includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
              {passwordMessage}
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
