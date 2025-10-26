import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './i18n';

import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/Toast';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Properties from './pages/Properties';
import Rooms from './pages/Rooms';
import Condominiums from './pages/Condominiums';
import ManagementContracts from './pages/ManagementContracts';
import Proposals from './pages/Proposals';
import Contracts from './pages/Contracts';
import Suppliers from './pages/Suppliers';
import Owners from './pages/Owners';
import Deposits from './pages/Deposits';
import Cancellations from './pages/Cancellations';
import Invoices from './pages/Invoices';
import Penalties from './pages/Penalties';
import Calendar from './pages/Calendar';

/**
 * React Query Client configuration.
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendario" element={<Calendar />} />

                {/* ANAGRAFICHE */}
                <Route path="/clienti" element={<Clients />} />
                <Route path="/immobili" element={<Properties />} />
                <Route path="/stanze" element={<Rooms />} />
                <Route path="/condomini" element={<Condominiums />} />

                {/* FLUSSO */}
                <Route path="/gestione-immobiliare" element={<ManagementContracts />} />
                <Route path="/proposte" element={<Proposals />} />
                <Route path="/contratti" element={<Contracts />} />

                {/* GENERALI */}
                <Route path="/fornitori" element={<Suppliers />} />
                <Route path="/proprietari" element={<Owners />} />

                {/* GESTIONE */}
                <Route path="/caparre" element={<Deposits />} />
                <Route path="/disdette" element={<Cancellations />} />
                <Route path="/bollette" element={<Invoices />} />
                <Route path="/sanzioni" element={<Penalties />} />
            </Route>
        </Routes>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ToastProvider>
                        <App />
                        <ToastContainer />
                    </ToastProvider>
                </AuthProvider>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
