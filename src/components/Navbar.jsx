import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Universal Navigation Bar Component
 * 
 * Persists across all views (Public Impact page, Login entry points, and Protected Dashboards).
 * Displays user identity, active role badge, navigation links, and functional logout trigger.
 */
export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Public Link */}
        <Link to="/" className="flex items-center gap-3 font-extrabold text-xl text-slate-900 group">
          <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span>Smart<span className="text-emerald-600">Food</span>Rescue</span>
        </Link>

        {/* Global Impact & Role Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${location.pathname === '/' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'}`}
          >
            🌍 Global Impact
          </Link>

          {/* If user is logged in, show their authorized dashboard link */}
          {user && (
            <Link 
              to={`/${user.role}`}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors capitalize"
            >
              📊 {user.role} Dashboard
            </Link>
          )}
        </div>

        {/* Auth Profile / Login Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 pr-3 rounded-full">
              <img 
                src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                alt={user.full_name} 
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user.full_name}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-bold text-xs transition-colors flex items-center gap-1"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login-donor" 
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
              >
                Donor Login
              </Link>
              <Link 
                to="/login-ngo" 
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
              >
                NGO Login
              </Link>
              <Link 
                to="/login-citizen" 
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-600/30 transition-all"
              >
                Citizen Spotter Login
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
