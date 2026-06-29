import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { synthesizeVoicevoxWav } from '@/lib/voicevoxSynth';

type RouteContext = {
  params: Promise<{ hash: string }>;
};

type TextManifest = Record<string, string>;

async function loadTextFromManifest(hash: string): Promise<string | null> {
  try {
    const manifestPath = path.join(process.cwd(), 'public/audio/voicevox/text/manifest.json');
    const raw = await readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw) as TextManifest;
    return manifest[hash] ?? null;
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { hash } = await context.params;
  const text = await loadTextFromManifest(hash);
  if (!text) {
    return new Response('Text not found', { status: 404 });
  }

  const wav = await synthesizeVoicevoxWav(text);
  if (!wav) {
    return new Response(
      'VOICEVOX engine unavailable. Start the VOICEVOX app, or run npm run generate:voicevox.',
      { status: 503 }
    );
  }

  return new Response(wav, {
    headers: {
      'Content-Type': 'audio/wav',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
