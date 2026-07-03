import Link from 'next/link';
import type { ReactNode } from 'react';
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

function SetupPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-50">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm text-amber-100/90">{children}</div>
    </div>
  );
}

export default async function AdminSocialPage() {
  const today = todayJapanDate();
  const dbConfigured = isSocialDbConfigured();

  if (!dbConfigured) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <PageHeader />
        <SetupPanel title="Supabase の設定が必要です">
          <p>
            Vercel に <code className="rounded bg-black/20 px-1">SUPABASE_URL</code> と{' '}
            <code className="rounded bg-black/20 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{' '}
            が入っているか確認してください。
          </p>
        </SetupPanel>
      </main>
    );
  }

  try {
    const todayPost = await getPostForDate(today);
    const todayMetrics = todayPost ? await getLatestMetricsForPost(todayPost.id) : null;
    const templates = await getSocialTemplates();
    const posts = await listRecentSocialPosts(14);
    const recentPosts = await Promise.all(
      posts.map(async (post) => ({
        post,
        metrics: await getLatestMetricsForPost(post.id),
      }))
    );

    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <PageHeader />
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
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '不明なエラー';

    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <PageHeader />
        <SetupPanel title="データベースの準備が必要です">
          <p>
            X投稿用のテーブルがまだ Supabase にありません。これが「ページが読み込めない」原因です。
          </p>
          <p className="font-semibold text-amber-50">やること（5分）</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <a
                href="https://supabase.com/dashboard"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Supabase
              </a>{' '}
              を開く
            </li>
            <li>このプロジェクト → 左の <strong>SQL Editor</strong></li>
            <li>
              <strong>New query</strong> を押す
            </li>
            <li>
              リポジトリの <code className="rounded bg-black/20 px-1">supabase/social.sql</code>{' '}
              の中身を全部コピーして貼り付け
            </li>
            <li>
              <strong>Run</strong> を押す
            </li>
            <li>このページをリロード</li>
          </ol>
          <p className="text-xs text-amber-100/70">技術メモ: {message}</p>
        </SetupPanel>
      </main>
    );
  }
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
          Japanese Super Words
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">X 自動投稿</h1>
          <p className="mt-2 text-sm text-slate-400">
            1日1ツイート · 今日の日本語（共感ストーリー + 単語解説）
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
  );
}
