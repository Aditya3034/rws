// app.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*", // process.env.CLIENT_URL,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);

app.get('*', (req, res) => {
  res.status(200).json({ message: 'Hello'})
});


// Error handling middleware
app.use(errorMiddleware);

export default app;
