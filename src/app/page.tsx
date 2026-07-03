'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { sampleWords, WordCard, SituationId } from '@/data/words';
import { TRIP_PACK_STORAGE_KEY } from '@/data/tripPack';
import {
  JAPAN_PRO_PRICE_USD,
  JAPAN_PRO_UPSELL_NOTE,
  JAPAN_PRO_PRICE_JPY_NOTE,
  TRIP_PACK_PRICE_USD,
  TRIP_PACK_PRICE_JPY_NOTE,
  clearAllUnlocks,
  getJapanProPhraseCount,
  readJapanProUnlocked,
  readTripPackUnlocked,
  saveUnlockTier,
  type UnlockTier,
} from '@/data/monetization';
import FlashCard from '@/components/FlashCard';
import IntroWizard, { INTRO_DONE_STORAGE_KEY } from '@/components/IntroWizard';
import JsiLogo from '@/components/JsiLogo';
import TripPackScreen from '@/components/TripPackScreen';
import MiniPackScreen from '@/components/MiniPackScreen';
import UnlockModal, { type UnlockContext } from '@/components/UnlockModal';
import {
  getDisplayMiniPacks,
  MINI_PACK_COUNT,
  type MiniPackId,
  getMiniPackById,
} from '@/data/miniPacks';
import { readMiniPackUnlocked, clearAllMiniPackUnlocks } from '@/data/miniPackUnlock';
import { YOUTUBE_CHANNEL_URL } from '@/data/youtubeCompanions';
import {
  captureAttributionFromUrl,
  getAttributionProps,
  readAttribution,
  YOUTUBE_BANNER_DISMISSED_KEY,
} from '@/lib/attribution';
import {
  clearPendingDeepLink,
  parseDeepLink,
  readPendingDeepLink,
  storePendingDeepLink,
  stripDeepLinkParamsFromUrl,
  type DeepLinkTarget,
} from '@/lib/deepLink';
import {
  allPremiumSituations,
  getPremiumSituationsByCategory,
  premiumSituationCategories,
  PREMIUM_PHRASE_COUNT,
  PREMIUM_SCENE_HIGHLIGHTS,
  PREMIUM_SITUATION_COUNT,
} from '@/data/premiumSituations';
import PhraseLevelBadge from '@/components/PhraseLevelBadge';
import PhraseLevelLadder from '@/components/PhraseLevelLadder';
import {
  PHRASE_CHECK_QUESTION_COUNT,
  PHRASE_CHECK_KIND_LABELS,
  PHRASE_CHECK_PROMPTS,
  PHRASE_LEVEL_STORAGE_KEY,
  buildPhraseCheckQuestions,
  estimatePhraseCheckQuestionCount,
  getPhraseLevelById,
  savePhraseLevelResult,
  type PhraseCheckQuestion,
  type PhraseLevelMeta,
  type SavedPhraseLevel,
} from '@/data/phraseLevel';
import { trackEvent } from '@/lib/analytics';
import { speakJapanese } from '@/lib/speakJapanese';
import { usePurchaseReturnUnlock } from '@/lib/usePurchaseReturnUnlock';
import {
  clearStudyHabits,
  getDueWordIds,
  getUpcomingReviewCount,
  readStreak,
  recordSrsAgain,
  recordSrsSuccess,
  recordStudyDay,
  removeSrsEntry,
  scheduleSrsEntry,
  syncSrsWithLearned,
  type StreakData,
} from '@/lib/studyHabits';
import {
  Utensils,
  ShoppingBag,
  Plane,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Sparkles,
  Edit2,
  Camera,
  Lock,
  ChevronRight,
  Star,
  Award,
  Plus,
  Compass,
  HeartPulse,
  Milestone,
  Beer,
  Fish,
  Shield,
  Building2,
  Check,
  Share2,
  MoreVertical,
  X,
  Smartphone,
  ClipboardCheck,
  XCircle,
  Settings,
  Search,
  MessageCircle,
  Bug,
  Send,
  Moon,
  Luggage,
  LayoutGrid,
  Volume2,
  Flame,
  Droplets,
  ShieldAlert,
} from 'lucide-react';

type ScreenType = 'home' | 'situation' | 'favorites' | 'super_test' | 'srs_review' | 'trip_pack' | 'mini_pack';
type HomeTab = 'packs' | 'situations' | 'review';
type FilterType = 'all' | 'unlearned';
type MessageStep = 'form' | 'confirm' | 'success';

const TRIP_DATE_STORAGE_KEY = 'japanese-super-words-trip-date';
const SUPER_TEST_INTRO_EXIT_MS = 450;

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysUntilDate(dateISO: string): number {
  const [year, month, day] = dateISO.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function formatTripDateLabel(dateISO: string): string {
  const [year, month, day] = dateISO.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}


function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function XSocialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

const YOUTUBE_WEB_URL = YOUTUBE_CHANNEL_URL;

function openYoutubeLink(e: React.MouseEvent<HTMLAnchorElement>) {
  if (typeof window === 'undefined') return;

  const ua = window.navigator.userAgent.toLowerCase();
  const isAndroid = /android/.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua);

  trackEvent('youtube_channel_click', { ...getAttributionProps(), source: 'app' });

  if (!isAndroid && !isIOS) return;

  e.preventDefault();

  if (isAndroid) {
    window.location.href = `intent://www.youtube.com/@jsi55#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodeURIComponent(YOUTUBE_WEB_URL)};end`;
    return;
  }

  window.location.href = 'youtube://www.youtube.com/@jsi55';
}

const socialLinks = [
  {
    id: 'youtube',
    label: 'Youtube',
    href: YOUTUBE_WEB_URL,
    icon: YoutubeIcon,
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-600',
    border: 'border-red-100',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/jsi_toriyama?igsh=amZjM2p6d3QxdzVv',
    icon: InstagramIcon,
    bg: 'bg-pink-50 hover:bg-pink-100',
    text: 'text-pink-600',
    border: 'border-pink-100',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/miyazaki_jsi?s=21&t=qlLFdzbNuQFerhEmqFfzWQ',
    icon: XSocialIcon,
    bg: 'bg-slate-100 hover:bg-slate-200',
    text: 'text-slate-800',
    border: 'border-slate-200',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@japanesesuperimmersion?_r=1&_t=ZS-97O0Er7WjOp',
    icon: TikTokIcon,
    bg: 'bg-slate-900 hover:bg-black',
    text: 'text-white',
    border: 'border-slate-800',
  },
] as const;

function toHiragana(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 0x30a1 && code <= 0x30f6) {
    return String.fromCharCode(code - 0x60);
  }
  return char;
}

function toHiraganaStr(str: string): string {
  return [...str].map(toHiragana).join('');
}

function isKanji(char: string): boolean {
  return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(char);
}

function isKanaChar(char: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(char);
}

function suffixMatchesAt(
  jChars: string[],
  j: number,
  rChars: string[],
  r: number
): boolean {
  while (j < jChars.length || r < rChars.length) {
    if (j >= jChars.length) return r >= rChars.length;
    if (r >= rChars.length) return !jChars.slice(j).some(isKanji);

    if (isKanji(jChars[j])) {
      let kanjiEnd = j;
      while (kanjiEnd < jChars.length && isKanji(jChars[kanjiEnd])) kanjiEnd++;
      for (let tryR = r + 1; tryR <= rChars.length; tryR++) {
        if (suffixMatchesAt(jChars, kanjiEnd, rChars, tryR)) return true;
      }
      return false;
    }

    const c = toHiragana(jChars[j]);
    if (r < rChars.length && toHiragana(rChars[r]) === c) {
      j++;
      r++;
    } else if (!isKanaChar(jChars[j])) {
      if (r < rChars.length && rChars[r] === jChars[j]) {
        j++;
        r++;
      } else {
        j++;
      }
    } else {
      return false;
    }
  }
  return true;
}

function suffixMatches(japanese: string, reading: string): boolean {
  return suffixMatchesAt([...japanese], 0, [...reading], 0);
}

function hasLatinOrDigits(str: string): boolean {
  return /[a-zA-Z0-9]/.test(str);
}

const ROMAJI_SYLLABLES: [string, string][] = [
  ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ'],
  ['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ'],
  ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ'],
  ['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ'],
  ['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ'],
  ['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ'],
  ['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ'],
  ['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ'],
  ['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ'],
  ['jya', 'じゃ'], ['jyu', 'じゅ'], ['jyo', 'じょ'],
  ['shi', 'し'], ['chi', 'ち'], ['tsu', 'つ'],
  ['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ'],
  ['ga', 'が'], ['gi', 'ぎ'], ['gu', 'ぐ'], ['ge', 'げ'], ['go', 'ご'],
  ['sa', 'さ'], ['si', 'し'], ['su', 'す'], ['se', 'せ'], ['so', 'そ'],
  ['za', 'ざ'], ['zi', 'じ'], ['zu', 'ず'], ['ze', 'ぜ'], ['zo', 'ぞ'],
  ['ji', 'じ'], ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'],
  ['ta', 'た'], ['ti', 'ち'], ['tu', 'つ'], ['te', 'て'], ['to', 'と'],
  ['da', 'だ'], ['di', 'ぢ'], ['du', 'づ'], ['de', 'で'], ['do', 'ど'],
  ['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の'],
  ['ha', 'は'], ['hi', 'ひ'], ['hu', 'ふ'], ['fu', 'ふ'], ['he', 'へ'], ['ho', 'ほ'],
  ['ba', 'ば'], ['bi', 'び'], ['bu', 'ぶ'], ['be', 'べ'], ['bo', 'ぼ'],
  ['pa', 'ぱ'], ['pi', 'ぴ'], ['pu', 'ぷ'], ['pe', 'ぺ'], ['po', 'ぽ'],
  ['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も'],
  ['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ'],
  ['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ'],
  ['wa', 'わ'], ['wi', 'うぃ'], ['we', 'うぇ'], ['wo', 'を'],
  ['la', 'ら'], ['li', 'り'], ['lu', 'る'], ['le', 'れ'], ['lo', 'ろ'],
  ['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お'],
];

function normalizeRomajiInput(romaji: string): string {
  return romaji
    .toLowerCase()
    .replace(/ō|ô/g, 'ou')
    .replace(/ū|û/g, 'uu')
    .replace(/ā|â/g, 'aa')
    .replace(/ī|î/g, 'ii')
    .replace(/ē|ê/g, 'ee')
    .replace(/[āīūēō]/g, (ch) => {
      const map: Record<string, string> = { ā: 'a', ī: 'i', ū: 'u', ē: 'e', ō: 'o' };
      return map[ch] ?? ch;
    });
}

function parseRomajiPrefix(romaji: string): { hira: string; remainder: string } {
  const s = normalizeRomajiInput(romaji);
  let i = 0;
  let hira = '';

  while (i < s.length) {
    const ch = s[i];
    if (ch === ' ' || ch === '-' || ch === "'" || ch === '.') {
      i++;
      continue;
    }

    if (i + 1 < s.length && ch === s[i + 1] && ch !== 'n' && /[bcdfghjklmprstwz]/.test(ch)) {
      hira += 'っ';
      i++;
      continue;
    }

    if (ch === 'n' && i + 1 < s.length && s[i + 1] === 'n') {
      hira += 'ん';
      i += 2;
      continue;
    }

    if (ch === 'n' && (i + 1 >= s.length || !'aiueoyw'.includes(s[i + 1]))) {
      hira += 'ん';
      i++;
      continue;
    }

    let matched = false;
    for (const [rom, kana] of ROMAJI_SYLLABLES) {
      if (s.startsWith(rom, i)) {
        hira += kana;
        i += rom.length;
        matched = true;
        break;
      }
    }
    if (!matched) break;
  }

  return { hira, remainder: s.slice(i) };
}

function kanaFromRomajiRemainder(remainder: string): string[] {
  const results = new Set<string>();
  for (const [rom, kana] of ROMAJI_SYLLABLES) {
    if (rom.startsWith(remainder)) {
      results.add(kana);
    }
  }
  return [...results];
}

function matchesReadingPrefix(readingHira: string, hira: string, remainder: string): boolean {
  if (!remainder) {
    return readingHira.startsWith(hira);
  }
  if (!readingHira.startsWith(hira)) return false;
  const next = readingHira.slice(hira.length);
  if (!next) return false;
  return kanaFromRomajiRemainder(remainder).some((kana) => next.startsWith(kana));
}

function isLatinQuery(query: string): boolean {
  return /[a-zA-ZāīūēōĀĪŪĒŌ]/.test(query);
}

function isKanaOrKanjiQuery(query: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(query);
}

function wordMatchesQuery(card: WordCard, rawQuery: string): boolean {
  const query = rawQuery.trim();
  if (!query) return false;

  const readingHira = toHiraganaStr(card.reading);

  if (isKanaOrKanjiQuery(query)) {
    const queryHira = toHiraganaStr(query);
    if (queryHira && readingHira.startsWith(queryHira)) return true;
    return card.japanese.startsWith(query);
  }

  if (isLatinQuery(query)) {
    const { hira, remainder } = parseRomajiPrefix(query);
    if (hira || remainder) {
      if (matchesReadingPrefix(readingHira, hira, remainder)) return true;
    }
    return card.english.toLowerCase().startsWith(query.toLowerCase());
  }

  return false;
}

function consumePlainSegment(plainText: string, reading: string, r: number): number {
  if (!hasLatinOrDigits(plainText)) {
    let ri = r;
    for (const c of plainText) {
      if (isKanaChar(c)) {
        const h = toHiragana(c);
        if (ri < reading.length && reading[ri] === h) ri++;
      } else if (ri < reading.length && reading[ri] === c) {
        ri++;
      }
    }
    return ri;
  }

  let pi = 0;
  let ri = r;
  while (pi < plainText.length) {
    const c = plainText[pi];
    if (isKanaChar(c)) {
      const h = toHiragana(c);
      while (ri < reading.length && reading[ri] !== h) ri++;
      if (ri >= reading.length) return r;
      ri++;
    }
    pi++;
  }
  return ri;
}

