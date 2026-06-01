import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      {/* Main content area offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-[220px]">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
