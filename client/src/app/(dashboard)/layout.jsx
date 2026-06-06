'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import useAuthStore from '@/store/useAuthStore';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await checkAuth();
      setInitialCheckDone(true);
    })();
  }, [checkAuth]);

  useEffect(() => {
    if (initialCheckDone && !isAuthenticated) {
      router.push('/login');
    }
  }, [initialCheckDone, isAuthenticated, router]);

  if (!initialCheckDone || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[220px]">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
