import Card from '../ui/Card';
import { Target, Check, Plus } from 'lucide-react';

const tasks = [
  { label: 'Review Pull Requests', done: true },
  { label: 'Update Q3 Product Roadmap', done: false },
  { label: 'Prep for client strategy call', done: false },
];

export default function TodaysFocus() {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-foreground">Today&apos;s Focus</h3>
        <Target className="w-5 h-5 text-highlight" />
      </div>

      <div className="flex-1 space-y-4">
        {tasks.map((task, idx) => (
          <label key={idx} className="flex items-start gap-3 cursor-pointer group">
            {task.done ? (
              <div className="mt-0.5 w-5 h-5 rounded bg-glow text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
            ) : (
              <div className="mt-0.5 w-5 h-5 rounded border-2 border-highlight/30 group-hover:border-glow transition-colors flex-shrink-0" />
            )}
            <span className={`text-sm leading-snug ${task.done ? 'text-foreground' : 'text-secondary'}`}>
              {task.label}
            </span>
          </label>
        ))}
      </div>

      <button className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-glow hover:text-glow/80 transition-colors">
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    </Card>
  );
}
