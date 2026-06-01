import Card from '../ui/Card';
import Badge from '../ui/Badge';

const leads = [
  { initial: 'A', color: 'bg-glow/10 text-glow', name: 'Acme Corp Redesign', status: 'PROPOSAL', statusVariant: 'purple', time: '2h ago', value: '$12,000' },
  { initial: 'Z', color: 'bg-green-500/10 text-green-600', name: 'Zenthly App Dev', status: 'DISCOVERY', statusVariant: 'green', time: 'Yesterday', value: '$8,500' },
  { initial: 'G', color: 'bg-red-500/10 text-red-600', name: 'Global Reach Branding', status: 'NEGOTIATION', statusVariant: 'red', time: '3 days ago', value: '$4,200' },
];

export default function ActiveLeads() {
  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-foreground">Active Leads</h3>
        <button className="text-sm font-semibold text-glow hover:text-glow/80 transition-colors">
          View CRM
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-highlight/15">
              <th className="pb-3 pl-1 text-[10px] font-bold text-highlight uppercase tracking-wider">Contact</th>
              <th className="pb-3 text-[10px] font-bold text-highlight uppercase tracking-wider">Status</th>
              <th className="pb-3 text-[10px] font-bold text-highlight uppercase tracking-wider">Last Contact</th>
              <th className="pb-3 text-right pr-1 text-[10px] font-bold text-highlight uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-highlight/10">
            {leads.map((lead, idx) => (
              <tr key={idx} className="group">
                <td className="py-4 pl-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${lead.color} flex items-center justify-center font-bold text-sm`}>
                      {lead.initial}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{lead.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variant={lead.statusVariant}>{lead.status}</Badge>
                </td>
                <td className="py-4 text-sm text-highlight">
                  {lead.time}
                </td>
                <td className="py-4 text-right pr-1 text-sm font-bold text-foreground">
                  {lead.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
