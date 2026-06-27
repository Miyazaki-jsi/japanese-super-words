'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Beer,
  Building2,
  CarTaxiFront,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  Lock,
  MessageCircle,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  TrainFront,
  UserRound,
  Utensils,
  Volume2,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import FlashCard from '@/components/FlashCard';
import RubyText from '@/components/RubyText';
import UnlockModal from '@/components/UnlockModal';
import { WordCard } from '@/data/words';
import {
  TripPackDay,
  TripPackRoleplayTurn,
  TRIP_PACK_STORAGE_KEY,
  TRIP_PACK_QUIZ_COUNT_DEFAULT,
  TRIP_PACK_ROLEPLAY_COUNT,
  getAllTripPackWords,
  getRecommendedTripPackDay,
  getTripPackDayEstimateMinutes,
  getTripPackWords,
  tripPackDays,
} from '@/data/tripPack';
import {
  TRIP_PACK_FREE_DAY_MAX,
  TRIP_PACK_PRICE_JPY_NOTE,
  TRIP_PACK_PRICE_USD,
  canAccessTripPackDay,
  readTripPackUnlocked,
  saveUnlockTier,
  type UnlockTier,
} from '@/data/monetization';
import { trackEvent } from '@/lib/analytics';

type TripPackStep = 'hub' | 'intro' | 'study' | 'roleplay' | 'quiz' | 'dayComplete' | 'cheatsheet';
type TransitionPhase = 'idle' | 'exit' | 'bridge' | 'enter';
type UnlockModalContext = 'hub' | 'day' | 'complete';

const MAJOR_BRIDGE_STEPS = new Set<TripPackStep>(['study', 'roleplay', 'quiz']);

const BRIDGE_META: Record<
  string,
  { step: number; title: string; titleEn: string; accent: string; emoji: string }
> = {
  study: {
    step: 1,
    title: 'フレーズを覚える',
    titleEn: 'Learn Phrases',
    accent: 'from-amber-400 to-orange-500',
    emoji: '📚',
  },
  roleplay: {
    step: 2,
    title: '会話シミュレーション',
    titleEn: 'Roleplay',
    accent: 'from-violet-500 to-purple-600',
    emoji: '💬',
  },
  quiz: {
    step: 3,
    title: 'ミニクイズ',
    titleEn: 'Quiz',
    accent: 'from-indigo-500 to-blue-600',
    emoji: '✅',
  },
};

function StepBridge({ target }: { target: TripPackStep }) {
  const meta = BRIDGE_META[target];
  if (!meta) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/92 backdrop-blur-sm px-6">
      <div className="animate-step-bridge text-center">
        <div className="relative mx-auto w-24 h-24 mb-5">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${meta.accent} animate-step-bridge-ring`}
          />
          <div
            className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${meta.accent} flex items-center justify-center text-4xl shadow-lg`}
          >
            {meta.emoji}
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Step {meta.step}
        </p>
        <h3 className="text-xl font-black text-slate-900 mt-1">{meta.titleEn}</h3>
        <p className="text-sm font-semibold text-slate-500 mt-0.5">{meta.title}</p>
      </div>
    </div>
  );
}

type TripPackQuizQuestion = {
  card: WordCard;
  choices: string[];
  correctIndex: number;
};

type TripPackScreenProps = {
  daysUntilTrip: number | null;
  learnedIds: string[];
  favoriteIds: string[];
  onToggleLearned: (id: string, learned: boolean) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  onClose: () => void;
};

function speakJapanese(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function buildQuizQuestions(cards: WordCard[], count = 3): TripPackQuizQuestion[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  return selected.map((card) => {
    const others = cards.filter((w) => w.id !== card.id);
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 2);
    const choices = [card.english, ...distractors.map((d) => d.english)].sort(() => Math.random() - 0.5);
    return {
      card,
      choices,
      correctIndex: choices.indexOf(card.english),
    };
  });
}

function getRoleplaySceneIcon(sceneTitle: string): LucideIcon {
  if (/駅|ホーム|電車|切符/.test(sceneTitle)) return TrainFront;
  if (/ホテル|チェックイン/.test(sceneTitle)) return Building2;
  if (/コンビニ/.test(sceneTitle)) return ShoppingBag;
  if (/ラーメン|食後/.test(sceneTitle)) return Utensils;
  if (/居酒屋|乾杯/.test(sceneTitle)) return Beer;
  if (/会計/.test(sceneTitle)) return ShoppingBag;
  if (/交番/.test(sceneTitle)) return Shield;
  if (/病院/.test(sceneTitle)) return HeartPulse;
  if (/タクシー/.test(sceneTitle)) return CarTaxiFront;
  return MessageCircle;
}

