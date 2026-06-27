'use client';

import React, { useState } from 'react';
import JsiLogo from '@/components/JsiLogo';
import {
  Beer,
  Building2,
  ChevronRight,
  ClipboardCheck,
  MessageCircle,
  Plane,
  ShoppingBag,
  Star,
  TrainFront,
  Utensils,
} from 'lucide-react';

export const INTRO_DONE_STORAGE_KEY = 'japanese-super-words-intro-done';

type IntroWizardProps = {
  fromYoutube?: boolean;
  onComplete: (data: { name: string; tripDate: string | null }) => void;
};

function addDaysToISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const FLOATING_ICONS = [
  { Icon: Utensils, color: 'text-orange-500 bg-orange-50', delay: '0s' },
  { Icon: TrainFront, color: 'text-sky-500 bg-sky-50', delay: '0.15s' },
  { Icon: ShoppingBag, color: 'text-pink-500 bg-pink-50', delay: '0.3s' },
  { Icon: Building2, color: 'text-violet-500 bg-violet-50', delay: '0.45s' },
  { Icon: Beer, color: 'text-purple-500 bg-purple-50', delay: '0.6s' },
];

const TRIP_CHIPS = [
  { label: 'In 7 days', ja: '7日後', days: 7 },
  { label: '2 weeks', ja: '2週間後', days: 14 },
  { label: '1 month', ja: '1ヶ月後', days: 30 },
  { label: 'Not sure yet', ja: 'まだ未定', days: null },
] as const;

export default function IntroWizard({ fromYoutube = false, onComplete }: IntroWizardProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripUndecided, setTripUndecided] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  const goToStep = (next: number) => {
    setStep(next);
    setContentKey((k) => k + 1);
  };

  const handleFinish = (skipTrip = false) => {
    const trimmed = name.trim();
    onComplete({
      name: trimmed || 'Traveler',
      tripDate: skipTrip || !tripDate || tripUndecided ? null : tripDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[55] bg-gradient-to-b from-indigo-50 via-white to-violet-50 flex flex-col animate-fade-in">
      <div className="flex-shrink-0 pt-6 pb-2 px-6">
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-indigo-600' : i < step ? 'w-4 bg-indigo-300' : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-4 min-h-0 overflow-y-auto">
        {step === 0 && (
          <div key={`intro-${contentKey}`} className="space-y-6 animate-step-enter text-center">
            {fromYoutube && (
              <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-left">
                <p className="text-[10px] font-black uppercase tracking-wider text-red-600">
                  From Japanese Super Immersion
                </p>
                <p className="text-xs font-bold text-red-900 mt-1 leading-snug">
                  You listen on YouTube — practice speaking here.
                </p>
                <p className="text-[10px] font-semibold text-red-700/80 mt-0.5">
                  YouTubeで聞いた会話を、ここで口に出して練習
                </p>
              </div>
            )}
            <div className="relative h-36 flex items-center justify-center">
              {FLOATING_ICONS.map(({ Icon, color, delay }, i) => {
                const positions = [
                  'left-[8%] top-[20%]',
                  'left-[28%] top-[55%]',
                  'left-1/2 -translate-x-1/2 top-[8%]',
                  'right-[28%] top-[55%]',
                  'right-[8%] top-[20%]',
                ];
                return (
                  <div
                    key={i}
                    className={`absolute ${positions[i]} w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm animate-intro-float`}
                    style={{ animationDelay: delay }}
                  >
                    <div className={`w-full h-full rounded-2xl flex items-center justify-center ${color}`}>
                      <Icon className="w-5 h-5" strokeWidth={2.25} />
                    </div>
                  </div>
                );
              })}
              <div className="relative z-10 flex items-center justify-center">
                <JsiLogo variant="full" className="h-[5.5rem] w-auto max-w-[12rem] drop-shadow-md" priority />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {fromYoutube
                  ? 'Turn listening into speaking'
                  : 'Japanese for real situations in Japan'}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-2">
                {fromYoutube
                  ? '聞いた日本語を、現地で言える形に'
                  : '日本でそのまま使えるシチュエーション別フレーズ'}
              </p>
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-xs mx-auto">
              {fromYoutube
                ? 'Flashcards, roleplay & quizzes — the speaking companion to our channel.'
                : 'Ramen shops, stations, konbini, hotels — learn what you actually need abroad.'}
            </p>
          </div>
        )}

        {step === 1 && (
          <div key={`intro-${contentKey}`} className="space-y-6 animate-step-enter">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                Trip-ready in 7 days
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-2">
                7日間で旅行準備完了
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: Star, label: 'Learn phrases', sub: 'フラッシュカードで覚える', color: 'bg-amber-50 text-amber-600' },
                { icon: MessageCircle, label: 'Practice conversations', sub: '会話シミュレーション', color: 'bg-violet-50 text-violet-600' },
                { icon: ClipboardCheck, label: 'Quiz yourself', sub: 'ミニクイズで定着', color: 'bg-indigo-50 text-indigo-600' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm animate-step-enter"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">{item.label}</p>
                      <p className="text-[10px] font-semibold text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-[11px] font-bold text-indigo-600">
              Day 1 is free · Full course $6.99
            </p>
          </div>
        )}

        {step === 2 && (
          <div key={`intro-${contentKey}`} className="space-y-5 animate-step-enter">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Plane className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {fromYoutube ? 'Almost there!' : "Let's set up your trip"}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {fromYoutube ? '旅行予定がなくてもOK' : 'あなた用にカスタマイズ'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">What should we call you?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                maxLength={12}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">When are you going to Japan?</label>
              <input
                type="date"
                value={tripDate}
                min={addDaysToISO(0)}
                onChange={(e) => {
                  setTripDate(e.target.value);
                  setTripUndecided(false);
                }}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-200"
              />
              <div className="flex flex-wrap gap-2">
                {TRIP_CHIPS.map((chip) => {
                  const chipDate = chip.days !== null ? addDaysToISO(chip.days) : null;
                  const isSelected =
                    chip.days === null ? tripUndecided : tripDate === chipDate;
                  return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      if (chip.days === null) {
                        setTripDate('');
                        setTripUndecided(true);
                      } else {
                        setTripDate(addDaysToISO(chip.days));
                        setTripUndecided(false);
                      }
                    }}
                    className={`btn-press px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {chip.label}
                    <span className="text-[9px] font-semibold opacity-70 ml-1">{chip.ja}</span>
                  </button>
                  );
                })}
              </div>
              {fromYoutube && (
                <p className="text-[10px] font-semibold text-indigo-600 leading-snug pt-1">
                  No Japan trip yet? Tap &quot;Skip trip date&quot; below — free situations & quizzes still work.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-6 pb-8 pt-2 space-y-2">
        {step < 2 ? (
          <button
            type="button"
            onClick={() => goToStep(step + 1)}
            className="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleFinish(false)}
              className="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-lg shadow-indigo-200"
            >
              Start learning →
            </button>
            <button
              type="button"
              onClick={() => handleFinish(true)}
              className="btn-press w-full py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600"
            >
              Skip trip date for now
            </button>
          </>
        )}
        {step > 0 && step < 2 && (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="btn-press w-full py-2 text-[11px] font-bold text-slate-400"
          >
            Back
          </button>
        )}
        {step === 2 && (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="btn-press w-full py-2 text-[11px] font-bold text-slate-400"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
