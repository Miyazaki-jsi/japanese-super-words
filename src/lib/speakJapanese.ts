/** Browser TTS — swap for pre-generated audio when native voice assets are ready. */
export function speakJapanese(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
