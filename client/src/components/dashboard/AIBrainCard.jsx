import Card from '../ui/Card';
import { BrainCircuit, Send } from 'lucide-react';

export default function AIBrainCard() {
  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-glow/10 text-glow flex items-center justify-center flex-shrink-0">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Solus AI Brain</h3>
          <p className="text-xs text-highlight font-medium">Connected to your workspace &amp; local files.</p>
        </div>
      </div>

      {/* AI Message */}
      <div className="flex-1 bg-[#F5F5F7] rounded-xl p-5 mb-5">
        <p className="text-sm text-secondary italic leading-relaxed">
          &quot;Based on your recent documents, you have a deadline for the &apos;E-commerce Redesign&apos; on Friday. Would you like me to draft a summary?&quot;
        </p>
      </div>

      {/* Chat Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Ask Solus anything..."
          className="w-full pl-4 pr-12 py-3 bg-white border border-highlight/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-glow/40 transition-all placeholder:text-highlight"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
