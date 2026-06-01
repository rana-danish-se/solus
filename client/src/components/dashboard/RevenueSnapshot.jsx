import Card from '../ui/Card';
import { TrendingUp } from 'lucide-react';

const barData = [
  { day: 'MON', height: '30%', active: false },
  { day: 'TUE', height: '45%', active: false },
  { day: 'WED', height: '35%', active: false },
  { day: 'THU', height: '60%', active: false },
  { day: 'FRI', height: '90%', active: true },
];

export default function RevenueSnapshot() {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground mb-1">Revenue Snapshot</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-glow">$3,200</span>
            <span className="text-xs text-highlight font-medium">this month</span>
          </div>
        </div>
        <div className="p-2 bg-glow/10 rounded-lg text-glow">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-auto flex items-end justify-between gap-3 h-28 pt-4">
        {barData.map((bar) => (
          <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-full rounded-sm transition-all ${bar.active ? 'bg-glow' : 'bg-highlight/15'}`}
              style={{ height: bar.height }}
            />
            <span className="text-[10px] font-bold text-highlight uppercase">{bar.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
