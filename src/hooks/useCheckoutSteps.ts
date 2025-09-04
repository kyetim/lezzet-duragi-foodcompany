import { useState } from 'react';

export type CheckoutStep = 'address' | 'payment' | 'review';

interface UseCheckoutStepsReturn {
    currentStep: number;
    currentStepId: CheckoutStep;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    canProceedToNext: boolean;
    setCanProceedToNext: (canProceed: boolean) => void;
}

const STEPS: CheckoutStep[] = ['address', 'payment', 'review'];

export function useCheckoutSteps(): UseCheckoutStepsReturn {
    const [currentStep, setCurrentStep] = useState(0);
    const [canProceedToNext, setCanProceedToNext] = useState(false);

    const nextStep = () => {
        if (currentStep < STEPS.length - 1 && canProceedToNext) {
            setCurrentStep(prev => prev + 1);
            setCanProceedToNext(false); // Reset for next step
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setCanProceedToNext(true); // Can always go back
        }
    };

    const goToStep = (step: number) => {
        if (step >= 0 && step < STEPS.length) {
            setCurrentStep(step);
        }
    };

    return {
        currentStep,
        currentStepId: STEPS[currentStep],
        nextStep,
        prevStep,
        goToStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === STEPS.length - 1,
        canProceedToNext,
        setCanProceedToNext
    };
}
