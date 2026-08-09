import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { GlobalImpactPage } from './pages/GlobalImpactPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DonorDashboard } from './pages/DonorDashboard.jsx';
import { NgoDashboard } from './pages/NgoDashboard.jsx';
import { CitizenDashboard } from './pages/CitizenDashboard.jsx';

/**
 * FIRST-PRINCIPLES ROUTING ARCHITECTURE
 * 
 * 1. AuthProvider wraps the entire route tree so that every route component and navigation bar 
 *    shares the same reactive auth context.
 * 2. Universal Navbar persists at the top across public and protected routes.
 * 3. Public Route '/' renders GlobalImpactPage accessible to everyone.
 * 4. Distinct Login Routes ('/login-donor', '/login-ngo', '/login-citizen') pass explicit role intent.
 * 5. Protected Routes ('/donor', '/ngo', '/citizen') are wrapped inside ProtectedRoute guards.
 */
export const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Universal Public Global Impact Page */}
            <Route path="/" element={<GlobalImpactPage />} />

            {/* Distinct Entry-Point Login Routes */}
            <Route path="/login-donor" element={<LoginPage targetRole="donor" />} />
            <Route path="/login-ngo" element={<LoginPage targetRole="ngo" />} />
            <Route path="/login-citizen" element={<LoginPage targetRole="citizen" />} />

            {/* Role-Protected Dashboards */}
            <Route 
              path="/donor" 
              element={
                <ProtectedRoute allowedRole="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/ngo" 
              element={
                <ProtectedRoute allowedRole="ngo">
                  <NgoDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/citizen" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};
