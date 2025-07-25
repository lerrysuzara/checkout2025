/**
 * Navigation component for checkout flow
 * Shows progress and allows navigation between steps
 */

import React from 'react';
import { CheckoutStep } from '../../types';

interface NavigationProps {
  currentStep: CheckoutStep;
  onStepChange: (step: CheckoutStep) => void;
  completedSteps: CheckoutStep[];
}

const steps: { key: CheckoutStep; label: string; description: string }[] = [
  { key: 'cart', label: 'Cart', description: 'Review items' },
  { key: 'shipping', label: 'Shipping', description: 'Delivery address' },
  { key: 'payment', label: 'Payment', description: 'Payment method' },
  { key: 'review', label: 'Review', description: 'Confirm order' }
];

const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  onStepChange,
  completedSteps
}) => {
  const getStepIndex = (step: CheckoutStep) => steps.findIndex(s => s.key === step);
  const currentStepIndex = getStepIndex(currentStep);

  const getStepStatus = (step: CheckoutStep, index: number) => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    if (index < currentStepIndex) return 'completed';
    return 'upcoming';
  };

  const canNavigateToStep = (step: CheckoutStep, index: number) => {
    return index <= currentStepIndex || completedSteps.includes(step);
  };

  return (
    <nav className="mb-8" aria-label="Checkout progress">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key, index);
          const canNavigate = canNavigateToStep(step.key, index);
          
          return (
            <li key={step.key} className="flex-1 relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                    status === 'completed' ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  style={{ left: '50%', right: '-50%' }}
                />
              )}
              
              {/* Step button */}
              <button
                onClick={() => canNavigate && onStepChange(step.key)}
                disabled={!canNavigate}
                className={`relative flex flex-col items-center group ${
                  canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {/* Step circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                    status === 'completed'
                      ? 'bg-primary-600 text-white'
                      : status === 'current'
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600'
                      : 'bg-gray-200 text-gray-500'
                  } ${canNavigate ? 'group-hover:bg-primary-200' : ''}`}
                >
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      status === 'current'
                        ? 'text-primary-600'
                        : status === 'completed'
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Navigation;