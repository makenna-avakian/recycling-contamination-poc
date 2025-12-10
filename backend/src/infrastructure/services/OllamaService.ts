import axios from 'axios';

/**
 * Service for interacting with Ollama API
 * Requires Ollama to be running locally: ollama serve
 */
export class OllamaService {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    // Default to localhost Ollama instance
    this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama2';
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, {
        timeout: 2000,
      });
      return response.status === 200;
    } catch (error: unknown) {
      return false;
    }
  }

  /**
   * Generate text using Ollama
   */
  async generate(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens ?? 300, // Reduced for faster generation
          },
        },
        {
          timeout: 90000, // 90 second timeout (Ollama can be slow, especially first request)
        }
      );

      if (response.data.response) {
        return response.data.response.trim();
      }

      throw new Error('No response from Ollama');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Ollama is not running. Please start it with: ollama serve');
        }
        if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
          throw new Error('Request timed out. Ollama may be slow or overloaded. Try again.');
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during generation');
    }
  }

  /**
   * Generate email content based on contamination type
   */
  async generateEmail(contaminationType: string): Promise<{ subject: string; body: string }> {
    const prompt = `Generate a professional email about ${contaminationType} contamination. Return ONLY valid JSON, no explanations or text before/after.

{
  "subject": "Brief subject line about ${contaminationType} contamination",
  "body": "Professional email body explaining why ${contaminationType} is contamination, why it matters (safety, cost, environment), and how to dispose properly. Be helpful and encouraging, not accusatory. Include professional closing."
}`;

    const response = await this.generate(prompt, { temperature: 0.7, maxTokens: 400 }); // Reduced for faster generation
    
    // Try to extract JSON from response
    try {
      // Remove any text before the JSON (common LLM behavior)
      // Remove markdown code blocks if present
      let cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Remove common LLM preambles (like "Sure, here's...", "Here's...", etc.)
      cleaned = cleaned.replace(/^(Sure,?\s*)?(here'?s?\s*)?(an?\s*)?(example\s*)?(professional\s*)?(email\s*)?(about\s*)?(.*?:\s*)?/i, '');
      cleaned = cleaned.replace(/^(Here'?s?\s*)?(an?\s*)?(example\s*)?(.*?:\s*)?/i, '');
      
      // Find JSON object (most reliable method)
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          subject: parsed.subject || `Important: Contamination Education - ${contaminationType}`,
          body: parsed.body || response,
        };
      }
    } catch (error: unknown) {
      // If JSON parsing fails, use the raw response
      console.warn('Failed to parse JSON from Ollama response, using raw text');
    }

    // Fallback: parse manually if JSON parsing failed
    return {
      subject: `Important: Contamination Education - ${contaminationType}`,
      body: response,
    };
  }

  /**
   * Generate campaign JSON based on contamination trends
   */
  async generateCampaignJson(contaminationType?: string, trendInfo?: string): Promise<any> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const contextInfo = contaminationType 
      ? `Focus on: ${contaminationType}. ${trendInfo || 'General contamination reduction campaign.'}`
      : 'General recycling contamination reduction campaign.';

    const prompt = `You are a waste management campaign specialist. Generate a campaign JSON structure for a recycling contamination education campaign.

Context: ${contextInfo}

Generate a campaign JSON with this exact structure:
{
  "type": "education",
  "is_shared": true,
  "subject": {
    "es": "Spanish subject",
    "en": "English subject",
    "fr": "French subject",
    "en_US": "English US subject"
  },
  "service_id": 0,
  "html_message": {
    "es": "<p>Spanish HTML message</p>",
    "en": "<p>English HTML message</p>",
    "fr": "<p>French HTML message</p>",
    "en_US": ""
  },
  "short_text_message": {
    "es": "Spanish short message",
    "en": "English short message",
    "fr": "French short message",
    "en_US": ""
  },
  "label": "Campaign label/tagline",
  "voice_message": {
    "es": "Spanish voice message",
    "en": "English voice message",
    "fr": "French voice message",
    "en_US": ""
  },
  "zones": [{"id": 0, "title": "Metro Vancouver", "name": "metro_vancouver"}],
  "meta": {"value": "contamination_reduction", "field": "campaign_type"},
  "end_at": "${endDate.toISOString()}",
  "start_at": "${startDate.toISOString()}",
  "plain_text_message": {
    "es": "Spanish plain text",
    "en": "English plain text",
    "fr": "French plain text",
    "en_US": ""
  }
}

Requirements:
- All messages should be about recycling contamination education
- Be encouraging and educational, not preachy
- Include practical tips
- Keep messages concise but informative
- Use proper HTML formatting in html_message
- Make the campaign engaging and community-focused

Return ONLY valid JSON. No explanations, no text before or after, no markdown. Start directly with { and end with }.`;

    const response = await this.generate(prompt, { temperature: 0.8, maxTokens: 1000 }); // Reduced for faster generation
    
    // Try to extract JSON from response
    try {
      // Remove any text before the JSON (common LLM behavior)
      // Remove markdown code blocks if present
      let cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Remove common LLM preambles
      cleaned = cleaned.replace(/^(Sure,?\s*)?(here'?s?\s*)?(an?\s*)?(example\s*)?(professional\s*)?(email\s*)?(campaign\s*)?(JSON\s*)?(about\s*)?(.*?:\s*)?/i, '');
      cleaned = cleaned.replace(/^(Here'?s?\s*)?(an?\s*)?(example\s*)?(.*?:\s*)?/i, '');
      
      // Find JSON object (most reliable method)
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Ensure required fields are present
        return {
          type: parsed.type || 'education',
          is_shared: parsed.is_shared !== undefined ? parsed.is_shared : true,
          subject: parsed.subject || {
            es: 'Reduzca la contaminación del reciclaje',
            en: 'Reduce Recycling Contamination',
            fr: 'Réduire la contamination du recyclage',
            en_US: 'Reduce Recycling Contamination',
          },
          service_id: parsed.service_id || 0,
          html_message: parsed.html_message || {},
          short_text_message: parsed.short_text_message || {},
          label: parsed.label || 'Reduce Recycling Contamination',
          voice_message: parsed.voice_message || {},
          zones: parsed.zones || [{ id: 0, title: 'Metro Vancouver', name: 'metro_vancouver' }],
          meta: parsed.meta || { value: 'contamination_reduction', field: 'campaign_type' },
          end_at: parsed.end_at || endDate.toISOString(),
          start_at: parsed.start_at || startDate.toISOString(),
          plain_text_message: parsed.plain_text_message || {},
        };
      }
    } catch (error: unknown) {
      console.warn('Failed to parse JSON from Ollama response:', error);
    }

    // Fallback: return template structure if parsing fails
    return {
      type: 'education',
      is_shared: true,
      subject: {
        es: 'Reduzca la contaminación del reciclaje',
        en: 'Reduce Recycling Contamination',
        fr: 'Réduire la contamination du recyclage',
        en_US: 'Reduce Recycling Contamination',
      },
      service_id: 0,
      html_message: {
        es: `<p>Por favor, ayúdenos a mantener nuestro programa de reciclaje limpio y efectivo.</p>`,
        en: `<p>Please help us keep our recycling program clean and effective.</p>`,
        fr: `<p>Aidez-nous à garder notre programme de recyclage propre et efficace.</p>`,
        en_US: '',
      },
      short_text_message: {
        es: 'Ayude a reducir la contaminación del reciclaje',
        en: 'Help reduce recycling contamination',
        fr: 'Aidez à réduire la contamination du recyclage',
        en_US: '',
      },
      label: 'Reduce Recycling Contamination',
      voice_message: {
        es: 'Ayude a reducir la contaminación del reciclaje',
        en: 'Help reduce recycling contamination',
        fr: 'Aidez à réduire la contamination du recyclage',
        en_US: '',
      },
      zones: [{ id: 0, title: 'Metro Vancouver', name: 'metro_vancouver' }],
      meta: { value: 'contamination_reduction', field: 'campaign_type' },
      end_at: endDate.toISOString(),
      start_at: startDate.toISOString(),
      plain_text_message: {
        es: 'Por favor, ayúdenos a mantener nuestro programa de reciclaje limpio y efectivo.',
        en: 'Please help us keep our recycling program clean and effective.',
        fr: 'Aidez-nous à garder notre programme de recyclage propre et efficace.',
        en_US: '',
      },
    };
  }
}

