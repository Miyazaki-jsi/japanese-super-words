export type Announcement = {
  id: string;
  /** ISO date (YYYY-MM-DD) shown as update date */
  date: string;
  titleEn: string;
  titleJa: string;
  bodyEn: string;
  bodyJa: string;
};

/** Newest first. Add new entries at the top. */
export const announcements: Announcement[] = [
  {
    id: '2026-07-17-ja-only-mode',
    date: '2026-07-17',
    titleEn: 'Super Japanese Mode',
    titleJa: '超日本語モード',
    bodyEn:
      'Settings now has a toggle to show Japanese only in menus and headings. Flashcard English translations, quizzes, and favorites stay as they are.',
    bodyJa:
      '設定に「超日本語モード」を追加しました。メニューや見出しなどを日本語のみで表示できます。フラッシュカードの英訳・クイズ・お気に入りはそのままです。',
  },
];

export function formatAnnouncementDate(isoDate: string, jaOnly: boolean): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  if (jaOnly) {
    return `${y}年${m}月${d}日`;
  }
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
