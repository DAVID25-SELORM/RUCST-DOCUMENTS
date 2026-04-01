import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { formatBytes, formatDate } from '../lib/utils';
import { Document } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  FileText, 
  Download, 
  Eye, 
  Search as SearchIcon,
  Calendar,
  Tag
} from 'lucide-react';

interface DocumentsProps {
  mode?: 'browse' | 'search';
}

export default function Documents({ mode = 'browse' }: DocumentsProps) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const isSearchPage = mode === 'search';

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter, yearFilter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (yearFilter) params.append('year', yearFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/documents?${params.toString()}`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await api.get(`/documents/${doc._id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  const categories = [...new Set(documents.map(d => d.category))];
  const years = [...new Set(documents.map(d => d.year))].sort((a, b) => b - a);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {isSearchPage ? 'Search Documents' : 'Documents'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            {isSearchPage
              ? 'Search by title, category, year, and tags across your accessible documents'
              : 'Browse and manage your documents'}
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/upload')} className="self-start sm:self-auto">
          <FileText className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Upload New</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={isSearchPage ? 'Search by title or keyword...' : 'Search documents...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                    autoFocus={isSearchPage}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Search</Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSearchPage ? `Search Results (${documents.length})` : `All Documents (${documents.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 w-20 bg-gray-200 rounded"></div>
                    <div className="h-9 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {isSearchPage ? 'No matching documents found' : 'No documents found'}
              </p>
              <p className="text-sm mt-1">
                {isSearchPage ? 'Try a different keyword or broaden your filters' : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-0"
                >
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
                    <div className="bg-white p-2 sm:p-3 rounded-lg border flex-shrink-0">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate text-sm sm:text-base">{doc.title}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="truncate">{formatDate(doc.createdAt)}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatBytes(doc.fileSize)}</span>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="truncate">{doc.category}</span>
                        </div>
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/documents/${doc._id}`)}
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                    >
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
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
