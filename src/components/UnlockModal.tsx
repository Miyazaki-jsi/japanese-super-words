'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ExternalLink,
  Lock,
  Plane,
  Sparkles,
  X,
} from 'lucide-react';
import {
  tripPackDays,
  TRIP_PACK_FIRST_PAID_DAY,
  TRIP_PACK_LAST_DAY_NUMBER,
  TRIP_PACK_PAID_DAY_COUNT,
  TRIP_PACK_PAID_DAY_LABEL,
  TRIP_PACK_PAID_PHRASE_COUNT,
  TRIP_PACK_PAID_QUIZ_COUNT,
  TRIP_PACK_PAID_ROLEPLAY_COUNT,
  TRIP_PACK_TOTAL_PHRASE_COUNT,
} from '@/data/tripPack';
import { MINI_PACK_COUNT } from '@/data/miniPacks';
import {
  PREMIUM_PHRASE_COUNT,
  PREMIUM_SCENE_HIGHLIGHTS,
  PREMIUM_SITUATION_COUNT,
} from '@/data/premiumSituations';
import {
  JAPAN_PRO_GUMROAD_URL,
  JAPAN_PRO_PRICE_JPY_NOTE,
  JAPAN_PRO_PRICE_USD,
  TRIP_PACK_GUMROAD_URL,
  TRIP_PACK_PRICE_JPY_NOTE,
  TRIP_PACK_PRICE_USD,
  type UnlockTier,
} from '@/data/monetization';
import { trackEvent } from '@/lib/analytics';
import { useVisualViewport } from '@/lib/useVisualViewport';
import { verifyUnlockCode } from '@/lib/unlockClient';

export type UnlockContext = 'hub' | 'day' | 'complete' | 'premium' | 'upsell';

type UnlockModalProps = {
  tier: UnlockTier;
  context: UnlockContext;
  daysUntilTrip?: number | null;
  onClose: () => void;
  onUnlock: (tier: UnlockTier) => void;
};

const TRIP_CONTEXT_COPY: Record<Exclude<UnlockContext, 'premium' | 'upsell'>, { title: string; titleJa: string; lead: string; leadJa: string }> = {
  hub: {
    title: 'Unlock the Full 7-Day Course',
    titleJa: '7日間コースを解放',
    lead: `Day 1 is free. Get all ${TRIP_PACK_PAID_DAY_COUNT} remaining guided lessons before your trip.`,
    leadJa: `Day 1 は無料。残り${TRIP_PACK_PAID_DAY_COUNT}日分のレッスンをすべて使えます。`,
  },
  day: {
    title: 'This Lesson Is Locked',
    titleJa: 'このレッスンはロック中',
    lead: `${TRIP_PACK_PAID_DAY_LABEL} unlock with the full course. Complete Day 1 free first.`,
    leadJa: `Day ${TRIP_PACK_FIRST_PAID_DAY}〜${TRIP_PACK_LAST_DAY_NUMBER} はフルコース購入で解放。まず Day 1 を無料で。`,
  },
  complete: {
    title: 'Day 1 Complete!',
    titleJa: 'Day 1 クリア！',
    lead: `You crushed Day 1. Unlock ${TRIP_PACK_PAID_PHRASE_COUNT} more phrases, ${TRIP_PACK_PAID_ROLEPLAY_COUNT} roleplays & ${TRIP_PACK_PAID_QUIZ_COUNT} quizzes.`,
    leadJa: `お疲れさまでした。残り${TRIP_PACK_PAID_PHRASE_COUNT}フレーズ · ロールプレイ${TRIP_PACK_PAID_ROLEPLAY_COUNT} · クイズ${TRIP_PACK_PAID_QUIZ_COUNT}問を解放しましょう。`,
  },
};

const PRO_CONTEXT_COPY: Record<'premium' | 'upsell', { title: string; titleJa: string; lead: string; leadJa: string }> = {
  premium: {
    title: 'Unlock Japan Pro',
    titleJa: 'Japan Pro を解放',
    lead: `Full trip course, ${PREMIUM_SITUATION_COUNT} real Japan scenes (${PREMIUM_SCENE_HIGHLIGHTS.slice(0, 4).join(', ')} & more), plus ${MINI_PACK_COUNT} guided mini courses.`,
    leadJa: `7日コース + 実シーン${PREMIUM_SITUATION_COUNT}種 + ガイド付きミニコース${MINI_PACK_COUNT}本`,
  },
  upsell: {
    title: 'Upgrade to Japan Pro',
    titleJa: 'Japan Pro にアップグレード',
    lead: `Trip course unlocked! Add ${PREMIUM_SITUATION_COUNT} scene packs + ${MINI_PACK_COUNT} guided mini courses with roleplay.`,
    leadJa: `旅行コース解放済み。実シーン${PREMIUM_SITUATION_COUNT}種 + ロールプレイ付きミニコース${MINI_PACK_COUNT}本を追加。`,
  },
};

