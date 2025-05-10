// routes/user.routes.js
import express from 'express';
import { 
  updateUser, 
  getPDFsByStandard, 
  submitContactForm, 
  getNotifications 
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// PUT /api/users/:userId - Update user profile
router.put('/update-user/:userId', verifyToken, updateUser);

// GET /api/users/:standard/PDFs - Get PDFs by standard with pagination
router.get('/:standard/PDFs', verifyToken, getPDFsByStandard);

// POST /api/users/contact - Submit contact form
router.post('/contact', submitContactForm);

// GET /api/users/notification/:userId - Get notifications
router.get('/notification/:userId', verifyToken, getNotifications);

export default router;