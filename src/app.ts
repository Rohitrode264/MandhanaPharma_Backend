import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();

app.use(helmet());

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply the rate limiting middleware to all API calls
app.use('/api', apiLimiter);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Enable CORS
const allowedOrigins = [
  env.frontendUrl,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Serve static uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
