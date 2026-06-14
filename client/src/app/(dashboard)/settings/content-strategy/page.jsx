'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ContentStrategySection from '@/components/settings/ContentStrategySection';

export default function ContentStrategyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 pb-24">
      <Link
        href="/settings"
        className="flex items-center gap-1.5 text-sm text-highlight hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Link>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground">Content Strategy</h1>
        <p className="text-highlight mt-1 text-sm">
          Define your content pillars, audience, tone, and posting preferences per platform.
        </p>
      </div>

      <ContentStrategySection />
    </div>
  );
}
