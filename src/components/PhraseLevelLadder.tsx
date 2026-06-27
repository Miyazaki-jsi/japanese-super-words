'use client';

import React from 'react';
import { phraseLevels, type PhraseLevelId } from '@/data/phraseLevel';

type PhraseLevelLadderProps = {
  currentLevelId: PhraseLevelId | null;
  compact?: boolean;
};

export default function PhraseLevelLadder({ currentLevelId, compact = false }: PhraseLevelLadderProps) {
  return (
    <div className={`grid ${compact ? 'grid-cols-6 gap-1' : 'grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-1.5'}`}>
      {phraseLevels.map((level) => {
        const Icon = level.icon;
        const isCurrent = currentLevelId === level.id;
        const isUnlocked = currentLevelId !== null && level.id <= currentLevelId;
        return (
          <div
            key={level.id}
            className={`flex flex-col items-center text-center rounded-xl px-1 py-2 transition-all ${
              isCurrent
                ? `bg-gradient-to-b ${level.gradient} text-white shadow-md scale-[1.03]`
                : isUnlocked
                  ? `${level.iconBg} ${level.iconColor}`
                  : 'bg-slate-50 text-slate-300'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isCurrent ? 'bg-white/20' : isUnlocked ? 'bg-white/80' : 'bg-white'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2.25} />
            </div>
            {!compact && (
              <>
                <p className={`text-[8px] font-black mt-1 leading-tight ${isCurrent ? 'text-white' : ''}`}>
                  {level.enName}
                </p>
                <p
                  className={`text-[7px] font-semibold leading-tight mt-0.5 ${
                    isCurrent ? 'text-white/80' : 'opacity-70'
                  }`}
                >
                  {level.jaName}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
