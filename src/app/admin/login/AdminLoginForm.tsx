'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid password.': 'パスワードが正しくありません。',
  'Admin auth is not configured on the server.': 'サーバー側の認証設定が未完了です。',
  'Could not create session.': 'セッションを作成できませんでした。',
  'Invalid request.': 'リクエストが不正です。',
};

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        const message = data.error ? ERROR_MESSAGES[data.error] ?? data.error : 'ログインに失敗しました。';
        setError(message);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
          管理者専用
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">アナリティクス ログイン</h1>
        <p className="mt-2 text-sm text-slate-400">
          このページはアプリからはリンクされていません。URLを知っている管理者のみアクセスできます。
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-slate-300">
            パスワード
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-indigo-500 focus:ring-2"
              required
            />
          </label>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'ログイン中…' : 'ログイン'}
          </button>
        </form>
      </div>
    </main>
  );
}
