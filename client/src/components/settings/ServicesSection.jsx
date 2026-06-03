import { useState } from 'react';
import useSettingsStore from '@/store/settingsStore';
import { X, Plus } from 'lucide-react';

export default function ServicesSection() {
  const { settings, addService, removeService } = useSettingsStore();
  const [newService, setNewService] = useState('');

  const handleAdd = () => {
    if (newService.trim()) {
      // Prevent duplicates
      if (!settings.services?.includes(newService.trim())) {
        addService(newService.trim());
      }
      setNewService('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <section className="mb-12">
      <div className="border-b border-highlight/15 pb-2 mb-6">
        <h3 className="text-xs font-bold text-highlight tracking-widest uppercase">Services</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {settings.services?.map((service, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-foreground rounded-md text-sm"
          >
            {service}
            <button 
              onClick={() => removeService(service)}
              className="text-highlight hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a service (e.g. Web Development)"
          className="flex-1 px-4 py-2.5 bg-background border border-highlight/15 rounded-lg text-sm focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
        />
        <button 
          onClick={handleAdd}
          className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
