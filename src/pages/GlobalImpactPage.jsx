import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Universal Global Impact Page (Public Root Route '/')
 * 
 * FIRST PRINCIPLES:
 * This page serves as the public landing page accessible to unauthenticated users, donors, NGOs, 
 * and citizens alike. It provides transparent community metrics and guides incoming users to their 
 * respective role-specific OAuth entry points.
 */
export const GlobalImpactPage = () => {
  const impactStats = [
    { label: "Total Meals Rescued", value: "14,850+", icon: "🍲", color: "from-emerald-500 to-green-600", desc: "Nutritious meals saved from landfills" },
    { label: "Active Receiving NGOs", value: "48 Shelters", icon: "🏢", color: "from-teal-500 to-emerald-700", desc: "Verified community food distribution centers" },
    { label: "Pending Citizen Alerts", value: "12 Locations", icon: "📍", color: "from-amber-500 to-orange-600", desc: "Reported hunger spots needing immediate dispatch" },
    { label: "CO2 Emissions Prevented", value: "18,560 kg", icon: "🌱", color: "from-blue-500 to-indigo-600", desc: "Environmental greenhouse gas offset" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span>🛡️</span> Multi-Role Community Food Rescue Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Zero Food Waste. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Zero Local Hunger.
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-normal">
            Connecting restaurants with surplus meals, shelters needing food, and citizen spotters 
            who report where communities need urgent hunger relief.
          </p>

          {/* Quick Login Entry Points */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link 
              to="/login-donor" 
              className="p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-left transition-all hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-2">🏨</div>
              <div className="font-bold text-white text-base group-hover:text-emerald-300">I am a Donor</div>
              <div className="text-xs text-slate-300 mt-1">Restaurants, bakeries & caterers with surplus food.</div>
            </Link>

            <Link 
              to="/login-ngo" 
              className="p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-left transition-all hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-2">🏢</div>
              <div className="font-bold text-white text-base group-hover:text-emerald-300">I am an NGO</div>
              <div className="text-xs text-slate-300 mt-1">Shelters & food banks looking to claim food.</div>
            </Link>

            <Link 
              to="/login-citizen" 
              className="p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-left transition-all hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-2">📍</div>
              <div className="font-bold text-white text-base group-hover:text-emerald-300">I am a Spotter</div>
              <div className="text-xs text-slate-300 mt-1">Report locations where people need food.</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Impact Stat Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`}></span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm font-bold text-slate-700 mt-1">{stat.label}</div>
              </div>
              <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">How Smart Food Rescue Works</h2>
          <p className="text-slate-600 mt-2">A 3-way interconnected pipeline built for rapid food redistribution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center">1</div>
            <h3 className="text-xl font-bold text-slate-900">1. Post Surplus Food</h3>
            <p className="text-slate-600 text-sm">Restaurants list unserved fresh meals with pickup address, expiry hours, and dietary flags.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-extrabold text-xl flex items-center justify-center">2</div>
            <h3 className="text-xl font-bold text-slate-900">2. Claim with Security PIN</h3>
            <p className="text-slate-600 text-sm">NGOs claim available donations, generating a digital pickup pass with a 4-digit verification code.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xl flex items-center justify-center">3</div>
            <h3 className="text-xl font-bold text-slate-900">3. Citizen Spotter Alerts</h3>
            <p className="text-slate-600 text-sm">Spotters notify the network of street communities in need, prompting direct food dispatch.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
