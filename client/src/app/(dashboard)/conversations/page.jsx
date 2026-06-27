'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Plus, X, UserCheck, Users } from 'lucide-react';
import useConversationStore from '@/store/conversationStore';
import useToastStore from '@/store/toastStore';

export default function ConversationsPage() {
  const router = useRouter();
  const { conversations, isLoading, fetchConversations, createConversation } = useConversationStore();
  const addToast = useToastStore((s) => s.addToast);
  const [tab, setTab] = useState('active');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = useMemo(() => {
    if (!Array.isArray(conversations)) return [];
    return conversations.filter((c) =>
      tab === 'archived' ? c.archived : !c.archived
    );
  }, [conversations, tab]);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-glow" />
            Conversations
          </h1>
          <p className="text-sm text-highlight mt-1">
            Manage prospect outreach and generate AI-powered replies.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      <div className="flex gap-1 bg-highlight/10 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'active' ? 'bg-white text-foreground shadow-sm' : 'text-highlight hover:text-foreground'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Active
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'archived' ? 'bg-white text-foreground shadow-sm' : 'text-highlight hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Archived
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white border border-dashed border-highlight/30 rounded-2xl py-16 px-6 text-center">
          <MessageCircle className="w-12 h-12 text-highlight/50 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            {tab === 'archived' ? 'No archived conversations' : 'No active conversations'}
          </h3>
          <p className="text-sm text-highlight mb-5 max-w-sm mx-auto">
            {tab === 'archived'
              ? 'Archived conversations will appear here.'
              : 'Start your first prospect outreach conversation.'}
          </p>
          {tab !== 'archived' && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conv) => (
            <ConversationCard
              key={conv._id}
              conversation={conv}
              onClick={() => router.push(`/conversations/${conv._id}`)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <NewConversationModal
          onClose={() => setShowModal(false)}
          onCreate={async (data) => {
            const result = await createConversation(data);
            if (result && result._id) {
              setShowModal(false);
              router.push(`/conversations/${result._id}`);
            }
          }}
        />
      )}
    </div>
  );
}

function ConversationCard({ conversation, onClick }) {
  const { prospect, lastMessage, updatedAt } = conversation;
  const name = prospect?.name || 'Unknown';
  const type = prospect?.type || 'Client';
  const headline = prospect?.headline || '';
  const messagePreview = lastMessage
    ? (lastMessage.content || lastMessage).substring(0, 100)
    : '';
  const time = updatedAt ? formatRelativeTime(updatedAt) : '';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-highlight/15 rounded-2xl p-5 cursor-pointer hover:border-glow/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{name}</h3>
            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border flex-shrink-0 ${
              type === 'Client'
                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            }`}>
              {type}
            </span>
          </div>
          {headline && (
            <p className="text-xs text-highlight truncate mb-1.5">{headline}</p>
          )}
          {messagePreview && (
            <p className="text-xs text-highlight/70 truncate">{messagePreview}</p>
          )}
        </div>
        {time && (
          <span className="text-[10px] text-highlight flex-shrink-0 whitespace-nowrap">{time}</span>
        )}
      </div>
    </div>
  );
}

function NewConversationModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '',
    type: 'Client',
    headline: '',
    about: '',
    niche: '',
    location: '',
    goalOfConversation: '',
    notes: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    portfolio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate({
        prospect: {
          name: form.name,
          type: form.type,
          headline: form.headline,
          about: form.about,
          niche: form.niche,
          location: form.location,
          goalOfConversation: form.goalOfConversation,
          notes: form.notes,
          socials: {
            linkedin: form.linkedin,
            twitter: form.twitter,
            instagram: form.instagram,
            portfolio: form.portfolio,
          },
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-highlight/15">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-highlight/15">
          <h2 className="text-base font-bold text-foreground">New Conversation</h2>
          <button onClick={onClose} className="p-1.5 text-highlight hover:text-foreground rounded-lg hover:bg-highlight/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Prospect name"
                className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              >
                <option value="Client">Client</option>
                <option value="Team">Team</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">Headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => updateField('headline', e.target.value)}
              placeholder="e.g. CEO at Acme Corp"
              className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">About</label>
            <textarea
              rows={2}
              value={form.about}
              onChange={(e) => updateField('about', e.target.value)}
              placeholder="Brief background about the prospect"
              className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">Niche</label>
              <input
                type="text"
                value={form.niche}
                onChange={(e) => updateField('niche', e.target.value)}
                placeholder="e.g. SaaS, Design"
                className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. San Francisco"
                className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">Goal of Conversation</label>
            <textarea
              rows={2}
              value={form.goalOfConversation}
              onChange={(e) => updateField('goalOfConversation', e.target.value)}
              placeholder="What do you want to achieve in this conversation?"
              className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-1.5">Notes <span className="font-normal normal-case text-highlight/70">(private)</span></label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Your private notes about this prospect"
              className="w-full px-3 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-highlight uppercase tracking-wider mb-2">Socials</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={form.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2 text-xs border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={form.twitter}
                  onChange={(e) => updateField('twitter', e.target.value)}
                  placeholder="Twitter URL"
                  className="w-full px-3 py-2 text-xs border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => updateField('instagram', e.target.value)}
                  placeholder="Instagram URL"
                  className="w-full px-3 py-2 text-xs border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={form.portfolio}
                  onChange={(e) => updateField('portfolio', e.target.value)}
                  placeholder="Portfolio URL"
                  className="w-full px-3 py-2 text-xs border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-highlight bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.name.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Conversation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
