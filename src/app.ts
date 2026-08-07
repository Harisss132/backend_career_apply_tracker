import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import { env } from './config/env.js';
import authRoutes from './routes/auth.route.js';
import { generalRateLimit } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config()

const app = express();

app.use(helmet());
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(cors({
    origin: env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}))
app.use(generalRateLimit);

app.use('/api/auth', authRoutes);

app.use(errorHandler)

export default app;