import express from 'express';
import {
  register,
  login,
  getMe,
  getActivityFeed,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/activity', protect, getActivityFeed);
router.put('/profile', protect, updateProfile);

export default router;
