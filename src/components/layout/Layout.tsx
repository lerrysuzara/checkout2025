/**
 * Main layout component for the checkout application
 * Provides consistent structure and responsive design
 */

import React from 'react';
import Navigation from './Navigation';
import { CheckoutStep } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: CheckoutStep;
  onStepChange: (step: CheckoutStep) => void;
  completedSteps: CheckoutStep[];
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentStep,
  onStepChange,
  completedSteps
}) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="checkout-container">


        {/* Navigation */}
        <div className="mb-8">
          <Navigation
            currentStep={currentStep}
            onStepChange={onStepChange}
            completedSteps={completedSteps}
          />
        </div>

        {/* Main content */}
        <main className="page-transition min-h-96">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-success-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>PCI Compliant</span>
            </div>
          </div>
          <p>© 2024 Secure Checkout. Your payment information is protected.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;