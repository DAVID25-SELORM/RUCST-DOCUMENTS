import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  FolderOpen,
  Lock,
  Shield,
  Tag,
  User2
} from 'lucide-react';
import api from '../lib/api';
import { formatBytes, formatDate, getDepartmentName } from '../lib/utils';
import { Document } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function DocumentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError('Document not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/documents/${id}`);
        setDocument(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load this document right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDownload = async () => {
    if (!document) {
      return;
    }

    try {
      const response = await api.get(`/documents/${document._id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.fileName);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Download failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading document details...</div>;
  }

  if (error || !document) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="py-8 text-center text-red-600">{error || 'Document not found.'}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summaryItems = [
    {
      label: 'Category',
      value: document.category || 'Uncategorized',
      icon: FolderOpen,
    },
    {
      label: 'Department',
      value: getDepartmentName(document.department),
      icon: Shield,
    },
    {
      label: 'Year',
      value: document.year?.toString() || 'Not set',
      icon: Calendar,
    },
    {
      label: 'Size',
      value: formatBytes(document.fileSize),
      icon: FileText,
    },
    {
      label: 'Access',
      value: document.accessLevel,
      icon: Lock,
    },
    {
      label: 'Version',
      value: `v${document.version}`,
      icon: Tag,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button variant="outline" onClick={() => navigate('/dashboard/documents')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{document.title}</h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Uploaded on {formatDate(document.createdAt)} by{' '}
              {document.uploadedBy
                ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
                : 'Unknown user'}
            </p>
          </div>
        </div>

        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold capitalize text-gray-900">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
            <CardDescription>Core metadata and description for this file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Description</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                {document.description || 'No description has been added yet.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Original File</h2>
                <p className="mt-2 text-sm text-gray-700">{document.fileName}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Document Type</h2>
                <p className="mt-2 text-sm text-gray-700">{document.documentType || 'Not specified'}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Uploaded By</h2>
                <p className="mt-2 text-sm text-gray-700">
                  {document.uploadedBy
                    ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
                    : 'Unknown user'}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Last Updated</h2>
                <p className="mt-2 text-sm text-gray-700">{formatDate(document.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags & History</CardTitle>
            <CardDescription>Quick context for searchability and version tracking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Tags</h2>
              {document.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No tags added.</p>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Version History</h2>
              {document.previousVersions.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {document.previousVersions.map((version) => (
                    <div key={`${version.version}-${version.filePath}`} className="rounded-lg border p-3">
                      <p className="font-medium text-gray-900">Version {version.version}</p>
                      <p className="mt-1 text-sm text-gray-600">{formatDate(version.uploadedAt)}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {version.uploadedBy
                          ? `${version.uploadedBy.firstName} ${version.uploadedBy.lastName}`
                          : 'Uploaded by previous user'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">This is the first saved version.</p>
              )}
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">MIME Type</span>
              </div>
              <p className="mt-2 break-all text-sm text-gray-600">{document.mimeType}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
