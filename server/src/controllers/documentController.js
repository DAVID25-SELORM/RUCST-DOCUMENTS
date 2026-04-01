import Document from '../models/Document.js';
import AuditLog from '../models/AuditLog.js';
import fs from 'fs';
import path from 'path';

// @desc    Upload document
// @route   POST /api/documents
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const {
      title,
      description,
      department,
      category,
      documentType,
      tags,
      year,
      accessLevel
    } = req.body;

    const document = await Document.create({
      title,
      description,
      department,
      category,
      documentType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      year: year || new Date().getFullYear(),
      accessLevel: accessLevel || 'restricted'
    });

    // Log the upload
    await AuditLog.create({
      user: req.user._id,
      action: 'upload',
      resource: 'document',
      resourceId: document._id,
      department,
      details: `Uploaded document: ${title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all documents for user's department
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res) => {
  try {
    const { department, category, year, search, page = 1, limit = 20 } = req.query;

    let query = { status: 'active' };

    // Department filter
    if (req.user.role !== 'super_admin') {
      query.department = req.user.department;
    } else if (department) {
      query.department = department;
    }

    // Additional filters
    if (category) query.category = category;
    if (year) query.year = parseInt(year);

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Document.countDocuments(query);

    res.json({
      documents,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName email')
      .populate('previousVersions.uploadedBy', 'firstName lastName');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check department access
    if (req.user.role !== 'super_admin' && document.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Log the view
    await AuditLog.create({
      user: req.user._id,
      action: 'view',
      resource: 'document',
      resourceId: document._id,
      department: document.department,
      details: `Viewed document: ${document.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Private
export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check department access
    if (req.user.role !== 'super_admin' && document.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Log the download
    await AuditLog.create({
      user: req.user._id,
      action: 'download',
      resource: 'document',
      resourceId: document._id,
      department: document.department,
      details: `Downloaded document: ${document.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.download(document.filePath, document.fileName);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document or is admin
    if (document.uploadedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized to update this document' });
    }

    // If new file is uploaded, save old version
    if (req.file) {
      document.previousVersions.push({
        version: document.version,
        filePath: document.filePath,
        uploadedAt: document.updatedAt,
        uploadedBy: document.uploadedBy
      });

      document.version += 1;
      document.fileName = req.file.originalname;
      document.filePath = req.file.path;
      document.fileSize = req.file.size;
      document.mimeType = req.file.mimetype;
    }

    // Update other fields
    const allowedUpdates = ['title', 'description', 'category', 'documentType', 'tags', 'accessLevel'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'tags' && typeof req.body[field] === 'string') {
          document[field] = req.body[field].split(',').map(tag => tag.trim());
        } else {
          document[field] = req.body[field];
        }
      }
    });

    const updatedDocument = await document.save();

    // Log the edit
    await AuditLog.create({
      user: req.user._id,
      action: 'edit',
      resource: 'document',
      resourceId: document._id,
      department: document.department,
      details: `Updated document: ${document.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document or is admin
    if (document.uploadedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    // Soft delete
    document.status = 'deleted';
    await document.save();

    // Log the deletion
    await AuditLog.create({
      user: req.user._id,
      action: 'delete',
      resource: 'document',
      resourceId: document._id,
      department: document.department,
      details: `Deleted document: ${document.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get document statistics
// @route   GET /api/documents/stats
// @access  Private
export const getDocumentStats = async (req, res) => {
  try {
    const department = req.user.role === 'super_admin' ? req.query.department : req.user.department;
    
    const stats = await Document.aggregate([
      { $match: { department, status: 'active' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          byCategory: {
            $push: {
              category: '$category',
              count: 1
            }
          }
        }
      }
    ]);

    res.json(stats[0] || { total: 0, totalSize: 0, byCategory: [] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
