import { useEffect, useMemo, useState } from 'react';
import { Activity as ActivityIcon, FileText, LogIn, Shield } from 'lucide-react';
import api from '../lib/api';
import { formatDate, getDepartmentName } from '../lib/utils';
import { AuditLog } from '../types';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const ACTION_OPTIONS = [
  { label: 'All Activity', value: '' },
  { label: 'Uploads', value: 'upload' },
  { label: 'Downloads', value: 'download' },
  { label: 'Views', value: 'view' },
  { label: 'Edits', value: 'edit' },
  { label: 'Logins', value: 'login' },
];

const actionStyles: Record<string, string> = {
  upload: 'bg-blue-100 text-blue-700',
  download: 'bg-green-100 text-green-700',
  view: 'bg-slate-100 text-slate-700',
  edit: 'bg-amber-100 text-amber-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-purple-100 text-purple-700',
  logout: 'bg-gray-100 text-gray-700',
  share: 'bg-cyan-100 text-cyan-700',
};

export default function Activity() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({ limit: '50' });
        if (actionFilter) {
          params.append('action', actionFilter);
        }

        const response = await api.get(`/auth/activity?${params.toString()}`);
        setLogs(response.data.logs);
      } catch (error) {
        console.error('Error fetching activity feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [actionFilter]);

  const title = user?.role === 'super_admin'
    ? 'System Activity'
    : user?.role === 'admin'
      ? 'Department Activity'
      : 'My Activity';

  const description = user?.role === 'super_admin'
    ? 'Review the latest actions happening across every department.'
    : user?.role === 'admin'
      ? `Recent activity for the ${getDepartmentName(user.department)} department.`
      : 'A timeline of your recent document and login activity.';

  const summary = useMemo(() => {
    const uploads = logs.filter((log) => log.action === 'upload').length;
    const documentActions = logs.filter((log) =>
      ['upload', 'download', 'view', 'edit', 'delete'].includes(log.action)
    ).length;
    const logins = logs.filter((log) => log.action === 'login').length;

    return [
      {
        label: 'Events Shown',
        value: logs.length,
        icon: ActivityIcon,
        color: 'bg-blue-500',
      },
      {
        label: 'Document Actions',
        value: documentActions,
        icon: FileText,
        color: 'bg-green-500',
      },
      {
        label: 'Logins',
        value: logins,
        icon: LogIn,
        color: 'bg-purple-500',
      },
      {
        label: 'Uploads',
        value: uploads,
        icon: Shield,
        color: 'bg-orange-500',
      },
    ];
  }, [logs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">{description}</p>
        </div>

        <div className="w-full md:w-60">
          <select
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {ACTION_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                <div className={`${item.color} rounded-lg p-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Timeline</CardTitle>
          <CardDescription>Newest activity appears first.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading activity...</div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No activity recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                          actionStyles[log.action] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                    </div>

                    <p className="font-medium text-gray-900">{log.details || 'Activity recorded'}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>
                        User:{' '}
                        {log.user
                          ? `${log.user.firstName} ${log.user.lastName}`
                          : 'Deleted user'}
                      </span>
                      <span>Department: {getDepartmentName(log.department)}</span>
                      <span className="capitalize">Status: {log.status}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 lg:text-right">
                    <div>{new Date(log.createdAt).toLocaleTimeString()}</div>
                    <div className="mt-1 capitalize">{log.resource}</div>
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
