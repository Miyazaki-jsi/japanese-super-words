'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Lock,
  MessageCircle,
  Sparkles,
  Star,
  UserRound,
  Volume2,
  XCircle,
} from 'lucide-react';
import FlashCard from '@/components/FlashCard';
import RubyText from '@/components/RubyText';
import { speakJapanese } from '@/lib/speakJapanese';
import { WordCard } from '@/data/words';
import {
  JAPAN_PRO_PRICE_USD,
} from '@/data/monetization';
import {
  getMiniPackCompletedKey,
  getMiniPackEstimateMinutes,
  getMiniPackWords,
  type MiniPack,
} from '@/data/miniPacks';
import { readMiniPackUnlocked } from '@/data/miniPackUnlock';
import { PREMIUM_SITUATION_COUNT } from '@/data/premiumSituations';
import { trackEvent } from '@/lib/analytics';

type MiniPackStep = 'hub' | 'intro' | 'study' | 'roleplay' | 'quiz' | 'complete';

type MiniPackQuizQuestion = {
  card: WordCard;
  choices: string[];
  correctIndex: number;
};

type MiniPackScreenProps = {
  pack: MiniPack;
  learnedIds: string[];
  favoriteIds: string[];
  onToggleLearned: (id: string, learned: boolean) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  onClose: () => void;
  onUnlockStateChange?: () => void;
  onRequestProUnlock?: () => void;
};

