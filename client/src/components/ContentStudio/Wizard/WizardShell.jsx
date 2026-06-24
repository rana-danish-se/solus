'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';
import StepIdea from './steps/StepIdea';
import StepHook from './steps/StepHook';
import StepBody from './steps/StepBody';
import StepCTA from './steps/StepCTA';
import StepPolish from './steps/StepPolish';
import StepImage from './steps/StepImage';
import StepPublish from './steps/StepPublish';

const STEPS = [
  { number: 1, label: 'Idea' },
  { number: 2, label: 'Hook' },
  { number: 3, label: 'Body' },
  { number: 4, label: 'CTA' },
  { number: 5, label: 'Polish' },
  { number: 6, label: 'Image' },
  { number: 7, label: 'Publish' },
];

function ProgressBar({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                  step.number < currentStep
                    ? 'bg-glow text-white'
                    : step.number === currentStep
                    ? 'bg-glow text-white'
                    : 'bg-gray-100 text-highlight'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                  step.number === currentStep ? 'text-glow' : 'text-highlight'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-2 ${
                  step.number < currentStep ? 'bg-glow' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WizardShell({ initialStep = 1, initialPostId = null, initialPost = null, onComplete }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [postId, setPostId] = useState(initialPostId);
  const [post, setPost] = useState(initialPost);

  const handleStepComplete = (data) => {
    if (data?.postId) setPostId(data.postId);
    if (data?.post) setPost(data.post);
    if (data?.nextStep) {
      setCurrentStep(data.nextStep);
    } else {
      setCurrentStep((s) => Math.min(s + 1, 7));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  function renderStep() {
    const commonProps = {
      onComplete: handleStepComplete,
      onBack: handleBack,
      postId,
      post,
    };

    switch (currentStep) {
      case 1:
        return <StepIdea {...commonProps} />;
      case 2:
        return <StepHook {...commonProps} />;
      case 3:
        return <StepBody {...commonProps} />;
      case 4:
        return <StepCTA {...commonProps} />;
      case 5:
        return <StepPolish {...commonProps} postId={postId} post={post} />;
      case 6:
        return <StepImage {...commonProps} />;
      case 7:
        return <StepPublish {...commonProps} postId={postId} post={post} onComplete={onComplete} />;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <ProgressBar currentStep={currentStep} />
      <div className="bg-white rounded-2xl shadow-sm">
        {renderStep()}
      </div>
    </div>
  );
}