import { getVoicevoxWordCard } from '@/data/voicevoxCatalog';
import { synthesizeVoicevoxWav } from '@/lib/voicevoxSynth';

type RouteContext = {
  params: Promise<{ cardId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { cardId } = await context.params;
  const card = getVoicevoxWordCard(cardId);
  if (!card) {
    return new Response('Card not found', { status: 404 });
  }

  const wav = await synthesizeVoicevoxWav(card.reading || card.japanese);
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
