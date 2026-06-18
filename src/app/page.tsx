'use client';

import React, { useState, useEffect } from 'react';
import { sampleWords, WordCard, SituationId } from '@/data/words';
import FlashCard from '@/components/FlashCard';
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
  Check,
} from 'lucide-react';

type ScreenType = 'home' | 'situation' | 'favorites';
type FilterType = 'all' | 'unlearned';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedSituation, setSelectedSituation] = useState<SituationId | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Random Study states
  const [isRandomStudyMode, setIsRandomStudyMode] = useState(false);
  const [randomStudyCards, setRandomStudyCards] = useState<WordCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleStartRandomStudy = () => {
    if (displayCards.length === 0) return;
    const shuffled = [...displayCards].sort(() => Math.random() - 0.5);
    setRandomStudyCards(shuffled);
    setCurrentCardIndex(0);
    setIsRandomStudyMode(true);
  };

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
  const [premiumModal, setPremiumModal] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedLearned = localStorage.getItem('japanese-super-words-progress');
    const savedFavorites = localStorage.getItem('japanese-super-words-favorites');
    const savedName = localStorage.getItem('japanese-super-words-username');
    
    if (savedLearned) {
      try { setLearnedIds(JSON.parse(savedLearned)); } catch (e) { console.error(e); }
    }
    if (savedFavorites) {
      try { setFavoriteIds(JSON.parse(savedFavorites)); } catch (e) { console.error(e); }
    }
    if (savedName) {
      setUserName(savedName);
      setNameInput(savedName);
    }
    setIsLoaded(true);
  }, []);

  // Save learned status
  const handleToggleLearned = (id: string, learned: boolean) => {
    let updated: string[];
    if (learned) {
      if (learnedIds.includes(id)) return;
      updated = [...learnedIds, id];
    } else {
      updated = learnedIds.filter((item) => item !== id);
    }
    setLearnedIds(updated);
    localStorage.setItem('japanese-super-words-progress', JSON.stringify(updated));
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

  const handleResetProgress = () => {
    if (window.confirm('進捗をリセットしますか？ (Are you sure you want to reset all your progress?)')) {
      setLearnedIds([]);
      setFavoriteIds([]);
      setUserName('ゲスト');
      setNameInput('ゲスト');
      localStorage.removeItem('japanese-super-words-progress');
      localStorage.removeItem('japanese-super-words-favorites');
      localStorage.removeItem('japanese-super-words-username');
    }
  };

  // XP & Rank Calculations
  // Let's define: 1 learned word = 20 XP, 1 favorite word = 10 XP
  const learnedXP = learnedIds.length * 20;
  const favoriteXP = favoriteIds.length * 10;
  const totalXP = learnedXP + favoriteXP;

  // Ranks: Bronze (0-299 XP), Silver (300-599 XP), Gold (600-899 XP), Platinum (900+ XP)
  const getRankInfo = (xp: number) => {
    if (xp < 300) {
      return {
        name: 'ブロンズ',
        enName: 'Bronze',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeColor: 'bg-amber-600 text-white',
        nextXP: 300,
        prevXP: 0,
      };
    } else if (xp < 600) {
      return {
        name: 'シルバー',
        enName: 'Silver',
        color: 'text-slate-500 bg-slate-50 border-slate-200',
        badgeColor: 'bg-slate-400 text-white',
        nextXP: 600,
        prevXP: 300,
      };
    } else if (xp < 900) {
      return {
        name: 'ゴールド',
        enName: 'Gold',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        badgeColor: 'bg-yellow-500 text-white',
        nextXP: 900,
        prevXP: 600,
      };
    } else {
      return {
        name: 'プラチナ',
        enName: 'Platinum',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        badgeColor: 'bg-indigo-600 text-white',
        nextXP: 1200, // Dummy next limit
        prevXP: 900,
      };
    }
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

  // Total available words in database
  const totalDbWords = sampleWords.length;

  const freeSituations = [
    { id: 'ramen_shop', title: 'ラーメン屋', enTitle: 'Ramen Shop', icon: Utensils, color: 'from-orange-500 to-amber-500' },
    { id: 'convenience_store', title: 'コンビニ', enTitle: 'Convenience Store', icon: ShoppingBag, color: 'from-pink-500 to-rose-500' },
    { id: 'greetings', title: '挨拶', enTitle: 'Greetings', icon: Compass, color: 'from-teal-500 to-emerald-500' },
    { id: 'hospital', title: '病院', enTitle: 'Hospital', icon: HeartPulse, color: 'from-red-500 to-rose-600' },
    { id: 'train_station', title: '駅', enTitle: 'Train Station', icon: Plane, color: 'from-sky-500 to-blue-600' },
    { id: 'izakaya', title: '居酒屋', enTitle: 'Izakaya', icon: Beer, color: 'from-purple-500 to-indigo-600' },
  ] as const;

  const premiumSituations = [
    { id: 'hangover', title: '二日酔い', enTitle: 'Hangover' },
    { id: 'missed_last_train', title: '終電逃した時', enTitle: 'Missed the Last Train' },
    { id: 'festival', title: '祭り', enTitle: 'Festival' },
    { id: 'bank', title: '銀行', enTitle: 'Bank' },
    { id: 'highway', title: '高速道路', enTitle: 'Highway' },
    { id: 'rainy_day', title: '雨の日', enTitle: 'Rainy Day' },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* HEADER */}
      <header className="bg-[#f0ad4e] text-white px-5 py-4 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-none text-white">
              超日本語学習
            </h1>
            <p className="text-[10px] text-white/90 font-medium tracking-wide">
              Japanese Immersion
            </p>
          </div>
        </div>
        {learnedIds.length > 0 && (
          <button
            onClick={handleResetProgress}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1 text-[11px] font-bold"
            title="Reset Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            リセット
          </button>
        )}
      </header>

      {/* MAIN CONTAINER (Mobile Centered / Premium Look) */}
      <div className="max-w-md mx-auto px-4 mt-5 space-y-6">
        
        {currentScreen === 'home' ? (
          /* ==================== HOME SCREEN ==================== */
          <div key="home-screen" className="space-y-6 animate-fade-in">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-5 relative overflow-hidden">
              <div className="flex items-center gap-4">
                {/* Avatar with Camera Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  {/* Camera Icon Overlay */}
                  <div className="absolute -bottom-1 -right-1 bg-slate-500 text-white p-1 rounded-full border-2 border-white cursor-pointer shadow-sm hover:bg-slate-600 transition-colors">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
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
                        <button
                          onClick={handleSaveName}
                          className="bg-emerald-500 text-white p-1 rounded-lg text-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-extrabold text-slate-900 truncate">
                          {userName}
                        </h2>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    {learnedIds.length} / {totalDbWords} words learned
                  </p>
                </div>

                {/* Rank Badge */}
                <div className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${rank.color} shadow-sm font-black`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black mt-1 text-slate-500 uppercase tracking-wide">
                    {rank.enName}
                  </span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-5 pt-3 border-t border-slate-50 space-y-1.5">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500 font-mono">
                    {totalXP} / {rank.nextXP} XP
                  </span>
                  <div className="flex items-center gap-1 text-[#f0ad4e] font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{rank.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: SELECT SITUATION */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  シチュエーションを選ぼう
                </h3>
                <span className="text-xs text-slate-400 font-semibold italic">
                  Pick a situation
                </span>
              </div>

              {/* FAVORITE WORDS BUTTON */}
              <button
                onClick={() => {
                  setCurrentScreen('favorites');
                  setFilter('all');
                }}
                className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-100 p-4 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      お気に入り単語
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      Favorite Words
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                    {favoriteIds.length}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </button>

              {/* SITUATIONS GRID */}
              <div className="grid grid-cols-3 gap-2">
                {/* Free Situations */}
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
                            {sit.title}
                          </h4>
                          <p className="text-[8px] text-slate-400 font-medium truncate">
                            {sit.enTitle}
                          </p>
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

                {/* Premium Situations */}
                {premiumSituations.map((sit) => {
                  return (
                    <button
                      key={sit.id}
                      onClick={() => setPremiumModal(sit.title)}
                      className="bg-yellow-50/20 rounded-xl border border-yellow-100/50 px-2.5 py-2 text-left hover:shadow-sm transition-all flex flex-col justify-between h-20 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-400 text-[11px] sm:text-xs leading-tight truncate">
                            {sit.title}
                          </h4>
                          <p className="text-[8px] text-slate-400 font-medium truncate">
                            {sit.enTitle}
                          </p>
                        </div>
                        <Lock className="w-3 h-3 text-amber-500/60 ml-1 flex-shrink-0" />
                      </div>

                      <div className="mt-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-100/70 text-amber-700 text-[7px] font-black rounded">
                          Premium
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
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
                    ランダム学習
                  </h2>
                  <p className="text-xs text-indigo-600 font-bold font-mono mt-1">
                    {currentCardIndex + 1} / {randomStudyCards.length}
                  </p>
                </div>
                <button
                  onClick={() => setIsRandomStudyMode(false)}
                  className="bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 transition-colors"
                >
                  終了
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
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
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      {currentScreen === 'favorites'
                        ? 'お気に入り単語'
                        : freeSituations.find((s) => s.id === selectedSituation)?.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold italic mt-0.5">
                      {currentScreen === 'favorites'
                        ? 'Favorite Words List'
                        : freeSituations.find((s) => s.id === selectedSituation)?.enTitle}
                    </p>
                  </div>
                </div>

                {/* Random Study Button */}
                {displayCards.length > 0 && (
                  <button
                    onClick={handleStartRandomStudy}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                    <span>ランダムで学習</span>
                  </button>
                )}

                {/* Filters */}
                {displayCards.length > 0 || filter === 'unlearned' ? (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-full">
                    <button
                      onClick={() => setFilter('all')}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                        filter === 'all'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      すべて ({currentScreen === 'favorites' ? favoriteIds.length : selectedSituation ? getStats(selectedSituation).total : 0})
                    </button>
                    <button
                      onClick={() => setFilter('unlearned')}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                        filter === 'unlearned'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      まだ覚えてない ({
                        currentScreen === 'favorites'
                          ? displayCards.filter(c => !learnedIds.includes(c.id)).length
                          : selectedSituation
                          ? getStats(selectedSituation).total - getStats(selectedSituation).learnedCount
                          : 0
                      })
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Card List Container - Row list with small vertical height, Romaji underneath, star on the right */}
              {displayCards.length > 0 ? (
                <div className="space-y-2">
                  {displayCards.map((card) => {
                    const isFav = favoriteIds.includes(card.id);
                    const isLearned = learnedIds.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center justify-between shadow-sm hover:border-slate-200 transition-all"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight truncate">
                            {card.japanese}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">
                            {card.romaji}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Learned Toggle Button */}
                          <button
                            onClick={() => handleToggleLearned(card.id, !isLearned)}
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
                            onClick={() => handleToggleFavorite(card.id, !isFav)}
                            className="p-1.5 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0"
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star
                              className={`w-4 h-4 transition-transform active:scale-125 ${
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
                    <h3 className="text-base font-extrabold text-slate-800">
                      {currentScreen === 'favorites' ? 'お気に入りは空っぽです' : 'すべて覚えました！'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentScreen === 'favorites'
                        ? 'お気に入りに追加したワードはありません。'
                        : 'おめでとうございます！すべてのフラッシュカードをマスターしました。'}
                    </p>
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

      {/* PREMIUM MODAL */}
      {premiumModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-slate-100 animate-scale-up">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                「{premiumModal}」はPremium機能です
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                プレミアムプランにアップグレードすると、すべてのシチュエーションワードが解放され、より多くの日本語フレーズやクイズにアクセスできるようになります。
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPremiumModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                閉じる
              </button>
              <button
                onClick={() => {
                  alert('プレミアムプランの決済画面（デモ）へ移動します。');
                  setPremiumModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md shadow-amber-200"
              >
                登録する (Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
