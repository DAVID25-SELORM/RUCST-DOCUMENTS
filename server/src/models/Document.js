import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['registry', 'accounts', 'quality_assurance', 'presidency', 'vp_academics']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  documentType: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    version: Number,
    filePath: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  accessLevel: {
    type: String,
    enum: ['public', 'restricted', 'confidential'],
    default: 'restricted'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for better search performance
documentSchema.index({ title: 'text', description: 'text', tags: 'text' });
documentSchema.index({ department: 1, category: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ year: 1 });

export default mongoose.model('Document', documentSchema);
