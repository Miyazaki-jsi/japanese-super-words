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
    id: '2026-08-10-payment-methods',
    date: '2026-08-10',
    titleEn: 'Payment note: no PayPal',
    titleJa: 'お支払いについて（PayPal不可）',
    bodyEn:
      'PayPal is not available on Gumroad for this product. Please pay by card (Apple Pay / Google Pay may appear on supported devices).',
    bodyJa:
      'PayPalでは払えません。カードでお支払いください（対応端末では Apple Pay／Google Pay も使えることがあります）。',
  },
  {
    id: '2026-08-10-contact-email',
    date: '2026-08-10',
    titleEn: 'Optional email on messages',
    titleJa: 'メッセージにメール（任意）を追加',
    bodyEn:
      'In Settings → Send a Message, you can leave an email if you’d like a reply someday (no promises). You can still send without it.',
    bodyJa:
      '設定の「メッセージを送る」に、メールアドレス（任意）を追加しました。入れるとワンチャン返事がくるかも？ なくても送れます。',
  },
  {
    id: '2026-08-08-chou-tsukau',
    date: '2026-08-08',
    titleEn: 'New Pro scene: Super Useful Phrases',
    titleJa: '新Proシチュ：超使うフレーズ',
    bodyEn:
      'Japan Pro now includes Super Useful Phrases — 30 everyday lines like “Ki ni shinaide,” “Osaki ni,” “Tasukatta,” and soft refusals from real Japanese conversation.',
    bodyJa:
      'Japan Pro に「超使うフレーズ」を追加しました。「気にしないで」「お先に」「助かった」など、日常で超使う会話フレーズ30個です。',
  },
  {
    id: '2026-08-08-suki-kirai',
    date: '2026-08-08',
    titleEn: 'New Pro scene: Like or Dislike?',
    titleJa: '新Proシチュ：すき？きらい？',
    bodyEn:
      'Japan Pro now includes Like or Dislike? — 30 real conversation phrases about favorites, pet peeves, food, and indoor vs outdoor (from our YouTube episode).',
    bodyJa:
      'Japan Pro に「すき？きらい？」を追加しました。好き・嫌い・食べ物・インドア／アウトドアなど、動画で出てくる会話フレーズ30個です。',
  },
  {
    id: '2026-08-08-japanese-table',
    date: '2026-08-08',
    titleEn: 'New Pro scene: Japanese Dinner Table',
    titleJa: '新Proシチュ：日本人の食卓',
    bodyEn:
      'Japan Pro now includes Japanese Dinner Table — 30 everyday foods from a real Japanese home dinner (rice, fish, curry, nikujaga, natto, and more).',
    bodyJa:
      'Japan Pro に「日本人の食卓」を追加しました。ご飯・魚・カレー・肉じゃが・納豆など、家庭の夜ごはんでよく出る食べ物の単語30個です。',
  },
  {
    id: '2026-07-27-situation-search',
    date: '2026-07-27',
    titleEn: 'Search situations',
    titleJa: 'シチュエーション検索',
    bodyEn:
      'On Situations, use the slim search next to More free — type a scene name and tap a suggestion (same style as Review word search).',
    bodyJa:
      'シチュエーション画面の「ほかの無料」横に細い検索窓を追加しました。名前を入れると候補が出ます（復習タブの単語検索と同じ操作感）。',
  },
  {
    id: '2026-07-27-progress-backup',
    date: '2026-07-27',
    titleEn: 'Backup & restore your progress',
    titleJa: '学習データのバックアップ',
    bodyEn:
      'Settings now has Save backup / Restore. Progress is stored on this device — keep a JSON file so you can recover after a wipe or phone change.',
    bodyJa:
      '設定に「バックアップ保存／復元」を追加しました。進捗はこの端末に保存されます。消えたとき・機種変更用にJSONファイルを残しておきましょう。',
  },
  {
    id: '2026-07-27-konbini-eki-deeper',
    date: '2026-07-27',
    titleEn: 'More Convenience Store & Station phrases',
    titleJa: 'コンビニ・駅のフレーズを追加',
    bodyEn:
      'Convenience Store and Train Station now have 15 new survival phrases each — checkout answers, ticket window lines, transfers, and more.',
    bodyJa:
      '「コンビニ」「駅」に、それぞれ15個の使えるフレーズを追加しました。レジの返事・切符・乗り換えなど、現場でそのまま使えます。',
  },
  {
    id: '2026-07-18-dark-mode',
    date: '2026-07-18',
    titleEn: 'Dark mode',
    titleJa: 'ダークモード',
    bodyEn: 'You can switch to dark mode in Settings. Easier on the eyes at night.',
    bodyJa: '設定からダークモードに切り替えできるようになりました。夜でも見やすくなります。',
  },
  {
    id: '2026-07-18-home-design',
    date: '2026-07-18',
    titleEn: 'Homepage design update',
    titleJa: 'トップページのデザインを修正',
    bodyEn:
      'We refreshed the home screen layout — easier tips, a slim Add to Home Screen banner, and cleaner spacing.',
    bodyJa:
      'トップページのデザインを修正しました。励まし文・ホーム画面追加の案内など、見やすさを整えています。',
  },
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
