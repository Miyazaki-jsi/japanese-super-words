import {
  Archivo_Black,
  Bebas_Neue,
  Bricolage_Grotesque,
  Outfit,
  Plus_Jakarta_Sans,
  Rubik,
  Space_Grotesk,
  Syne,
} from 'next/font/google';
import Link from 'next/link';

const outfit = Outfit({ subsets: ['latin'], weight: ['800', '900'] });
const syne = Syne({ subsets: ['latin'], weight: ['700', '800'] });
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: ['400'] });
const archivoBlack = Archivo_Black({ subsets: ['latin'], weight: ['400'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['700'] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'] });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['800'] });
const rubik = Rubik({ subsets: ['latin'], weight: ['900'] });

const TITLE = 'Japanese Super Words';
const SUBTITLE = '日本語スーパーワード';

type FontSample = {
  id: string;
  name: string;
  vibe: string;
  className: string;
  titleClass: string;
  subtitleClass?: string;
};

const samples: FontSample[] = [
  {
    id: 'outfit',
    name: 'Outfit',
    vibe: 'モダン・幾何学的。SaaS系アプリ向き',
    className: outfit.className,
    titleClass: 'text-base font-black tracking-tight',
  },
  {
    id: 'syne',
    name: 'Syne',
    vibe: 'エディトリアル・個性的。目を引く',
    className: syne.className,
    titleClass: 'text-base font-extrabold tracking-tight',
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    vibe: 'コンデンス・インパクト大。ロゴ感',
    className: bebasNeue.className,
    titleClass: 'text-lg tracking-wide uppercase',
    subtitleClass: 'text-[10px] tracking-wider',
  },
  {
    id: 'archivo',
    name: 'Archivo Black',
    vibe: '力強い・太字。自信あるブランド感',
    className: archivoBlack.className,
    titleClass: 'text-base tracking-tight',
  },
  {
    id: 'space',
    name: 'Space Grotesk',
    vibe: 'テック・スタートアップ。洗練',
    className: spaceGrotesk.className,
    titleClass: 'text-base font-bold tracking-tight',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    vibe: 'プレミアム・バランス良い',
    className: plusJakarta.className,
    titleClass: 'text-base font-extrabold tracking-tight',
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque',
    vibe: '独特・記憶に残る。2020sトレンド',
    className: bricolage.className,
    titleClass: 'text-base font-extrabold tracking-tight',
  },
  {
    id: 'rubik',
    name: 'Rubik',
    vibe: '丸み・親しみやすい。学習アプリ向き',
    className: rubik.className,
    titleClass: 'text-base font-black tracking-tight',
  },
];

function HeaderSample({ sample }: { sample: FontSample }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200">
      <header className="bg-[#f0ad4e] text-white px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/jsi-logo-icon.png"
            alt=""
            className="h-11 w-auto max-w-[5.25rem] object-contain drop-shadow-sm flex-shrink-0"
          />
          <div className={`min-w-0 flex-1 ${sample.className}`}>
            <h2 className={`${sample.titleClass} leading-none text-white`}>{TITLE}</h2>
            <p
              className={`${sample.subtitleClass ?? 'text-[10px] font-medium tracking-wide'} text-white/90 mt-0.5`}
            >
              {SUBTITLE}
            </p>
          </div>
        </div>
        <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </header>
      <div className="bg-white px-4 py-3 flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-slate-800">{sample.name}</p>
          <p className="text-xs text-slate-500">{sample.vibe}</p>
        </div>
        <code className="text-xs bg-slate-100 text-indigo-600 px-2 py-1 rounded font-mono">{sample.id}</code>
      </div>
    </div>
  );
}

export default function FontPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-slate-800">タイトルフォント サンプル</h1>
          <p className="text-sm text-slate-600">
            実際のヘッダーと同じレイアウトで比較できます。
            <br />
            気に入ったフォントの <strong>id</strong> を教えてください。
          </p>
          <Link href="/" className="inline-block text-sm text-indigo-600 hover:underline">
            ← アプリに戻る
          </Link>
        </div>

        <div className="space-y-5">
          {samples.map((sample) => (
            <HeaderSample key={sample.id} sample={sample} />
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center pb-8">
          現在のフォント: Geist Sans（font-black）— 上記と比較して選んでください
        </p>
      </div>
    </main>
  );
}
