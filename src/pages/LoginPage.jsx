import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * FIRST-PRINCIPLES REASONING: Role-Specific Login Entry Point Component
 * 
 * 1. WHY ARE THERE 3 DISTINCT LOGIN ROUTES (/login-donor, /login-ngo, /login-citizen)?
 * Having distinct login URLs establishes explicit entry points for each persona. When a restaurant 
 * owner clicks "I want to donate", they land on '/login-donor', explicitly capturing their intent 
 * BEFORE identity authentication occurs. This guarantees that upon Google OAuth completion, 
 * the backend creates their profile with the exact intended RLS role ('donor') without needing 
 * extra interactive role selection steps.
 * 
 * 2. WHY GOOGLE OAUTH + INITIAL ROLE CAPTURE?
 * OAuth handles identity verification safely without storing password hashes. Once Google returns 
 * the verified email and user profile, our system checks if a record exists in `public.profiles`. 
 * If it is the user's first login, we insert a new profile record setting `role = targetRole`.
 */

export const LoginPage = ({ targetRole }) => {
  const { loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const roleMeta = {
    donor: {
      title: "Restaurant & Food Donor Portal",
      subtitle: "Sign in with Google to post surplus food and track donations.",
      badge: "🏨 Food Donor Entry Point",
      color: "from-emerald-600 to-teal-700",
      redirectPath: "/donor"
    },
    ngo: {
      title: "NGO & Shelter Partner Portal",
      subtitle: "Sign in with Google to claim food donations and direct rescue alerts.",
      badge: "🏢 NGO Representative Entry Point",
      color: "from-teal-600 to-emerald-800",
      redirectPath: "/ngo"
    },
    citizen: {
      title: "Community Need Spotter Portal",
      subtitle: "Sign in with Google to report locations where people need food.",
      badge: "📍 Citizen Spotter Entry Point",
      color: "from-amber-600 to-orange-700",
      redirectPath: "/citizen"
    }
  };

  const meta = roleMeta[targetRole] || roleMeta.donor;

  const handleGoogleLogin = async () => {
    try {
      /*
       * FIRST PRINCIPLES:
       * 1. Trigger Google OAuth workflow, binding targetRole to session intent.
       * 2. After profile resolution in AuthContext, navigate explicitly to the protected dashboard.
       */
      await loginWithGoogle(targetRole);
      navigate(meta.redirectPath, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        
        {/* Role Header Banner */}
        <div className={`p-8 bg-gradient-to-r ${meta.color} text-white text-center space-y-3`}>
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider">
            {meta.badge}
          </div>
          <h2 className="text-2xl font-extrabold">{meta.title}</h2>
          <p className="text-xs text-slate-100">{meta.subtitle}</p>
        </div>

        {/* Auth Body */}
        <div className="p-8 space-y-6 text-center">
          
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authentication Required</p>
            <p className="text-sm text-slate-600">
              Sign in with your Google account to access your role-protected dashboard.
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-700 font-bold border-2 border-slate-200 hover:border-emerald-500 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            Role selected: <strong className="text-slate-700 capitalize">{targetRole}</strong>. 
            Protected by RLS auth policies.
          </div>

        </div>

      </div>
    </div>
  );
};
