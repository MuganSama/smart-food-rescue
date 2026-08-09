import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * FIRST-PRINCIPLES REASONING: Protected Route Guard Component
 * 
 * 1. WHY IS CLIENT-SIDE ROUTE GUARDING NECESSARY?
 * Simply hiding navigation links in the header is security through obscurity. A user can still 
 * manually type '/ngo' or '/donor' directly into the browser URL bar. ProtectedRoute acts as an 
 * active gatekeeper that intercept requests before rendering sensitive components.
 * 
 * 2. WHY TWO-LEVEL VALIDATION (AUTHENTICATION + AUTHORIZATION)?
 * - Level 1 (Authentication Check): Is the user logged in at all? 
 *   If NO -> Redirect to the specific login entry point for that role (e.g., '/login-donor').
 * - Level 2 (Authorization / Role Check): Is the logged-in user authorized for THIS specific route?
 *   If a logged-in 'donor' attempts to navigate to '/ngo', allowing them in would break UI invariants. 
 *   Hence, we redirect them to their authorized role dashboard (e.g., '/donor').
 */

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  // If auth context is asynchronously verifying token on startup, suspend rendering
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  // Level 1: Unauthenticated -> Redirect to the role-specific login entry point
  if (!user) {
    const loginRedirects = {
      donor: '/login-donor',
      ngo: '/login-ngo',
      citizen: '/login-citizen'
    };
    return <Navigate to={loginRedirects[allowedRole] || '/login-donor'} replace />;
  }

  // Level 2: Authenticated but wrong role -> Redirect to user's authorized dashboard
  if (user.role !== allowedRole) {
    const roleDashboards = {
      donor: '/donor',
      ngo: '/ngo',
      citizen: '/citizen'
    };
    return <Navigate to={roleDashboards[user.role] || '/'} replace />;
  }

  // Authorized -> Render protected dashboard view
  return children;
};
