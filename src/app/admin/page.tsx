import Link from 'next/link';
import { getAdminStats } from '@/lib/analyticsServer';
import { isAdminAuthConfigured } from '@/lib/adminAuth';
import { isAnalyticsDbConfigured } from '@/lib/supabaseServer';
import AdminLogoutButton from './AdminLogoutButton';

function formatMoney(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
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
      <h2 className="text-lg font-semibold">Setup required</h2>
      <p className="mt-2 text-sm text-amber-100/90">
        Add environment variables in Vercel, then run the SQL schema in Supabase.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-amber-100/90">
        <li>Create a free Supabase project</li>
        <li>Run <code className="rounded bg-black/20 px-1">supabase/schema.sql</code> in the SQL editor</li>
        <li>Set <code className="rounded bg-black/20 px-1">SUPABASE_URL</code> and <code className="rounded bg-black/20 px-1">SUPABASE_SERVICE_ROLE_KEY</code></li>
        <li>Set <code className="rounded bg-black/20 px-1">ADMIN_PASSWORD</code> and <code className="rounded bg-black/20 px-1">ADMIN_SESSION_SECRET</code></li>
        <li>Point Gumroad webhook to <code className="rounded bg-black/20 px-1">/api/webhooks/gumroad</code></li>
      </ol>
      <p className="mt-4 text-sm text-amber-100/80">
        See <code className="rounded bg-black/20 px-1">.env.example</code> for the full list.
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
          <h1 className="mt-2 text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-2 text-sm text-slate-400">
            Last {periodDays} days · since {new Date(stats.since).toLocaleDateString('en-US')}
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
            7 days
          </Link>
          <Link
            href="/admin?days=30"
            className={`rounded-lg px-3 py-2 text-sm ${
              periodDays === 30
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            30 days
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
        <StatCard label="Unique visitors" value={stats.visitors} hint="Anonymous browser IDs" />
        <StatCard
          label="YouTube visitors"
          value={stats.youtubeVisitors}
          hint={pct(stats.youtubeVisitors, stats.visitors) + ' of visitors'}
        />
        <StatCard label="Gumroad purchases" value={stats.purchases} />
        <StatCard
          label="Revenue"
          value={formatMoney(stats.revenueCents, stats.revenueCurrency)}
          hint="From Gumroad webhook"
        />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Intro completed" value={stats.introCompletes} />
        <StatCard label="Day 1 completed" value={stats.day1Completes} />
        <StatCard label="Unlock success" value={stats.unlockSuccesses} />
        <StatCard
          label="Code activation rate"
          value={pct(stats.unlockSuccesses, stats.purchases)}
          hint="unlock_success / purchases"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Unlock funnel</h2>
          <p className="mt-1 text-sm text-slate-400">Modal → Gumroad click → code entered</p>
          <div className="mt-6 space-y-4">
            <FunnelRow label="Unlock modal shown" count={stats.unlockModalShown} max={funnelMax} />
            <FunnelRow label="Gumroad click" count={stats.gumroadClicks} max={funnelMax} />
            <FunnelRow label="Unlock success" count={stats.unlockSuccesses} max={funnelMax} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Daily visitors</h2>
          <div className="mt-6 space-y-3">
            {stats.dailyVisitors.length === 0 ? (
              <p className="text-sm text-slate-400">No data yet.</p>
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
          <h2 className="text-lg font-semibold text-white">Top YouTube videos</h2>
          <p className="mt-1 text-sm text-slate-400">From <code>?video=...</code> attribution</p>
          <div className="mt-6 space-y-3">
            {stats.topVideos.length === 0 ? (
              <p className="text-sm text-slate-400">No video tags yet.</p>
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
          <h2 className="text-lg font-semibold text-white">Traffic sources</h2>
          <div className="mt-6 space-y-3">
            {stats.topSources.length === 0 ? (
              <p className="text-sm text-slate-400">No source tags yet.</p>
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
        <h2 className="text-lg font-semibold text-white">Recent Gumroad purchases</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 font-medium">Tier</th>
                <th className="pb-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPurchases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-slate-400">
                    No purchases recorded yet.
                  </td>
                </tr>
              ) : (
                stats.recentPurchases.map((purchase) => (
                  <tr key={purchase.saleId} className="border-t border-slate-800">
                    <td className="py-3 pr-4 text-slate-300">
                      {purchase.purchasedAt
                        ? new Date(purchase.purchasedAt).toLocaleString('en-US')
                        : '—'}
                    </td>
                    <td className="py-3 pr-4 text-white">{purchase.productName ?? '—'}</td>
                    <td className="py-3 pr-4 text-slate-300">{purchase.tier ?? '—'}</td>
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