const TRIP_FEATURES = [
  {
    en: `${TRIP_PACK_PAID_DAY_COUNT} more guided lessons · ${TRIP_PACK_TOTAL_PHRASE_COUNT} phrases in full course`,
    ja: `残り${TRIP_PACK_PAID_DAY_COUNT}日分 · 全${TRIP_PACK_TOTAL_PHRASE_COUNT}フレーズ`,
  },
  {
    en: `${TRIP_PACK_PAID_PHRASE_COUNT} more phrases · ${TRIP_PACK_PAID_ROLEPLAY_COUNT} roleplays · ${TRIP_PACK_PAID_QUIZ_COUNT} quiz Qs`,
    ja: `${TRIP_PACK_PAID_PHRASE_COUNT}フレーズ · ロールプレイ${TRIP_PACK_PAID_ROLEPLAY_COUNT} · クイズ${TRIP_PACK_PAID_QUIZ_COUNT}問`,
  },
  { en: 'Offline cheat sheet', ja: 'オフライン・チートシート' },
];

const PRO_FEATURES = [
  { en: 'Everything in 7-Day Trip Course', ja: '7日間コースすべて含む' },
  { en: `${PREMIUM_SITUATION_COUNT} real scenes · ${PREMIUM_PHRASE_COUNT} phrases`, ja: `実シーン${PREMIUM_SITUATION_COUNT}種 · ${PREMIUM_PHRASE_COUNT}語` },
  { en: `${MINI_PACK_COUNT} guided mini courses with roleplay & quiz`, ja: `ロールプレイ付きミニコース${MINI_PACK_COUNT}本` },
];

const day2Preview = tripPackDays.find((d) => d.dayNumber === 2);

