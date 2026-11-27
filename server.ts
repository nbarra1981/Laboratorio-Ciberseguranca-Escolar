import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const TTS_PRIMARY_MODEL = 'gemini-3.8-flash-lite-tts';
const TTS_FALLBACK_MODEL = 'gemini-3.8-flash-tts';
const TTS_VOICE_NAME = 'Kore';
const TTS_STYLE_INSTRUCTION =
  'Native European Portuguese speaker from Lisbon, Portugal (pt-PT). Strictly European Portuguese accent, rhythm, closed vowels, and consonant pronunciation—never Brazilian Portuguese. Calm, clear, articulate educational tone suitable for school teachers.';

const ttsAudioCache = new Map<string, string>();

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

function isTransientOverloadError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes('503') ||
    message.includes('UNAVAILABLE') ||
    message.includes('overloaded') ||
    message.includes('429') ||
    message.includes('RESOURCE_EXHAUSTED')
  );
}

async function generateTtsWithModel(
  ai: GoogleGenAI,
  model: string,
  text: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text,
            speechMetadata: {
              style: TTS_STYLE_INSTRUCTION,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: TTS_VOICE_NAME,
          },
        },
      },
    },
  });

  const base64Audio =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('Gemini TTS response did not include audio data.');
  }
  return base64Audio;
}

async function synthesizeEuropeanPortugueseAudio(
  ai: GoogleGenAI,
  text: string,
): Promise<{ audioBase64: string; model: string }> {
  try {
    const audioBase64 = await generateTtsWithModel(ai, TTS_PRIMARY_MODEL, text);
    return { audioBase64, model: TTS_PRIMARY_MODEL };
  } catch (firstErr) {
    if (!isTransientOverloadError(firstErr)) {
      throw firstErr;
    }

    await new Promise((resolve) => setTimeout(resolve, 450));

    try {
      const audioBase64 = await generateTtsWithModel(ai, TTS_PRIMARY_MODEL, text);
      return { audioBase64, model: TTS_PRIMARY_MODEL };
    } catch (retryErr) {
      if (!isTransientOverloadError(retryErr)) {
        throw retryErr;
      }
      const audioBase64 = await generateTtsWithModel(ai, TTS_FALLBACK_MODEL, text);
      return { audioBase64, model: TTS_FALLBACK_MODEL };
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '16kb' }));

  app.post('/api/tts', async (req, res) => {
    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!rawText) {
      res.status(400).json({ error: 'Texto em falta para síntese de voz.', code: 'INVALID_TEXT' });
      return;
    }
    if (rawText.length > 2000) {
      res.status(400).json({ error: 'Texto demasiado longo para síntese de voz.', code: 'TEXT_TOO_LONG' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Chave de API Gemini não configurada no servidor.',
        code: 'MISSING_API_KEY',
      });
      return;
    }

    const cacheKey = crypto
      .createHash('sha256')
      .update(`${TTS_PRIMARY_MODEL}:${TTS_VOICE_NAME}:${rawText}`)
      .digest('hex');

    const cached = ttsAudioCache.get(cacheKey);
    if (cached) {
      res.json({
        audioBase64: cached,
        mimeType: 'audio/wav',
        model: TTS_PRIMARY_MODEL,
        cached: true,
      });
      return;
    }

    try {
      const result = await synthesizeEuropeanPortugueseAudio(ai, rawText);
      ttsAudioCache.set(cacheKey, result.audioBase64);
      res.json({
        audioBase64: result.audioBase64,
        mimeType: 'audio/wav',
        model: result.model,
        cached: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[api/tts] synthesis error:', message);
      const status =
        message.includes('400') || message.includes('API_KEY_INVALID') || message.includes('INVALID_ARGUMENT')
          ? 400
          : message.includes('403') || message.includes('PERMISSION_DENIED')
          ? 403
          : message.includes('404') || message.includes('NOT_FOUND')
          ? 404
          : message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
          ? 429
          : 502;
      res.status(status).json({
        error: 'Não foi possível gerar o áudio através do modelo Gemini TTS.',
        code: 'TTS_GENERATION_FAILED',
      });
    }
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Aplicação não compilada.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
