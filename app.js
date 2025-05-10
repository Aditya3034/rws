// app.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import apiDocumentation from './documentation/api-docs.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*", // process.env.CLIENT_URL,
  credentials: true
}));

app.get('/', (req, res) => {
  res.status(200).json(apiDocumentation);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // Added user routes
app.use('/api/admin', adminRoutes); // Added admin routes

// 404 route
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;