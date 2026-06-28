'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Check,
  X,
  Copy,
  CheckCheck,
  Send,
  Loader2,
  ExternalLink,
  Briefcase,
  AtSign,
  Camera,
  Globe,
  Archive,
  Trash2,
} from 'lucide-react';
import useConversationStore from '@/store/conversationStore';
import useToastStore from '@/store/toastStore';

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const addToast = useToastStore((s) => s.addToast);

  const {
    activeConversation,
    isLoading,
    isGenerating,
    pendingReplies,
    fetchConversation,
    submitProspectMessage,
    confirmReply,
    updateProspect,
    archiveConversation,
    deleteConversation,
    clearPendingReplies,
  } = useConversationStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) fetchConversation(id);
  }, [id, fetchConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, pendingReplies]);

  const handleGenerateReplies = async () => {
    if (!message.trim()) return;
    await submitProspectMessage(id, message);
    setMessage('');
  };

  const handleConfirmReply = useCallback(async (replyContent) => {
    await confirmReply(id, replyContent);
  }, [id, confirmReply]);

  const handleCopyConfirm = useCallback(async (replyContent) => {
    try {
      await navigator.clipboard.writeText(replyContent);
      await confirmReply(id, replyContent);
    } catch {
      addToast('Failed to copy to clipboard', 'error');
    }
  }, [id, confirmReply, addToast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!activeConversation) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <p className="text-highlight">Conversation not found.</p>
        <button onClick={() => router.push('/conversations')} className="mt-4 text-sm text-glow hover:underline">
          Back to Conversations
        </button>
      </div>
    );
  }

  const { prospect, messages = [], summaryUpTo = 0 } = activeConversation;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-0">
      {/* Left Panel — Prospect Info */}
      <div className={`relative flex-shrink-0 border-r border-highlight/15 bg-white transition-all duration-300 ${sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
        <div className="h-full overflow-y-auto p-5">
          <ProspectPanel
            key={prospect?.updatedAt || prospect?.name || 'prospect'}
            prospect={prospect}
            conversationId={id}
            onArchive={() => archiveConversation(id)}
            onDelete={async () => {
              if (window.confirm('Delete this conversation permanently?')) {
                await deleteConversation(id);
                router.push('/conversations');
              }
            }}
            onUpdate={async (data) => {
              await updateProspect(id, data);
            }}
          />
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-[280px] top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-highlight/15 rounded-r-lg flex items-center justify-center text-highlight hover:text-foreground hover:bg-highlight/5 transition-colors shadow-sm"
        style={{ left: sidebarOpen ? '280px' : '0' }}
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Right Panel — Conversation */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-highlight/15 ml-2">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-highlight/15 flex-shrink-0">
          <button
            onClick={() => router.push('/conversations')}
            className="p-1.5 text-highlight hover:text-foreground rounded-lg hover:bg-highlight/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">{prospect?.name || 'Unknown'}</h2>
            {prospect?.headline && (
              <p className="text-xs text-highlight truncate">{prospect.headline}</p>
            )}
          </div>
        </div>

        {/* Zone 1 — Message Thread */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {summaryUpTo > 0 && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-highlight/20" />
              <span className="text-[10px] text-highlight font-medium uppercase tracking-wider flex-shrink-0">
                Earlier conversation summarized
              </span>
              <div className="flex-1 h-px bg-highlight/20" />
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Send className="w-10 h-10 text-highlight/30 mb-3" />
              <p className="text-sm text-highlight">No messages yet</p>
              <p className="text-xs text-highlight/60 mt-1">Paste a prospect message below to start.</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isProspect = msg.role === 'user' || msg.role === 'prospect';
              return (
                <div
                  key={msg._id || i}
                  className={`flex ${isProspect ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                      isProspect
                        ? 'bg-highlight/10 text-foreground rounded-bl-sm'
                        : 'bg-glow text-white rounded-br-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isProspect ? 'text-highlight' : 'text-white/60'}`}>
                      {msg.createdAt ? formatTime(msg.createdAt) : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone 2 — Pending Replies */}
        {pendingReplies.length > 0 && (
          <div className="flex-shrink-0 border-t border-highlight/15 bg-highlight/5 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-highlight uppercase tracking-wider">Suggested Replies</h3>
              <button
                onClick={clearPendingReplies}
                className="text-xs text-highlight hover:text-foreground transition-colors"
              >
                Dismiss all
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {pendingReplies.map((reply, i) => (
                <ReplyCard
                  key={i}
                  reply={reply}
                  onCopyConfirm={() => handleCopyConfirm(reply.content)}
                  onDismiss={clearPendingReplies}
                />
              ))}
            </div>
          </div>
        )}

        {/* Zone 3 — Input Area */}
        <div className="flex-shrink-0 border-t border-highlight/15 px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste their message here..."
              rows={2}
              className="flex-1 px-4 py-2.5 text-sm border border-highlight/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerateReplies();
                }
              }}
            />
            <button
              onClick={handleGenerateReplies}
              disabled={isGenerating || !message.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 disabled:opacity-50 transition-colors self-end"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate Replies
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplyCard({ reply, onCopyConfirm, onDismiss }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const label = reply.label || reply.type || 'Direct';
  const labelStyles = {
    Direct: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Warm: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Strategic: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };
  const labelStyle = labelStyles[label] || labelStyles.Direct;

  return (
    <div className="min-w-[260px] max-w-[300px] bg-white border border-highlight/15 rounded-2xl p-4 flex flex-col gap-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${labelStyle}`}>
          {label}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap line-clamp-6">{reply.content}</p>
      <div className="flex gap-2 mt-auto pt-1">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-highlight bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors"
        >
          {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={onCopyConfirm}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          Confirm
        </button>
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors ml-auto"
        >
          <X className="w-3.5 h-3.5" />
          Dismiss
        </button>
      </div>
    </div>
  );
}

function ProspectPanel({ prospect, conversationId, onArchive, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(() => ({ ...(prospect || {}) }));

  if (!prospect) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (field, value) => {
    setForm((prev) => ({
      ...prev,
      socials: { ...(prev.socials || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(form);
    setIsSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...(prospect || {}) });
    setEditing(false);
  };

  const name = form.name || 'Unknown';
  const type = form.type || 'Client';
  const socials = prospect?.socials || {};

  const socialLinks = [
    { key: 'linkedin', icon: Briefcase, href: socials.linkedin },
    { key: 'twitter', icon: AtSign, href: socials.twitter },
    { key: 'instagram', icon: Camera, href: socials.instagram },
    { key: 'portfolio', icon: Globe, href: socials.portfolio },
  ].filter((s) => s.href);

  return (
    <div className="space-y-5">
      {/* Name + Type */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm font-semibold border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30"
              />
              <select
                value={form.type || 'Client'}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-highlight/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-glow/30"
              >
                <option value="Client">Client</option>
                <option value="Team">Team</option>
              </select>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold text-foreground truncate">{name}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                type === 'Client'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              }`}>
                {type}
              </span>
            </>
          )}
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-highlight hover:text-foreground rounded-lg hover:bg-highlight/10 transition-colors flex-shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {editing && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-glow text-white rounded-lg hover:bg-glow/90 disabled:opacity-50 transition-colors"
          >
            <Check className="w-3 h-3" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-highlight bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      )}

      {/* Socials */}
      {socialLinks.length > 0 && (
        <div className="flex gap-2">
          {socialLinks.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-highlight hover:text-glow hover:bg-glow/5 rounded-lg transition-colors"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}

      {/* Fields */}
      <FieldGroup>
        {editing ? (
          <>
            <EditableField label="Headline" value={form.headline || ''} onChange={(v) => updateField('headline', v)} />
            <EditableField label="Goal of Conversation" value={form.goalOfConversation || ''} onChange={(v) => updateField('goalOfConversation', v)} textarea />
            <EditableField label="About" value={form.about || ''} onChange={(v) => updateField('about', v)} textarea />
            <EditableField label="Niche" value={form.niche || ''} onChange={(v) => updateField('niche', v)} />
            <EditableField label="Location" value={form.location || ''} onChange={(v) => updateField('location', v)} />
            <EditableField label="Notes (private)" value={form.notes || ''} onChange={(v) => updateField('notes', v)} textarea />
            <div className="border-t border-highlight/10 pt-3 mt-3">
              <p className="text-[10px] font-semibold text-highlight uppercase tracking-wider mb-2">Socials</p>
              <div className="space-y-2">
                <EditableField label="LinkedIn" value={form.socials?.linkedin || ''} onChange={(v) => updateSocial('linkedin', v)} />
                <EditableField label="Twitter" value={form.socials?.twitter || ''} onChange={(v) => updateSocial('twitter', v)} />
                <EditableField label="Instagram" value={form.socials?.instagram || ''} onChange={(v) => updateSocial('instagram', v)} />
                <EditableField label="Portfolio" value={form.socials?.portfolio || ''} onChange={(v) => updateSocial('portfolio', v)} />
              </div>
            </div>
          </>
        ) : (
          <>
            {prospect.headline && <Field label="Headline" value={prospect.headline} />}
            {prospect.goalOfConversation && (
              <div>
                <p className="text-[10px] font-semibold text-glow uppercase tracking-wider mb-1">Goal of Conversation</p>
                <p className="text-sm text-foreground leading-relaxed bg-glow/5 border border-glow/20 rounded-lg p-3">{prospect.goalOfConversation}</p>
              </div>
            )}
            {prospect.about && <Field label="About" value={prospect.about} />}
            {prospect.niche && <Field label="Niche" value={prospect.niche} />}
            {prospect.location && <Field label="Location" value={prospect.location} />}
            {prospect.notes && (
              <div>
                <p className="text-[10px] font-semibold text-highlight uppercase tracking-wider mb-1">Notes <span className="font-normal normal-case">(private)</span></p>
                <p className="text-sm text-highlight italic">{prospect.notes}</p>
              </div>
            )}
          </>
        )}
      </FieldGroup>

      {/* Actions */}
      <div className="border-t border-highlight/10 pt-4 space-y-2">
        <button
          onClick={onArchive}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-highlight hover:text-amber-600 bg-highlight/5 hover:bg-amber-500/10 rounded-lg transition-colors"
        >
          <Archive className="w-3.5 h-3.5" />
          Archive Conversation
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-highlight hover:text-red-600 bg-highlight/5 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Conversation
        </button>
      </div>
    </div>
  );
}

function FieldGroup({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-highlight uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}

function EditableField({ label, value, onChange, textarea = false }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-highlight uppercase tracking-wider mb-1">{label}</label>
      {textarea ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2.5 py-1.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2.5 py-1.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
        />
      )}
    </div>
  );
}

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
