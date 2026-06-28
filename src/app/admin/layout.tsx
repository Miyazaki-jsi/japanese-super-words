import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Admin · Japanese Super Words',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      {children}
    </div>
  );
}