function buildQuizQuestions(cards: WordCard[], count: number): MiniPackQuizQuestion[] {
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

export default function MiniPackScreen({
  pack,
  learnedIds,
  favoriteIds,
  onToggleLearned,
  onToggleFavorite,
  onClose,
  onUnlockStateChange,
  onRequestProUnlock,
}: MiniPackScreenProps) {
  const [step, setStep] = useState<MiniPackStep>('hub');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [studyWords, setStudyWords] = useState<WordCard[]>([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [roleplayIndex, setRoleplayIndex] = useState(0);
  const [selectedRoleplay, setSelectedRoleplay] = useState<number | null>(null);
  const [roleplayDone, setRoleplayDone] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<MiniPackQuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  const estimateMin = getMiniPackEstimateMinutes(pack);

  const refreshUnlock = () => {
    setIsUnlocked(readMiniPackUnlocked(pack.id));
    onUnlockStateChange?.();
  };

  useEffect(() => {
    refreshUnlock();
    setIsCompleted(localStorage.getItem(getMiniPackCompletedKey(pack.id)) === 'true');
  }, [pack.id]);

  const markCompleted = () => {
    localStorage.setItem(getMiniPackCompletedKey(pack.id), 'true');
    setIsCompleted(true);
    trackEvent('mini_pack_completed', { packId: pack.id });
  };

  const openLesson = () => {
    if (!isUnlocked) {
      onRequestProUnlock?.();
      trackEvent('unlock_modal_open', { packId: pack.id, source: 'mini_pack', tier: 'pro' });
      return;
    }
    const isResuming = studyWords.length > 0;
    if (!isResuming) {
      setStudyWords(getMiniPackWords(pack));
      setStudyIndex(0);
      setRoleplayIndex(0);
      setSelectedRoleplay(null);
      setRoleplayDone(false);
      setQuizQuestions([]);
      setQuizIndex(0);
      setQuizScore(0);
      setQuizSelected(null);
    }
    setStep('intro');
  };

  const startStudy = () => setStep('study');

  const startRoleplay = () => setStep('roleplay');

  const advanceStudy = () => {
    if (studyIndex < studyWords.length - 1) {
      setStudyIndex((i) => i + 1);
    } else {
      setStep('intro');
    }
  };

  const goBackStudy = () => {
    if (studyIndex <= 0) return;
    setStudyIndex((i) => i - 1);
  };

  const handleStudyLearned = (id: string, learned: boolean) => {
    onToggleLearned(id, learned);
    if (!learned) return;
    setTimeout(advanceStudy, 480);
  };

  const startQuiz = () => {
    if (quizQuestions.length === 0) {
      setQuizQuestions(buildQuizQuestions(studyWords, pack.quizCount));
      setQuizIndex(0);
      setQuizScore(0);
      setQuizSelected(null);
    }
    setStep('quiz');
  };

  const goToNextRoleplayOrQuiz = () => {
    if (roleplayIndex < pack.roleplays.length - 1) {
      setRoleplayIndex((i) => i + 1);
      setSelectedRoleplay(null);
      setRoleplayDone(false);
    } else {
      setStep('intro');
    }
  };

  const handleQuizAnswer = (choiceIndex: number) => {
    if (quizSelected !== null || !quizQuestions[quizIndex]) return;
    setQuizSelected(choiceIndex);
    const isCorrect = choiceIndex === quizQuestions[quizIndex].correctIndex;
    if (isCorrect) setQuizScore((s) => s + 1);
  };

  const advanceQuiz = () => {
    if (quizSelected === null) return;
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizSelected(null);
    } else {
      markCompleted();
      setStep('complete');
    }
  };

  const handleHeaderBack = () => {
    if (step === 'hub' || step === 'intro') {
      onClose();
      return;
    }
    if (step === 'roleplay' && (roleplayIndex > 0 || selectedRoleplay !== null)) {
      if (selectedRoleplay !== null) {
        setSelectedRoleplay(null);
        setRoleplayDone(false);
      } else {
        setRoleplayIndex((i) => i - 1);
        setSelectedRoleplay(null);
        setRoleplayDone(false);
      }
      return;
    }
    if (step === 'complete') {
      setStep('hub');
      return;
    }
    setStep('intro');
  };

  const header = (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
      <button
        type="button"
        onClick={handleHeaderBack}
        className="btn-press relative z-10 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 touch-manipulation"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center min-w-0 px-2">
        <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none truncate">{pack.titleEn}</h2>
        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{pack.title}</p>
      </div>
      <div className="w-9" />
    </div>
  );

  if (step === 'hub') {
    return (
      <div className="space-y-4 animate-fade-in">
        {header}
        <div className={`rounded-3xl bg-gradient-to-br ${pack.accent} p-5 text-white shadow-lg relative overflow-hidden`}>
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{pack.emoji}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                {isUnlocked ? 'Unlocked' : 'Japan Pro'}
              </span>
            </div>
              <h3 className="text-xl font-black leading-tight">{pack.titleEn}</h3>
              <p className="text-[11px] text-white/85 font-semibold mt-1">{pack.goalEn}</p>
              <p className="text-[10px] text-white/70 font-semibold mt-0.5">{pack.goal}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
                  {pack.wordIds.length} phrases
                </span>
                <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
                  {pack.roleplays.length} roleplays
                </span>
                <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
                  ~{estimateMin} min
                </span>
              </div>
              {isCompleted && (
                <p className="mt-3 text-[11px] font-bold text-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </p>
              )}
          </div>
        </div>

        {isUnlocked ? (
            <button
              type="button"
              onClick={openLesson}
              className="lesson-start-btn btn-press w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm shadow-lg shadow-indigo-200"
            >
              <span className="relative z-10 block leading-tight">
                {isCompleted ? 'Review Pack' : 'Start Pack'}
                <span className="block text-[10px] font-semibold text-indigo-100/90 mt-0.5">
                  {isCompleted ? 'もう一度復習する' : 'パックを始める'}
                </span>
              </span>
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-amber-900">Included in Japan Pro</p>
                  <p className="text-[10px] font-semibold text-amber-700/90 mt-0.5 leading-snug">
                    Pro unlocks all mini courses — trip course + {PREMIUM_SITUATION_COUNT} real scenes included.
                  </p>
                  <p className="text-[9px] font-semibold text-amber-600/70 mt-0.5">
                    Proで解放 · 旅行コース + プレミアムシチュ込み
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onRequestProUnlock?.();
                  trackEvent('unlock_modal_open', { packId: pack.id, source: 'mini_pack_hub', tier: 'pro' });
                }}
                className="btn-press w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Unlock Japan Pro · {JAPAN_PRO_PRICE_USD}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="space-y-4 animate-fade-in">
          {header}
          <div className={`rounded-3xl bg-gradient-to-br ${pack.accent} p-5 text-white shadow-lg`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">~{estimateMin} min</p>
            <h3 className="text-xl font-black mt-2">{pack.titleEn}</h3>
            <p className="text-[11px] text-white/80 font-semibold mt-1">{pack.title}</p>
            <p className="text-sm font-bold mt-3">{pack.goalEn}</p>
            <p className="text-[11px] text-white/75 font-semibold mt-0.5">{pack.goal}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2">
            <p className="text-xs font-black text-slate-800 mb-1">Today&apos;s steps</p>
            <p className="text-[10px] text-slate-400 font-semibold mb-2">好きな順番で選べます · Pick any step</p>
            {[
              { id: 'study' as const, icon: Star, label: 'Learn phrases', sub: 'フレーズを覚える', meta: `${studyWords.length} cards`, color: 'text-amber-500 bg-amber-50', progress: studyIndex > 0 ? `${studyIndex + 1}/${studyWords.length}` : null },
              { id: 'roleplay' as const, icon: MessageCircle, label: 'Roleplay', sub: '会話シミュレーション', meta: `${pack.roleplays.length} scenes`, color: 'text-violet-500 bg-violet-50', progress: roleplayIndex > 0 || roleplayDone ? `${roleplayIndex + 1}/${pack.roleplays.length}` : null },
              { id: 'quiz' as const, icon: ClipboardCheck, label: 'Quiz', sub: 'ミニクイズ', meta: `${pack.quizCount} questions`, color: 'text-indigo-500 bg-indigo-50', progress: quizIndex > 0 && quizQuestions.length > 0 ? `${quizIndex + 1}/${quizQuestions.length}` : null },
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
    );
  }

  if (step === 'study') {
    const card = studyWords[studyIndex];
    if (!card) return null;
    return (
      <div className="space-y-4">
          {header}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">STEP 1</span>
            <span className="text-[11px] font-bold text-slate-400 font-mono">
              {studyIndex + 1} / {studyWords.length}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${((studyIndex + 1) / studyWords.length) * 100}%` }}
            />
          </div>
          <FlashCard
            key={`study-${studyIndex}`}
            card={card}
            isLearned={learnedIds.includes(card.id)}
            isFavorite={favoriteIds.includes(card.id)}
            onToggleLearned={handleStudyLearned}
            onToggleFavorite={onToggleFavorite}
          />
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
      </div>
    );
  }

  if (step === 'roleplay') {
    const rp = pack.roleplays[roleplayIndex];
    if (!rp) return null;
    const turn = rp.turns[0];
    if (!turn) return null;
    const isLast = roleplayIndex >= pack.roleplays.length - 1;
    return (
      <div className="space-y-4">
          {header}
          <span className="text-[11px] font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            STEP 2 · {roleplayIndex + 1}/{pack.roleplays.length}
          </span>
          <div>
            <p className="text-[11px] font-bold text-slate-800">{rp.sceneTitleEn}</p>
            <p className="text-[9px] text-slate-400">{rp.sceneTitle}</p>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
              <UserRound className="w-4 h-4 text-white" />
            </div>
            <div className="bg-zinc-100 rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[88%]">
              <p className="text-[10px] text-slate-600 font-semibold">{turn.staffEnglish}</p>
              <RubyText japanese={turn.staffLine} reading={turn.staffReading} className="text-[13px] font-bold text-slate-500 mt-1" />
            </div>
          </div>
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-slate-600">Your reply</p>
              <span className="text-[9px] font-bold text-slate-400">あなたの返答</span>
            </div>
            <div className="space-y-1.5">
              {turn.choices.map((choice, i) => {
                const isSelected = selectedRoleplay === i;
                const showResult = selectedRoleplay !== null;
                const selectedChoice = selectedRoleplay !== null ? turn.choices[selectedRoleplay] : null;
                const pickedWrong = showResult && selectedChoice !== null && !selectedChoice.correct;
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
                const showFeedback =
                  isSelected || (showResult && choice.correct && pickedWrong);
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
                      <p className="text-[13px] font-bold text-slate-800 leading-snug">{choice.label}</p>
                      {choice.sublabel && (
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{choice.sublabel}</p>
                      )}
                      {showFeedback && (
                        <p
                          className={`text-[10px] font-bold mt-1.5 leading-snug ${
                            choice.correct ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {choice.feedback}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {roleplayDone && selectedRoleplay !== null && !turn.choices[selectedRoleplay].correct && (
            <p className="text-[10px] font-semibold text-slate-500 text-center">
              正解は緑のチェックマークで表示されています
            </p>
          )}
          {roleplayDone && (
            <button
              type="button"
              onClick={goToNextRoleplayOrQuiz}
              className="btn-press w-full py-4 rounded-2xl bg-violet-600 text-white font-black text-sm"
            >
              {isLast ? 'Back to steps / ステップに戻る' : 'Next Scene'}
            </button>
          )}
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="space-y-5 text-center py-4">
          {header}
          <div className="py-6">
            <div className="text-5xl">{pack.emoji}</div>
            <h3 className="text-2xl font-black text-slate-900 mt-4">Pack Complete!</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">{pack.titleEn}</p>
            <p className="text-[10px] text-slate-400 font-semibold">{pack.title}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-3">
              Quiz {quizScore}/{quizQuestions.length} correct
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep('hub')}
            className="btn-press w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-sm"
          >
          Back to Pack / パックに戻る
        </button>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = quizQuestions[quizIndex];
    if (!q) return null;
    const isAnswered = quizSelected !== null;
    return (
      <div className="space-y-4">
          {header}
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            STEP 3 · {quizIndex + 1}/{quizQuestions.length}
          </span>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
            <p className="text-2xl font-black text-slate-900">{q.card.japanese}</p>
            <p className="text-xs text-slate-400 font-mono mt-1">{q.card.romaji}</p>
            <button
              type="button"
              onClick={() =>
                speakJapanese(q.card.reading || q.card.japanese, {
                  cardId: q.card.id,
                  situation: q.card.situation,
                })
              }
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600"
            >
              <Volume2 className="w-3 h-3" /> Listen
            </button>
          </div>
          <div className="space-y-2">
            {q.choices.map((choice, i) => {
              let cls = 'bg-white border-slate-100';
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
                  className={`btn-press w-full text-left rounded-xl border px-4 py-3 text-sm font-bold ${cls}`}
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
          {isAnswered && (
            <button
              type="button"
              onClick={advanceQuiz}
              className="btn-press w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-sm"
            >
              Next / 次へ
            </button>
          )}
      </div>
    );
  }

  return null;
}
