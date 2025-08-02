// routes/auth.js
import express from 'express';
import { Signup, login } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/signup
router.post('/signup', Signup);

// @route   POST /api/auth/login
router.post('/login', login);

export default router;
