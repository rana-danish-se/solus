'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostById } from '@/services/content.service';
import WizardShell from '@/components/ContentStudio/Wizard/WizardShell';
import useToastStore from '@/store/toastStore';

function determineStep(post) {
  const sections = post?.sections || {};
  if (!sections.hook) return 2;
  if (!sections.body) return 3;
  if (!sections.cta) return 4;
  if (post.status === 'approved' || post.status === 'draft') return 5;
  return 6;
}

export default function ResumePostWizard() {
  const params = useParams();
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const [post, setPost] = useState(null);
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await getPostById(params.id);
        if (!mounted) return;

        if (!p) {
          addToast('Post not found', 'error');
          router.push('/content-studio');
          return;
        }

        if (p.status === 'published' || p.status === 'scheduled') {
          addToast('This post is already ' + p.status, 'info');
          router.push('/content-studio');
          return;
        }

        setPost(p);
        setStep(determineStep(p));
      } catch (err) {
        if (mounted) {
          addToast(err.response?.data?.message || 'Failed to load post', 'error');
          router.push('/content-studio');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded-lg" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <WizardShell
      initialStep={step}
      initialPostId={post._id}
      initialPost={post}
    />
  );
}