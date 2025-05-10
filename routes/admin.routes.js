// routes/admin.routes.js
import express from 'express';
import { uploadPDF, editPDF, deletePDF } from '../controllers/admin.controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

const router = express.Router();

// POST /api/admin/upload-pdf - Upload a new PDF
router.post('/upload-pdf', verifyToken, verifyAdmin, upload.single('pdfFile'), uploadPDF);

// PUT /api/admin/edit-pdf/:pdfId - Edit an existing PDF
router.put('/edit-pdf/:pdfId', verifyToken, verifyAdmin, upload.single('pdfFile'), editPDF);

// DELETE /api/admin/remove-pdf/:pdfId - Delete a PDF
router.delete('/remove-pdf/:pdfId', verifyToken, verifyAdmin, deletePDF);

export default router;