function buildRubyNodes(japanese: string, reading: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const readHira = toHiraganaStr(reading);
  let j = 0;
  let r = 0;
  let key = 0;

  while (j < japanese.length) {
    if (isKanji(japanese[j])) {
      let kanjiEnd = j;
      while (kanjiEnd < japanese.length && isKanji(japanese[kanjiEnd])) kanjiEnd++;
      const kanjiText = japanese.slice(j, kanjiEnd);

      let readEnd = readHira.length;
      if (kanjiEnd < japanese.length) {
        readEnd = r;
        for (let candidate = r + 1; candidate <= readHira.length; candidate++) {
          if (suffixMatches(japanese.slice(kanjiEnd), readHira.slice(candidate))) {
            readEnd = candidate;
            break;
          }
        }
        if (readEnd === r) readEnd = readHira.length;
      }

      const rt = readHira.slice(r, readEnd);
      if (rt) {
        nodes.push(
          <ruby key={key++} className="super-test-ruby">
            {kanjiText}
            <rt>{rt}</rt>
          </ruby>
        );
      } else {
        nodes.push(<span key={key++}>{kanjiText}</span>);
      }
      j = kanjiEnd;
      r = readEnd;
    } else {
      const plainStart = j;
      let plainEnd = j;
      while (plainEnd < japanese.length && !isKanji(japanese[plainEnd])) {
        plainEnd++;
      }
      const plainText = japanese.slice(plainStart, plainEnd);
      const readEnd = consumePlainSegment(plainText, readHira, r);

      nodes.push(<span key={key++}>{plainText}</span>);
      j = plainEnd;
      r = readEnd;
    }
  }

  return nodes;
}

