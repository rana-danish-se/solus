import DailyChecklist from '@/components/dashboard/DailyChecklist';
import RevenueSnapshot from '@/components/dashboard/RevenueSnapshot';
import LearningStreak from '@/components/dashboard/LearningStreak';
import AIBrainCard from '@/components/dashboard/AIBrainCard';
import ContentPipeline from '@/components/dashboard/ContentPipeline';
import ActiveLeads from '@/components/dashboard/ActiveLeads';

export default function DashboardPage() {
  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-6">

      {/* Row 1: Daily Checklist | Revenue Snapshot | Learning Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DailyChecklist />
        <RevenueSnapshot />
        <LearningStreak />
      </div>

      {/* Row 2: AI Brain (2/3) | Content Pipeline (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AIBrainCard />
        </div>
        <div className="md:col-span-1">
          <ContentPipeline />
        </div>
      </div>

      {/* Row 3: Active Leads (full width) */}
      <ActiveLeads />

    </div>
  );
}
