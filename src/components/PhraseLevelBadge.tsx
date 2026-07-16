'use client';

import React from 'react';
import type { PhraseLevelMeta } from '@/data/phraseLevel';
import { useUiLang } from '@/lib/uiLang';

type PhraseLevelBadgeProps = {
  level: PhraseLevelMeta;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: { wrap: 'w-9 h-9 rounded-xl', icon: 'w-4 h-4', title: 'text-[11px]', sub: 'text-[9px]' },
  md: { wrap: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7', title: 'text-sm', sub: 'text-[10px]' },
  lg: { wrap: 'w-20 h-20 rounded-3xl', icon: 'w-10 h-10', title: 'text-base', sub: 'text-xs' },
};

export default function PhraseLevelBadge({
  level,
  size = 'md',
  showLabel = false,
  className = '',
}: PhraseLevelBadgeProps) {
  const { jaOnly } = useUiLang();
  const Icon = level.icon;
  const s = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${s.wrap} bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-md ring-2 ${level.ring} flex-shrink-0`}
      >
        <Icon className={`${s.icon} text-white`} strokeWidth={2.25} />
      </div>
      {showLabel && (
        <div className="min-w-0 text-left">
          <p className={`${s.title} font-black text-slate-900 leading-tight`}>
            {jaOnly ? level.jaName : level.enName}
          </p>
          {!jaOnly && (
            <p className={`${s.sub} font-semibold text-slate-500`}>{level.jaName}</p>
          )}
        </div>
      )}
    </div>
  );
}
