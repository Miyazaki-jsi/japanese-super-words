'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { explainXApiError } from '@/lib/social/xErrors';
import type { SocialPost, SocialPostMetrics, SocialTemplate } from '@/lib/social/types';

type PostRow = {
  post: SocialPost;
  metrics: SocialPostMetrics | null;
};

type Props = {
  today: string;
  todayPost: SocialPost | null;
  todayMetrics: SocialPostMetrics | null;
  templates: SocialTemplate[];
  recentPosts: PostRow[];
  xApiConfigured: boolean;
  xAutoPostEnabled: boolean;
};

function statusLabel(status: SocialPost['status']): string {
  if (status === 'draft') return '下書き';
  if (status === 'posted') return '投稿済み';
  return '失敗';
}

function MetricsForm({ post, metrics }: { post: SocialPost; metrics: SocialPostMetrics | null }) {
  const router = useRouter();
  const [likes, setLikes] = useState(String(metrics?.likes ?? 0));
  const [reposts, setReposts] = useState(String(metrics?.reposts ?? 0));
  const [replies, setReplies] = useState(String(metrics?.replies ?? 0));
  const [bookmarks, setBookmarks] = useState(String(metrics?.bookmarks ?? 0));
  const [impressions, setImpressions] = useState(String(metrics?.impressions ?? 0));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/social/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          likes: Number(likes),
          reposts: Number(reposts),
          replies: Number(replies),
          bookmarks: Number(bookmarks),
          impressions: Number(impressions),
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMessage(data.error ?? '保存に失敗しました');
        return;
      }

      setMessage('保存しました。テンプレートのスコアを更新しました。');
      router.refresh();
    } catch {
      setMessage('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="mt-4 grid gap-3 sm:grid-cols-5">
      <label className="text-xs text-slate-400">
        いいね
        <input
          type="number"
          min={0}
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs text-slate-400">
        リポスト
        <input
          type="number"
          min={0}
          value={reposts}
          onChange={(e) => setReposts(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs text-slate-400">
        返信
        <input
          type="number"
          min={0}
          value={replies}
          onChange={(e) => setReplies(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs text-slate-400">
        ブックマーク
        <input
          type="number"
          min={0}
          value={bookmarks}
          onChange={(e) => setBookmarks(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs text-slate-400">
        インプレ
        <input
          type="number"
          min={0}
          value={impressions}
          onChange={(e) => setImpressions(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <div className="sm:col-span-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? '保存中…' : '反応数を保存（学習に反映）'}
        </button>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </form>
  );
}

export default function SocialAdminPanel({
  today,
  todayPost,
  todayMetrics,
  templates,
  recentPosts,
  xApiConfigured,
  xAutoPostEnabled,
}: Props) {
  const router = useRouter();
  const [tweetText, setTweetText] = useState(todayPost?.tweetText ?? '');
  const [xTweetId, setXTweetId] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function handleGenerate(force = false) {
    setLoadingAction('generate');
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      const data = (await res.json()) as { message?: string; post?: SocialPost; error?: string };

      if (!res.ok) {
        setActionMessage(data.error ?? data.message ?? '生成に失敗しました');
        return;
      }

      setActionMessage(data.message ?? '生成しました');
      if (data.post?.tweetText) setTweetText(data.post.tweetText);
      router.refresh();
    } catch {
      setActionMessage('通信エラーが発生しました');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleMarkPosted() {
    if (!todayPost) return;
    setLoadingAction('posted');
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/social/mark-posted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: todayPost.id,
          xTweetId: xTweetId.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setActionMessage(data.error ?? '更新に失敗しました');
        return;
      }

      setActionMessage('投稿済みに更新しました');
      router.refresh();
    } catch {
      setActionMessage('通信エラーが発生しました');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleTestConnection() {
    setLoadingAction('test');
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/social/test-connection', { method: 'POST' });
      const data = (await res.json()) as
        | { ok: true; username: string }
        | { ok: false; error?: string; help?: { title: string; message: string } };

      if (!res.ok) {
        setActionMessage('接続テストに失敗しました');
        return;
      }

      if (data.ok) {
        setActionMessage(`X接続OK：@${data.username} として認識されました`);
        return;
      }

      const help = 'help' in data && data.help ? data.help : null;
      setActionMessage(
        help
          ? `${help.title} — ${help.message}（詳細: ${data.error ?? ''}）`
          : (data.error ?? 'X接続に失敗しました')
      );
    } catch {
      setActionMessage('通信エラーが発生しました');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleSyncMetrics() {
    setLoadingAction('sync');
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/social/sync-metrics', { method: 'POST' });
      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setActionMessage(data.error ?? '同期に失敗しました');
        return;
      }

      setActionMessage(data.message ?? '同期しました');
      router.refresh();
    } catch {
      setActionMessage('通信エラーが発生しました');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleCopy() {
    const text = tweetText || todayPost?.tweetText || '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setActionMessage('ツイート文をコピーしました');
    } catch {
      setActionMessage('コピーに失敗しました');
    }
  }

  const errorHelp = todayPost?.errorMessage ? explainXApiError(todayPost.errorMessage) : null;
  const primaryButtonLabel =
    todayPost?.status === 'failed'
      ? 'もう一度投稿する'
      : todayPost?.status === 'posted'
        ? '今日は投稿済み'
        : '今日の下書きを生成';

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">接続状態</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">X API</p>
            <p className="mt-1 font-semibold text-white">
              {xApiConfigured ? '設定済み' : '未設定（下書きモード）'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">自動投稿</p>
            <p className="mt-1 font-semibold text-white">
              {xAutoPostEnabled ? 'ON' : 'OFF'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">今日（JST）</p>
            <p className="mt-1 font-semibold text-white">{today}</p>
          </div>
        </div>
        {!xApiConfigured ? (
          <p className="mt-4 text-sm text-slate-400">
            APIキーがなくても、毎朝8時（JST）に下書きが自動生成されます。ここからコピーして手動投稿できます。
          </p>
        ) : null}
        {xApiConfigured ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={loadingAction !== null}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
            >
              {loadingAction === 'test' ? 'テスト中…' : 'X接続テスト（投稿せず確認）'}
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">今日のツイート</h2>
            <p className="mt-1 text-sm text-indigo-100/80">
              会話例 + 話し言葉解説 · 最大500字 · リンクは3回に1回
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleGenerate(todayPost?.status === 'failed')}
              disabled={loadingAction !== null || todayPost?.status === 'posted'}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {loadingAction === 'generate' ? '投稿中…' : primaryButtonLabel}
            </button>
            <button
              type="button"
              onClick={() => handleGenerate(true)}
              disabled={loadingAction !== null || todayPost?.status === 'posted'}
              className="rounded-lg border border-indigo-400/40 px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-500/20 disabled:opacity-60"
            >
              作り直す
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!tweetText && !todayPost?.tweetText}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
            >
              コピー
            </button>
          </div>
        </div>

        {todayPost ? (
          <p className="mt-3 text-xs text-indigo-100/70">
            状態: {statusLabel(todayPost.status)} · テンプレ: {todayPost.templateId} · フレーズ: {todayPost.wordId}
          </p>
        ) : (
          <p className="mt-3 text-sm text-indigo-100/80">まだ今日の下書きがありません。</p>
        )}

        <textarea
          readOnly
          value={tweetText || todayPost?.tweetText || ''}
          rows={8}
          className="mt-4 w-full rounded-xl border border-indigo-400/20 bg-slate-950/80 px-4 py-3 text-sm leading-relaxed text-white"
        />

        {todayPost?.status !== 'posted' ? (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="text-sm text-slate-300">
              XのツイートID（任意）
              <input
                type="text"
                value={xTweetId}
                onChange={(e) => setXTweetId(e.target.value)}
                placeholder="手動投稿後に入力すると自動同期できます"
                className="mt-1 block w-72 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <button
              type="button"
              onClick={handleMarkPosted}
              disabled={!todayPost || loadingAction !== null}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {loadingAction === 'posted' ? '更新中…' : '手動投稿済みにする'}
            </button>
          </div>
        ) : null}

        {todayPost ? <MetricsForm post={todayPost} metrics={todayMetrics} /> : null}

        {todayPost?.status === 'failed' && errorHelp ? (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-50">
            <p className="font-semibold">{errorHelp.title}</p>
            <p className="mt-2 text-rose-100/90">{errorHelp.message}</p>
            <p className="mt-3 font-medium">あなたがやること：</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-rose-100/90">
              {errorHelp.userSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {actionMessage ? <p className="mt-4 text-sm text-slate-200">{actionMessage}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">テンプレート学習スコア</h2>
          <button
            type="button"
            onClick={handleSyncMetrics}
            disabled={loadingAction !== null}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
          >
            {loadingAction === 'sync' ? '同期中…' : 'Xから反応数を同期'}
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          いいね・保存・リポストが多い型ほど、次の投稿で選ばれやすくなります（20%は新しい型も試します）。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-2 pr-4 font-medium">テンプレ</th>
                <th className="pb-2 pr-4 font-medium">スコア</th>
                <th className="pb-2 pr-4 font-medium">使用回数</th>
                <th className="pb-2 font-medium">説明</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-t border-slate-800">
                  <td className="py-3 pr-4 font-medium text-white">{template.name}</td>
                  <td className="py-3 pr-4 text-indigo-300">{template.score.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-slate-300">{template.useCount}</td>
                  <td className="py-3 text-slate-400">{template.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">最近の投稿</h2>
        <div className="mt-4 space-y-4">
          {recentPosts.length === 0 ? (
            <p className="text-sm text-slate-400">まだ投稿履歴がありません。</p>
          ) : (
            recentPosts.map(({ post, metrics }) => (
              <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-white">{post.scheduledFor}</span>
                  <span className="text-slate-400">
                    {statusLabel(post.status)} · {post.templateId}
                    {metrics ? ` · ❤️ ${metrics.likes}` : ''}
                  </span>
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{post.tweetText}</pre>
                {post.id !== todayPost?.id ? <MetricsForm post={post} metrics={metrics} /> : null}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
