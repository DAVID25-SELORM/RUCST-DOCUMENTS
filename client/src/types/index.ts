export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  _id: string;
  title: string;
  description?: string;
  department: string;
  category: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: User;
  tags: string[];
  year: number;
  version: number;
  previousVersions: DocumentVersion[];
  status: 'active' | 'archived' | 'deleted';
  accessLevel: 'public' | 'restricted' | 'confidential';
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentVersion {
  version: number;
  filePath: string;
  uploadedAt: Date;
  uploadedBy: User;
}

export interface AuditLog {
  _id: string;
  user: User;
  action: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'share' | 'login' | 'logout';
  resource: 'document' | 'user' | 'system';
  resourceId?: string;
  department: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  role?: string;
}

export interface DocumentStats {
  total: number;
  totalSize: number;
  byCategory: Array<{ category: string; count: number }>;
}
