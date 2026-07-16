'use client';

import React from 'react';
import { useUiLang } from '@/lib/uiLang';

type BilingualLabelProps = {
  en: string;
  ja: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onDark?: boolean;
  className?: string;
  enClassName?: string;
  jaClassName?: string;
  truncate?: boolean;
};

const EN_SIZE: Record<NonNullable<BilingualLabelProps['size']>, string> = {
  xs: 'text-[11px] sm:text-xs font-extrabold leading-tight',
  sm: 'text-sm font-black leading-tight',
  md: 'text-lg font-black leading-tight tracking-tight',
  lg: 'text-xl font-black leading-tight',
  xl: 'text-2xl font-black leading-tight',
};

const JA_SIZE: Record<NonNullable<BilingualLabelProps['size']>, string> = {
  xs: 'text-[8px] font-semibold mt-0.5 leading-tight',
  sm: 'text-[10px] font-semibold mt-0.5 leading-tight',
  md: 'text-[11px] font-semibold mt-0.5 leading-tight',
  lg: 'text-xs font-semibold mt-0.5 leading-tight',
  xl: 'text-sm font-semibold mt-1 leading-tight',
};

export default function BilingualLabel({
  en,
  ja,
  size = 'sm',
  onDark = false,
  className = '',
  enClassName = '',
  jaClassName = '',
  truncate = false,
}: BilingualLabelProps) {
  const { jaOnly } = useUiLang();
  const jaColor = onDark ? 'text-white/75' : 'text-slate-400';
  const truncateClass = truncate ? 'truncate' : '';

  if (jaOnly) {
    return (
      <div className={className}>
        <p className={`${EN_SIZE[size]} ${truncateClass} ${enClassName || jaClassName}`}>
          {ja}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className={`${EN_SIZE[size]} ${truncateClass} ${enClassName}`}>{en}</p>
      <p className={`${JA_SIZE[size]} ${jaColor} ${truncateClass} ${jaClassName}`}>{ja}</p>
    </div>
  );
}

type BilingualButtonLabelProps = {
  en: string;
  ja: string;
  onDark?: boolean;
  enClassName?: string;
  jaClassName?: string;
};

export function BilingualButtonLabel({
  en,
  ja,
  onDark = false,
  enClassName = 'block text-sm font-extrabold leading-tight',
  jaClassName = '',
}: BilingualButtonLabelProps) {
  const { jaOnly } = useUiLang();
  const jaDefault = onDark
    ? 'block text-[10px] font-semibold text-white/80 mt-0.5 leading-tight'
    : 'block text-[10px] font-semibold text-slate-400 mt-0.5 leading-tight';

  if (jaOnly) {
    return <span className={enClassName}>{ja}</span>;
  }

  return (
    <>
      <span className={enClassName}>{en}</span>
      <span className={jaClassName || jaDefault}>{ja}</span>
    </>
  );
}
