export type ProgressTip = { en: string; ja: string };

/** Shown under the XP bar when the learner has 0 phrases. */
export const BEGINNER_PROGRESS_TIPS: ProgressTip[] = [
  {
    en: 'One phrase today. Japan gets easier.',
    ja: '今日は1フレーズだけでOK。',
  },
  {
    en: 'Start with Convenience Store — you’ll use it tomorrow.',
    ja: 'コンビニから始めよう。明日すぐ使える。',
  },
  {
    en: 'Don’t finish the bar. Just say one line out loud.',
    ja: '全部やらなくていい。1つ口に出せば十分。',
  },
];

/** Shown under the XP bar once the learner has at least 1 phrase. */
export const LEARNING_PROGRESS_TIPS: ProgressTip[] = [
  {
    en: 'You’re already ahead of most travelers.',
    ja: 'もう、普通の旅行者より一歩先。',
  },
  {
    en: 'One more phrase = one less panic in Japan.',
    ja: 'あと1フレーズで、現地の焦りが減る。',
  },
  {
    en: 'Review beats cramming. Open one scene.',
    ja: '詰め込みより復習。シーンを1つ開こう。',
  },
];

function dayHash(date: Date): number {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Same tip all day; switches bucket when learnedCount goes from 0 → 1+. */
export function getDailyProgressTip(
  learnedCount: number,
  date: Date = new Date()
): ProgressTip {
  const tips = learnedCount === 0 ? BEGINNER_PROGRESS_TIPS : LEARNING_PROGRESS_TIPS;
  return tips[dayHash(date) % tips.length];
}
