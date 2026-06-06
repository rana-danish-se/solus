'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit3, Save, Loader2, Globe, Link2 } from 'lucide-react';
import { fetchResourceById, updateResource } from '@/services/resources.service';
import { RESOURCE_CATEGORIES } from '@/lib/resourceConstants';
import useToastStore from '@/store/toastStore';
import TagInput from '@/components/ResourceVault/TagInput';

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const addToast = useToastStore((state) => state.addToast);

  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchResourceById(id);
        if (mounted) {
          setResource(data);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setCategory(data.category || RESOURCE_CATEGORIES[0]);
          setTags(Array.isArray(data.tags) ? data.tags : []);
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load resource', 'error');
        router.push('/resource-vault');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, addToast, router]);

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
      await updateResource(id, {
        title: title.trim(),
        description: description.trim(),
        category,
        tags,
      });
      addToast('Resource updated', 'success');
      router.push('/resource-vault');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update resource', 'error');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <button
        onClick={() => router.push('/resource-vault')}
        className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-glow" />
          Edit Resource
        </h1>
        <p className="text-sm text-highlight mt-1">
          Update the title, your notes, category, and tags. The original link cannot be changed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Read-only URL & Metadata */}
        <ReadOnlySection icon={Link2} label="URL">
          <a
            href={resource?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-glow hover:underline break-all"
          >
            {resource?.url}
          </a>
        </ReadOnlySection>

        {resource?.favicon && (
          <div className="flex items-center gap-3 p-4 bg-highlight/5 border border-highlight/15 rounded-xl">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-highlight/15">
              <img
                src={resource.favicon}
                alt="favicon"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-highlight">Favicon</p>
              <p className="text-xs text-highlight/70 truncate">{resource.favicon}</p>
            </div>
          </div>
        )}

        <ReadOnlySection icon={Globe} label="Site Name">
          <span className="text-sm text-secondary">{resource?.siteName || '—'}</span>
        </ReadOnlySection>

        {resource?.metaDescription && (
          <ReadOnlySection icon={Edit3} label="Meta Description">
            <p className="text-sm text-secondary leading-relaxed max-h-32 overflow-y-auto">
              {resource.metaDescription}
            </p>
          </ReadOnlySection>
        )}

        <div className="pt-2 border-t border-highlight/15" />

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
            onClick={() => router.push('/resource-vault')}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-medium text-secondary bg-highlight/10 hover:bg-highlight/20 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function ReadOnlySection({ icon: Icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-highlight" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-highlight">
          {label}
        </span>
      </div>
      <div className="px-4 py-3 bg-highlight/5 border border-highlight/15 rounded-lg">
        {children}
      </div>
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
