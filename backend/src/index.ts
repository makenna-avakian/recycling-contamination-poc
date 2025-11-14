import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createContaminationRoutes } from './presentation/routes/contaminationRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { contaminationController } from './infrastructure/config/dependencies';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/contamination', createContaminationRoutes(contaminationController));

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Contamination API: http://localhost:${PORT}/api/contamination`);
});

