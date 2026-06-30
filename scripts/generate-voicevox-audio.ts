/**
 * Generate VOICEVOX WAV files for all word cards + trip pack roleplay lines.
 *
 * Prerequisites: VOICEVOX running at http://127.0.0.1:50021
 * Usage: npm run generate:voicevox
 *        npm run generate:voicevox -- --situation date
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  collectTripPackStaffReadings,
  voicevoxWordCards,
} from '../src/data/voicevoxCatalog';
import { voicevoxTextHash } from '../src/lib/voicevoxTextHash';
import type { SituationId } from '../src/data/words';

function parseSituationArg(): SituationId | null {
  const index = process.argv.indexOf('--situation');
  if (index === -1) return null;
  const value = process.argv[index + 1]?.trim();
  return value ? (value as SituationId) : null;
}

const VOICEVOX_URL = process.env.VOICEVOX_URL ?? 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VOICEVOX_SPEAKER ?? 8);
const OUT_ROOT = path.join(process.cwd(), 'public/audio/voicevox');

async function synthesize(text: string): Promise<ArrayBuffer> {
  const queryParams = new URLSearchParams({
    text,
    speaker: String(SPEAKER),
  });
  const queryRes = await fetch(`${VOICEVOX_URL}/audio_query?${queryParams.toString()}`, {
    method: 'POST',
    signal: AbortSignal.timeout(10_000),
  });
  if (!queryRes.ok) {
    throw new Error(`audio_query failed (${queryRes.status})`);
  }

  const query = (await queryRes.json()) as { speedScale?: number };
  query.speedScale = 0.92;

  const synthRes = await fetch(`${VOICEVOX_URL}/synthesis?speaker=${SPEAKER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
    signal: AbortSignal.timeout(15_000),
  });
  if (!synthRes.ok) {
    throw new Error(`synthesis failed (${synthRes.status})`);
  }

  return synthRes.arrayBuffer();
}

async function main() {
  const situationFilter = parseSituationArg();
  const wordCards = situationFilter
    ? voicevoxWordCards.filter((card) => card.situation === situationFilter)
    : voicevoxWordCards;
  if (situationFilter && wordCards.length === 0) {
    console.error(`No word cards found for situation: ${situationFilter}`);
    process.exit(1);
  }

  const versionRes = await fetch(`${VOICEVOX_URL}/version`, {
    signal: AbortSignal.timeout(4_000),
  }).catch(() => null);
  if (!versionRes?.ok) {
    console.error(
      'VOICEVOX engine is not running at',
      VOICEVOX_URL,
      '\nStart the VOICEVOX desktop app, then run this script again.'
    );
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;

  const scopeLabel = situationFilter ? ` (${situationFilter})` : '';
  console.log(`Generating ${wordCards.length} word card files${scopeLabel}…`);
  for (const card of wordCards) {
    const text = card.reading || card.japanese;
    const outDir = path.join(OUT_ROOT, card.situation);
    const outPath = path.join(outDir, `${card.id}.wav`);
    process.stdout.write(`${card.id} … `);
    try {
      await mkdir(outDir, { recursive: true });
      const wav = await synthesize(text);
      await writeFile(outPath, Buffer.from(wav));
      console.log('ok');
      ok++;
    } catch (error) {
      console.log('fail');
      console.error(error);
      failed++;
    }
  }

  if (situationFilter) {
    console.log(`Done. ${ok} ok, ${failed} failed.`);
    if (failed > 0) process.exit(1);
    return;
  }

  const roleplayReadings = collectTripPackStaffReadings();
  const textDir = path.join(OUT_ROOT, 'text');
  await mkdir(textDir, { recursive: true });
  const manifest: Record<string, string> = {};

  console.log(`Generating ${roleplayReadings.length} trip pack roleplay files…`);
  for (const reading of roleplayReadings) {
    const hash = voicevoxTextHash(reading);
    manifest[hash] = reading;
    const outPath = path.join(textDir, `${hash}.wav`);
    process.stdout.write(`text:${hash.slice(0, 8)} … `);
    try {
      const wav = await synthesize(reading);
      await writeFile(outPath, Buffer.from(wav));
      console.log('ok');
      ok++;
    } catch (error) {
      console.log('fail');
      console.error(error);
      failed++;
    }
  }

  await writeFile(path.join(textDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`Done. ${ok} ok, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

void main();
