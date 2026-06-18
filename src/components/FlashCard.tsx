'use client';

import React, { useState } from 'react';
import { WordCard } from '@/data/words';
import { CheckCircle, HelpCircle, RefreshCw, Star } from 'lucide-react';

interface FlashCardProps {
  card: WordCard;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleLearned: (id: string, learned: boolean) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
}

const getSituationLabel = (id: string) => {
  switch (id) {
    case 'ramen_shop':
      return 'ラーメン屋';
    case 'convenience_store':
      return 'コンビニ';
    case 'greetings':
      return '挨拶';
    case 'hospital':
      return '病院';
    case 'train_station':
      return '駅';
    case 'izakaya':
      return '居酒屋';
    default:
      return id;
  }
};

export default function FlashCard({
  card,
  isLearned,
  isFavorite,
  onToggleLearned,
  onToggleFavorite,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [animateStar, setAnimateStar] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleButtonClick = (e: React.MouseEvent, learned: boolean) => {
    e.stopPropagation(); // Prevent card from flipping when clicking buttons
    onToggleLearned(card.id, learned);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping when starring
    setAnimateStar(true);
    onToggleFavorite(card.id, !isFavorite);
    setTimeout(() => {
      setAnimateStar(false);
    }, 350);
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full tracking-wider">
                {getSituationLabel(card.situation)}
              </span>
              <button
                onClick={handleFavoriteClick}
                className="p-1 rounded-full hover:bg-slate-50 transition-colors"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`w-5 h-5 transition-transform ${
                    animateStar ? 'animate-star-pop' : 'active:scale-125'
                  } ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-500 transition-colors">
              <span className="text-[10px] font-medium">Tap to flip</span>
              <RefreshCw className="w-3 h-3 animate-pulse" />
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
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                !isLearned
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 border border-transparent'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center ${!isLearned ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                <HelpCircle className="w-4 h-4" />
              </span>
              Still learning
            </button>
            <button
              onClick={(e) => handleButtonClick(e, true)}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                isLearned
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-emerald-500 hover:text-white border border-slate-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center ${isLearned ? 'bg-emerald-600/40 text-white' : 'bg-slate-200 text-slate-500'}`}>
                <CheckCircle className="w-4 h-4" />
              </span>
              Learned
            </button>
          </div>
        </div>

        {/* Back Side (English) */}
        <div className="absolute inset-0 w-full h-full p-6 bg-slate-900 rounded-2xl shadow-md backface-hidden rotate-y-180 flex flex-col justify-between text-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full tracking-wider">
                Translation
              </span>
              <button
                onClick={handleFavoriteClick}
                className="p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <Star
                  className={`w-5 h-5 transition-transform ${
                    animateStar ? 'animate-star-pop' : 'active:scale-125'
                  } ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500 hover:text-amber-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1 text-slate-500 group-hover:text-indigo-400 transition-colors">
              <span className="text-[10px] font-medium">Tap to flip</span>
              <RefreshCw className="w-3 h-3" />
            </div>
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
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                !isLearned
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                  : 'bg-slate-800 text-slate-400 hover:bg-amber-500 hover:text-white'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center ${!isLearned ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <HelpCircle className="w-4 h-4" />
              </span>
              Still learning
            </button>
            <button
              onClick={(e) => handleButtonClick(e, true)}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                isLearned
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-850'
                  : 'bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center ${isLearned ? 'bg-emerald-600/40 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <CheckCircle className="w-4 h-4" />
              </span>
              Learned
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
