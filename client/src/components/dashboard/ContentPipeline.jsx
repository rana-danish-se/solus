import Card from '../ui/Card';

const pipelineStages = [
  { name: 'Ideas', count: 5, color: 'bg-highlight' },
  { name: 'Drafts', count: 2, color: 'bg-glow' },
  { name: 'Review', count: 1, color: 'bg-red-500' },
  { name: 'Scheduled', count: 3, color: 'bg-green-500' },
];

export default function ContentPipeline() {
  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-base font-bold text-foreground mb-5">Content Pipeline</h3>

      <div className="flex flex-col gap-3">
        {pipelineStages.map((stage) => (
          <div key={stage.name} className="flex items-center justify-between py-3 px-1 border-b border-highlight/10 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
              <span className="text-sm font-medium text-secondary">{stage.name}</span>
            </div>
            <span className="text-base font-bold text-foreground">{stage.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
