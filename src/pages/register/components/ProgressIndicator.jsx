import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: "Basic Information", description: "Personal & contact details" },
    { number: 2, title: "Professional Details", description: "License & experience" },
    { number: 3, title: "Account Setup", description: "Password & preferences" }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-border">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step Indicators */}
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center relative bg-background px-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step.number < currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : step.number === currentStep
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.number < currentStep ? '✓' : step.number}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;