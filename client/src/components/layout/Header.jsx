import { Search, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-highlight/15 bg-background sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-foreground">Good morning, Dani</h2>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-highlight" />
          <input 
            type="text" 
            placeholder="Search Solus..." 
            className="pl-10 pr-4 py-2 bg-highlight/5 border border-highlight/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-glow/40 w-56 transition-all placeholder:text-highlight"
          />
        </div>
        
        <Link href="/settings" className="relative p-2 text-foreground hover:bg-highlight/10 rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
