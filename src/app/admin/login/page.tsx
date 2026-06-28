import { Suspense } from 'react';
import AdminLoginForm from './AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-sm text-slate-400">
            Loading…
          </div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
