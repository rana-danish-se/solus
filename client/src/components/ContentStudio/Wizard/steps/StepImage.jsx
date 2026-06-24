'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Loader2, SkipForward } from 'lucide-react';
import { uploadPostImage, removePostImage } from '@/services/content.service';
import useToastStore from '@/store/toastStore';

export default function StepImage({ onComplete, onBack, postId, post: initialPost }) {
  const addToast = useToastStore((state) => state.addToast);
  const inputRef = useRef(null);

  const [image, setImage] = useState(initialPost?.image?.url ? initialPost.image : null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !postId) return;
    setIsUploading(true);
    try {
      const updated = await uploadPostImage(postId, file);
      setImage(updated.image || { url: updated.image?.url, publicId: updated.image?.publicId });
      addToast('Image uploaded', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove() {
    if (!postId) return;
    setIsRemoving(true);
    try {
      await removePostImage(postId);
      setImage(null);
      addToast('Image removed', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove image', 'error');
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-lg font-bold text-foreground mb-1">Image</h2>
      <p className="text-sm text-highlight mb-6">Add an image to your post (optional).</p>

      {image?.url ? (
        <div className="space-y-4">
          <div className="relative h-80 rounded-xl overflow-hidden border border-gray-200 bg-[#F5F5F7]">
            <Image
              src={image.url}
              alt="Post image"
              fill
              className="object-contain"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isRemoving ? 'Removing...' : 'Remove image'}
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-glow/40 rounded-xl py-12 px-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-glow animate-spin mb-3" />
              <p className="text-sm text-foreground font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-highlight/10 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-highlight" />
              </div>
              <p className="text-sm text-foreground font-medium">Click to upload</p>
              <p className="text-xs text-highlight mt-1">JPG, PNG, or WebP</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="text-sm text-highlight hover:text-foreground transition-colors"
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onComplete({ postId, post: { ...initialPost, image: image || { url: '', publicId: '', source: 'none' } } })}
            className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            Skip for now
          </button>

          <button
            onClick={() => onComplete({ postId, post: { ...initialPost, image: image || { url: '', publicId: '', source: 'none' } } })}
            className="flex items-center gap-2 px-5 py-2 bg-glow text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}