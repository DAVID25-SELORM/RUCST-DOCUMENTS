import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getDepartmentName, formatBytes } from '../lib/utils';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Upload, TrendingUp, Clock, Activity, Search } from 'lucide-react';
import { Document, DocumentStats } from '../types';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, docsRes] = await Promise.all([
        api.get('/documents/stats'),
        api.get('/documents?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentDocuments(docsRes.data.documents);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Documents',
      value: stats?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Storage Used',
      value: stats ? formatBytes(stats.totalSize) : '0 Bytes',
      icon: Upload,
      color: 'bg-green-500',
    },
    {
      title: 'Recent Activity',
      value: recentDocuments.length,
      icon: Activity,
      color: 'bg-purple-500',
    },
    {
      title: 'This Month',
      value: recentDocuments.filter((d: Document) => {
        const date = new Date(d.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          {getDepartmentName(user?.department || '')} Department Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 animate-in fade-in duration-500">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} p-1.5 sm:p-2 rounded-lg`}>
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your recently uploaded or modified documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No documents yet</p>
              <p className="text-sm mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div
                  key={doc._id}
                  className="flex cursor-pointer flex-col gap-2 rounded-lg bg-gray-50 p-2.5 transition-colors hover:bg-gray-100 sm:flex-row sm:items-center sm:gap-0 sm:p-3"
                  onClick={() => navigate(`/dashboard/documents/${doc._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      navigate(`/dashboard/documents/${doc._id}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="bg-white p-1.5 sm:p-2 rounded border flex-shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base">{doc.title}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatBytes(doc.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 py-0.5 sm:py-1 rounded self-start sm:self-auto whitespace-nowrap">
                    {doc.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                Secure document storage
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                Access control and permissions
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                Version control for documents
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                Full audit trail logging
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard/upload')}
              className="flex w-full items-center gap-3 rounded-lg bg-blue-50 p-3 text-left text-blue-900 transition-colors hover:bg-blue-100"
            >
              <Upload className="h-5 w-5" />
              <span className="font-medium">Upload New Document</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/search')}
              className="flex w-full items-center gap-3 rounded-lg bg-gray-50 p-3 text-left text-gray-900 transition-colors hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
              <span className="font-medium">Search Documents</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
