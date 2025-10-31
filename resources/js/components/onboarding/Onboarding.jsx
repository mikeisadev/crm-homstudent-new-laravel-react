import { useState } from 'react';
import OnboardingLoader from './OnboardingLoader';
import OnboardingModal from './OnboardingModal';
import WelcomeScreen from './WelcomeScreen';

/**
 * Onboarding Component
 *
 * Main orchestrator for the onboarding flow:
 * 1. Loading screen (4.5 seconds)
 * 2. Multi-step modal (3 slides)
 * 3. Welcome screen (5 seconds or click)
 */
export default function Onboarding({ onComplete }) {
    const [currentPhase, setCurrentPhase] = useState('loading'); // loading | modal | welcome

    const handleLoaderComplete = () => {
        setCurrentPhase('modal');
    };

    const handleModalComplete = () => {
        setCurrentPhase('welcome');
    };

    const handleWelcomeComplete = () => {
        // Mark onboarding as complete and trigger parent callback
        onComplete();
    };

    return (
        <>
            {currentPhase === 'loading' && (
                <OnboardingLoader onComplete={handleLoaderComplete} />
            )}

            {currentPhase === 'modal' && (
                <OnboardingModal onComplete={handleModalComplete} />
            )}

            {currentPhase === 'welcome' && (
                <WelcomeScreen onComplete={handleWelcomeComplete} />
            )}
        </>
    );
}
