
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${
            currentStep === step
              ? 'border-primary bg-primary text-primary-foreground'
              : currentStep > step
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground text-muted-foreground'
          }`}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-10 h-0.5 ${currentStep > step ? 'bg-primary' : 'bg-muted-foreground'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
