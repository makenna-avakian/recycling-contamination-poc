import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createContaminationRoutes } from './presentation/routes/contaminationRoutes';
import { createAIRoutes } from './presentation/routes/aiRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { contaminationController } from './infrastructure/config/dependencies';
import { AIGenerationController } from './presentation/controllers/AIGenerationController';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/contamination', createContaminationRoutes(contaminationController));
app.use('/api/ai', createAIRoutes(new AIGenerationController()));

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Contamination API: http://localhost:${PORT}/api/contamination`);
});

