'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { createNote } from '@/services/notes.service';
import useToastStore from '@/store/toastStore';

export default function NewNotePage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('Title and content are required', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await createNote({ title: title.trim(), content: content.trim(), source: source.trim() });
      addToast('Note created and processed by AI', 'success');
      router.push('/learning-hub');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to create note', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-glow" />
          New Note
        </h1>
        <p className="text-sm text-highlight mt-1">
          Capture your learning. AI will summarize, classify, and tag it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Understanding JavaScript Closures"
            className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            disabled={isProcessing}
            required
          />
        </Field>

        <Field label="Content" required>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste article text, your notes, or write freely..."
            rows={14}
            className="w-full px-4 py-3 text-sm border border-highlight/20 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors font-mono leading-relaxed"
            disabled={isProcessing}
            required
          />
        </Field>

        <Field label="Source (optional)">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="URL, book name, or where you learned this"
            className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
            disabled={isProcessing}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/learning-hub')}
            disabled={isProcessing}
            className="px-5 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Process with AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-7 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-[90%]">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-glow/20 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-glow animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">Processing with AI</h3>
              <p className="text-sm text-highlight mt-1">
                Summarizing, classifying, and tagging your note...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
