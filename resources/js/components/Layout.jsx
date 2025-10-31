import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useOnboarding } from '../hooks/useOnboarding';
import Sidebar from './Sidebar';
import Onboarding from './onboarding/Onboarding';
import BugReportButton from './bugReport/BugReportButton';
import RestartOnboardingButton from './onboarding/RestartOnboardingButton';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const toast = useToast();
    const { isOnboardingCompleted, completeOnboarding } = useOnboarding();

    /**
     * Toggles.
     * 
     * By Michele Mincone.
     */
    const disableHeader = true;

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Disconnessione effettuata con successo');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Errore durante il logout:', error);
            toast.error('Errore durante la disconnessione');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                {!disableHeader && (
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-sm font-medium hidden md:block">{user?.name || 'Utente'}</span>
                                <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setUserMenuOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Utente'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Disconnetti</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>)}

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-0">
                    <Outlet />
                </main>
            </div>

            {/* Onboarding Flow - Shows only if not completed */}
            {!isOnboardingCompleted && (
                <Onboarding onComplete={completeOnboarding} />
            )}

            {/* Floating Action Buttons - Bottom Right Corner */}
            <RestartOnboardingButton />
            <BugReportButton />
        </div>
    );
}
