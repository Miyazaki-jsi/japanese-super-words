'use client';

import React, { useState } from 'react';
import { WordCard } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';
import { speakJapanese } from '@/lib/speakJapanese';
import { CheckCircle, HelpCircle, RefreshCw, Star, Volume2 } from 'lucide-react';

interface FlashCardProps {
  card: WordCard;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleLearned: (id: string, learned: boolean) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  /** `review` = spaced-repetition session (neutral buttons, Remembered / Review again) */
  mode?: 'learn' | 'review';
}

function ActionLabel({ en, ja }: { en: string; ja: string }) {
  return (
    <span className="flex flex-col items-center leading-tight">
      <span>{en}</span>
      <span className="text-[9px] font-semibold opacity-75">{ja}</span>
    </span>
  );
}

export default function FlashCard({
  card,
  isLearned,
  isFavorite,
  onToggleLearned,
  onToggleFavorite,
  mode = 'learn',
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [animateStar, setAnimateStar] = useState(false);
  const situationLabel = getSituationLabel(card.situation);
  const isReview = mode === 'review';

  const negativeLabel = isReview
    ? { en: 'Review again', ja: 'もう一度' }
    : { en: 'Still learning', ja: 'まだ覚えてない' };
  const positiveLabel = isReview
    ? { en: 'Remembered', ja: '覚えた' }
    : { en: 'Learned', ja: '覚えた' };

  const showNegativeActive = !isReview && !isLearned;
  const showPositiveActive = !isReview && isLearned;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleButtonClick = (e: React.MouseEvent, learned: boolean) => {
    e.stopPropagation();
    onToggleLearned(card.id, learned);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateStar(true);
    onToggleFavorite(card.id, !isFavorite);
    setTimeout(() => {
      setAnimateStar(false);
    }, 350);
  };

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakJapanese(card.reading || card.japanese, {
      cardId: card.id,
      situation: card.situation,
    });
  };

  const negativeButtonClass = (dark: boolean) => {
    if (dark) {
      return showNegativeActive
        ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
        : 'bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-white border border-slate-700';
    }
    return showNegativeActive
      ? 'bg-amber-50 text-amber-600 border border-amber-200'
      : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 border border-slate-100';
  };

  const positiveButtonClass = (dark: boolean) => {
    if (dark) {
      return showPositiveActive
        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-850'
        : 'bg-slate-800 text-slate-300 hover:bg-emerald-500 hover:text-white border border-slate-700';
    }
    return showPositiveActive
      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
      : 'bg-slate-50 text-slate-600 hover:bg-emerald-500 hover:text-white border border-slate-100';
  };

  const negativeIconClass = (dark: boolean) => {
    if (dark) {
      return showNegativeActive
        ? 'bg-amber-600 text-white'
        : 'bg-slate-700 text-slate-300';
    }
    return showNegativeActive
      ? 'bg-amber-100 text-amber-600'
      : 'bg-slate-200 text-slate-500';
  };

  const positiveIconClass = (dark: boolean) => {
    if (dark) {
      return showPositiveActive
        ? 'bg-emerald-600/40 text-white'
        : 'bg-slate-700 text-slate-300';
    }
    return showPositiveActive
      ? 'bg-emerald-600/40 text-white'
      : 'bg-slate-200 text-slate-500';
  };

  return (
    <div
      onClick={handleFlip}
      className="w-full h-72 perspective-1000 cursor-pointer group"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side (Japanese) */}
        <div className="absolute inset-0 w-full h-full p-6 bg-white rounded-2xl shadow-md border border-slate-100 backface-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full tracking-wider truncate max-w-[7rem]">
                {situationLabel.en}
              </span>
              <button
                onClick={handleFavoriteClick}
                className="no-press p-1 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`w-5 h-5 icon-pop ${
                    animateStar ? 'animate-star-pop' : ''
                  } ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleListen}
                className="no-press flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[10px] font-bold transition-colors"
                aria-label="Listen"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Listen
              </button>
              <div className="hidden sm:flex items-center gap-1 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <span className="text-[10px] font-medium">Flip</span>
                <RefreshCw className="w-3 h-3 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 font-sans tracking-tight">
              {card.japanese}
            </h3>
            <p className="text-sm text-slate-400 font-medium mb-1">
              {card.reading}
            </p>
            <p className="text-xs text-indigo-400 font-mono tracking-wide">
              {card.romaji}
            </p>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t border-slate-50">
            <button
              onClick={(e) => handleButtonClick(e, false)}
              className={`flex-1 py-2 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 ${negativeButtonClass(false)}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${negativeIconClass(false)}`}>
                <HelpCircle className="w-4 h-4" />
              </span>
              <ActionLabel en={negativeLabel.en} ja={negativeLabel.ja} />
            </button>
            <button
              onClick={(e) => handleButtonClick(e, true)}
              className={`flex-1 py-2 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 ${positiveButtonClass(false)}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${positiveIconClass(false)}`}>
                <CheckCircle className="w-4 h-4" />
              </span>
              <ActionLabel en={positiveLabel.en} ja={positiveLabel.ja} />
            </button>
          </div>
        </div>

        {/* Back Side (English) */}
        <div className="absolute inset-0 w-full h-full p-6 bg-slate-900 rounded-2xl shadow-md backface-hidden rotate-y-180 flex flex-col justify-between text-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full tracking-wider">
                Translation
              </span>
              <button
                onClick={handleFavoriteClick}
                className="no-press p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <Star
                  className={`w-5 h-5 icon-pop ${
                    animateStar ? 'animate-star-pop' : ''
                  } ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500 hover:text-amber-400'
                  }`}
                />
              </button>
            </div>
            <button
              type="button"
              onClick={handleListen}
              className="no-press flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 hover:bg-slate-700 text-[10px] font-bold"
              aria-label="Listen"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Listen
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-wide leading-snug">
              {card.english}
            </h4>
            <span className="text-xs text-slate-500 mt-3 italic font-serif">Original: {card.japanese}</span>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={(e) => handleButtonClick(e, false)}
              className={`flex-1 py-2 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 ${negativeButtonClass(true)}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${negativeIconClass(true)}`}>
                <HelpCircle className="w-4 h-4" />
              </span>
              <ActionLabel en={negativeLabel.en} ja={negativeLabel.ja} />
            </button>
            <button
              onClick={(e) => handleButtonClick(e, true)}
              className={`flex-1 py-2 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 ${positiveButtonClass(true)}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${positiveIconClass(true)}`}>
                <CheckCircle className="w-4 h-4" />
              </span>
              <ActionLabel en={positiveLabel.en} ja={positiveLabel.ja} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
