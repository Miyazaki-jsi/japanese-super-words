import Link from 'next/link';
import { getAdminStats } from '@/lib/analyticsServer';
import { isAdminAuthConfigured } from '@/lib/adminAuth';
import { isAnalyticsDbConfigured } from '@/lib/supabaseServer';
import AdminLogoutButton from './AdminLogoutButton';

function formatMoney(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

function formatTier(tier: string | null | undefined): string {
  if (!tier) return '—';
  if (tier === 'trip') return 'Trip Course';
  if (tier === 'pro') return 'Japan Pro';
  if (tier === 'unknown') return '不明';
  return tier;
}

function pct(part: number, whole: number): string {
  if (whole <= 0) return '0%';
  return `${Math.round((part / whole) * 100)}%`;
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-400">{hint}</p> : null}
    </div>
  );
}

function FunnelRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const width = max > 0 ? Math.max(8, Math.round((count / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-indigo-500 transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function SetupPanel() {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-50">
      <h2 className="text-lg font-semibold">セットアップが必要です</h2>
      <p className="mt-2 text-sm text-amber-100/90">
        Vercel に環境変数を設定し、Supabase で SQL を実行してください。
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-amber-100/90">
        <li>Supabase で無料プロジェクトを作成</li>
        <li>SQL Editor で <code className="rounded bg-black/20 px-1">supabase/schema.sql</code> を実行</li>
        <li><code className="rounded bg-black/20 px-1">SUPABASE_URL</code> と <code className="rounded bg-black/20 px-1">SUPABASE_SERVICE_ROLE_KEY</code> を Vercel に設定</li>
        <li><code className="rounded bg-black/20 px-1">ADMIN_PASSWORD</code> と <code className="rounded bg-black/20 px-1">ADMIN_SESSION_SECRET</code> を Vercel に設定</li>
        <li>再デプロイ後、<code className="rounded bg-black/20 px-1">npm run setup:admin</code> の手順で確認</li>
      </ol>
      <p className="mt-4 text-sm text-amber-100/80">
        詳細は <code className="rounded bg-black/20 px-1">.env.example</code> を参照してください。
      </p>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const periodDays = params.days === '7' ? 7 : 30;
  const stats = await getAdminStats(periodDays);
  const authConfigured = isAdminAuthConfigured();
  const dbConfigured = isAnalyticsDbConfigured();

  const funnelMax = Math.max(
    stats.unlockModalShown,
    stats.gumroadClicks,
    stats.unlockSuccesses,
    1
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Japanese Super Words
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">アナリティクス</h1>
          <p className="mt-2 text-sm text-slate-400">
            直近 {periodDays} 日間 · {new Date(stats.since).toLocaleDateString('ja-JP')} 以降
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin?days=7"
            className={`rounded-lg px-3 py-2 text-sm ${
              periodDays === 7
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            7日間
          </Link>
          <Link
            href="/admin?days=30"
            className={`rounded-lg px-3 py-2 text-sm ${
              periodDays === 30
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            30日間
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      {!authConfigured || !dbConfigured ? (
        <div className="mt-8">
          <SetupPanel />
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="ユニーク訪問者" value={stats.visitors} hint="匿名ブラウザID" />
        <StatCard
          label="YouTube 経由"
          value={stats.youtubeVisitors}
          hint={`訪問者の ${pct(stats.youtubeVisitors, stats.visitors)}`}
        />
        <StatCard label="購入数" value={stats.purchases} hint="Gumroad 連携時" />
        <StatCard
          label="売上"
          value={formatMoney(stats.revenueCents, stats.revenueCurrency)}
          hint="Gumroad 連携時"
        />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="イントロ完了" value={stats.introCompletes} />
        <StatCard label="Day 1 完了" value={stats.day1Completes} />
        <StatCard label="アンロック成功" value={stats.unlockSuccesses} />
        <StatCard
          label="コード入力率"
          value={pct(stats.unlockSuccesses, stats.purchases)}
          hint="アンロック成功 ÷ 購入数"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">アンロックの流れ</h2>
          <p className="mt-1 text-sm text-slate-400">モーダル表示 → 購入ページ → コード入力成功</p>
          <div className="mt-6 space-y-4">
            <FunnelRow label="モーダル表示" count={stats.unlockModalShown} max={funnelMax} />
            <FunnelRow label="購入ページクリック" count={stats.gumroadClicks} max={funnelMax} />
            <FunnelRow label="アンロック成功" count={stats.unlockSuccesses} max={funnelMax} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">日別訪問者</h2>
          <div className="mt-6 space-y-3">
            {stats.dailyVisitors.length === 0 ? (
              <p className="text-sm text-slate-400">まだデータがありません。</p>
            ) : (
              stats.dailyVisitors.map((row) => (
                <div key={row.date} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{row.date}</span>
                  <span className="font-semibold text-white">{row.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">YouTube 動画別</h2>
          <p className="mt-1 text-sm text-slate-400"><code>?video=...</code> 付きリンクから</p>
          <div className="mt-6 space-y-3">
            {stats.topVideos.length === 0 ? (
              <p className="text-sm text-slate-400">まだデータがありません。</p>
            ) : (
              stats.topVideos.map((row) => (
                <div key={row.video} className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-slate-300">{row.video}</span>
                  <span className="shrink-0 font-semibold text-white">{row.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">流入元</h2>
          <div className="mt-6 space-y-3">
            {stats.topSources.length === 0 ? (
              <p className="text-sm text-slate-400">まだデータがありません。</p>
            ) : (
              stats.topSources.map((row) => (
                <div key={row.source} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{row.source}</span>
                  <span className="font-semibold text-white">{row.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">最近の購入</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3 pr-4 font-medium">日時</th>
                <th className="pb-3 pr-4 font-medium">商品</th>
                <th className="pb-3 pr-4 font-medium">プラン</th>
                <th className="pb-3 font-medium">金額</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPurchases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-slate-400">
                    まだ購入データがありません。
                  </td>
                </tr>
              ) : (
                stats.recentPurchases.map((purchase) => (
                  <tr key={purchase.saleId} className="border-t border-slate-800">
                    <td className="py-3 pr-4 text-slate-300">
                      {purchase.purchasedAt
                        ? new Date(purchase.purchasedAt).toLocaleString('ja-JP')
                        : '—'}
                    </td>
                    <td className="py-3 pr-4 text-white">{purchase.productName ?? '—'}</td>
                    <td className="py-3 pr-4 text-slate-300">{formatTier(purchase.tier)}</td>
                    <td className="py-3 text-white">
                      {typeof purchase.priceCents === 'number'
                        ? formatMoney(purchase.priceCents, purchase.currency ?? 'usd')
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
