/** Stable hash for VOICEVOX text-only audio paths (djb2 xor). */
export function voicevoxTextHash(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}
