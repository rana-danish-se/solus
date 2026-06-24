'use client';
import WizardShell from '@/components/ContentStudio/Wizard/WizardShell';

export default function NewPostWizard() {
  return (
    <WizardShell
      initialStep={1}
      initialPostId={null}
      onComplete={() => {}}
    />
  );
}