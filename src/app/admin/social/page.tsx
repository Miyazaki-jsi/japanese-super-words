import Link from 'next/link';
import AdminLogoutButton from '../AdminLogoutButton';
import SocialAdminPanel from './SocialAdminPanel';
import { todayJapanDate } from '@/lib/social/japanDate';
import {
  getLatestMetricsForPost,
  getPostForDate,
  getSocialTemplates,
  isSocialDbConfigured,
  listRecentSocialPosts,
} from '@/lib/social/socialDb';
import { isXApiConfigured, isXAutoPostEnabled } from '@/lib/social/xClient';

export const dynamic = 'force-dynamic';

export default async function AdminSocialPage() {
  const today = todayJapanDate();
  const dbConfigured = isSocialDbConfigured();

  const todayPost = dbConfigured ? await getPostForDate(today) : null;
  const todayMetrics =
    todayPost && dbConfigured ? await getLatestMetricsForPost(todayPost.id) : null;
  const templates = dbConfigured ? await getSocialTemplates() : [];
  const posts = dbConfigured ? await listRecentSocialPosts(14) : [];
  const recentPosts = await Promise.all(
    posts.map(async (post) => ({
      post,
      metrics: await getLatestMetricsForPost(post.id),
    }))
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Japanese Super Words
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">X 自動投稿</h1>
          <p className="mt-2 text-sm text-slate-400">
            1日1ツイート · 学習者向けの保存したくなるフレーズノート
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            アナリティクス
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      {!dbConfigured ? (
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-50">
          <h2 className="text-lg font-semibold">Supabase のセットアップが必要です</h2>
          <p className="mt-2 text-sm text-amber-100/90">
            Supabase の SQL Editor で <code className="rounded bg-black/20 px-1">supabase/schema.sql</code>{' '}
            を実行してください（social_* テーブルが追加されています）。
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <SocialAdminPanel
            today={today}
            todayPost={todayPost}
            todayMetrics={todayMetrics}
            templates={templates}
            recentPosts={recentPosts}
            xApiConfigured={isXApiConfigured()}
            xAutoPostEnabled={isXAutoPostEnabled()}
          />
        </div>
      )}
    </main>
  );
}
