import { useState, useEffect } from 'react';

/**
 * Custom hook to manage onboarding state
 * Uses localStorage to persist onboarding completion status
 */
export function useOnboarding() {
    const ONBOARDING_KEY = 'crm_homstudent_onboarding_completed';

    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
        // Check localStorage on initial load
        const completed = localStorage.getItem(ONBOARDING_KEY);
        return completed === 'true';
    });

    /**
     * Mark onboarding as completed
     */
    const completeOnboarding = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setIsOnboardingCompleted(true);
    };

    /**
     * Reset onboarding (for testing or re-onboarding)
     */
    const resetOnboarding = () => {
        localStorage.removeItem(ONBOARDING_KEY);
        setIsOnboardingCompleted(false);
    };

    return {
        isOnboardingCompleted,
        completeOnboarding,
        resetOnboarding
    };
}
