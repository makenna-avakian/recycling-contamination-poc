import { Request, Response } from 'express';
import { OllamaService } from '../../infrastructure/services/OllamaService';

/**
 * Presentation Layer: AI Generation Controller
 * Handles HTTP requests/responses for AI-powered content generation
 */
export class AIGenerationController {
  private ollamaService: OllamaService;

  constructor() {
    this.ollamaService = new OllamaService();
  }

  async generateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { contaminationType } = req.body;

      if (!contaminationType || typeof contaminationType !== 'string') {
        res.status(400).json({ error: 'contaminationType is required' });
        return;
      }

      // Check if Ollama is available
      const isAvailable = await this.ollamaService.isAvailable();
      if (!isAvailable) {
        res.status(503).json({ 
          error: 'Ollama service is not available',
          message: 'Please ensure Ollama is running: ollama serve'
        });
        return;
      }

      const result = await this.ollamaService.generateEmail(contaminationType);
      res.json(result);
    } catch (error: unknown) {
      console.error('Error generating email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for timeout errors
      if (errorMessage.includes('timeout') || errorMessage.includes('ECONNABORTED')) {
        res.status(504).json({ 
          error: 'Request timed out',
          message: 'AI generation is taking too long. Please try again.'
        });
        return;
      }

      res.status(500).json({ 
        error: 'Failed to generate email',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }

  async generateCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { contaminationType, trendInfo } = req.body;

      // Check if Ollama is available
      const isAvailable = await this.ollamaService.isAvailable();
      if (!isAvailable) {
        res.status(503).json({ 
          error: 'Ollama service is not available',
          message: 'Please ensure Ollama is running: ollama serve'
        });
        return;
      }

      const result = await this.ollamaService.generateCampaignJson(
        contaminationType,
        trendInfo
      );
      res.json(result);
    } catch (error: unknown) {
      console.error('Error generating campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for timeout errors
      if (errorMessage.includes('timeout') || errorMessage.includes('ECONNABORTED')) {
        res.status(504).json({ 
          error: 'Request timed out',
          message: 'AI generation is taking too long. Please try again.'
        });
        return;
      }

      res.status(500).json({ 
        error: 'Failed to generate campaign',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const isAvailable = await this.ollamaService.isAvailable();
      res.json({
        available: isAvailable,
        model: process.env.OLLAMA_MODEL || 'llama2',
        url: process.env.OLLAMA_URL || 'http://localhost:11434'
      });
    } catch (error: unknown) {
      console.error('Error checking Ollama status:', error);
      res.json({
        available: false,
        model: process.env.OLLAMA_MODEL || 'llama2',
        url: process.env.OLLAMA_URL || 'http://localhost:11434',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
