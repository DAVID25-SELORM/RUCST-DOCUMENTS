import { useMemo, useState } from 'react';
import { Lock, Save, ShieldCheck, UserCircle2 } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { getDepartmentName } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Settings() {
  const { user, setAuth, token } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const accountSummary = useMemo(
    () => [
      { label: 'Department', value: getDepartmentName(user?.department || '') },
      { label: 'Role', value: user?.role ? user.role.replace('_', ' ') : 'Unknown' },
      { label: 'Email', value: user?.email || 'Unknown' },
    ],
    [user]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !token) {
      setError('Your session is missing. Please log in again.');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload: Record<string, string> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const response = await api.put('/auth/profile', payload);
      const { token: newToken, ...updatedUser } = response.data;
      setAuth({ ...user, ...updatedUser } as User, newToken || token);
      setForm((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
      setSuccess('Settings updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to save your changes right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Update your profile details and login credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCircle2 className="h-5 w-5 text-blue-600" />
              Account Overview
            </CardTitle>
            <CardDescription>Read-only account details for this admin profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountSummary.map((item) => (
              <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-1 font-medium capitalize text-gray-900">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              Profile & Security
            </CardTitle>
            <CardDescription>Change your display information and password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              ) : null}

              {success ? (
                <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={saving}
                      className="pl-10"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
