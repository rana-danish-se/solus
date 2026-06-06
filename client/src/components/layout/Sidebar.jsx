"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Archive,
  PenTool,
  Briefcase,
  UserCircle,
  BrainCircuit,
  LogOut,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learning Hub', href: '/learning-hub', icon: GraduationCap },
  { name: 'Resource Vault', href: '/resource-vault', icon: Archive },
  { name: 'Content Studio', href: '/content-studio', icon: PenTool },
  { name: 'Freelance Tracker', href: '/freelance-tracker', icon: Briefcase },
  { name: 'Career Assistant', href: '/career-assistant', icon: UserCircle },
  { name: 'AI Brain', href: '/ai-brain', icon: BrainCircuit },
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-[220px] bg-foreground flex flex-col h-screen">
      {/* Logo Area */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image src="/logo_dark.png" alt="Solus OS" width={22} height={22} className="object-contain" />
        </div>
        <div>
          <h1 className="text-white font-bold text-[15px] leading-tight tracking-tight">Solus OS</h1>
          <p className="text-[9px] text-highlight uppercase tracking-[0.15em] mt-0.5 font-semibold">Personal Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-glow text-white'
                  : 'text-highlight hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
            <Image src="/danish.png" alt="Rana Danish" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">Rana Danish</p>
            <p className="text-[10px] text-highlight">Pro Plan</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-highlight hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
