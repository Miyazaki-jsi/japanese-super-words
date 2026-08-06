'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  configured: boolean;
};

export default function GumroadSyncButton({ configured }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSync() {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/gumroad/sync', { method: 'POST' });
      const data = (await res.json()) as { message?: string; synced?: number };
      setMessage(data.message ?? (res.ok ? '同期しました' : '同期に失敗しました'));
      if (res.ok) router.refresh();
    } catch {
      setMessage('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-lg font-semibold text-white">Gumroad 購入データ</h2>
      <p className="mt-2 text-sm text-slate-400">
        管理画面の購入数は Gumroad の Webhook または手動同期で Supabase に保存されます。
      </p>
      {!configured ? (
        <p className="mt-4 text-sm text-amber-200/90">
          <code className="rounded bg-black/30 px-1">GUMROAD_ACCESS_TOKEN</code>{' '}
          が未設定です。Gumroad → Settings → Advanced でトークンを取得し、Vercel に追加してから{' '}
          <code className="rounded bg-black/30 px-1">npm run setup:gumroad</code> を実行してください。
        </p>
      ) : (
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? '同期中…' : 'Gumroad から購入を同期'}
        </button>
      )}
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
