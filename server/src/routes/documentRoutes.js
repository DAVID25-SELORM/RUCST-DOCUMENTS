import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  downloadDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, getDocuments)
  .post(protect, upload.single('file'), uploadDocument);

router.get('/stats', protect, getDocumentStats);

router.route('/:id')
  .get(protect, getDocumentById)
  .put(protect, upload.single('file'), updateDocument)
  .delete(protect, deleteDocument);

router.get('/:id/download', protect, downloadDocument);

export default router;
