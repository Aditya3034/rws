// routes/auth.routes.js
import express from 'express';
import { signup, signin, google, signout, verifyEmail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/verify-email/:verificationCode', verifyEmail);
router.get('/signout', signout);

export default router;