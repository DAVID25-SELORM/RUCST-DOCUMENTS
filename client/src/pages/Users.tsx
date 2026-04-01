import { useEffect, useState } from 'react';
import { Shield, UserCheck, UserX, Users as UsersIcon } from 'lucide-react';
import api from '../lib/api';
import { formatDate, getDepartmentName } from '../lib/utils';
import { User } from '../types';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const departmentOptions = [
  { label: 'All Departments', value: '' },
  { label: 'Registry', value: 'registry' },
  { label: 'Accounts', value: 'accounts' },
  { label: 'Quality Assurance', value: 'quality_assurance' },
  { label: 'Presidency', value: 'presidency' },
  { label: 'VP Academics', value: 'vp_academics' },
  { label: 'Administration', value: 'admin' },
];

export default function Users() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isManager) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams({ limit: '100' });
        if (roleFilter) {
          params.append('role', roleFilter);
        }

        if (currentUser?.role === 'super_admin' && departmentFilter) {
          params.append('department', departmentFilter);
        }

        const response = await api.get(`/admin/users?${params.toString()}`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.role, departmentFilter, isManager, roleFilter]);

  const handleToggleStatus = async (targetUser: User) => {
    if (!isManager || targetUser._id === currentUser?._id) {
      return;
    }

    setUpdatingId(targetUser._id);

    try {
      const response = await api.put(`/admin/users/${targetUser._id}`, {
        isActive: !targetUser.isActive,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === targetUser._id ? response.data : user))
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isManager) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-10 text-center text-gray-500">
            You do not have permission to manage users.
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeUsers = users.filter((user) => user.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Users</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            {currentUser?.role === 'super_admin'
              ? 'Manage user access across every department.'
              : `Manage users in the ${getDepartmentName(currentUser?.department || '')} department.`}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto">
          {currentUser?.role === 'super_admin' ? (
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="flex h-10 min-w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {departmentOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="flex h-10 min-w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="super_admin">Super Admins</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length - activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Review roles, departments, and access status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No users matched the selected filters.</div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 xl:flex-row xl:items-center xl:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{user.email}</span>
                      <span>{getDepartmentName(user.department)}</span>
                      <span>Joined {formatDate(user.createdAt)}</span>
                      <span>
                        Last login {user.lastLogin ? formatDate(user.lastLogin) : 'Not recorded'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={user.isActive ? 'outline' : 'default'}
                      onClick={() => handleToggleStatus(user)}
                      disabled={updatingId === user._id || user._id === currentUser?._id}
                    >
                      {user.isActive ? 'Deactivate' : 'Reactivate'}
                    </Button>
                    <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      {user._id === currentUser?._id ? 'Current user' : 'Managed account'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
