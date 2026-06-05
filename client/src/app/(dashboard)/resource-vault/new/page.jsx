'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Link2, Loader2, Save, Globe, Sparkles, X } from 'lucide-react';
import { scrapeResourceMetadata, createResource } from '@/services/resources.service';
import { RESOURCE_CATEGORIES } from '@/lib/resourceConstants';
import useToastStore from '@/store/toastStore';
import TagInput from '@/components/ResourceVault/TagInput';

export default function NewResourcePage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const [metadata, setMetadata] = useState(null);
  const [title, setTitle] = useState('');
  const [siteName, setSiteName] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [tags, setTags] = useState([]);

  const handleFetchMetadata = async (e) => {
    e?.preventDefault?.();
    const trimmed = url.trim();
    if (!trimmed) {
      addToast('Please enter a URL', 'error');
      return;
    }
    try {
      new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    } catch {
      addToast('Please enter a valid URL', 'error');
      return;
    }

    setIsScraping(true);
    try {
      const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const data = await scrapeResourceMetadata(normalized);
      setMetadata({ ...data, url: normalized });
      setTitle(data.title || normalized);
      setSiteName(data.siteName || '');
      setMetaDescription(data.metaDescription || '');
      setFaviconError(false);
      setStep(2);
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to fetch metadata', 'error');
    } finally {
      setIsScraping(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setMetadata(null);
    setTitle('');
    setSiteName('');
    setMetaDescription('');
    setDescription('');
    setCategory(RESOURCE_CATEGORIES[0]);
    setTags([]);
    setFaviconError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Title is required', 'error');
      return;
    }
    if (!category) {
      addToast('Category is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await createResource({
        url: metadata.url,
        title: title.trim(),
        siteName,
        favicon: metadata.favicon || '',
        metaDescription,
        description: description.trim(),
        category,
        tags,
      });
      addToast('Resource saved to vault', 'success');
      router.push('/resource-vault');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save resource';
      addToast(message, 'error');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Back Button */}
      <button
        onClick={() => (step === 2 ? handleReset() : router.back())}
        className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {step === 2 ? 'Start over' : 'Back'}
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-glow" />
          {step === 1 ? 'Add a Resource' : 'Review & Save'}
        </h1>
        <p className="text-sm text-highlight mt-1">
          {step === 1
            ? 'Paste a URL. We will fetch its metadata so you can review and save it.'
            : 'Confirm the scraped details and add your own context, category, and tags.'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 text-xs">
        <StepBadge active={step === 1} done={step === 2} index={1} label="URL" />
        <div className="flex-1 h-px bg-highlight/20" />
        <StepBadge active={step === 2} done={false} index={2} label="Review" />
      </div>

      {step === 1 ? (
        <form onSubmit={handleFetchMetadata} className="space-y-5">
          <Field label="Resource URL" required>
            <div className="relative">
              <Link2 className="w-4 h-4 text-highlight absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full pl-10 pr-3 py-3 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
                disabled={isScraping}
                required
              />
            </div>
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/resource-vault')}
              disabled={isScraping}
              className="px-5 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isScraping}
              className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scraping page details...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Fetch Metadata
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Favicon + URL preview */}
          <div className="flex items-center gap-3 p-4 bg-highlight/5 border border-highlight/15 rounded-xl">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-highlight/15">
              {metadata?.favicon && !faviconError ? (
                <img
                  src={metadata.favicon}
                  alt="favicon"
                  className="w-6 h-6 object-contain"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <Globe className="w-5 h-5 text-highlight" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-highlight">Source</p>
              <a
                href={metadata?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-glow transition-colors break-all"
              >
                {metadata?.url}
              </a>
            </div>
          </div>

          <Field label="Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Vector Databases Matter"
              className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              disabled={isSaving}
              required
            />
          </Field>

          <Field label="Site Name">
            <div className="px-4 py-2.5 bg-highlight/5 border border-highlight/15 rounded-lg text-sm text-secondary">
              {siteName || '—'}
            </div>
          </Field>

          {metaDescription && (
            <Field label="Meta Description (from page)">
              <div className="px-4 py-3 bg-highlight/5 border border-highlight/15 rounded-lg text-sm text-secondary leading-relaxed max-h-32 overflow-y-auto">
                {metaDescription}
              </div>
            </Field>
          )}

          <Field label="Your Notes" hint="Why is this resource worth saving?">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add your own insights, why you saved it, or how you plan to use it..."
              rows={5}
              className="w-full px-4 py-3 text-sm border border-highlight/20 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
              disabled={isSaving}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Category" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-highlight/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-glow/30 focus:border-glow transition-colors"
                disabled={isSaving}
                required
              >
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tags" hint="Press Enter to add">
              <TagInput tags={tags} onChange={setTags} placeholder="e.g. react, productivity" />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors disabled:opacity-50"
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save to Vault
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Scraping overlay */}
      {isScraping && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-7 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-[90%]">
            <div className="w-14 h-14 rounded-full border-4 border-glow/20 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-glow animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">Scraping page details...</h3>
              <p className="text-sm text-highlight mt-1">
                Fetching title, description, and favicon.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepBadge({ active, done, index, label }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-glow/10 border-glow/30 text-glow font-semibold'
          : done
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
            : 'border-highlight/20 text-highlight'
      }`}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
        {done ? '✓' : index}
      </span>
      <span className="text-[11px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {hint && <span className="text-[11px] text-highlight">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
