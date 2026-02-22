import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import type { User, UserRole } from '../types';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; users: User[] }>('/auth/users');
      setUsers(response.data.users);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditRole = (user: User) => {
    setEditingId(user._id);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async (userId: string) => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: selectedRole });
      await fetchUsers();
      setEditingId(null);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/auth/users/${userId}`);
      await fetchUsers();
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1>Manage Users</h1>
        <p className="text-sm text-slate-600">View and manage user accounts and roles</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || '-'}</td>
                  <td className="px-4 py-3">
                    {editingId === user._id ? (
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          user.role === 'admin'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingId === user._id ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => handleSaveRole(user._id)}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => handleEditRole(user)}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <h3 className="mb-4 text-lg font-semibold">Statistics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-2xl font-semibold text-slate-900">{users.length}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Total Users</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-2xl font-semibold text-emerald-600">
              {users.filter((u) => u.role === 'admin').length}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Administrators</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-2xl font-semibold text-sky-600">
              {users.filter((u) => u.role === 'user').length}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Regular Users</div>
          </div>
        </div>
      </div>
    </section>
  );
}