function getRoleplaySceneAccent(sceneTitle: string): string {
  if (/駅|ホーム|電車|切符/.test(sceneTitle)) return 'from-amber-400 to-yellow-500';
  if (/ホテル|チェックイン/.test(sceneTitle)) return 'from-violet-500 to-purple-600';
  if (/コンビニ|会計/.test(sceneTitle)) return 'from-pink-500 to-rose-500';
  if (/ラーメン|食後/.test(sceneTitle)) return 'from-orange-500 to-amber-600';
  if (/居酒屋|乾杯/.test(sceneTitle)) return 'from-amber-600 to-orange-700';
  if (/交番/.test(sceneTitle)) return 'from-blue-600 to-indigo-700';
  if (/病院/.test(sceneTitle)) return 'from-red-500 to-rose-600';
  if (/タクシー/.test(sceneTitle)) return 'from-emerald-500 to-teal-600';
  return 'from-slate-500 to-slate-600';
}

export default function TripPackScreen({
  daysUntilTrip,
  learnedIds,
  favoriteIds,
  onToggleLearned,
  onToggleFavorite,
  onClose,
}: TripPackScreenProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [step, setStep] = useState<TripPackStep>('hub');
  const [activeDay, setActiveDay] = useState<TripPackDay | null>(null);
  const [studyIndex, setStudyIndex] = useState(0);
  const [studyWords, setStudyWords] = useState<WordCard[]>([]);
  const [roleplayIndex, setRoleplayIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [selectedRoleplay, setSelectedRoleplay] = useState<number | null>(null);
  const [roleplayDone, setRoleplayDone] = useState(false);
  const [roleplayHistory, setRoleplayHistory] = useState<
    { turn: TripPackRoleplayTurn; userLabel: string }[]
  >([]);
  const [quizQuestions, setQuizQuestions] = useState<TripPackQuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  const [bridgeTarget, setBridgeTarget] = useState<TripPackStep | null>(null);
  const [contentKey, setContentKey] = useState(0);
  const [isPackUnlocked, setIsPackUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockModalContext, setUnlockModalContext] = useState<UnlockModalContext>('hub');

  const recommendedDay = getRecommendedTripPackDay(daysUntilTrip);
  const recommendedLesson =
    tripPackDays.find((d) => d.dayNumber === recommendedDay) ?? tripPackDays[0];
  const showUnlockHero = !isPackUnlocked && completedDays.includes(TRIP_PACK_FREE_DAY_MAX);
  const heroLesson = showUnlockHero
    ? null
    : canAccessTripPackDay(recommendedLesson.dayNumber, isPackUnlocked)
      ? recommendedLesson
      : tripPackDays[0];
  const todayLesson = heroLesson ?? tripPackDays[0];
  const totalPhrases = tripPackDays.reduce((sum, d) => sum + d.wordIds.length, 0);
  const progressPercent = Math.round((completedDays.length / tripPackDays.length) * 100);

  useEffect(() => {
    setIsPackUnlocked(readTripPackUnlocked());
    const saved = localStorage.getItem(TRIP_PACK_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setCompletedDays(parsed.filter((n) => typeof n === 'number'));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (step === 'cheatsheet' && !readTripPackUnlocked()) {
      setStep('hub');
    }
  }, [step]);

  const saveCompletedDay = (dayNumber: number) => {
    setCompletedDays((prev) => {
      if (prev.includes(dayNumber)) return prev;
      const next = [...prev, dayNumber].sort((a, b) => a - b);
      localStorage.setItem(TRIP_PACK_STORAGE_KEY, JSON.stringify(next));
      if (dayNumber === TRIP_PACK_FREE_DAY_MAX) {
        trackEvent('day1_completed');
      }
      return next;
    });
  };

  const goToStep = (next: TripPackStep, opts?: { bridge?: boolean }) => {
    if (transitionPhase === 'exit' || transitionPhase === 'bridge') return;
    const useBridge = Boolean(opts?.bridge && MAJOR_BRIDGE_STEPS.has(next));

    setTransitionPhase('exit');
    setTimeout(() => {
      if (useBridge) {
        setBridgeTarget(next);
        setTransitionPhase('bridge');
        setTimeout(() => {
          setStep(next);
          setBridgeTarget(null);
          setTransitionPhase('enter');
          setContentKey((k) => k + 1);
          window.scrollTo(0, 0);
          setTimeout(() => setTransitionPhase('idle'), 480);
        }, 2000);
      } else {
        setStep(next);
        setTransitionPhase('enter');
        setContentKey((k) => k + 1);
        window.scrollTo(0, 0);
        setTimeout(() => setTransitionPhase('idle'), 480);
      }
    }, 320);
  };

  const bumpContent = () => setContentKey((k) => k + 1);

  const transitionClass =
    transitionPhase === 'exit'
      ? 'animate-step-exit'
      : transitionPhase === 'enter'
        ? 'animate-step-enter'
        : '';

  const handlePackUnlock = (unlockedTier: UnlockTier) => {
    saveUnlockTier(unlockedTier);
    setIsPackUnlocked(true);
    setShowUnlockModal(false);
    if (unlockModalContext === 'complete') {
      trackEvent('day1_complete_unlock_flow', { tier: unlockedTier });
    }
  };

  const openUnlockModal = (context: UnlockModalContext) => {
    setUnlockModalContext(context);
    setShowUnlockModal(true);
    trackEvent('unlock_modal_open', { context, source: 'trip_pack' });
  };

  const openDay = (day: TripPackDay) => {
    if (!canAccessTripPackDay(day.dayNumber, isPackUnlocked)) {
      openUnlockModal('day');
      return;
    }
    const isSameDay = activeDay?.dayNumber === day.dayNumber;
    setActiveDay(day);
    if (!isSameDay) {
      setStudyWords(getTripPackWords(day));
      setStudyIndex(0);
      setRoleplayIndex(0);
      setTurnIndex(0);
      setSelectedRoleplay(null);
      setRoleplayDone(false);
      setRoleplayHistory([]);
      setQuizQuestions([]);
      setQuizIndex(0);
      setQuizScore(0);
      setQuizSelected(null);
      setQuizFinished(false);
    }
    goToStep('intro');
  };

  const startStudy = () => {
    goToStep('study', { bridge: true });
  };

  const startRoleplay = () => {
    goToStep('roleplay', { bridge: true });
  };

  const advanceStudy = () => {
    if (studyIndex < studyWords.length - 1) {
      setStudyIndex((idx) => idx + 1);
      bumpContent();
    } else {
      goToStep('intro');
    }
  };

  const goBackStudy = () => {
    if (studyIndex <= 0) return;
    setStudyIndex((idx) => idx - 1);
    bumpContent();
  };

  const handleStudyLearned = (id: string, learned: boolean) => {
    onToggleLearned(id, learned);
    if (!learned) return;
    setTimeout(advanceStudy, 480);
  };

  const startQuiz = () => {
    if (!activeDay) return;
    if (quizQuestions.length === 0 || quizFinished) {
      const words = getTripPackWords(activeDay);
      setQuizQuestions(buildQuizQuestions(words, activeDay.quizCount));
      setQuizIndex(0);
      setQuizScore(0);
      setQuizSelected(null);
      setQuizFinished(false);
    }
    goToStep('quiz', { bridge: true });
  };

  const handleQuizAnswer = (choiceIndex: number) => {
    if (quizSelected !== null || !quizQuestions[quizIndex]) return;
    setQuizSelected(choiceIndex);
    const isCorrect = choiceIndex === quizQuestions[quizIndex].correctIndex;
    if (isCorrect) setQuizScore((s) => s + 1);

    setTimeout(() => {
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((i) => i + 1);
        setQuizSelected(null);
        bumpContent();
      } else {
        setQuizFinished(true);
        if (activeDay) saveCompletedDay(activeDay.dayNumber);
        if (
          activeDay?.dayNumber === TRIP_PACK_FREE_DAY_MAX &&
          !readTripPackUnlocked()
        ) {
          setUnlockModalContext('complete');
          setShowUnlockModal(true);
        }
        goToStep('dayComplete');
      }
    }, 900);
  };

  const goToNextRoleplayOrQuiz = () => {
    if (!activeDay) return;
    if (roleplayIndex < activeDay.roleplays.length - 1) {
      setRoleplayIndex((i) => i + 1);
      setTurnIndex(0);
      setSelectedRoleplay(null);
      setRoleplayDone(false);
      setRoleplayHistory([]);
      bumpContent();
      window.scrollTo(0, 0);
    } else {
      goToStep('intro');
    }
  };

  const advanceRoleplayTurn = () => {
    if (!activeDay) return;
    const rp = activeDay.roleplays[roleplayIndex];
    const turn = rp?.turns[turnIndex];
    const choice = turn && selectedRoleplay !== null ? turn.choices[selectedRoleplay] : null;
    if (!turn || !choice) return;

    const nextHistory = [...roleplayHistory, { turn, userLabel: choice.label }];
    if (turnIndex < rp.turns.length - 1) {
      setRoleplayHistory(nextHistory);
      setTurnIndex((i) => i + 1);
      setSelectedRoleplay(null);
      setRoleplayDone(false);
      bumpContent();
      window.scrollTo(0, 0);
    } else {
      setRoleplayHistory(nextHistory);
      goToNextRoleplayOrQuiz();
    }
  };

  const cheatSheetWords = useMemo(() => {
    const picks = [
      'g16',
      'g15',
      'ht14',
      's14',
      'r15',
      'i14',
      'kb15',
      'tx14',
      'a20',
      'h14',
      'kb24',
      'g18',
    ];
    const map = new Map(getAllTripPackWords().map((w) => [w.id, w]));
    return picks.map((id) => map.get(id)).filter((w): w is WordCard => Boolean(w));
  }, []);

  const goBackOneStep = () => {
    if (transitionPhase === 'exit' || transitionPhase === 'bridge') return;

    if (step === 'hub') {
      onClose();
      return;
    }

    if (step === 'intro') {
      goToStep('hub');
      return;
    }

    if (step === 'study') {
      if (studyIndex > 0) {
        goBackStudy();
        return;
      }
      goToStep('intro');
      return;
    }

    if (step === 'roleplay' && activeDay) {
      if (selectedRoleplay !== null) {
        setSelectedRoleplay(null);
        setRoleplayDone(false);
        return;
      }
      if (turnIndex > 0) {
        setRoleplayHistory((h) => h.slice(0, -1));
        setTurnIndex((i) => i - 1);
        bumpContent();
        window.scrollTo(0, 0);
        return;
      }
      if (roleplayIndex > 0) {
        const prevIndex = roleplayIndex - 1;
        const prevRp = activeDay.roleplays[prevIndex];
        const lastTurn = prevRp.turns[prevRp.turns.length - 1];
        const lastChoice = lastTurn.choices.find((c) => c.correct) ?? lastTurn.choices[0];
        setRoleplayIndex(prevIndex);
        setTurnIndex(prevRp.turns.length - 1);
        setRoleplayHistory(
          prevRp.turns.slice(0, -1).map((t) => {
            const pick = t.choices.find((c) => c.correct) ?? t.choices[0];
            return { turn: t, userLabel: pick.label };
          }),
        );
        setSelectedRoleplay(null);
        setRoleplayDone(false);
        bumpContent();
        window.scrollTo(0, 0);
        return;
      }
      goToStep('intro');
      return;
    }

    if (step === 'quiz') {
      if (quizIndex > 0 && !quizFinished) {
        setQuizIndex((i) => i - 1);
        setQuizSelected(null);
        bumpContent();
        return;
      }
      goToStep('intro');
      return;
    }

    if (step === 'dayComplete' || step === 'cheatsheet') {
      goToStep('hub');
    }
  };

  const goToCourseHub = () => {
    if (transitionPhase === 'exit' || transitionPhase === 'bridge') return;
    goToStep('hub');
  };

  const stickyHeader = (
    <div className="sticky top-[4.5rem] z-10 -mx-1 px-1 pt-0.5 pb-2 bg-slate-50/95 backdrop-blur-sm">
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
        <button
          type="button"
          onClick={goBackOneStep}
          className="btn-press bg-slate-50 hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800"
          aria-label="Back one step"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center min-w-0 px-2">
          <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none truncate">
            7-Day Trip Prep
          </h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">旅行前7日パック</p>
        </div>
        {step !== 'hub' ? (
          <button
            type="button"
            onClick={goToCourseHub}
            className="btn-press text-[10px] font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 leading-tight whitespace-nowrap"
            aria-label="Back to course home"
          >
            Course Home
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>
    </div>
  );

  const unlockModal = showUnlockModal ? (
    <UnlockModal
      tier="trip"
      context={unlockModalContext}
      daysUntilTrip={daysUntilTrip}
      onClose={() => setShowUnlockModal(false)}
      onUnlock={handlePackUnlock}
    />
  ) : null;

  if (step === 'hub') {
    return (
      <>
        {unlockModal}
        {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
        <div key={`hub-${contentKey}`} className={`space-y-4 ${transitionClass}`}>
        {stickyHeader}

        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 text-white shadow-lg shadow-indigo-200/60 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-0 w-20 h-20 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
                {isPackUnlocked ? 'Full Course' : `Day 1 Free · ${TRIP_PACK_PRICE_USD}`}
              </span>
            </div>
            <h3 className="text-xl font-black leading-tight">7-Day Japan<br />Survival Program</h3>
            <p className="text-[11px] text-indigo-100 font-semibold mt-1.5">
              日本で困らない7日間プログラム
            </p>
            <p className="text-[10px] text-indigo-100/90 font-semibold mt-1">
              {totalPhrases} phrases · {TRIP_PACK_ROLEPLAY_COUNT} roleplays · {TRIP_PACK_QUIZ_COUNT_DEFAULT} quiz Qs / day
              {!isPackUnlocked && (
                <span className="block mt-0.5 text-amber-200/90">
                  Full course {TRIP_PACK_PRICE_USD} one-time · {TRIP_PACK_PRICE_JPY_NOTE}
                </span>
              )}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-bold text-indigo-100 mb-1">
                <span>Progress</span>
                <span>{completedDays.length}/7 days</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-amber-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            {isPackUnlocked && completedDays.length === 7 && (
              <button
                type="button"
                onClick={() => goToStep('cheatsheet')}
                className="btn-press mt-4 w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-[11px] font-black"
              >
                📋 View offline cheat sheet / オフライン・チートシートを見る
              </button>
            )}
          </div>
        </div>

        {/* TODAY'S LESSON — hero */}
        <section className="space-y-2">
          <div className="flex items-baseline justify-between px-0.5">
            <h3 className="text-sm font-black text-slate-900">
              {showUnlockHero ? 'Next step' : "Today's lesson"}
            </h3>
            <span className="text-[10px] font-bold text-indigo-600">
              {showUnlockHero ? '解放' : '今日のレッスン'}
            </span>
          </div>

          {showUnlockHero ? (
            <div className="w-full rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-5 shadow-lg shadow-amber-100/80">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                  🔓
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex text-[10px] font-black uppercase tracking-widest bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                    Day 1 Complete
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-2 leading-tight">
                    Unlock Days 2–7
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-600 mt-1">
                    残り6日分を解放 · roleplays · quizzes · cheatsheet
                  </p>
                  <p className="text-sm font-black text-amber-700 mt-2">
                    {TRIP_PACK_PRICE_USD}{' '}
                    <span className="text-[11px] font-bold text-amber-600/80">
                      one-time · {TRIP_PACK_PRICE_JPY_NOTE}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openUnlockModal('hub')}
                className="btn-press mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-md"
              >
                Unlock Full Course / フルコースを解放
              </button>
            </div>
          ) : (
          <button
            type="button"
            onClick={() => openDay(todayLesson)}
            className={`btn-press w-full text-left rounded-3xl border-2 border-indigo-300 p-5 shadow-lg shadow-indigo-200/50 bg-gradient-to-br ${todayLesson.accent} text-white relative overflow-hidden`}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                    Day {todayLesson.dayNumber} · ~{getTripPackDayEstimateMinutes(todayLesson)} min
                  </span>
                  <div className="flex items-center gap-2.5 mt-3">
                    <span className="text-4xl">{todayLesson.emoji}</span>
                    <div>
                      <h4 className="text-xl font-black leading-tight">{todayLesson.titleEn}</h4>
                      <p className="text-[12px] text-white/85 font-semibold mt-0.5">{todayLesson.title}</p>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold text-white/90 mt-3 leading-snug">{todayLesson.goalEn}</p>
                  <p className="text-[10px] font-semibold text-white/75 mt-0.5">{todayLesson.goal}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full text-center leading-tight">
                      <span className="block">{todayLesson.wordIds.length} Phrases</span>
                      <span className="block text-[8px] font-semibold text-white/75">
                        {todayLesson.wordIds.length} フレーズ
                      </span>
                    </span>
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full text-center leading-tight">
                      <span className="block">{todayLesson.roleplays.length} Scenes</span>
                      <span className="block text-[8px] font-semibold text-white/75">
                        {todayLesson.roleplays.length} 会話シーン
                      </span>
                    </span>
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full text-center leading-tight">
                      <span className="block">{todayLesson.quizCount} Quiz Qs</span>
                      <span className="block text-[8px] font-semibold text-white/75">
                        クイズ {todayLesson.quizCount} 問
                      </span>
                    </span>
                  </div>
                </div>
                {completedDays.includes(todayLesson.dayNumber) ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-8 h-8 text-white/70 flex-shrink-0" />
                )}
              </div>
              <div className="lesson-start-btn-wrap mt-4">
                <div className="lesson-start-btn py-3 bg-white text-indigo-700 font-black text-sm text-center shadow-sm">
                  <div className="lesson-start-btn-shine" aria-hidden />
                  <span className="relative z-10 block leading-tight">
                    {completedDays.includes(todayLesson.dayNumber) ? (
                      <>
                        Review Again
                        <span className="block text-[10px] font-semibold text-indigo-500/80 mt-0.5">
                          もう一度復習する
                        </span>
                      </>
                    ) : (
                      <>
                        Start Lesson
                        <span className="block text-[10px] font-semibold text-indigo-500/80 mt-0.5">
                          レッスンを始める
                        </span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </button>
          )}
        </section>

        <div className="flex items-baseline justify-between px-0.5 pt-1">
          <h3 className="text-sm font-black text-slate-700">All lessons</h3>
          <span className="text-[10px] font-semibold text-slate-400">
            すべてのレッスン · {isPackUnlocked ? '7 days unlocked' : 'Day 1 free'}
          </span>
        </div>

        <div className="space-y-2.5">
          {tripPackDays.map((day) => {
            const done = completedDays.includes(day.dayNumber);
            const isToday = day.dayNumber === recommendedDay;
            const locked = !canAccessTripPackDay(day.dayNumber, isPackUnlocked);
            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => openDay(day)}
                className={`btn-press w-full text-left rounded-2xl border p-3.5 ${
                  locked
                    ? 'bg-slate-50/80 border-slate-200 opacity-90'
                    : done
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : isToday
                      ? 'bg-indigo-50/50 border-indigo-100'
                      : 'bg-white border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br ${day.accent} shadow-sm ${locked ? 'opacity-50' : ''}`}
                  >
                    {locked ? <Lock className="w-4 h-4 text-white" /> : day.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                        Day {day.dayNumber}
                      </span>
                      {day.dayNumber === TRIP_PACK_FREE_DAY_MAX && !isPackUnlocked && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          FREE
                        </span>
                      )}
                      {isToday && !done && !locked && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                          今日 · Today
                        </span>
                      )}
                      {locked && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          LOCKED
                        </span>
                      )}
                      {done && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Done
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm font-extrabold truncate ${locked ? 'text-slate-500' : 'text-slate-900'}`}>
                      {day.titleEn}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">{day.title}</p>
                    <p className="text-[9px] text-slate-400/90 font-semibold mt-0.5">
                      {locked
                        ? `Unlock with full course · ${TRIP_PACK_PRICE_USD}`
                        : `${day.wordIds.length} phrases · ~${getTripPackDayEstimateMinutes(day)} min`}
                    </p>
                  </div>
                  {locked ? (
                    <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        </div>
      </>
    );
  }

  if (step === 'cheatsheet') {
    return (
      <>
        {unlockModal}
        {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
        <div key={`cheatsheet-${contentKey}`} className={`space-y-4 ${transitionClass}`}>
        {stickyHeader}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <h3 className="text-base font-black text-amber-900">🇯🇵 Japan Travel Cheat Sheet</h3>
          <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
            旅行チートシート · Top phrases to keep handy
          </p>
        </div>
        <div className="space-y-2">
          {cheatSheetWords.map((card, i) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-slate-100 p-3 flex items-start gap-3 shadow-sm"
            >
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-900">{card.english}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{card.japanese}</p>
                <p className="text-[9px] text-slate-400 font-mono">{card.romaji}</p>
              </div>
              <button
                type="button"
                onClick={() => speakJapanese(card.reading || card.japanese)}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex-shrink-0"
                aria-label="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        </div>
      </>
    );
  }

  if (!activeDay) return null;

  if (step === 'intro') {
    return (
      <>
        {unlockModal}
        {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
        <div key={`intro-${contentKey}`} className={`space-y-4 ${transitionClass}`}>
        {stickyHeader}

        <div className={`rounded-3xl bg-gradient-to-br ${activeDay.accent} p-5 text-white shadow-lg`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
            Day {activeDay.dayNumber} · ~{getTripPackDayEstimateMinutes(activeDay)} min
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-4xl">{activeDay.emoji}</span>
            <div>
              <h3 className="text-xl font-black leading-tight">{activeDay.titleEn}</h3>
              <p className="text-[11px] text-white/80 font-semibold">{activeDay.title}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-bold leading-snug">{activeDay.goalEn}</p>
          <p className="text-[11px] text-white/75 font-semibold">{activeDay.goal}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2">
          <p className="text-xs font-black text-slate-800 mb-1">Today&apos;s steps</p>
          <p className="text-[10px] text-slate-400 font-semibold mb-2">好きな順番で選べます · Pick any step</p>
          {[
            { id: 'study' as const, icon: Star, label: 'Learn phrases', sub: 'フレーズを覚える', meta: `${studyWords.length} cards`, color: 'text-amber-500 bg-amber-50', progress: studyIndex > 0 ? `${studyIndex + 1}/${studyWords.length}` : null },
            { id: 'roleplay' as const, icon: MessageCircle, label: 'Roleplay practice', sub: '会話シミュレーション', meta: `${activeDay.roleplays.length} scenes · 2 exchanges each`, color: 'text-violet-500 bg-violet-50', progress: roleplayIndex > 0 || roleplayDone ? `${roleplayIndex + 1}/${activeDay.roleplays.length}` : null },
            { id: 'quiz' as const, icon: ClipboardCheck, label: 'Mini quiz', sub: 'ミニクイズ', meta: `${activeDay.quizCount} questions`, color: 'text-indigo-500 bg-indigo-50', progress: quizIndex > 0 && !quizFinished ? `${quizIndex + 1}/${quizQuestions.length || activeDay.quizCount}` : null },
          ].map((item) => {
            const Icon = item.icon;
            const onSelect = item.id === 'study' ? startStudy : item.id === 'roleplay' ? startRoleplay : startQuiz;
            return (
              <button
                key={item.label}
                type="button"
                onClick={onSelect}
                className="btn-press w-full flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 text-left hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-slate-800">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{item.sub} · {item.meta}</p>
                </div>
                {item.progress ? (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full flex-shrink-0">
                    {item.progress}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        </div>
      </>
    );
  }

  if (step === 'study') {
    const card = studyWords[studyIndex];
    if (!card) return null;
    return (
      <>
        {unlockModal}
        {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
        <div key={`study-${contentKey}`} className={`space-y-4 ${transitionClass}`}>
        {stickyHeader}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            STEP 1 · Learn
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono">
            {studyIndex + 1} / {studyWords.length}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((studyIndex + 1) / studyWords.length) * 100}%` }}
          />
        </div>
        <div key={`study-card-${studyIndex}`} className="animate-content-swap">
          <FlashCard
            card={card}
            isLearned={learnedIds.includes(card.id)}
            isFavorite={favoriteIds.includes(card.id)}
            onToggleLearned={handleStudyLearned}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goBackStudy}
            disabled={studyIndex === 0}
            className="btn-press flex-1 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            ← Back / 前へ
          </button>
          <button
            type="button"
            onClick={advanceStudy}
            className="btn-press flex-1 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold text-sm"
          >
            Skip / 次へ
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 font-semibold">
          Tap Learned to continue / 「Learned」で次へ
        </p>
        </div>
      </>
    );
  }

  if (step === 'roleplay') {
    const rp = activeDay.roleplays[roleplayIndex];
    if (!rp) return null;
    const turn = rp.turns[turnIndex];
    if (!turn) return null;
    const isLastRoleplay = roleplayIndex >= activeDay.roleplays.length - 1;
    const isLastTurn = turnIndex >= rp.turns.length - 1;
    const SceneIcon = getRoleplaySceneIcon(rp.sceneTitle);
    const sceneAccent = getRoleplaySceneAccent(rp.sceneTitle);
    const selectedChoice = selectedRoleplay !== null ? turn.choices[selectedRoleplay] : null;
    const canAdvance = roleplayDone;

    return (
      <>
        {unlockModal}
        {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
        <div key={`roleplay-${contentKey}`} className={`space-y-4 ${transitionClass}`}>
        {stickyHeader}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            STEP 2 · Roleplay
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono">
            {roleplayIndex + 1}/{activeDay.roleplays.length} · {turnIndex + 1}/{rp.turns.length}
          </span>
        </div>

        <div key={`roleplay-scene-${roleplayIndex}-${turnIndex}`} className="space-y-3 animate-content-swap">
        <div className="flex items-center gap-2 px-0.5">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${sceneAccent} flex items-center justify-center flex-shrink-0`}>
            <SceneIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-800 leading-tight">{rp.sceneTitleEn}</p>
            <p className="text-[9px] font-semibold text-slate-400">{rp.sceneTitle}</p>
          </div>
        </div>

        {roleplayHistory.map((entry, idx) => (
          <div key={`history-${idx}`} className="space-y-2">
            <div className="flex gap-2 items-start px-0.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <UserRound className="w-4 h-4 text-white" strokeWidth={2.25} />
              </div>
              <div className="min-w-0 max-w-[88%]">
                <p className="text-[9px] font-bold text-slate-400 mb-1 pl-0.5">Staff</p>
                <div className="bg-zinc-100 rounded-2xl rounded-tl-md px-3 py-2.5">
                  <p className="text-[10px] text-slate-600 font-semibold leading-snug">{entry.turn.staffEnglish}</p>
                  <RubyText
                    japanese={entry.turn.staffLine}
                    reading={entry.turn.staffReading}
                    className="roleplay-ruby text-[13px] font-bold text-slate-500 leading-relaxed mt-1.5"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-start justify-end px-0.5">
              <div className="min-w-0 max-w-[88%]">
                <p className="text-[9px] font-bold text-slate-400 mb-1 pr-0.5 text-right">You</p>
                <div className="bg-indigo-600 rounded-2xl rounded-tr-md px-3 py-2.5">
                  <p className="text-[13px] font-bold text-white leading-snug">{entry.userLabel}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-2 items-start px-0.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <UserRound className="w-4 h-4 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 max-w-[88%]">
            <p className="text-[9px] font-bold text-slate-400 mb-1 pl-0.5">Staff</p>
            <div className="bg-zinc-100 rounded-2xl rounded-tl-md px-3 py-2.5">
              <p className="text-[10px] text-slate-600 font-semibold leading-snug">
                {turn.staffEnglish}
              </p>
              <RubyText
                japanese={turn.staffLine}
                reading={turn.staffReading}
                className="roleplay-ruby text-[13px] font-bold text-slate-500 leading-relaxed mt-1.5"
              />
            </div>
            <button
              type="button"
              onClick={() => speakJapanese(turn.staffReading)}
              className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-indigo-600 pl-0.5"
            >
              <Volume2 className="w-3 h-3" /> Listen
            </button>
          </div>
        </div>

        {roleplayDone && selectedChoice && (
          <div className="flex gap-2 items-start justify-end px-0.5">
            <div className="min-w-0 max-w-[88%]">
              <p className="text-[9px] font-bold text-slate-400 mb-1 pr-0.5 text-right">You</p>
              <div className={`rounded-2xl rounded-tr-md px-3 py-2.5 ${selectedChoice.correct ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <p className="text-[13px] font-bold text-white leading-snug">{selectedChoice.label}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-1 px-0.5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-slate-600">Your reply</p>
            <span className="text-[9px] font-bold text-slate-400">あなたの返答</span>
          </div>

        <div className="space-y-1.5">
          {turn.choices.map((choice, i) => {
            const isSelected = selectedRoleplay === i;
            const showResult = selectedRoleplay !== null;
            const choiceLetter = String.fromCharCode(65 + i);
            let style =
              'border border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30';
            if (showResult && isSelected) {
              style = choice.correct
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-red-300 bg-red-50';
            } else if (showResult && choice.correct) {
              style = 'border-emerald-300 bg-emerald-50/70';
            } else if (showResult) {
              style = 'border-slate-100 bg-slate-50 opacity-55';
            }
            return (
              <button
                key={choice.label}
                type="button"
                disabled={selectedRoleplay !== null}
                onClick={() => {
                  setSelectedRoleplay(i);
                  setRoleplayDone(true);
                }}
                className={`btn-press w-full text-left rounded-xl px-3 py-2.5 flex items-start gap-2.5 ${style} disabled:cursor-default`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                    showResult && isSelected && choice.correct
                      ? 'bg-emerald-500 text-white'
                      : showResult && isSelected && !choice.correct
                        ? 'bg-red-400 text-white'
                        : showResult && choice.correct
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {showResult && isSelected && choice.correct ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : showResult && isSelected && !choice.correct ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : showResult && choice.correct ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    choiceLetter
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  {choice.labelReading ? (
                    <RubyText
                      japanese={choice.label}
                      reading={choice.labelReading}
                      className="text-[13px] font-bold text-slate-800 leading-snug"
                    />
                  ) : (
                    <p className="text-[13px] font-bold text-slate-800 leading-snug">{choice.label}</p>
                  )}
                  {choice.sublabel && (
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{choice.sublabel}</p>
                  )}
                  {isSelected && (
                    <p className={`text-[10px] font-bold mt-1.5 ${choice.correct ? 'text-emerald-700' : 'text-red-600'}`}>
                      {choice.feedback}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        </div>

        {canAdvance && (
          <button
            type="button"
            onClick={advanceRoleplayTurn}
            className="btn-press w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-lg"
          >
            {isLastTurn && isLastRoleplay
              ? 'ステップに戻る / Back to steps'
              : isLastTurn
                ? '次のシーンへ / Next Scene'
                : '次のやりとりへ / Next Exchange'}
            {!selectedChoice?.correct && (
              <span className="block text-[10px] font-semibold text-violet-200 mt-0.5">
                正解は緑で表示されています
              </span>
            )}
          </button>
        )}
        </div>
        </div>
      </>
    );
  }

  if (step === 'quiz' || step === 'dayComplete') {
    if (step === 'dayComplete') {
      const allDone = completedDays.length >= 7;
      return (
        <>
          {unlockModal}
          {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
          <div key={`complete-${contentKey}`} className={`space-y-5 text-center py-4 ${transitionClass}`}>
          {stickyHeader}
          <div className="py-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto text-4xl shadow-lg shadow-amber-200">
              🎉
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-4">Day {activeDay.dayNumber} Complete!</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">Day {activeDay.dayNumber} クリア！</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-3 px-4">
              Quiz {quizScore}/{quizQuestions.length} correct · {activeDay.titleEn} mastered
            </p>
            <p className="text-[10px] text-slate-400/80 font-medium px-4">
              クイズ {quizScore}/{quizQuestions.length} 正解 · {activeDay.title}
            </p>
            {allDone ? (
              <div className="mt-6 mx-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
                <p className="text-lg font-black">🇯🇵 Japan Trip Ready!</p>
                <p className="text-[11px] text-indigo-100 font-semibold mt-1">All 7 days done — ready for Japan!</p>
                <p className="text-[10px] text-indigo-100/80 font-semibold mt-0.5">全7日完了 — 日本へ出発準備OK</p>
              </div>
            ) : (
              <p className="text-[11px] font-bold text-indigo-600 mt-4">
                {7 - completedDays.length} lesson{7 - completedDays.length === 1 ? '' : 's'} left / 残り {7 - completedDays.length} 日
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {allDone && isPackUnlocked && (
              <button
                type="button"
                onClick={() => goToStep('cheatsheet')}
                className="btn-press w-full py-3.5 rounded-2xl bg-amber-500 text-white font-black text-sm shadow-md"
              >
                📋 View cheat sheet / チートシートを見る
              </button>
            )}
            {activeDay.dayNumber === TRIP_PACK_FREE_DAY_MAX && !isPackUnlocked && (
              <button
                type="button"
                onClick={() => openUnlockModal('complete')}
                className="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-md"
              >
                Unlock 6 more days · {TRIP_PACK_PRICE_USD} / 残り6日を解放
              </button>
            )}
            <button
              type="button"
              onClick={() => goToStep('hub')}
              className="btn-press w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-sm"
            >
              Back to course / コース一覧に戻る
            </button>
          </div>
          </div>
        </>
      );
    }

    const q = quizQuestions[quizIndex];
    if (!q) return null;
    const isAnswered = quizSelected !== null;

    return (
      <>
        {unlockModal}
        {transitionPhase === 'bridge' && bridgeTarget && <StepBridge target={bridgeTarget} />}
        <div key={`quiz-${contentKey}`} className={`space-y-4 ${transitionClass}`}>
        {stickyHeader}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            STEP 3 · Quiz
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono">
            {quizIndex + 1} / {quizQuestions.length}
          </span>
        </div>

        <div key={`quiz-q-${quizIndex}`} className="space-y-4 animate-content-swap">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">What does this mean?</p>
          <p className="text-2xl font-black text-slate-900">{q.card.japanese}</p>
          <p className="text-xs text-slate-400 font-mono mt-1">{q.card.romaji}</p>
          <button
            type="button"
            onClick={() => speakJapanese(q.card.reading || q.card.japanese)}
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600"
          >
            <Volume2 className="w-3 h-3" /> Listen
          </button>
        </div>

        <div className="space-y-2">
          {q.choices.map((choice, i) => {
            let cls = 'bg-white border-slate-100 hover:border-indigo-200';
            if (isAnswered) {
              if (i === q.correctIndex) cls = 'bg-emerald-50 border-emerald-300';
              else if (i === quizSelected) cls = 'bg-red-50 border-red-200';
            }
            return (
              <button
                key={choice}
                type="button"
                disabled={isAnswered}
                onClick={() => handleQuizAnswer(i)}
                className={`btn-press w-full text-left rounded-xl border px-4 py-3 text-sm font-bold text-slate-800 ${cls}`}
              >
                <span className="flex items-center gap-2">
                  {isAnswered && i === q.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {isAnswered && i === quizSelected && i !== q.correctIndex && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  {choice}
                </span>
              </button>
            );
          })}
        </div>
        </div>
        </div>
      </>
    );
  }

  return null;
}
