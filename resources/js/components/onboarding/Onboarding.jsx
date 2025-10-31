import { useState, useEffect, useRef } from 'react';
import OnboardingLoader from './OnboardingLoader';
import OnboardingModal from './OnboardingModal';
import WelcomeScreen from './WelcomeScreen';

/**
 * Onboarding Component
 *
 * Main orchestrator for the onboarding flow:
 * 1. Loading screen (4.5 seconds)
 * 2. Multi-step modal (3 slides) - Audio starts here
 * 3. Welcome screen (5 seconds or click)
 *
 * Features:
 * - Plays audio when modal phase starts
 * - Audio continues playing through welcome screen
 * - Audio continues playing AFTER onboarding completes
 * - Audio plays to natural completion while user explores CRM
 * - Error handling for browser autoplay policies
 * - Memory-safe: releases reference on unmount without stopping playback
 */
export default function Onboarding({ onComplete }) {
    const [currentPhase, setCurrentPhase] = useState('loading'); // loading | modal | welcome
    const audioRef = useRef(null);

    // Initialize audio element
    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio('/audio/aura_assistant_ai_michele_mincone.mp3');
        audioRef.current.volume = 0.7; // Set volume to 70%

        // Cleanup audio on unmount - but allow it to finish playing
        return () => {
            // Don't pause audio - let it play to completion naturally
            // Just release the reference so component can unmount cleanly
            audioRef.current = null;
        };
    }, []);

    // Start audio when modal phase begins
    useEffect(() => {
        if (currentPhase === 'modal' && audioRef.current) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                audioRef.current.play().catch(error => {
                    console.warn('Audio autoplay failed (browser policy):', error);
                    // Autoplay might be blocked by browser - this is expected
                });
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [currentPhase]);

    const handleLoaderComplete = () => {
        setCurrentPhase('modal');
    };

    const handleModalComplete = () => {
        setCurrentPhase('welcome');
        // Keep audio playing through welcome screen
    };

    const handleWelcomeComplete = () => {
        // Allow audio to continue playing even after onboarding completes
        // The audio will play to its natural end while user explores the CRM

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
