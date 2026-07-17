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
    id: '2026-07-18-home-and-directions',
    date: '2026-07-18',
    titleEn: 'Home screen update + new free scene',
    titleJa: 'ホーム画面の改善と新無料シチュ',
    bodyEn:
      'The home screen now opens on Situations first, with a big Try now card for Convenience Store. We also added a new free scene, Asking for Directions — 30 street phrases with audio.',
    bodyJa:
      'ホーム画面を改善しました。最初にシチュエーションが開き、コンビニの「今すぐ試す」が目立つようになりました。あわせて無料シチュ「道を尋ねる」を追加。道を聞く・曲がる・お礼まで、音声付きフレーズ30個です。',
  },
  {
    id: '2026-07-17-ryokan',
    date: '2026-07-17',
    titleEn: 'New scene: Ryokan',
    titleJa: '新シチュ：旅館',
    bodyEn:
      'Japan Pro now includes a Ryokan scene — check-in, meals, baths, and inn etiquette phrases.',
    bodyJa:
      'Japan Pro に「旅館」シチュエーションを追加しました。チェックイン・食事・大浴場・作法など、旅館で使える表現を学べます。',
  },
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
  {
    id: '2026-07-03-minor-bugfix',
    date: '2026-07-03',
    titleEn: 'Minor bug fix',
    titleJa: '軽微なバグ修正',
    bodyEn: 'We fixed a minor bug.',
    bodyJa: '軽微なバグを修正しました。',
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
