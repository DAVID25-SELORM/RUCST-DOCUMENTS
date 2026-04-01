import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['upload', 'view', 'download', 'edit', 'delete', 'share', 'login', 'logout']
  },
  resource: {
    type: String,
    required: true,
    enum: ['document', 'user', 'system']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  department: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  }
}, {
  timestamps: true
});

// Index for better query performance
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ department: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
