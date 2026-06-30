'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, Lock, X } from 'lucide-react';
import type { MiniPack } from '@/data/miniPacks';
import { getMiniPackGumroadUrl } from '@/data/miniPackUnlock';
import { saveUnlockTier } from '@/data/monetization';
import { trackEvent } from '@/lib/analytics';
import { useVisualViewport } from '@/lib/useVisualViewport';
import { verifyUnlockCode } from '@/lib/unlockClient';

type MiniPackUnlockModalProps = {
  pack: MiniPack;
  onClose: () => void;
  onUnlock: () => void;
};

export default function MiniPackUnlockModal({ pack, onClose, onUnlock }: MiniPackUnlockModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const ignoreBackdropCloseRef = useRef(false);
  const { height: viewportHeight, offsetTop } = useVisualViewport();

  const gumroadUrl = getMiniPackGumroadUrl(pack.id);
  const features = [
    { en: `${pack.wordIds.length} curated phrases`, ja: `${pack.wordIds.length}フレーズ厳選` },
    { en: `${pack.roleplays.length} roleplay scenes`, ja: `ロールプレイ${pack.roleplays.length}シーン` },
    { en: `Mini quiz · ${pack.quizCount} questions`, ja: `ミニクイズ${pack.quizCount}問` },
  ];

  useEffect(() => {
    trackEvent('unlock_modal_shown', { packId: pack.id, type: 'mini_pack' });
  }, [pack.id]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleUnlock = async () => {
    setLoading(true);
    setError('');
    const result = await verifyUnlockCode(code);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      trackEvent('unlock_failed', { packId: pack.id });
      return;
    }

    if (result.tier === 'pro') {
      saveUnlockTier('pro');
      trackEvent('unlock_success', { tier: 'pro', packId: pack.id });
      onUnlock();
      return;
    }

    setError('Enter a Japan Pro unlock code.');
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

  const compactEntry = codeFocused;

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
        className="btn-press w-full py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'Checking…' : (
          <>
            <Lock className="w-4 h-4" />
            Unlock Pack
          </>
        )}
      </button>
      <p className="text-[9px] text-center text-slate-400 font-semibold">
        Japan Pro includes all mini packs
        <span className="block">Japan Pro で全ミニパック込み</span>
      </p>
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
          className={`flex-shrink-0 text-white relative bg-gradient-to-br ${pack.accent} ${
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
              <span className="text-xl flex-shrink-0">{pack.emoji}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-black leading-tight truncate">{pack.titleEn}</h3>
                <p className="text-[10px] font-semibold text-white/80">{pack.title}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 text-2xl">
                {pack.emoji}
              </div>
              <h3 className="text-lg font-black leading-tight pr-6">{pack.titleEn}</h3>
              <p className="text-[11px] font-semibold text-white/80 mt-0.5">{pack.title}</p>
              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-black">{pack.priceUsd}</span>
                <span className="text-[11px] font-bold text-white/80">one-time · {pack.priceJpyNote}</span>
              </div>
              <p className="text-[10px] font-semibold text-white/70 mt-1.5">No subscription · Pay once, keep forever</p>
            </>
          )}
        </div>

        {!compactEntry && (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4">
            <p className="text-xs font-bold text-slate-700 leading-snug">{pack.goalEn}</p>
            <p className="text-[10px] font-semibold text-slate-400 leading-snug -mt-2">{pack.goal}</p>

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
                onClick={() => trackEvent('gumroad_click', { packId: pack.id })}
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
          </div>
        )}

        {codeEntrySection}
      </div>
    </div>
  );
}