function RubyText({
  japanese,
  reading,
  className = '',
}: {
  japanese: string;
  reading: string;
  className?: string;
}) {
  return <span className={className}>{buildRubyNodes(japanese, reading)}</span>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandaloneDisplayMode = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeMiniPackId, setActiveMiniPackId] = useState<MiniPackId | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<SituationId | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Random Study states
  const [isRandomStudyMode, setIsRandomStudyMode] = useState(false);
  const [randomStudyCards, setRandomStudyCards] = useState<WordCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showRandomStudyModal, setShowRandomStudyModal] = useState(false);
  const [randomStudyCountInput, setRandomStudyCountInput] = useState('5');
  const [randomStudyCountError, setRandomStudyCountError] = useState('');

  const [streakInfo, setStreakInfo] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  });
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [srsReviewCards, setSrsReviewCards] = useState<WordCard[]>([]);
  const [srsReviewIndex, setSrsReviewIndex] = useState(0);
  const [srsReviewComplete, setSrsReviewComplete] = useState(false);

  const handleRandomStudyToggleLearned = (id: string, learned: boolean) => {
    handleToggleLearned(id, learned);
    // 200ms delay to allow the user to see the button press feedback before transitioning
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => {
        if (prevIndex < randomStudyCards.length - 1) {
          return prevIndex + 1;
        } else {
          setIsRandomStudyMode(false);
          return 0;
        }
      });
    }, 200);
  };
  
  // Progress states
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userName, setUserName] = useState('ゲスト');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('ゲスト');
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [unlockModal, setUnlockModal] = useState<{ tier: UnlockTier; context: UnlockContext } | null>(null);
  const [pendingUnlockCode, setPendingUnlockCode] = useState('');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isTripPackUnlocked, setIsTripPackUnlocked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showIntroWizard, setShowIntroWizard] = useState(false);
  const [showIntroWelcome, setShowIntroWelcome] = useState(false);
  const [fromYoutube, setFromYoutube] = useState(false);
  const [showYoutubeBanner, setShowYoutubeBanner] = useState(false);
  const deepLinkAppliedRef = useRef(false);
  const [onboardingTab, setOnboardingTab] = useState<'ios' | 'android'>('ios');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [currentRankName, setCurrentRankName] = useState<string | null>(null);
  const [showRankUpModal, setShowRankUpModal] = useState<{ name: string; enName: string; color: string } | null>(null);
  const [showPremiumUnlockedModal, setShowPremiumUnlockedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [messageStep, setMessageStep] = useState<MessageStep | null>(null);
  const [messageName, setMessageName] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageFormError, setMessageFormError] = useState('');
  const [messageSendError, setMessageSendError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const installPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canNativeInstall, setCanNativeInstall] = useState(false);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);

  const [homeTab, setHomeTab] = useState<HomeTab>('packs');
  const [tripDate, setTripDate] = useState<string | null>(null);
  const [tripDateDraft, setTripDateDraft] = useState('');
  const [isEditingTripDate, setIsEditingTripDate] = useState(false);
  const [wordSearchQuery, setWordSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchWordPopup, setSearchWordPopup] = useState<WordCard | null>(null);
  const wordSearchRef = useRef<HTMLDivElement>(null);

  // Phrase Level Check states
  const [superTestQuestions, setSuperTestQuestions] = useState<PhraseCheckQuestion[]>([]);
  const [superTestIndex, setSuperTestIndex] = useState(0);
  const [superTestScore, setSuperTestScore] = useState(0);
  const [superTestSelectedAnswer, setSuperTestSelectedAnswer] = useState<number | null>(null);
  const [superTestFinished, setSuperTestFinished] = useState(false);
  const [showSuperTestIntro, setShowSuperTestIntro] = useState(false);
  const [superTestIntroExiting, setSuperTestIntroExiting] = useState(false);
  const [showSuperTestExitConfirm, setShowSuperTestExitConfirm] = useState(false);
  const [savedPhraseLevel, setSavedPhraseLevel] = useState<SavedPhraseLevel | null>(null);
  const [phraseCheckResult, setPhraseCheckResult] = useState<{
    level: PhraseLevelMeta;
    percent: number;
    leveledUp: boolean;
  } | null>(null);
  const [showPhraseLevelUpModal, setShowPhraseLevelUpModal] = useState<PhraseLevelMeta | null>(null);
  const superTestIntroExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyDeepLink = useCallback((target: DeepLinkTarget) => {
    if (target.type === 'situation') {
      setSelectedSituation(target.situationId);
      setCurrentScreen('situation');
      setFilter('all');
      setHomeTab('situations');
    } else if (target.type === 'pack') {
      setHomeTab('packs');
      if (target.packId === 'trip') {
        setCurrentScreen('trip_pack');
      } else {
        setActiveMiniPackId(target.packId);
        setCurrentScreen('mini_pack');
      }
    } else if (target.type === 'tab') {
      setHomeTab(target.tab);
      setCurrentScreen('home');
    }
    trackEvent('deep_link_applied', {
      ...getAttributionProps(),
      targetType: target.type,
      ...(target.type === 'situation' ? { situation: target.situationId } : {}),
      ...(target.type === 'pack' ? { packId: target.packId } : {}),
      ...(target.type === 'tab' ? { tab: target.tab } : {}),
    });
  }, []);

  const totalXP = learnedIds.length;

  const getRankInfo = (xp: number) => {
    if (xp < 100) {
      return {
        name: 'ブロンズ',
        enName: 'Bronze',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeColor: 'bg-amber-600 text-white',
        nextXP: 100,
        prevXP: 0,
      };
    } else if (xp < 300) {
      return {
        name: 'シルバー',
        enName: 'Silver',
        color: 'text-slate-500 bg-slate-50 border-slate-200',
        badgeColor: 'bg-slate-400 text-white',
        nextXP: 300,
        prevXP: 100,
      };
    } else if (xp < 600) {
      return {
        name: 'ゴールド',
        enName: 'Gold',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        badgeColor: 'bg-yellow-500 text-white',
        nextXP: 600,
        prevXP: 300,
      };
    } else {
      return {
        name: 'プラチナ',
        enName: 'Platinum',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        badgeColor: 'bg-indigo-600 text-white',
        nextXP: 750,
        prevXP: 600,
      };
    }
  };

  // Load state from localStorage on mount
  useEffect(() => {
    captureAttributionFromUrl();
    const attribution = readAttribution();
    if (attribution?.fromYoutube) {
      setFromYoutube(true);
      setShowYoutubeBanner(!localStorage.getItem(YOUTUBE_BANNER_DISMISSED_KEY));
    }
    const deepLink = parseDeepLink(window.location.search);
    if (deepLink) {
      storePendingDeepLink(deepLink);
    }
    stripDeepLinkParamsFromUrl();

    const savedLearned = localStorage.getItem('japanese-super-words-progress');
    const savedFavorites = localStorage.getItem('japanese-super-words-favorites');
    const savedName = localStorage.getItem('japanese-super-words-username');
    const savedPremium = localStorage.getItem('japanese-super-words-premium');
    const savedVisited = localStorage.getItem('japanese-super-words-visited');
    const savedAvatar = localStorage.getItem('japanese-super-words-avatar');
    const savedPhraseLevelRaw = localStorage.getItem(PHRASE_LEVEL_STORAGE_KEY);
    const savedTripDate = localStorage.getItem(TRIP_DATE_STORAGE_KEY);
    
    let initialLearnedCount = 0;
    if (savedLearned) {
      try {
        const learnedList = JSON.parse(savedLearned);
        setLearnedIds(learnedList);
        initialLearnedCount = learnedList.length;
        syncSrsWithLearned(learnedList);
        setDueReviewCount(getUpcomingReviewCount(learnedList));
      } catch (e) { console.error(e); }
    }
    setStreakInfo(readStreak());
    if (savedFavorites) {
      try { setFavoriteIds(JSON.parse(savedFavorites)); } catch (e) { console.error(e); }
    }
    if (savedName) {
      setUserName(savedName);
      setNameInput(savedName);
    }
    if (savedPremium === 'true' || readJapanProUnlocked()) {
      setIsPremiumUnlocked(true);
    }
    setIsTripPackUnlocked(readTripPackUnlocked());
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
    if (savedPhraseLevelRaw) {
      try {
        const parsed = JSON.parse(savedPhraseLevelRaw) as SavedPhraseLevel;
        if (parsed.levelId >= 1 && parsed.levelId <= 6) {
          setSavedPhraseLevel(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (savedTripDate && /^\d{4}-\d{2}-\d{2}$/.test(savedTripDate)) {
      setTripDate(savedTripDate);
      setTripDateDraft(savedTripDate);
    }

    const initialXP = initialLearnedCount;
    const initialRank = getRankInfo(initialXP).name;
    setCurrentRankName(initialRank);

    if (!savedVisited) {
      setShowOnboarding(true);
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/android/.test(userAgent)) {
          setOnboardingTab('android');
        }
      }
    } else if (!localStorage.getItem(INTRO_DONE_STORAGE_KEY)) {
      setShowIntroWizard(true);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || showOnboarding || showIntroWizard || deepLinkAppliedRef.current) return;
    const pending = readPendingDeepLink();
    if (!pending) return;
    deepLinkAppliedRef.current = true;
    clearPendingDeepLink();
    applyDeepLink(pending);
  }, [isLoaded, showOnboarding, showIntroWizard, applyDeepLink]);

  const closePwaOnboarding = () => {
    localStorage.setItem('japanese-super-words-visited', 'true');
    setShowOnboarding(false);
    if (!localStorage.getItem(INTRO_DONE_STORAGE_KEY)) {
      setShowIntroWizard(true);
    }
  };

  const handleIntroComplete = (data: { name: string; tripDate: string | null }) => {
    setUserName(data.name);
    setNameInput(data.name);
    localStorage.setItem('japanese-super-words-username', data.name);
    if (data.tripDate) {
      setTripDate(data.tripDate);
      setTripDateDraft(data.tripDate);
      localStorage.setItem(TRIP_DATE_STORAGE_KEY, data.tripDate);
    }
    localStorage.setItem(INTRO_DONE_STORAGE_KEY, 'true');
    setShowIntroWizard(false);
    setShowIntroWelcome(true);
    trackEvent('intro_complete', { ...getAttributionProps(), hasTripDate: Boolean(data.tripDate) });

    const pending = readPendingDeepLink();
    if (pending) {
      deepLinkAppliedRef.current = true;
      clearPendingDeepLink();
      setTimeout(() => applyDeepLink(pending), 400);
    } else if (data.tripDate) {
      const days = getDaysUntilDate(data.tripDate);
      if (days >= 0 && days <= 7) {
        setHomeTab('packs');
      } else {
        setHomeTab('situations');
      }
    } else if (fromYoutube) {
      setHomeTab('situations');
    } else {
      setHomeTab('situations');
    }
    setCurrentScreen('home');
  };

  useEffect(() => {
    setIsStandaloneApp(isStandaloneDisplayMode());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      installPromptRef.current = event as BeforeInstallPromptEvent;
      setCanNativeInstall(true);
    };

    const onAppInstalled = () => {
      installPromptRef.current = null;
      setCanNativeInstall(false);
      setIsStandaloneApp(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  // Scroll to top when navigating between screens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen, selectedSituation, isRandomStudyMode, srsReviewIndex, srsReviewComplete]);

  useEffect(() => {
    if (!isLoaded) return;
    syncSrsWithLearned(learnedIds);
    setDueReviewCount(getUpcomingReviewCount(learnedIds));
  }, [learnedIds, isLoaded]);

  useEffect(() => {
    if (!showSettingsModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showSettingsModal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wordSearchRef.current && !wordSearchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenProFromPacks = (source: string) => {
    if (isTripPackUnlocked) {
      setUnlockModal({ tier: 'pro', context: 'upsell' });
      trackEvent('unlock_modal_open', { tier: 'pro', context: 'upsell', source });
    } else {
      setUnlockModal({ tier: 'pro', context: 'premium' });
      trackEvent('unlock_modal_open', { tier: 'pro', context: 'premium', source });
    }
  };

  const handleMiniPackOpen = (packId: MiniPackId) => {
    if (readMiniPackUnlocked(packId)) {
      setActiveMiniPackId(packId);
      setCurrentScreen('mini_pack');
      return;
    }
    handleOpenProFromPacks('mini_pack_card');
  };

  const homeTabs: {
    id: HomeTab;
    label: string;
    enLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'packs', label: 'パック', enLabel: 'Packs', icon: Luggage },
    {
      id: 'situations',
      label: 'シチュエーション',
      enLabel: 'Situations',
      icon: LayoutGrid,
    },
    {
      id: 'review',
      label: '復習',
      enLabel: 'Review',
      icon: BookOpen,
      badge:
        dueReviewCount > 0
          ? dueReviewCount
          : favoriteIds.length > 0
            ? favoriteIds.length
            : undefined,
    },
  ];

  const handleSaveTripDate = () => {
    if (!tripDateDraft) return;
    setTripDate(tripDateDraft);
    localStorage.setItem(TRIP_DATE_STORAGE_KEY, tripDateDraft);
    setIsEditingTripDate(false);
  };

  const handleClearTripDate = () => {
    setTripDate(null);
    setTripDateDraft('');
    setIsEditingTripDate(false);
    localStorage.removeItem(TRIP_DATE_STORAGE_KEY);
  };

  const daysUntilTrip = tripDate ? getDaysUntilDate(tripDate) : null;

  // Save phrase level when check finishes
  useEffect(() => {
    if (!superTestFinished || superTestQuestions.length === 0) return;
    const total = superTestQuestions.length;
    const result = savePhraseLevelResult(superTestScore, total);
    setSavedPhraseLevel(result.saved);
    setPhraseCheckResult({
      level: result.level,
      percent: Math.round((superTestScore / total) * 100),
      leveledUp: result.leveledUp,
    });
    if (result.leveledUp) {
      setShowPhraseLevelUpModal(result.level);
    }
    trackEvent('phrase_level_check_complete', {
      score: superTestScore,
      total,
      levelId: result.level.id,
      leveledUp: result.leveledUp,
    });
    const streak = recordStudyDay();
    setStreakInfo(streak);
  }, [superTestFinished, superTestScore, superTestQuestions.length]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserAvatar(base64String);
        localStorage.setItem('japanese-super-words-avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save learned status
  const handleToggleLearned = (id: string, learned: boolean) => {
    let updated: string[];
    if (learned) {
      if (learnedIds.includes(id)) return;
      updated = [...learnedIds, id];

      // Rank Up Check
      const newXP = updated.length;
      const newRank = getRankInfo(newXP);
      if (currentRankName && newRank.name !== currentRankName && newXP > learnedIds.length) {
        setShowRankUpModal({
          name: newRank.name,
          enName: newRank.enName,
          color: newRank.color,
        });
        setCurrentRankName(newRank.name);
      } else if (!currentRankName) {
        setCurrentRankName(newRank.name);
      }
    } else {
      updated = learnedIds.filter((item) => item !== id);
      
      const newXP = updated.length;
      const newRank = getRankInfo(newXP);
      setCurrentRankName(newRank.name);
    }
    if (learned) {
      scheduleSrsEntry(id);
      const streak = recordStudyDay();
      setStreakInfo(streak);
    } else {
      removeSrsEntry(id);
    }
    setLearnedIds(updated);
    localStorage.setItem('japanese-super-words-progress', JSON.stringify(updated));
    setDueReviewCount(getUpcomingReviewCount(updated));
  };

  // Save favorite status
  const handleToggleFavorite = (id: string, favorite: boolean) => {
    let updated: string[];
    if (favorite) {
      if (favoriteIds.includes(id)) return;
      updated = [...favoriteIds, id];
    } else {
      updated = favoriteIds.filter((item) => item !== id);
    }
    setFavoriteIds(updated);
    localStorage.setItem('japanese-super-words-favorites', JSON.stringify(updated));
  };

  // Edit User Name
  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      localStorage.setItem('japanese-super-words-username', trimmed);
    }
    setIsEditingName(false);
  };

  const handleUnlockSuccess = (tier: UnlockTier) => {
    saveUnlockTier(tier);
    setIsTripPackUnlocked(true);
    if (tier === 'pro') {
      setIsPremiumUnlocked(true);
      setShowPremiumUnlockedModal(true);
    }
    setUnlockModal(null);
    setPendingUnlockCode('');
    setCurrentScreen('home');
    setSelectedSituation(null);
  };

  usePurchaseReturnUnlock({
    onUnlocked: handleUnlockSuccess,
    onNeedsManualUnlock: (payload) => {
      setPendingUnlockCode(payload.licenseKey);
      setUnlockModal({
        tier: payload.tierHint ?? 'trip',
        context: 'hub',
      });
    },
  });

  const handleOpenTripUnlock = (context: UnlockContext = 'hub') => {
    closeSettingsModal();
    setUnlockModal({ tier: 'trip', context });
    trackEvent('unlock_modal_open', { tier: 'trip', context, source: 'settings' });
  };

  const handleOpenPremiumUnlock = (context: UnlockContext = 'premium') => {
    closeSettingsModal();
    setUnlockModal({ tier: 'pro', context });
    trackEvent('unlock_modal_open', { tier: 'pro', context, source: 'settings' });
  };

  const handleOpenProUpsell = () => {
    setUnlockModal({ tier: 'pro', context: 'upsell' });
    trackEvent('unlock_modal_open', { tier: 'pro', context: 'upsell', source: 'review_tab' });
  };

  const resetMessageFlow = () => {
    setMessageStep(null);
    setMessageName('');
    setMessageBody('');
    setMessageFormError('');
    setMessageSendError('');
    setIsSendingMessage(false);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
    resetMessageFlow();
  };

  const handleOpenMessageForm = () => {
    setMessageName(userName === 'ゲスト' ? '' : userName);
    setMessageBody('');
    setMessageFormError('');
    setMessageSendError('');
    setMessageStep('form');
  };

  const handleReportBug = () => {
    setShowSettingsModal(true);
    setMessageName(userName === 'ゲスト' ? '' : userName);
    setMessageBody('');
    setMessageFormError('');
    setMessageSendError('');
    setMessageStep('form');
    trackEvent('bug_report_open', { source: 'home_footer' });
  };

  const handleMessageToConfirm = () => {
    if (!messageName.trim()) {
      setMessageFormError('名前を入力してください。 / Please enter your name.');
      return;
    }
    if (!messageBody.trim()) {
      setMessageFormError('メッセージを入力してください。 / Please enter a message.');
      return;
    }
    setMessageFormError('');
    setMessageSendError('');
    setMessageStep('confirm');
  };

  const handleSendMessage = async () => {
    setIsSendingMessage(true);
    setMessageSendError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: messageName.trim(),
          message: messageBody.trim(),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(
          data.error ||
            '送信に失敗しました。しばらくしてからもう一度お試しください。 / Failed to send. Please try again later.'
        );
      }
      setMessageStep('success');
    } catch (error) {
      setMessageSendError(
        error instanceof Error
          ? error.message
          : '送信に失敗しました。しばらくしてからもう一度お試しください。 / Failed to send. Please try again later.'
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const openAddToHomeScreenGuide = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setOnboardingTab(/android/.test(userAgent) ? 'android' : 'ios');
    closeSettingsModal();
    setShowOnboarding(true);
  };

  const handleAddToHomeScreen = async () => {
    const prompt = installPromptRef.current;
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      installPromptRef.current = null;
      setCanNativeInstall(false);
      return;
    }
    openAddToHomeScreenGuide();
  };

  const performResetSavedData = () => {
    setLearnedIds([]);
    setFavoriteIds([]);
    setUserName('ゲスト');
    setNameInput('ゲスト');
    setIsPremiumUnlocked(false);
    setIsTripPackUnlocked(false);
    setUserAvatar(null);
    setSavedPhraseLevel(null);
    setPhraseCheckResult(null);
    setShowPhraseLevelUpModal(null);
    setCurrentRankName(getRankInfo(0).name);
    setCurrentScreen('home');
    setSelectedSituation(null);
    setIsRandomStudyMode(false);
    setSrsReviewCards([]);
    setSrsReviewIndex(0);
    setSrsReviewComplete(false);
    clearStudyHabits();
    setStreakInfo({ currentStreak: 0, longestStreak: 0, lastStudyDate: null });
    setDueReviewCount(0);
    setSuperTestQuestions([]);
    setSuperTestIndex(0);
    setSuperTestScore(0);
    setSuperTestSelectedAnswer(null);
    setSuperTestFinished(false);
    setShowSuperTestIntro(false);
    setSuperTestIntroExiting(false);
    setShowSuperTestExitConfirm(false);
    clearSuperTestIntroExitTimer();
    setTripDate(null);
    setTripDateDraft('');
    setIsEditingTripDate(false);
    localStorage.removeItem('japanese-super-words-progress');
    localStorage.removeItem('japanese-super-words-favorites');
    localStorage.removeItem('japanese-super-words-username');
    localStorage.removeItem('japanese-super-words-premium');
    localStorage.removeItem('japanese-super-words-avatar');
    localStorage.removeItem(PHRASE_LEVEL_STORAGE_KEY);
    localStorage.removeItem(TRIP_DATE_STORAGE_KEY);
    localStorage.removeItem(TRIP_PACK_STORAGE_KEY);
    clearAllUnlocks();
    clearAllMiniPackUnlocks();
    localStorage.removeItem('japanese-super-words-visited');
    localStorage.removeItem(INTRO_DONE_STORAGE_KEY);
    setShowIntroWizard(false);
    setShowIntroWelcome(false);
    setShowOnboarding(true);
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setOnboardingTab(/android/.test(userAgent) ? 'android' : 'ios');
    }
    setShowResetConfirmModal(false);
    closeSettingsModal();
  };

  const handleResetProgress = () => {
    setShowResetConfirmModal(true);
  };

  const rank = getRankInfo(totalXP);
  const xpInCurrentLevel = totalXP - rank.prevXP;
  const xpNeededForNextLevel = rank.nextXP - rank.prevXP;
  const xpPercentage = Math.min(Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100), 100);

  // Statistics
  const getStats = (situation: SituationId) => {
    const cards = sampleWords.filter((w) => w.situation === situation);
    const total = cards.length;
    const learnedCount = cards.filter((w) => learnedIds.includes(w.id)).length;
    return { total, learnedCount };
  };

  // Filter cards based on current screen / selection
  const getDisplayCards = () => {
    if (currentScreen === 'favorites') {
      const cards = sampleWords.filter((card) => favoriteIds.includes(card.id));
      return filter === 'all' ? cards : cards.filter((card) => !learnedIds.includes(card.id));
    }
    if (currentScreen === 'situation' && selectedSituation) {
      const cards = sampleWords.filter((card) => card.situation === selectedSituation);
      return filter === 'all' ? cards : cards.filter((card) => !learnedIds.includes(card.id));
    }
    return [];
  };

  const displayCards = getDisplayCards();

  const getContextAllCards = (): WordCard[] => {
    if (currentScreen === 'favorites') {
      return sampleWords.filter((card) => favoriteIds.includes(card.id));
    }
    if (currentScreen === 'situation' && selectedSituation) {
      return sampleWords.filter((card) => card.situation === selectedSituation);
    }
    return [];
  };

  const getContextUnlearnedCards = (): WordCard[] =>
    getContextAllCards().filter((card) => !learnedIds.includes(card.id));

  const handleStartSrsReview = () => {
    const dueIds = getDueWordIds(learnedIds);
    const cards = dueIds
      .map((id) => sampleWords.find((w) => w.id === id))
      .filter((w): w is WordCard => !!w)
      .sort(() => Math.random() - 0.5);
    if (cards.length === 0) return;
    setSrsReviewCards(cards);
    setSrsReviewIndex(0);
    setSrsReviewComplete(false);
    setCurrentScreen('srs_review');
    trackEvent('srs_review_start', { count: cards.length });
  };

  const handleExitSrsReview = () => {
    setSrsReviewCards([]);
    setSrsReviewIndex(0);
    setSrsReviewComplete(false);
    setCurrentScreen('home');
    setHomeTab('review');
  };

  const handleSrsReviewOutcome = (id: string, remembered: boolean) => {
    if (remembered) {
      recordSrsSuccess(id);
    } else {
      recordSrsAgain(id);
    }
    const streak = recordStudyDay();
    setStreakInfo(streak);
    setDueReviewCount(getUpcomingReviewCount(learnedIds));

    setTimeout(() => {
      setSrsReviewIndex((prevIndex) => {
        if (prevIndex < srsReviewCards.length - 1) {
          return prevIndex + 1;
        }
        setSrsReviewComplete(true);
        trackEvent('srs_review_complete', { count: srsReviewCards.length });
        return prevIndex;
      });
    }, 200);
  };

  const launchRandomStudy = (cards: WordCard[], count?: number) => {
    if (cards.length === 0) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const limit = count ?? cards.length;
    const selected = shuffled.slice(0, Math.min(limit, shuffled.length));
    setRandomStudyCards(selected);
    setCurrentCardIndex(0);
    setIsRandomStudyMode(true);
    setShowRandomStudyModal(false);
    setRandomStudyCountError('');
  };

  const handleOpenRandomStudyModal = () => {
    const allCards = getContextAllCards();
    if (allCards.length === 0) return;
    setRandomStudyCountInput(String(Math.min(5, allCards.length)));
    setRandomStudyCountError('');
    setShowRandomStudyModal(true);
  };

  const handleRandomStudyWithCount = () => {
    const allCards = getContextAllCards();
    const count = parseInt(randomStudyCountInput, 10);
    if (Number.isNaN(count) || count < 1) {
      setRandomStudyCountError('1以上の数値を入力してください。 / Enter 1 or more.');
      return;
    }
    if (count > allCards.length) {
      setRandomStudyCountError(`最大 ${allCards.length} 問まで出題できます。 / Max ${allCards.length} questions.`);
      return;
    }
    launchRandomStudy(allCards, count);
  };

  const handleRandomStudyAllUnlearned = () => {
    const cards = getContextUnlearnedCards();
    if (cards.length === 0) {
      setRandomStudyCountError('未学習の単語がありません。 / No unlearned words.');
      return;
    }
    launchRandomStudy(cards);
  };

  const handleRandomStudyAll = () => {
    launchRandomStudy(getContextAllCards());
  };

  const randomStudyAllCards = showRandomStudyModal ? getContextAllCards() : [];
  const randomStudyUnlearnedCount = showRandomStudyModal ? getContextUnlearnedCards().length : 0;

  // Total available words in database
  const totalDbWords = sampleWords.length;

  const freeSituations = [
    { id: 'ramen_shop', title: 'ラーメン屋', enTitle: 'Ramen Shop', icon: Utensils, color: 'from-orange-500 to-amber-500' },
    { id: 'convenience_store', title: 'コンビニ', enTitle: 'Convenience Store', icon: ShoppingBag, color: 'from-pink-500 to-rose-500' },
    { id: 'greetings', title: '挨拶', enTitle: 'Greetings', icon: Compass, color: 'from-teal-500 to-emerald-500' },
    { id: 'hospital', title: '病院', enTitle: 'Hospital', icon: HeartPulse, color: 'from-red-500 to-rose-600' },
    { id: 'train_station', title: '駅', enTitle: 'Train Station', icon: Plane, color: 'from-sky-500 to-blue-600' },
    { id: 'izakaya', title: '居酒屋', enTitle: 'Izakaya', icon: Beer, color: 'from-purple-500 to-indigo-600' },
    { id: 'sushi_shop', title: '寿司屋', enTitle: 'Sushi Shop', icon: Fish, color: 'from-cyan-500 to-teal-600' },
    { id: 'koban', title: '交番', enTitle: 'Police Box', icon: Shield, color: 'from-blue-600 to-indigo-700' },
    { id: 'hotel', title: 'ホテル', enTitle: 'Hotel', icon: Building2, color: 'from-violet-500 to-purple-600' },
  ] as const;

  const premiumSituations = allPremiumSituations;

  const miniPackIcons: Record<MiniPackId, typeof Sparkles> = {
    hatsumode: Sparkles,
    arrival_24h: Plane,
    night_japan: Moon,
    foodie: Utensils,
    onsen_intro: Droplets,
    trouble_survival: ShieldAlert,
  };

  const getSituationInfo = (id: SituationId | null) => {
    if (!id) return undefined;
    return (
      freeSituations.find((s) => s.id === id) ??
      premiumSituations.find((s) => s.id === id)
    );
  };

  const getUnlockedWords = (): WordCard[] => {
    const allowedSituations: SituationId[] = [
      ...freeSituations.map((s) => s.id),
      ...(isPremiumUnlocked ? premiumSituations.map((s) => s.id) : []),
    ];
    return sampleWords.filter((w) => allowedSituations.includes(w.situation));
  };

  const unlockedWords = getUnlockedWords();
  const learnedUnlockedWords = useMemo(
    () => unlockedWords.filter((w) => learnedIds.includes(w.id)),
    [unlockedWords, learnedIds],
  );
  const phraseCheckPool =
    learnedUnlockedWords.length >= 3 ? learnedUnlockedWords : unlockedWords;
  const phraseCheckUsesLearned = learnedUnlockedWords.length >= 3;
  const phraseCheckQuestionCount = estimatePhraseCheckQuestionCount(phraseCheckPool);
  const currentPhraseLevel = savedPhraseLevel
    ? getPhraseLevelById(savedPhraseLevel.levelId)
    : null;

  const wordSearchResults = useMemo(() => {
    const q = wordSearchQuery.trim();
    if (!q) return [];
    return unlockedWords.filter((card) => wordMatchesQuery(card, q)).slice(0, 8);
  }, [wordSearchQuery, unlockedWords]);

  const clearSuperTestIntroExitTimer = () => {
    if (superTestIntroExitTimerRef.current) {
      clearTimeout(superTestIntroExitTimerRef.current);
      superTestIntroExitTimerRef.current = null;
    }
  };

  const handleStartSuperTest = (skipIntro = false) => {
    if (phraseCheckPool.length < 3) return;
    const questions = buildPhraseCheckQuestions(
      learnedUnlockedWords,
      unlockedWords,
      PHRASE_CHECK_QUESTION_COUNT,
    );
    setSuperTestQuestions(questions);
    setSuperTestIndex(0);
    setSuperTestScore(0);
    setSuperTestSelectedAnswer(null);
    setSuperTestFinished(false);
    setPhraseCheckResult(null);
    setShowSuperTestExitConfirm(false);
    setShowSuperTestIntro(!skipIntro);
    setSuperTestIntroExiting(false);
    setCurrentScreen('super_test');
    clearSuperTestIntroExitTimer();

    if (skipIntro) {
      trackEvent('phrase_level_check_started', {
        questionCount: questions.length,
        usesLearnedOnly: phraseCheckUsesLearned,
      });
    }
  };

  const handleConfirmStartSuperTest = () => {
    clearSuperTestIntroExitTimer();
    setSuperTestIntroExiting(true);
    superTestIntroExitTimerRef.current = setTimeout(() => {
      setShowSuperTestIntro(false);
      setSuperTestIntroExiting(false);
      superTestIntroExitTimerRef.current = null;
    }, SUPER_TEST_INTRO_EXIT_MS);
    trackEvent('phrase_level_check_started', {
      questionCount: superTestQuestions.length,
      usesLearnedOnly: phraseCheckUsesLearned,
    });
  };

  const handleSuperTestAnswer = (choiceIndex: number) => {
    if (superTestSelectedAnswer !== null || superTestFinished) return;
    setSuperTestSelectedAnswer(choiceIndex);
    const isCorrect = choiceIndex === superTestQuestions[superTestIndex].correctIndex;
    if (isCorrect) setSuperTestScore((s) => s + 1);

    setTimeout(() => {
      if (superTestIndex < superTestQuestions.length - 1) {
        setSuperTestIndex((i) => i + 1);
        setSuperTestSelectedAnswer(null);
      } else {
        setSuperTestFinished(true);
      }
    }, 1000);
  };

  const goHome = useCallback(() => {
    clearSuperTestIntroExitTimer();
    setShowSuperTestIntro(false);
    setSuperTestIntroExiting(false);
    setShowSuperTestExitConfirm(false);
    setSuperTestQuestions([]);
    setSuperTestIndex(0);
    setSuperTestScore(0);
    setSuperTestSelectedAnswer(null);
    setSuperTestFinished(false);
    setPhraseCheckResult(null);
    setShowPhraseLevelUpModal(null);
    setUnlockModal(null);
    setSelectedSituation(null);
    setActiveMiniPackId(null);
    setIsRandomStudyMode(false);
    setSrsReviewCards([]);
    setSrsReviewIndex(0);
    setSrsReviewComplete(false);
    setCurrentScreen('home');
  }, []);

  const handleExitSuperTest = () => {
    goHome();
  };

  const handleSuperTestBack = () => {
    if (superTestFinished) {
      goHome();
      return;
    }
    setShowSuperTestExitConfirm(true);
  };

  const handleConfirmExitSuperTest = () => {
    setShowSuperTestExitConfirm(false);
    goHome();
  };

  useEffect(() => {
    return () => {
      clearSuperTestIntroExitTimer();
    };
  }, []);

  useEffect(() => {
    if (currentScreen !== 'super_test' || superTestFinished || showSuperTestIntro) return;
    const question = superTestQuestions[superTestIndex];
    if (question?.kind === 'listening' && question.card) {
      speakJapanese(question.card.reading || question.card.japanese, {
        cardId: question.card.id,
        situation: question.card.situation,
      });
    }
  }, [currentScreen, superTestIndex, superTestFinished, showSuperTestIntro, superTestQuestions]);

  const handleReplayListening = () => {
    const question = superTestQuestions[superTestIndex];
    if (question?.kind === 'listening' && question.card) {
      speakJapanese(question.card.reading || question.card.japanese, {
        cardId: question.card.id,
        situation: question.card.situation,
      });
    }
  };

  const currentTestQuestion = superTestQuestions[superTestIndex];
  const currentTestSituationId = currentTestQuestion
    ? currentTestQuestion.card?.situation ?? currentTestQuestion.situationId ?? null
    : null;
  const currentTestSituationInfo = getSituationInfo(currentTestSituationId);
  const CurrentTestSituationIcon = currentTestSituationInfo?.icon;
  const isCurrentTestPremiumSituation = currentTestSituationId
    ? premiumSituations.some((s) => s.id === currentTestSituationId)
    : false;
  const currentTestPrompt = currentTestQuestion
    ? PHRASE_CHECK_PROMPTS[currentTestQuestion.kind]
    : null;
  const currentTestKindLabel = currentTestQuestion
    ? PHRASE_CHECK_KIND_LABELS[currentTestQuestion.kind]
    : null;
  const superTestProgress = superTestQuestions.length
    ? Math.round(((superTestIndex + (superTestSelectedAnswer !== null || superTestFinished ? 1 : 0)) / superTestQuestions.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* HEADER */}
      <header className="bg-[#f0ad4e] text-white px-5 py-4 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left touch-manipulation active:opacity-90 transition-opacity"
          aria-label="トップページへ戻る"
        >
          <JsiLogo variant="icon" className="h-11 drop-shadow-sm" priority />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-base font-extrabold tracking-tight leading-none text-white truncate">
              Japanese Super Words
            </h1>
            <p className="text-[10px] text-white/90 font-medium tracking-wide truncate">
              日本語スーパーワード
            </p>
          </div>
        </button>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors"
          aria-label="設定"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* MAIN CONTAINER (Mobile Centered / Premium Look) */}
      <div className="max-w-md mx-auto px-4 mt-5 space-y-6">
        
        {currentScreen === 'home' ? (
          /* ==================== HOME SCREEN ==================== */
          <div key="home-screen" className="space-y-5 animate-fade-in">
            {/* COMPACT PROFILE CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <label htmlFor="avatar-upload" className="relative flex-shrink-0 cursor-pointer block group pressable">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-inner group-hover:opacity-90 transition-opacity"
                      alt="ユーザーアバター"
                      onError={() => {
                        setUserAvatar(null);
                        localStorage.removeItem('japanese-super-words-avatar');
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-slate-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                    <Camera className="w-2.5 h-2.5" />
                  </div>
                </label>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {isEditingName ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                          onBlur={handleSaveName}
                          className="border border-slate-200 rounded-lg px-2 py-0.5 text-sm font-bold text-slate-800 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          autoFocus
                          maxLength={12}
                        />
                        <button onClick={handleSaveName} className="bg-emerald-500 text-white p-1 rounded-lg text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-base font-extrabold text-slate-900 truncate">{userName}</h2>
                        <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-slate-600 p-0.5">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${rank.color} shadow-sm`}>
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${xpPercentage}%` }} />
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[10px] text-slate-400 font-bold font-mono truncate">
                          {learnedIds.length}/{totalDbWords} · {totalXP}/{rank.nextXP} XP
                        </p>
                        {streakInfo.currentStreak > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-orange-600 flex-shrink-0">
                            <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                            {streakInfo.currentStreak}d
                          </span>
                        ) : !streakInfo.lastStudyDate ? (
                          <span className="text-[9px] font-bold text-slate-400 flex-shrink-0">Start streak</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip date / countdown */}
              <div className="mt-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/80 px-3 py-2.5">
                {tripDate && !isEditingTripDate ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {daysUntilTrip !== null && daysUntilTrip > 0 ? (
                        <>
                          <p className="text-[11px] font-black text-indigo-900 leading-tight">
                            {daysUntilTrip} day{daysUntilTrip === 1 ? '' : 's'} until Japan trip
                          </p>
                          <p className="text-[10px] font-semibold text-indigo-500/90">
                            来日まであと {daysUntilTrip}日
                          </p>
                        </>
                      ) : daysUntilTrip === 0 ? (
                        <>
                          <p className="text-[11px] font-black text-indigo-900 leading-tight">Today is your Japan trip!</p>
                          <p className="text-[10px] font-semibold text-indigo-500/90">今日が来日の日！</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[11px] font-black text-indigo-900 leading-tight">Hope you enjoyed Japan!</p>
                          <p className="text-[10px] font-semibold text-indigo-500/90">日本旅行お疲れさま！</p>
                        </>
                      )}
                      <p className="text-[9px] font-bold text-indigo-400/80 mt-0.5">
                        {formatTripDateLabel(tripDate)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTripDateDraft(tripDate);
                        setIsEditingTripDate(true);
                      }}
                      className="text-[10px] font-bold text-indigo-600 bg-white/80 px-2 py-1 rounded-full border border-indigo-100 hover:bg-white transition-colors flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-black text-indigo-900 leading-tight">When is your Japan trip?</p>
                        <p className="text-[10px] font-semibold text-indigo-500/90">日本はいつ行きますか？</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={tripDateDraft}
                        min={getTodayISO()}
                        onChange={(e) => setTripDateDraft(e.target.value)}
                        className="flex-1 min-w-0 border border-indigo-100 rounded-lg px-2.5 py-2 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button
                        type="button"
                        onClick={handleSaveTripDate}
                        disabled={!tripDateDraft}
                        className="px-3 py-2 rounded-lg text-[11px] font-black bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex-shrink-0"
                      >
                        Save
                      </button>
                    </div>
                    {tripDate && isEditingTripDate && (
                      <button
                        type="button"
                        onClick={handleClearTripDate}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                      >
                        Clear date / 日程をクリア
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showIntroWelcome && (
              <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200/50 animate-fade-in">
                <button
                  type="button"
                  onClick={() => setShowIntroWelcome(false)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-sm font-black pr-6">
                  Welcome, {userName}! 🎌
                </p>
                {tripDate && daysUntilTrip !== null && daysUntilTrip >= 0 && daysUntilTrip <= 7 ? (
                  <>
                    <p className="text-[11px] font-semibold text-indigo-100 mt-1">
                      {daysUntilTrip === 0
                        ? 'Your trip starts today — time for your final prep!'
                        : `${daysUntilTrip} day${daysUntilTrip === 1 ? '' : 's'} until Japan — start your free Day 1 lesson.`}
                    </p>
                    <p className="text-[10px] font-medium text-indigo-200/90 mt-0.5">
                      {daysUntilTrip === 0
                        ? '今日から旅の最終準備を始めましょう'
                        : '無料の Day 1 レッスンから始めよう'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowIntroWelcome(false);
                        setHomeTab('packs');
                        setCurrentScreen('trip_pack');
                      }}
                      className="btn-press mt-3 w-full py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-black"
                    >
                      Start 7-Day Trip Pack →
                    </button>
                  </>
                ) : fromYoutube && !tripDate ? (
                  <>
                    <p className="text-[11px] font-semibold text-indigo-100 mt-1">
                      Welcome from JSI! Practice speaking the phrases from our videos.
                    </p>
                    <p className="text-[10px] font-medium text-indigo-200/90 mt-0.5">
                      動画で聞いた表現を、フラッシュカード & クイズで口に出そう
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowIntroWelcome(false);
                          setHomeTab('situations');
                        }}
                        className="btn-press w-full py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-black"
                      >
                        Browse free situations →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowIntroWelcome(false);
                          setHomeTab('review');
                          handleStartSuperTest();
                        }}
                        className="btn-press w-full py-2.5 rounded-xl bg-white/15 text-white text-xs font-bold border border-white/25"
                      >
                        Try Phrase Level Check
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold text-indigo-100 mt-1">
                      {tripDate && daysUntilTrip !== null && daysUntilTrip > 7
                        ? `Your trip is in ${daysUntilTrip} days — explore free situations while you wait.`
                        : 'Explore free situations, or set your trip date to unlock the 7-day pack timeline.'}
                    </p>
                    <p className="text-[10px] font-medium text-indigo-200/90 mt-0.5">
                      {tripDate && daysUntilTrip !== null && daysUntilTrip > 7
                        ? '7日パックは来日7日前からおすすめです'
                        : '来日日程を設定すると7日パックが最適化されます'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowIntroWelcome(false);
                        setHomeTab('situations');
                      }}
                      className="btn-press mt-3 w-full py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-black"
                    >
                      Browse situations →
                    </button>
                  </>
                )}
              </div>
            )}

            {showYoutubeBanner && currentScreen === 'home' && (
              <div className="relative rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-4 shadow-sm animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(YOUTUBE_BANNER_DISMISSED_KEY, '1');
                    setShowYoutubeBanner(false);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-100/80 text-red-400 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-[10px] font-black uppercase tracking-wider text-red-600 pr-8">
                  JSI Viewer
                </p>
                <p className="text-sm font-black text-slate-900 mt-1 leading-snug pr-6">
                  You listen on YouTube — practice speaking here
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  Tap Listen on any card · カードの Listen で発音確認
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHomeTab('situations');
                      trackEvent('youtube_banner_cta', { action: 'situations' });
                    }}
                    className="btn-press flex-1 py-2 rounded-xl bg-indigo-600 text-white text-[11px] font-black"
                  >
                    Practice phrases
                  </button>
                  <a
                    href={YOUTUBE_WEB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('youtube_banner_cta', { action: 'channel' })}
                    className="btn-press flex-1 py-2 rounded-xl bg-white border border-red-100 text-red-700 text-[11px] font-black text-center"
                  >
                    More listening →
                  </a>
                </div>
              </div>
            )}

            {/* SEGMENT TABS */}
            <nav
              className="sticky top-[4.25rem] z-10 -mx-1 px-1 py-1 bg-slate-50/95 backdrop-blur-md"
              aria-label="ホームタブ"
            >
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                {homeTabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = homeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setHomeTab(tab.id)}
                      aria-selected={isActive}
                      className={`home-tab-button relative flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 pressable ${
                        isActive
                          ? 'home-tab-button--active bg-indigo-600 text-white shadow-md shadow-indigo-200/70'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      <TabIcon
                        className={`w-[18px] h-[18px] ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span className={`text-[11px] font-black leading-none ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {tab.enLabel}
                      </span>
                      <span
                        className={`text-[8px] font-bold leading-none ${
                          isActive ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {tab.label}
                      </span>
                      {tab.badge !== undefined && (
                        <span
                          className={`absolute top-1.5 right-1.5 min-w-[1rem] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center ${
                            isActive
                              ? 'bg-white text-indigo-600'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* TAB: PACKS */}
            {homeTab === 'packs' && (
              <div key="home-tab-packs" className="space-y-5 animate-fade-in">
                {/* Plans: Trip + Pro */}
                <section className="space-y-3">
                  <div className="px-0.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                      Choose your plan
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      プランを選ぶ · Trip か Pro の2つだけ
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Trip Pack */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('trip_pack')}
                      className="pack-card-wrap pack-card-wrap--featured pack-card-wrap--plan text-left pressable"
                    >
                      <div className="pack-card bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-4 text-white shadow-md h-full">
                        <div className="pack-card-shine" aria-hidden />
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                              <Luggage className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white">
                              {isTripPackUnlocked ? 'Unlocked' : 'Day 1 free'}
                            </span>
                          </div>
                          <h4 className="text-base font-black leading-tight">7-Day Trip Prep</h4>
                          <p className="text-[10px] font-semibold text-white/80 mt-0.5">旅行前7日間コース</p>
                          <p className="text-[10px] font-bold text-white/70 mt-2 leading-snug flex-1">
                            Guided lessons · roleplays · quizzes · cheat sheet
                          </p>
                          {!isTripPackUnlocked && (
                            <p className="text-lg font-black mt-3">
                              {TRIP_PACK_PRICE_USD}
                              <span className="text-[10px] font-bold text-white/70 ml-1.5">{TRIP_PACK_PRICE_JPY_NOTE}</span>
                            </p>
                          )}
                          {isTripPackUnlocked && (
                            <p className="text-[11px] font-bold text-emerald-200 mt-3 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Course unlocked
                            </p>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Japan Pro */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isPremiumUnlocked) return;
                        handleOpenProFromPacks('plan_card');
                      }}
                      disabled={isPremiumUnlocked}
                      className={`pack-card-wrap pack-card-wrap--premium pack-card-wrap--plan text-left ${isPremiumUnlocked ? 'opacity-95' : 'pressable'}`}
                    >
                      <div className="pack-card bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 p-4 text-white shadow-md h-full">
                        <div className="pack-card-shine" aria-hidden />
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-950/30 text-amber-50">
                              {isPremiumUnlocked ? 'Active' : 'Best value'}
                            </span>
                          </div>
                          <h4 className="text-base font-black leading-tight">Japan Pro</h4>
                          <p className="text-[10px] font-semibold text-white/85 mt-0.5">全部入りプラン</p>
                          <ul className="text-[9px] font-semibold text-white/75 mt-2 space-y-0.5 flex-1 leading-snug">
                            <li>· 7-day trip course</li>
                            <li>· {PREMIUM_SITUATION_COUNT} real Japan scenes</li>
                            <li>· {MINI_PACK_COUNT} guided mini courses</li>
                          </ul>
                          {!isPremiumUnlocked && (
                            <p className="text-lg font-black mt-3">
                              {JAPAN_PRO_PRICE_USD}
                              <span className="text-[10px] font-bold text-white/70 ml-1.5">{JAPAN_PRO_PRICE_JPY_NOTE}</span>
                            </p>
                          )}
                          {isPremiumUnlocked && (
                            <p className="text-[11px] font-bold text-amber-100 mt-3 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Everything unlocked
                            </p>
                          )}
                          {!isPremiumUnlocked && isTripPackUnlocked && (
                            <p className="text-[9px] font-bold text-amber-100/90 mt-1">{JAPAN_PRO_UPSELL_NOTE}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </section>

                {/* Theme packs */}
                <section className="space-y-3">
                  <div className="flex items-baseline justify-between px-0.5">
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight leading-none">
                        Guided mini courses
                      </h3>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                        ロールプレイ付き集中コース · {isPremiumUnlocked ? 'All unlocked' : 'Included with Japan Pro'}
                      </p>
                    </div>
                    {!isPremiumUnlocked && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Pro
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {getDisplayMiniPacks().map((pack) => {
                      const PackIcon = miniPackIcons[pack.id];
                      const unlocked = readMiniPackUnlocked(pack.id);
                      return (
                        <button
                          key={pack.id}
                          type="button"
                          onClick={() => handleMiniPackOpen(pack.id)}
                          className={`relative h-full rounded-2xl overflow-hidden text-left pressable shadow-sm border ${
                            unlocked ? 'border-emerald-200' : 'border-slate-100'
                          }`}
                        >
                          <div className={`h-full bg-gradient-to-br ${pack.accent} p-3.5 text-white`}>
                            <div className="flex items-start justify-between gap-1 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <PackIcon className="w-4 h-4" />
                              </div>
                              {unlocked ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                              )}
                            </div>
                            <h4 className="text-[12px] font-black leading-tight pr-1">{pack.titleEn}</h4>
                            <p className="text-[9px] font-semibold text-white/75 mt-0.5 line-clamp-1">{pack.title}</p>
                            <p className="text-[8px] font-bold text-white/60 mt-2">
                              {pack.wordIds.length} phrases · {pack.roleplays.length} roleplays
                            </p>
                          </div>
                          {!unlocked && (
                            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" aria-hidden />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <a
                  href={YOUTUBE_WEB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('youtube_channel_link', { source: 'packs_tab' })}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-red-100 hover:shadow-md transition-all pressable"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <YoutubeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-900 leading-tight">
                      More listening on YouTube
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5 truncate">
                      Japanese Super Immersion · 聞くはJSI、話すはこのアプリ
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={handleReportBug}
                  className="flex items-center gap-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-amber-200 hover:shadow-md transition-all pressable text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bug className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-900 leading-tight">
                      Report a bug or fix
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5 truncate">
                      バグや修正を報告する。
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </button>
              </div>
            )}

            {/* TAB: SITUATIONS */}
            {homeTab === 'situations' && (
              <div key="home-tab-situations" className="space-y-4 animate-fade-in">
                <div className="flex items-baseline justify-between px-0.5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                      Pick a situation
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      シチュエーションを選ぼう · {freeSituations.length + premiumSituations.length} scenes
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Free {freeSituations.length}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-0.5 mb-2">
                    Free · 無料
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {freeSituations.map((sit) => {
                      const stats = getStats(sit.id);
                      const Icon = sit.icon;
                      return (
                        <button
                          key={sit.id}
                          onClick={() => {
                            setSelectedSituation(sit.id);
                            setCurrentScreen('situation');
                            setFilter('all');
                          }}
                          className="bg-white rounded-xl border border-slate-100 shadow-sm px-2.5 py-2 text-left hover:border-indigo-100 hover:shadow-md transition-all group flex flex-col justify-between h-20"
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-extrabold text-slate-900 text-[11px] sm:text-xs leading-tight truncate">
                                {sit.enTitle}
                              </h4>
                              <p className="text-[8px] text-slate-400 font-medium truncate">{sit.title}</p>
                            </div>
                            <Icon className="w-3.5 h-3.5 text-indigo-500/80 group-hover:scale-110 transition-transform ml-1 flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 font-mono mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{stats.learnedCount}/{stats.total}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-0.5">
                    <div>
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        Japan Pro · プレミアム
                      </p>
                      <p className="text-[9px] text-amber-600/80 font-semibold mt-0.5">
                        {PREMIUM_SCENE_HIGHLIGHTS.join(' · ')} & more
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      {isPremiumUnlocked ? 'Unlocked' : 'Pro'}
                    </span>
                  </div>

                  {premiumSituationCategories.map((category) => {
                    const categorySituations = getPremiumSituationsByCategory(category.id);
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="px-0.5">
                          <h4 className="text-[11px] font-extrabold text-slate-800 leading-tight">
                            {category.enTitle}
                          </h4>
                          <p className="text-[9px] text-slate-400 font-semibold">
                            {category.title} · {category.descriptionJa ?? category.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {categorySituations.map((sit) => {
                            const stats = getStats(sit.id);
                            const Icon = sit.icon;
                            return (
                              <button
                                key={sit.id}
                                onClick={() => {
                                  if (isPremiumUnlocked) {
                                    setSelectedSituation(sit.id);
                                    setCurrentScreen('situation');
                                    setFilter('all');
                                  } else {
                                    setUnlockModal({ tier: 'pro', context: 'premium' });
                                    trackEvent('unlock_modal_open', {
                                      tier: 'pro',
                                      context: 'premium',
                                      source: 'situation_card',
                                      situation: sit.id,
                                    });
                                  }
                                }}
                                className={`${
                                  isPremiumUnlocked
                                    ? 'bg-amber-50/30 border-amber-200/50'
                                    : 'bg-yellow-50/20 border-yellow-100/50'
                                } rounded-xl border px-2.5 py-2 text-left hover:shadow-sm transition-all flex flex-col justify-between ${
                                  isPremiumUnlocked ? 'h-20' : 'min-h-[5.5rem]'
                                } relative overflow-hidden`}
                              >
                                <div className="situation-premium-glow" aria-hidden />
                                <div className="relative z-10 flex flex-col justify-between flex-1 min-h-0">
                                  <div className="flex justify-between items-start w-full gap-1">
                                    <div className="min-w-0 flex-1">
                                      <h4
                                        className={`font-extrabold ${
                                          isPremiumUnlocked ? 'text-amber-900' : 'text-slate-500'
                                        } text-[11px] sm:text-xs leading-tight truncate`}
                                      >
                                        {sit.enTitle}
                                      </h4>
                                      <p
                                        className={`text-[8px] ${
                                          isPremiumUnlocked ? 'text-amber-600/80' : 'text-slate-400'
                                        } font-medium truncate`}
                                      >
                                        {sit.title}
                                      </p>
                                    </div>
                                    {isPremiumUnlocked ? (
                                      <Icon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                    ) : (
                                      <Lock className="w-3 h-3 text-amber-500/60 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="mt-1">
                                    {isPremiumUnlocked ? (
                                      <div className="flex items-center gap-1 text-[9px] font-bold text-amber-700 font-mono">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <span>{stats.learnedCount}/{stats.total}</span>
                                      </div>
                                    ) : (
                                      <p className="text-[7px] text-slate-400 font-semibold leading-tight line-clamp-2">
                                        &ldquo;{sit.previewPhraseEn}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: REVIEW */}
            {homeTab === 'review' && (
              <div key="home-tab-review" className="space-y-4 animate-fade-in">
                <div className="px-0.5">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Review & test</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">復習・フレーズレベルチェック</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-100 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner flex-shrink-0">
                        <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-black text-slate-900 leading-tight">
                          {streakInfo.currentStreak > 0
                            ? `${streakInfo.currentStreak} day streak`
                            : 'Build your streak'}
                        </p>
                        <p className="text-[11px] font-semibold text-orange-700/80 mt-0.5">
                          {streakInfo.currentStreak > 0
                            ? `${streakInfo.currentStreak}日連続学習中`
                            : '今日からストリークを始めよう'}
                        </p>
                        {streakInfo.longestStreak > streakInfo.currentStreak && (
                          <p className="text-[10px] font-semibold text-slate-400 mt-1">
                            Best {streakInfo.longestStreak} days · 最高 {streakInfo.longestStreak}日
                          </p>
                        )}
                      </div>
                    </div>
                    {dueReviewCount > 0 && (
                      <span className="text-xs font-black font-mono bg-orange-600 text-white px-2.5 py-1 rounded-full flex-shrink-0">
                        {dueReviewCount}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl bg-white/80 border border-orange-100/80 px-3 py-2.5">
                    <p className="text-[11px] font-bold text-slate-700">
                      {dueReviewCount > 0
                        ? `${dueReviewCount} word${dueReviewCount === 1 ? '' : 's'} due today`
                        : learnedIds.length > 0
                          ? 'No reviews due today — great job!'
                          : 'Mark words as Learned to start spaced review'}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {dueReviewCount > 0
                        ? `今日の復習 ${dueReviewCount}語`
                        : learnedIds.length > 0
                          ? '今日の復習はありません'
                          : 'Learnedにすると復習スケジュールが始まります'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartSrsReview}
                    disabled={dueReviewCount === 0}
                    className={`w-full rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-extrabold text-sm transition-all pressable ${
                      dueReviewCount > 0
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {dueReviewCount > 0 ? 'Start today\'s review / 今日の復習' : 'Review reminder / 復習リマインダー'}
                  </button>
                </div>

                <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Phrase Level
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">フレーズレベル · XPランクとは別</p>
                    </div>
                    {currentPhraseLevel ? (
                      <PhraseLevelBadge level={currentPhraseLevel} size="sm" showLabel />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                        Not checked / 未診断
                      </span>
                    )}
                  </div>
                  <PhraseLevelLadder currentLevelId={savedPhraseLevel?.levelId ?? null} />
                  {savedPhraseLevel && (
                    <p className="text-[10px] font-semibold text-slate-500 text-center">
                      Best {savedPhraseLevel.bestPercent}% · {savedPhraseLevel.bestScore}/{savedPhraseLevel.bestTotal}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleStartSuperTest(false)}
                  disabled={phraseCheckPool.length < 3}
                  className={`w-full rounded-2xl border p-4 flex items-center justify-between group pressable ${
                    phraseCheckPool.length < 3
                      ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500 shadow-md shadow-indigo-200 hover:shadow-lg hover:from-indigo-700 hover:to-violet-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-inner">
                      <ClipboardCheck className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-white text-base tracking-wide">Phrase Level Check</h4>
                      <p className="text-[11px] text-indigo-100 font-semibold">
                        {phraseCheckUsesLearned ? 'Learned phrases' : 'All unlocked'} · up to {phraseCheckQuestionCount} questions
                      </p>
                      <p className="text-[10px] text-indigo-200/80 font-semibold mt-0.5">
                        旅行フレーズ力を6段階で判定
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentPhraseLevel ? (
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <currentPhraseLevel.icon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded-full">
                        Start
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </button>

                {phraseCheckPool.length < 3 && (
                  <p className="text-[10px] font-semibold text-slate-400 text-center px-2">
                    Mark at least 3 words as Learned to start / Learnedを3語以上にすると始められます
                  </p>
                )}

                {isTripPackUnlocked && !isPremiumUnlocked && (
                  <button
                    type="button"
                    onClick={handleOpenProUpsell}
                    className="w-full rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 flex items-center justify-between group pressable shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-amber-900 text-base">Upgrade to Japan Pro</h4>
                        <p className="text-[11px] text-amber-700/90 font-semibold mt-0.5">
                          {PREMIUM_SITUATION_COUNT} real scenes · {MINI_PACK_COUNT} guided courses · {JAPAN_PRO_UPSELL_NOTE}
                        </p>
                        <p className="text-[10px] text-amber-600/70 font-medium">プレミアム · {PREMIUM_SITUATION_COUNT}シチュ + ミニコース{MINI_PACK_COUNT}本</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-sm font-black text-amber-800">{JAPAN_PRO_PRICE_USD}</span>
                      <ChevronRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    setCurrentScreen('favorites');
                    setFilter('all');
                  }}
                  className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-100 p-4 flex items-center justify-between group pressable"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                      <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-slate-800 text-base">Favorite Words</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">お気に入り単語</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">
                      {favoriteIds.length}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </button>

                <div ref={wordSearchRef} className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={wordSearchQuery}
                      onChange={(e) => {
                        setWordSearchQuery(e.target.value);
                        setShowSearchSuggestions(true);
                      }}
                      onFocus={() => {
                        if (wordSearchQuery.trim()) setShowSearchSuggestions(true);
                      }}
                      placeholder="Search words… / 単語を検索"
                      className="w-full pl-9 pr-8 py-2.5 text-base sm:text-sm font-semibold text-slate-800 bg-white border border-slate-100 rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-200 transition-all"
                    />
                    {wordSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setWordSearchQuery('');
                          setShowSearchSuggestions(false);
                        }}
                        className="absolute right-2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {showSearchSuggestions && wordSearchQuery.trim() && (
                    <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                      {wordSearchResults.length > 0 ? (
                        wordSearchResults.map((card) => {
                          const sitInfo = getSituationInfo(card.situation);
                          const SitIcon = sitInfo?.icon;
                          return (
                            <button
                              key={card.id}
                              type="button"
                              onClick={() => {
                                setSearchWordPopup(card);
                                setShowSearchSuggestions(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-indigo-50/60 transition-colors border-b border-slate-50 last:border-b-0 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-extrabold text-slate-800 truncate">{card.english}</p>
                                <p className="text-[10px] text-slate-500 font-semibold truncate">{card.japanese}</p>
                                <p className="text-[9px] text-slate-400 font-mono truncate">{card.romaji}</p>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {sitInfo && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 max-w-[4.5rem]">
                                    {SitIcon && <SitIcon className="w-2.5 h-2.5 text-indigo-400 flex-shrink-0" />}
                                    <span className="text-[8px] font-bold text-slate-500 truncate leading-tight">{sitInfo.enTitle}</span>
                                  </span>
                                )}
                                {favoriteIds.includes(card.id) && (
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-3 py-3 text-[11px] text-slate-400 font-semibold text-center">
                          No matches / 該当する単語がありません
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Learned</p>
                    <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{learnedIds.length}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">/ {totalDbWords} words</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Streak</p>
                    <p className="text-2xl font-black text-orange-500 mt-1 font-mono flex items-center gap-1">
                      {streakInfo.currentStreak > 0 && (
                        <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
                      )}
                      {streakInfo.currentStreak}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {streakInfo.currentStreak > 0 ? 'days · 日連続' : 'Start today · 今日から'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : currentScreen === 'trip_pack' ? (
          <TripPackScreen
            daysUntilTrip={daysUntilTrip}
            learnedIds={learnedIds}
            favoriteIds={favoriteIds}
            onToggleLearned={handleToggleLearned}
            onToggleFavorite={handleToggleFavorite}
            onClose={() => setCurrentScreen('home')}
          />
        ) : currentScreen === 'mini_pack' && activeMiniPackId && getMiniPackById(activeMiniPackId) ? (
          <MiniPackScreen
            pack={getMiniPackById(activeMiniPackId)!}
            learnedIds={learnedIds}
            favoriteIds={favoriteIds}
            onToggleLearned={handleToggleLearned}
            onToggleFavorite={handleToggleFavorite}
            onClose={() => {
              setCurrentScreen('home');
              setActiveMiniPackId(null);
            }}
            onUnlockStateChange={() => {
              setIsPremiumUnlocked(readJapanProUnlocked());
              setIsTripPackUnlocked(readTripPackUnlocked());
            }}
            onRequestProUnlock={() => handleOpenProFromPacks('mini_pack_screen')}
          />
        ) : currentScreen === 'super_test' ? (
          /* ==================== SUPER TEST SCREEN ==================== */
          <>
            {showSuperTestIntro && (
              <div
                className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 ${
                  superTestIntroExiting ? 'animate-super-test-intro-exit' : 'animate-fade-in'
                }`}
              >
                <button
                  type="button"
                  onClick={handleSuperTestBack}
                  className="absolute top-5 left-5 p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors touch-manipulation"
                  aria-label="戻る"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 animate-intro-float" />
                  <div
                    className="absolute -bottom-20 -right-12 w-56 h-56 rounded-full bg-white/10 animate-intro-float"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                <div className="relative text-center space-y-5 animate-step-enter max-w-xs">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-step-bridge-ring" />
                    <div className="relative w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-indigo-900/20 border border-white/25">
                      <ClipboardCheck className="w-11 h-11 text-white" strokeWidth={2.25} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">
                      Phrase Level Check
                    </p>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      Check your travel phrase level
                    </h2>
                    <p className="text-sm font-bold text-indigo-100 mt-2">
                      旅行フレーズ力をチェック！
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-white/75 leading-relaxed">
                    {phraseCheckUsesLearned ? 'Learned phrases only' : 'All unlocked phrases'}
                    <span className="block text-[10px] text-white/55 mt-0.5">
                      {superTestQuestions.length}問 · 語彙・漢字・文法・リスニング
                    </span>
                  </p>
                  <div className="w-full max-w-[220px] mx-auto pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmStartSuperTest}
                      disabled={superTestIntroExiting}
                      className="w-full py-3.5 bg-white text-indigo-700 font-extrabold rounded-2xl shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 active:scale-[0.98] transition-all pressable disabled:opacity-70 disabled:pointer-events-none"
                    >
                      START
                      <span className="block text-xs font-bold text-indigo-500/90 mt-0.5">始める</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          <div
            key="super-test-screen"
            className={`space-y-5 ${
              showSuperTestIntro && !superTestIntroExiting
                ? 'opacity-0 pointer-events-none'
                : superTestIntroExiting
                ? 'animate-super-test-enter'
                : 'animate-step-enter'
            }`}
          >
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <button
                onClick={handleSuperTestBack}
                className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                  Phrase Level Check
                </h2>
                {!superTestFinished && (
                  <p className="text-xs text-indigo-600 font-bold font-mono mt-1">
                    {superTestIndex + 1} / {superTestQuestions.length}
                  </p>
                )}
              </div>
              <div className="text-right min-w-[52px]">
                <p className="text-[10px] text-slate-400 font-bold">Score</p>
                <p className="text-sm font-black text-emerald-600 font-mono">
                  {superTestScore}
                </p>
              </div>
            </div>

            {superTestFinished ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 text-center space-y-5 shadow-sm">
                {phraseCheckResult && (
                  <div className="space-y-3">
                    <PhraseLevelBadge level={phraseCheckResult.level} size="lg" className="justify-center" />
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{phraseCheckResult.level.enName}</h3>
                      <p className="text-sm font-bold text-slate-500">{phraseCheckResult.level.jaName}</p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">
                        {phraseCheckResult.level.taglineEn}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">{phraseCheckResult.level.taglineJa}</p>
                    </div>
                  </div>
                )}
                <div className="py-2">
                  <p className="text-4xl font-black text-indigo-600 font-mono">
                    {superTestScore}
                    <span className="text-xl text-slate-400">/{superTestQuestions.length}</span>
                  </p>
                  <p className="text-sm font-bold text-slate-500 mt-2">
                    {phraseCheckResult?.percent ?? Math.round((superTestScore / superTestQuestions.length) * 100)}% correct
                  </p>
                  {phraseCheckResult?.leveledUp && (
                    <p className="text-[11px] font-bold text-emerald-600 mt-2">Level up! / レベルアップ！</p>
                  )}
                </div>
                <PhraseLevelLadder currentLevelId={phraseCheckResult?.level.id ?? savedPhraseLevel?.levelId ?? null} compact />
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStartSuperTest(true)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-sm flex items-center justify-center gap-2 pressable"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry / もう一度
                  </button>
                  <button
                    type="button"
                    onClick={handleExitSuperTest}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                  >
                    Back to Review / 復習に戻る
                  </button>
                </div>
              </div>
            ) : currentTestQuestion ? (
              <div className="space-y-5">
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${superTestProgress}%` }}
                  />
                </div>

                {/* Question card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  {currentTestSituationInfo && CurrentTestSituationIcon && (
                    <div className="px-5 pt-4 pb-1">
                      <div className="inline-flex items-center gap-1.5">
                        <CurrentTestSituationIcon
                          className={`w-3 h-3 flex-shrink-0 ${
                            isCurrentTestPremiumSituation ? 'text-amber-600' : 'text-indigo-500'
                          }`}
                        />
                        <div className="text-left min-w-0">
                          <p
                            className={`text-xs font-extrabold leading-tight ${
                              isCurrentTestPremiumSituation ? 'text-amber-800' : 'text-indigo-800'
                            }`}
                          >
                            {currentTestSituationInfo.enTitle}
                          </p>
                          <p
                            className={`text-[10px] font-semibold leading-tight mt-0.5 ${
                              isCurrentTestPremiumSituation ? 'text-amber-600/80' : 'text-indigo-500/80'
                            }`}
                          >
                            {currentTestSituationInfo.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="px-6 pb-6 pt-3 text-center space-y-2">
                    {currentTestKindLabel && (
                      <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
                        {currentTestKindLabel.en} · {currentTestKindLabel.ja}
                      </p>
                    )}
                    {currentTestPrompt && (
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {currentTestPrompt.en}
                        <span className="block text-[9px] font-bold text-indigo-400/80 normal-case tracking-normal mt-0.5">
                          {currentTestPrompt.ja}
                        </span>
                      </p>
                    )}

                    {currentTestQuestion.kind === 'grammar' ? (
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-relaxed">
                        {currentTestQuestion.sentenceBefore}
                        <span className="inline-block mx-1 px-3 py-0.5 border-b-4 border-indigo-400 text-indigo-600">
                          ＿＿
                        </span>
                        {currentTestQuestion.sentenceAfter}
                      </h3>
                    ) : currentTestQuestion.kind === 'listening' ? (
                      <div className="space-y-3">
                        <div className="mx-auto w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                          <Volume2 className="w-9 h-9 text-indigo-500" />
                        </div>
                        <button
                          type="button"
                          onClick={handleReplayListening}
                          disabled={superTestSelectedAnswer !== null}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                        >
                          <Volume2 className="w-4 h-4" />
                          Play again / もう一度
                        </button>
                      </div>
                    ) : currentTestQuestion.kind === 'kanji' && currentTestQuestion.card ? (
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-relaxed">
                        {currentTestQuestion.card.japanese}
                      </h3>
                    ) : currentTestQuestion.card ? (
                      <>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-relaxed">
                          <RubyText
                            japanese={currentTestQuestion.card.japanese}
                            reading={currentTestQuestion.card.reading}
                          />
                        </h3>
                        <p className="text-sm text-slate-400 font-mono">
                          {currentTestQuestion.card.romaji}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Answer choices */}
                <div className="space-y-3">
                  {currentTestQuestion.choices.map((choice, idx) => {
                    const isSelected = superTestSelectedAnswer === idx;
                    const isCorrect = idx === currentTestQuestion.correctIndex;
                    const hasAnswered = superTestSelectedAnswer !== null;
                    const showCorrect = hasAnswered && isCorrect;
                    const showWrong = hasAnswered && isSelected && !isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuperTestAnswer(idx)}
                        disabled={hasAnswered}
                        className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-3 ${
                          showCorrect
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : showWrong
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : hasAnswered
                            ? 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'
                            : 'border-slate-100 bg-white text-slate-800 hover:border-indigo-200 hover:bg-indigo-50/50 pressable shadow-sm'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            showCorrect
                              ? 'bg-emerald-500 text-white'
                              : showWrong
                              ? 'bg-red-400 text-white'
                              : 'bg-indigo-100 text-indigo-600'
                          }`}
                        >
                          {showCorrect ? (
                            <Check className="w-4 h-4" />
                          ) : showWrong ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="flex-1 leading-snug">{choice}</span>
                      </button>
                    );
                  })}
                </div>

                {superTestSelectedAnswer !== null && (
                  <p className="text-center text-xs font-bold text-slate-400 animate-pulse">
                    次の問題へ… / Next question…
                  </p>
                )}
              </div>
            ) : null}
          </div>
          </>
        ) : currentScreen === 'srs_review' ? (
          /* ==================== SRS REVIEW SCREEN ==================== */
          <div key="srs-review-screen" className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <button
                onClick={handleExitSrsReview}
                className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                  Today&apos;s Review
                </h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">今日の復習</p>
                {!srsReviewComplete && srsReviewCards.length > 0 && (
                  <p className="text-xs text-orange-600 font-bold font-mono mt-1">
                    {srsReviewIndex + 1} / {srsReviewCards.length}
                  </p>
                )}
              </div>
              <button
                onClick={handleExitSrsReview}
                className="bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 transition-colors"
              >
                Exit / 終了
              </button>
            </div>

            {srsReviewComplete ? (
              <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-6 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Review complete!</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">復習完了 · {srsReviewCards.length} words</p>
                </div>
                {streakInfo.currentStreak > 0 && (
                  <p className="inline-flex items-center gap-1.5 text-sm font-black text-orange-600 bg-white px-3 py-1.5 rounded-full border border-orange-100">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    {streakInfo.currentStreak} day streak · {streakInfo.currentStreak}日連続
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleExitSrsReview}
                  className="w-full rounded-xl py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-200 transition-colors pressable"
                >
                  Back to Review / 復習タブへ
                </button>
              </div>
            ) : srsReviewCards.length > 0 ? (
              <div className="space-y-4">
                <p className="text-center text-[11px] font-semibold text-slate-500 px-2">
                  Tap card to flip · Remembered = next interval · Review again = sooner
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    カードをタップで裏返し · 覚えた=次回へ · もう一度=早めに復習
                  </span>
                </p>
                <div key={srsReviewCards[srsReviewIndex].id} className="animate-card-slide">
                  <FlashCard
                    card={srsReviewCards[srsReviewIndex]}
                    isLearned={learnedIds.includes(srsReviewCards[srsReviewIndex].id)}
                    isFavorite={favoriteIds.includes(srsReviewCards[srsReviewIndex].id)}
                    mode="review"
                    onToggleLearned={handleSrsReviewOutcome}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* ==================== DETAIL / LIST SCREEN ==================== */
          isRandomStudyMode ? (
            /* ==================== RANDOM STUDY MODE ==================== */
            <div key="random-study-screen" className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <button
                  onClick={() => setIsRandomStudyMode(false)}
                  className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                    Random Study
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ランダム学習</p>
                  <p className="text-xs text-indigo-600 font-bold font-mono mt-1">
                    {currentCardIndex + 1} / {randomStudyCards.length}
                  </p>
                </div>
                <button
                  onClick={() => setIsRandomStudyMode(false)}
                  className="bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 transition-colors"
                >
                  Exit / 終了
                </button>
              </div>

              {randomStudyCards.length > 0 && (
                <div className="space-y-6">
                  <div key={randomStudyCards[currentCardIndex].id} className="animate-card-slide">
                    <FlashCard
                      card={randomStudyCards[currentCardIndex]}
                      isLearned={learnedIds.includes(randomStudyCards[currentCardIndex].id)}
                      isFavorite={favoriteIds.includes(randomStudyCards[currentCardIndex].id)}
                      onToggleLearned={handleRandomStudyToggleLearned}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ==================== NORMAL LIST VIEW ==================== */
            <div key={`list-screen-${selectedSituation || currentScreen}`} className="space-y-5 animate-fade-in">
              {/* Header / Nav */}
              <div className="sticky top-[64px] z-10 bg-slate-50/95 backdrop-blur-sm py-2 -mx-4 px-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentScreen('home');
                    setIsRandomStudyMode(false);
                  }}
                  className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-500 hover:text-slate-800" />
                </button>
                <div>
                  {currentScreen === 'favorites' ? (
                    <>
                      <h2 className="text-xl font-black text-slate-900 leading-tight">
                        Favorite Words
                      </h2>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        お気に入り単語
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-black text-slate-900 leading-tight">
                        {getSituationInfo(selectedSituation)?.enTitle}
                      </h2>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        {getSituationInfo(selectedSituation)?.title}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons & Filters */}
              <div className="flex flex-col gap-3">
                {/* Random Study Button */}
                {displayCards.length > 0 && (
                  <button
                    onClick={handleOpenRandomStudyModal}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-sm flex items-center justify-center gap-2 pressable hover:shadow-md"
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse flex-shrink-0" />
                    <div className="text-center leading-tight">
                      <span className="block text-sm">Random Study</span>
                      <span className="block text-[10px] font-semibold text-white/80 mt-0.5">ランダムで学習</span>
                    </div>
                  </button>
                )}

                {/* Filters */}
                {displayCards.length > 0 || filter === 'unlearned' ? (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-full">
                    <button
                      onClick={() => setFilter('all')}
                      className={`flex-1 text-center py-2 rounded-lg transition-all ${
                        filter === 'all'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <span className="block text-xs font-bold">
                        All ({currentScreen === 'favorites' ? favoriteIds.length : selectedSituation ? getStats(selectedSituation).total : 0})
                      </span>
                      <span className={`block text-[9px] font-semibold mt-0.5 ${
                        filter === 'all' ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        すべて ({currentScreen === 'favorites' ? favoriteIds.length : selectedSituation ? getStats(selectedSituation).total : 0})
                      </span>
                    </button>
                    <button
                      onClick={() => setFilter('unlearned')}
                      className={`flex-1 text-center py-2 rounded-lg transition-all ${
                        filter === 'unlearned'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <span className="block text-xs font-bold">
                        Not Yet Learned ({
                          currentScreen === 'favorites'
                            ? displayCards.filter(c => !learnedIds.includes(c.id)).length
                            : selectedSituation
                            ? getStats(selectedSituation).total - getStats(selectedSituation).learnedCount
                            : 0
                        })
                      </span>
                      <span className={`block text-[9px] font-semibold mt-0.5 ${
                        filter === 'unlearned' ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        まだ覚えてない ({
                          currentScreen === 'favorites'
                            ? displayCards.filter(c => !learnedIds.includes(c.id)).length
                            : selectedSituation
                            ? getStats(selectedSituation).total - getStats(selectedSituation).learnedCount
                            : 0
                        })
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Card List — situation: JA + furigana; favorites: EN first */}
              {displayCards.length > 0 ? (
                <div className="space-y-2">
                  {displayCards.map((card) => {
                    const isFav = favoriteIds.includes(card.id);
                    const isLearned = learnedIds.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSearchWordPopup(card)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSearchWordPopup(card);
                          }
                        }}
                        className={`bg-white rounded-xl border border-slate-100 px-4 flex items-center justify-between shadow-sm hover:border-slate-200 pressable cursor-pointer ${
                          currentScreen === 'situation' ? 'py-3' : 'py-2.5'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          {currentScreen === 'situation' ? (
                            <>
                              <RubyText
                                japanese={card.japanese}
                                reading={card.reading || card.japanese}
                                className="word-list-ruby font-extrabold text-slate-800 text-sm sm:text-base leading-relaxed"
                              />
                              <p className="text-[10px] text-slate-500 font-semibold tracking-wide mt-1 line-clamp-2">
                                {card.english}
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono tracking-wide truncate mt-0.5">
                                {card.romaji}
                              </p>
                            </>
                          ) : (
                            <>
                              <h4 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight truncate">
                                {card.english}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
                                {card.japanese}
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono tracking-wide truncate">
                                {card.romaji}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Learned Toggle Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLearned(card.id, !isLearned);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider transition-all flex items-center gap-1.5 ${
                              isLearned
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isLearned ? 'bg-white' : 'bg-slate-400'}`} />
                            <span>{isLearned ? 'Learned' : 'Still'}</span>
                          </button>

                          {/* Favorite Star Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(card.id, !isFav);
                            }}
                            className="p-1.5 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0"
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star
                              className={`w-4 h-4 icon-pop ${
                                isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-400'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center space-y-4 shadow-sm max-w-sm mx-auto">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    {currentScreen === 'favorites' ? (
                      <>
                        <h3 className="text-base font-extrabold text-slate-800">
                          Your favorites are empty
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          お気に入りは空っぽです
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          No words have been added to your favorites yet.
                        </p>
                        <p className="text-[10px] text-slate-400/80 font-medium">
                          お気に入りに追加したワードはありません。
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-base font-extrabold text-slate-800">
                          All words mastered!
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          すべて覚えました！
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Congratulations! You&apos;ve mastered every flashcard in this set.
                        </p>
                        <p className="text-[10px] text-slate-400/80 font-medium">
                          おめでとうございます！すべてのフラッシュカードをマスターしました。
                        </p>
                      </>
                    )}
                  </div>
                  {filter === 'unlearned' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl"
                    >
                      すべての単語を表示
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* WORD SEARCH DETAIL POPUP */}
      {searchWordPopup && (() => {
        const popupSituation = getSituationInfo(searchWordPopup.situation);
        const PopupSitIcon = popupSituation?.icon;
        return (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSearchWordPopup(null)}
        >
          <div
            className="bg-white rounded-[28px] p-5 max-w-sm w-full shadow-2xl border border-slate-100 animate-scale-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            {popupSituation && (
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100 max-w-[calc(100%-3.5rem)]">
                {PopupSitIcon && (
                  <PopupSitIcon className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                )}
                <span className="text-[10px] font-bold text-slate-600 truncate">
                  {popupSituation.title}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSearchWordPopup(null)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 pt-7">
              <div className="text-center space-y-1 pr-6">
                <RubyText
                  japanese={searchWordPopup.japanese}
                  reading={searchWordPopup.reading}
                  className="text-2xl font-black text-slate-900 leading-relaxed"
                />
                <p className="text-xs text-slate-400 font-mono tracking-wide">
                  {searchWordPopup.romaji}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl px-4 py-3 text-center">
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                  {searchWordPopup.english}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  speakJapanese(searchWordPopup.reading || searchWordPopup.japanese, {
                    cardId: searchWordPopup.id,
                    situation: searchWordPopup.situation,
                  })
                }
                className="mx-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition-colors"
                aria-label="Listen"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleToggleLearned(
                      searchWordPopup.id,
                      !learnedIds.includes(searchWordPopup.id)
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all flex items-center gap-1.5 ${
                    learnedIds.includes(searchWordPopup.id)
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      learnedIds.includes(searchWordPopup.id) ? 'bg-white' : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    {learnedIds.includes(searchWordPopup.id) ? 'Learned' : 'Still learning'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleToggleFavorite(
                      searchWordPopup.id,
                      !favoriteIds.includes(searchWordPopup.id)
                    )
                  }
                  className="p-2 rounded-full hover:bg-slate-50 transition-colors"
                  title={
                    favoriteIds.includes(searchWordPopup.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  <Star
                    className={`w-5 h-5 icon-pop ${
                      favoriteIds.includes(searchWordPopup.id)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 hover:text-amber-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* RANDOM STUDY SETUP MODAL */}
      {showRandomStudyModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-5 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="text-center space-y-1 pt-1">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-7 h-7 text-amber-400 fill-amber-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Random Study</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">ランダムで学習</p>
            </div>

            <div className="space-y-3">
              <div className="text-center space-y-0.5">
                <p className="text-sm font-extrabold text-slate-800">How many questions?</p>
                <p className="text-[11px] font-semibold text-slate-400">何問学習しますか？</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={randomStudyAllCards.length}
                  value={randomStudyCountInput}
                  onChange={(e) => {
                    setRandomStudyCountInput(e.target.value);
                    setRandomStudyCountError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRandomStudyWithCount();
                  }}
                  className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  onClick={handleRandomStudyWithCount}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-sm pressable flex-shrink-0"
                >
                  <span className="block text-sm leading-tight">Start</span>
                  <span className="block text-[10px] font-semibold text-white/80">開始</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold text-center">
                Max {randomStudyAllCards.length} questions · 最大 {randomStudyAllCards.length} 問
              </p>

              {randomStudyCountError && (
                <p className="text-xs text-red-500 font-bold text-center leading-snug">{randomStudyCountError}</p>
              )}
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <button
                onClick={handleRandomStudyAllUnlearned}
                disabled={randomStudyUnlearnedCount === 0}
                className="w-full py-3.5 px-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 pressable disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between gap-3"
              >
                <div className="text-left">
                  <span className="block text-sm font-extrabold">All Unlearned Only</span>
                  <span className="block text-[11px] font-semibold text-emerald-600/90 mt-0.5">未学習のみを全問出題</span>
                </div>
                <span className="text-xs font-black font-mono bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex-shrink-0">
                  {randomStudyUnlearnedCount}
                </span>
              </button>

              <button
                onClick={handleRandomStudyAll}
                className="w-full py-3.5 px-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50 text-indigo-800 pressable flex items-center justify-between gap-3"
              >
                <div className="text-left">
                  <span className="block text-sm font-extrabold">Study All</span>
                  <span className="block text-[11px] font-semibold text-indigo-600/90 mt-0.5">全てを学習</span>
                </div>
                <span className="text-xs font-black font-mono bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full flex-shrink-0">
                  {randomStudyAllCards.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowRandomStudyModal(false);
                  setRandomStudyCountError('');
                }}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 pressable"
              >
                <span className="block text-sm font-extrabold">Back</span>
                <span className="block text-[11px] font-semibold text-slate-400 mt-0.5">戻る</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {unlockModal && (
        <UnlockModal
          tier={unlockModal.tier}
          context={unlockModal.context}
          daysUntilTrip={daysUntilTrip}
          initialCode={pendingUnlockCode}
          onClose={() => {
            setUnlockModal(null);
            setPendingUnlockCode('');
          }}
          onUnlock={handleUnlockSuccess}
        />
      )}

      {/* PWA ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-5 shadow-2xl border border-slate-100 animate-scale-up relative">
            <button
              onClick={closePwaOnboarding}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5 pt-2">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Add to Home Screen! 📲
              </h3>
              <p className="text-xs text-slate-500 font-semibold italic">
                Get the best experience on your phone
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setOnboardingTab('ios')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  onboardingTab === 'ios'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                 Apple iOS (Safari)
              </button>
              <button
                onClick={() => setOnboardingTab('android')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  onboardingTab === 'android'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🤖 Android (Chrome)
              </button>
            </div>

            {/* STEP BY STEP INSTRUCTIONS */}
            <div className="space-y-3.5 py-1">
              {onboardingTab === 'ios' ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        Tap the Share button <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Safariブラウザ最下部の共有ボタンを押します。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        Select 'Add to Home Screen' <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        メニューから「ホーム画面に追加」をタップします。
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        Tap the Share button <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Chromeブラウザ右上のメニューボタンを押します。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        Select 'Add to Home screen' <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        「ホーム画面に追加」をタップします。
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={closePwaOnboarding}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-md shadow-indigo-100 text-sm pressable"
            >
              Got it, let's start! 🚀
            </button>
          </div>
        </div>
      )}

      {showIntroWizard && (
        <IntroWizard fromYoutube={fromYoutube} onComplete={handleIntroComplete} />
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-hidden">
          <div className="bg-white rounded-[32px] max-w-sm w-full max-h-[calc(100dvh-2rem)] flex flex-col shadow-2xl border border-slate-100 animate-scale-up relative">
            <div className="flex-shrink-0 px-6 pt-6 relative">
              {messageStep ? (
                <button
                  onClick={() => {
                    if (messageStep === 'confirm') {
                      setMessageStep('form');
                      setMessageSendError('');
                    } else if (messageStep === 'success') {
                      resetMessageFlow();
                    } else {
                      resetMessageFlow();
                    }
                  }}
                  className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
                  aria-label="戻る"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : null}

              <button
                onClick={closeSettingsModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 pt-2 px-10">
                <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  {messageStep ? (
                    <MessageCircle className="w-7 h-7" />
                  ) : (
                    <Settings className="w-7 h-7" />
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {messageStep === 'form'
                    ? 'Send a Message'
                    : messageStep === 'confirm'
                    ? 'Confirm Message'
                    : messageStep === 'success'
                    ? 'Message Sent'
                    : 'Settings'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {messageStep === 'form'
                    ? 'メッセージを送る'
                    : messageStep === 'confirm'
                    ? '送信内容の確認'
                    : messageStep === 'success'
                    ? '送信完了'
                    : '設定'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-5 space-y-5">
              {messageStep === 'form' ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="message-name"
                        className="block text-xs font-bold text-slate-600"
                      >
                        Your Name / お名前
                      </label>
                      <input
                        id="message-name"
                        type="text"
                        value={messageName}
                        onChange={(e) => setMessageName(e.target.value)}
                        maxLength={100}
                        placeholder="例: たろう"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message-body"
                        className="block text-xs font-bold text-slate-600"
                      >
                        Message / メッセージ
                      </label>
                      <textarea
                        id="message-body"
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        maxLength={2000}
                        rows={6}
                        placeholder="鳥山さん・宮崎さんへのメッセージを入力してください"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 resize-none"
                      />
                      <p className="text-[10px] text-slate-400 text-right font-semibold">
                        {messageBody.length}/2000
                      </p>
                    </div>

                    {messageFormError && (
                      <p className="text-xs font-bold text-red-500 leading-relaxed">
                        {messageFormError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleMessageToConfirm}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-sm shadow-indigo-200 pressable flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Continue / 確認画面へ</span>
                  </button>
                </>
              ) : messageStep === 'confirm' ? (
                <>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Your Name / お名前
                      </p>
                      <p className="text-sm font-extrabold text-slate-800 mt-1 break-words">
                        {messageName.trim()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Message / メッセージ
                      </p>
                      <p className="text-sm font-semibold text-slate-700 mt-1 whitespace-pre-wrap break-words leading-relaxed">
                        {messageBody.trim()}
                      </p>
                    </div>
                  </div>

                    <p className="text-xs text-slate-500 leading-relaxed text-center">
                      Send this message to Toriyama-san and Miyazaki-san?
                      <br />
                      <span className="font-semibold text-[10px] text-slate-400">
                        この内容で鳥山さんと宮崎さんに送信します。よろしいですか？
                      </span>
                    </p>

                  {messageSendError && (
                    <p className="text-xs font-bold text-red-500 leading-relaxed text-center">
                      {messageSendError}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMessageStep('form');
                        setMessageSendError('');
                      }}
                      disabled={isSendingMessage}
                      className="py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-600 font-extrabold text-sm pressable disabled:opacity-50"
                    >
                      Back / 戻る
                    </button>
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isSendingMessage}
                      className="py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-sm shadow-indigo-200 pressable flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSendingMessage ? 'Sending…' : 'Send / 送信する'}</span>
                    </button>
                  </div>
                </>
              ) : messageStep === 'success' ? (
                <>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="text-sm font-extrabold text-emerald-900 leading-relaxed">
                      Your message has been sent. Thank you!
                    </p>
                    <p className="text-xs font-semibold text-emerald-600/90 mt-0.5">
                      メッセージを送信しました。ありがとうございます！
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetMessageFlow}
                    className="w-full py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-extrabold text-sm pressable"
                  >
                    Back to Settings / 設定に戻る
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-left space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 leading-snug">
                      Purchases are saved with your unlock code — not an account.
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 leading-snug">
                      購入はアカウントではなくコードで管理されます。別の端末では同じコードを再入力してください。
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 leading-snug pt-0.5">
                      Lost your code? Use the message form below.
                      <span className="block">コードを忘れた場合は下の問い合わせへ</span>
                    </p>
                  </div>

                  {!isPremiumUnlocked && !isTripPackUnlocked && (
                    <button
                      type="button"
                      onClick={() => handleOpenTripUnlock()}
                      className="w-full py-3.5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 pressable flex items-center justify-center gap-2.5"
                    >
                      <Luggage className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <div className="text-left">
                        <span className="block text-sm font-extrabold text-indigo-900">Unlock Trip Course</span>
                        <span className="block text-[11px] font-semibold text-indigo-600/90">
                          7-day guided course · {TRIP_PACK_PRICE_USD}
                        </span>
                      </div>
                    </button>
                  )}

                  {isTripPackUnlocked && !isPremiumUnlocked && (
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                        <Luggage className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-extrabold text-indigo-900">Trip Course Active</span>
                        <span className="block text-[11px] font-semibold text-indigo-700/90">7-day course unlocked · Day 1–7</span>
                      </div>
                    </div>
                  )}

                  {!isPremiumUnlocked && (
                    <button
                      type="button"
                      onClick={() => handleOpenPremiumUnlock()}
                      className="w-full py-3.5 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 pressable flex items-center justify-center gap-2.5"
                    >
                      <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div className="text-left">
                        <span className="block text-sm font-extrabold text-amber-800">Unlock Japan Pro</span>
                        <span className="block text-[11px] font-semibold text-amber-600/90">
                          Trip + {PREMIUM_SITUATION_COUNT} scenes + {MINI_PACK_COUNT} guided courses · {JAPAN_PRO_PRICE_USD}
                        </span>
                      </div>
                    </button>
                  )}

                  {isPremiumUnlocked && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-extrabold text-amber-900">Japan Pro Active</span>
                        <span className="block text-[11px] font-semibold text-amber-700/90">Full course + {PREMIUM_SITUATION_COUNT} scenes + {MINI_PACK_COUNT} guided courses</span>
                      </div>
                    </div>
                  )}

                  {isStandaloneApp ? (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-200">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="block text-sm font-extrabold text-emerald-900">Added to Home Screen</span>
                        <span className="block text-[11px] font-semibold text-emerald-600/90 mt-0.5">ホーム画面に追加済み</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 to-violet-50/70 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="block text-sm font-extrabold text-slate-900 leading-tight">Add to Home Screen</span>
                          <span className="block text-[11px] font-semibold text-indigo-600/90 mt-0.5">ホーム画面に追加</span>
                          <p className="text-[11px] text-slate-500 leading-snug mt-1.5">
                            {canNativeInstall
                              ? 'Launch like an app with one tap.'
                              : 'Add from Safari / Chrome to start learning faster.'}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                            {canNativeInstall
                              ? 'ワンタップでアプリのように起動できます。'
                              : 'Safari / Chrome から追加すると、すぐに学習を始められます。'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddToHomeScreen}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-sm shadow-indigo-200 pressable flex items-center justify-center gap-2"
                      >
                        {canNativeInstall ? (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Install / インストール</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            <span>How to Add / 追加方法を見る</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleOpenMessageForm}
                    className="w-full py-3.5 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 pressable flex items-center justify-center gap-2.5"
                  >
                    <MessageCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    <div className="text-left">
                      <span className="block text-sm font-extrabold text-violet-900">
                        Send a message to Toriyama-san and Miyazaki-san
                      </span>
                      <span className="block text-[11px] font-semibold text-violet-600/90">
                        鳥山さんと宮崎さんにメッセージを送る
                      </span>
                    </div>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={link.id === 'youtube' ? openYoutubeLink : undefined}
                          className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl border ${link.border} ${link.bg} ${link.text} font-bold text-sm pressable`}
                        >
                          <Icon className="w-7 h-7" />
                          <span>{link.label}</span>
                        </a>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleResetProgress}
                    className="w-full py-3.5 rounded-2xl border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-600 hover:text-red-700 pressable"
                  >
                    <span className="block text-sm font-extrabold">Reset Saved Data</span>
                    <span className="block text-[11px] font-semibold text-red-400 mt-0.5">保存データをリセット</span>
                  </button>

                  <Link
                    href="/privacy"
                    onClick={closeSettingsModal}
                    className="block w-full py-3 rounded-2xl border border-slate-100 bg-white text-center text-slate-500 hover:text-indigo-600 hover:border-indigo-100 pressable"
                  >
                    <span className="block text-xs font-extrabold">Privacy Policy</span>
                    <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">プライバシーポリシー</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUPER TEST EXIT CONFIRM MODAL */}
      {showSuperTestExitConfirm && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-5 shadow-2xl border border-indigo-100 animate-scale-up">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Quit the level check?
                </h3>
                <p className="text-sm font-bold text-indigo-600">
                  本当にやめますか？
                </p>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  Your progress in this session will be lost.
                  <br />
                  <span className="text-[10px] text-slate-400">
                    このチェックの進捗は保存されません。
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSuperTestExitConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Continue
                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">続ける</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmExitSuperTest}
                className="flex-1 py-3 rounded-2xl text-sm font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 pressable"
              >
                Quit
                <span className="block text-[10px] font-semibold text-indigo-100 mt-0.5">やめる</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET DATA CONFIRM MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-5 shadow-2xl border border-red-100 animate-scale-up">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <RotateCcw className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  All saved data will be deleted. Are you sure?
                </h3>
                <p className="text-sm font-bold text-red-500">
                  保存データが消えます。よろしいですか？
                </p>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  Progress, favorites, Premium, best scores, and more will be reset.
                  <br />
                  <span className="text-[10px] text-slate-400">
                    学習進捗・お気に入り・Premium・ベストスコアなどが初期状態に戻ります。
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">キャンセル</span>
              </button>
              <button
                onClick={performResetSavedData}
                className="flex-1 py-3 rounded-2xl text-sm font-extrabold bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100 pressable"
              >
                Reset
                <span className="block text-[10px] font-semibold text-red-100 mt-0.5">リセットする</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM UNLOCKED MODAL */}
      {showPremiumUnlockedModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center space-y-5 shadow-2xl border border-amber-100 animate-scale-up relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-amber-100/80">
              <Sparkles className="w-9 h-9 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                Japan Pro Unlocked
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Welcome to Japan Pro!
              </h3>
              <p className="text-sm font-bold text-amber-600">
                {PREMIUM_SITUATION_COUNT} real Japan scenes · {getJapanProPhraseCount()}+ phrases
              </p>
              <p className="text-[11px] text-slate-500 font-semibold">
                Japan Pro が解放されました
              </p>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                Airport, last train, Don Quijote, onsen & more — all unlocked.
                <br />
                空港・終電・ドンキ・温泉など、プレミアム{PREMIUM_SITUATION_COUNT}シチュすべて使えます。
              </p>
            </div>
            <button
              onClick={() => setShowPremiumUnlockedModal(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold rounded-2xl shadow-md shadow-amber-200 text-sm pressable"
            >
              さあ、学習を始めよう！ / Let&apos;s start learning!
            </button>
          </div>
        </div>
      )}

      {/* PHRASE LEVEL UP MODAL */}
      {showPhraseLevelUpModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100 animate-scale-up">
            <PhraseLevelBadge level={showPhraseLevelUpModal} size="lg" className="justify-center" />
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Phrase Level Up!
              </h3>
              <p className="text-sm text-slate-800 font-extrabold">
                フレーズレベルアップ！
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                You reached <span className="font-black text-indigo-600">{showPhraseLevelUpModal.enName}</span>
                <span className="text-slate-400"> ({showPhraseLevelUpModal.jaName})</span>
                <br />
                新しいフレーズレベルに到達しました
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPhraseLevelUpModal(null)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-md shadow-indigo-100 text-sm pressable"
            >
              Nice! / やったね！
            </button>
          </div>
        </div>
      )}

      {/* RANK UP MODAL */}
      {showRankUpModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <Award className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Congratulations! Rank Up! 🎉
              </h3>
              <p className="text-sm text-slate-800 font-extrabold">
                おめでとうございます！ランクアップ！
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have reached the <span className="font-black text-amber-600">{showRankUpModal.enName} ({showRankUpModal.name})</span> level!
                <br />
                新しいランクに到達しました！
              </p>
            </div>
            <button
              onClick={() => setShowRankUpModal(null)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md shadow-amber-100 text-sm pressable"
            >
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