export default function UnlockModal({
  tier,
  context,
  daysUntilTrip,
  onClose,
  onUnlock,
}: UnlockModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const ignoreBackdropCloseRef = useRef(false);
  const { height: viewportHeight, offsetTop } = useVisualViewport();

  const isPro = tier === 'pro';
  const price = isPro ? JAPAN_PRO_PRICE_USD : TRIP_PACK_PRICE_USD;
  const priceNote = isPro ? JAPAN_PRO_PRICE_JPY_NOTE : TRIP_PACK_PRICE_JPY_NOTE;
  const gumroadUrl = isPro ? JAPAN_PRO_GUMROAD_URL : TRIP_PACK_GUMROAD_URL;
  const features = isPro ? PRO_FEATURES : TRIP_FEATURES;

  const copy =
    isPro && (context === 'premium' || context === 'upsell')
      ? PRO_CONTEXT_COPY[context]
      : TRIP_CONTEXT_COPY[context as keyof typeof TRIP_CONTEXT_COPY] ?? TRIP_CONTEXT_COPY.hub;

  useEffect(() => {
    trackEvent('unlock_modal_shown', { tier, context });
  }, [tier, context]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleGumroadClick = () => {
    trackEvent('gumroad_click', { tier, context });
  };

  const handleUnlock = async () => {
    setLoading(true);
    setError('');
    const result = await verifyUnlockCode(code);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      trackEvent('unlock_failed', { tier, context });
      return;
    }

    if ('tier' in result) {
      trackEvent('unlock_success', { tier: result.tier, context });
      onUnlock(result.tier);
      return;
    }

    setError('Enter a Trip or Pro unlock code.');
  };

  const handleCodeFocus = () => {
    ignoreBackdropCloseRef.current = true;
    setCodeFocused(true);
    window.setTimeout(() => {
      ignoreBackdropCloseRef.current = false;
    }, 500);
  };

  const handleCodeBlur = () => {
    window.setTimeout(() => setCodeFocused(false), 200);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (ignoreBackdropCloseRef.current || codeFocused) return;
    onClose();
  };

  const showTripUrgency = !isPro && daysUntilTrip !== null && daysUntilTrip !== undefined && daysUntilTrip >= 0;
  const showDay2Preview = !isPro && (context === 'complete' || context === 'hub') && day2Preview;
  const compactEntry = codeFocused;
  const headerGradient = isPro
    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600'
    : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700';

  const codeEntrySection = (
    <div className="flex-shrink-0 p-5 border-t border-slate-100 bg-white space-y-2">
      <p className="text-[10px] font-bold text-slate-500">
        Enter your unlock code
        <span className="block text-slate-400 font-semibold">購入後に届くコードを入力</span>
      </p>
      <input
        ref={codeInputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="done"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError('');
        }}
        onFocus={handleCodeFocus}
        onBlur={handleCodeBlur}
        onKeyDown={(e) => e.key === 'Enter' && !loading && handleUnlock()}
        placeholder="Unlock code"
        disabled={loading}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
      />
      {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
      <button
        type="button"
        onClick={handleUnlock}
        disabled={loading || !code.trim()}
        className="btn-press w-full py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-sm disabled:opacity-50"
      >
        {loading ? 'Checking…' : 'Unlock'}
      </button>
    </div>
  );

  return (
    <div
      className="fixed left-0 right-0 z-[60] bg-slate-950/50 backdrop-blur-sm flex justify-center p-4 overflow-hidden animate-fade-in"
      style={{
        top: offsetTop,
        height: viewportHeight || undefined,
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden flex flex-col self-end sm:self-center max-h-full"
        style={{
          maxHeight: viewportHeight ? `${Math.max(200, viewportHeight - 32)}px` : 'calc(100dvh - 2rem)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex-shrink-0 text-white relative ${headerGradient} ${
            compactEntry ? 'px-4 py-3' : 'px-5 py-5'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="no-press absolute top-3 right-3 p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          {compactEntry ? (
            <div className="flex items-center gap-2 pr-8">
              {isPro ? <Sparkles className="w-5 h-5 flex-shrink-0" /> : <Lock className="w-5 h-5 flex-shrink-0" />}
              <div className="min-w-0">
                <h3 className="text-sm font-black leading-tight truncate">{copy.title}</h3>
                <p className="text-[10px] font-semibold text-white/80">{copy.titleJa}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                {isPro ? <Sparkles className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
              </div>
              <h3 className="text-lg font-black leading-tight pr-6">{copy.title}</h3>
              <p className="text-[11px] font-semibold text-white/80 mt-0.5">{copy.titleJa}</p>
              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-black">{price}</span>
                <span className="text-[11px] font-bold text-white/80">one-time · {priceNote}</span>
              </div>
              <p className="text-[10px] font-semibold text-white/70 mt-1.5">No subscription · Pay once, keep forever</p>
            </>
          )}
        </div>

        {!compactEntry && (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4">
            {showTripUrgency && (
              <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 border border-indigo-100 px-3.5 py-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-indigo-900">
                    {daysUntilTrip === 0
                      ? 'Your trip starts today!'
                      : `${daysUntilTrip} day${daysUntilTrip === 1 ? '' : 's'} until Japan`}
                  </p>
                  <p className="text-[10px] font-semibold text-indigo-600/80 mt-0.5">
                    {daysUntilTrip === 0
                      ? '今日から日本！残りレッスンを今すぐ'
                      : `来日まであと${daysUntilTrip}日 · 残り${TRIP_PACK_PAID_DAY_COUNT}日分を解放`}
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs font-bold text-slate-700 leading-snug">{copy.lead}</p>
            <p className="text-[10px] font-semibold text-slate-400 leading-snug -mt-2">{copy.leadJa}</p>

            {showDay2Preview && day2Preview && (
              <div className="relative rounded-2xl border border-slate-200 overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 z-10 flex items-center justify-center">
                  <span className="text-[10px] font-black text-indigo-700 bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
                    Preview · Day 2 locked
                  </span>
                </div>
                <div className={`bg-gradient-to-br ${day2Preview.accent} p-3.5 text-white opacity-90`}>
                  <p className="text-[9px] font-black uppercase tracking-wider text-white/70">Up next · Day 2</p>
                  <p className="text-sm font-black mt-0.5">{day2Preview.titleEn}</p>
                  <p className="text-[10px] font-semibold text-white/80">{day2Preview.goalEn}</p>
                </div>
              </div>
            )}

            <ul className="space-y-2">
              {features.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 leading-snug">{item.en}</p>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{item.ja}</p>
                  </div>
                </li>
              ))}
            </ul>

            {gumroadUrl ? (
              <a
                href={gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGumroadClick}
                className="btn-press pressable flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-lg shadow-indigo-200"
              >
                Buy on Gumroad
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-[10px] font-semibold text-amber-800 text-center">
                Store link coming soon — use your unlock code below
              </div>
            )}

            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 text-center space-y-0.5">
              <p className="text-[10px] font-bold text-slate-600 leading-snug">
                Already purchased? Enter the same code on any device.
              </p>
              <p className="text-[9px] font-semibold text-slate-400 leading-snug">
                別の端末でも、購入時のコードを再入力すれば復元できます
              </p>
            </div>
          </div>
        )}

        {codeEntrySection}
      </div>
    </div>
  );
}
