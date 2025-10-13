import express from 'express';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/upload/profile-picture

router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

export default router;

