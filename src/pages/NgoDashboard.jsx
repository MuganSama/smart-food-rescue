import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { dbClient } from '../supabase.js';

/**
 * NGO Dashboard Component (Protected Route: '/ngo')
 * 
 * FIRST PRINCIPLES:
 * Accessible ONLY to authenticated users with role === 'ngo'.
 * Provides 2 distinct operational feeds:
 * 1. Available Food Surplus Feed: Claim food with digital security PIN pass generation.
 * 2. Citizen Reports Feed: View citizen-reported hunger locations and dispatch direct food rescue.
 */
export const NgoDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [citizenReports, setCitizenReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Claim Modal State
  const [claimingItem, setClaimingItem] = useState(null);
  const [pickupPass, setPickupPass] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [donData, repData] = await Promise.all([
      dbClient.getDonations(),
      dbClient.getCitizenReports()
    ]);
    setDonations(donData);
    setCitizenReports(repData);
    setLoading(false);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimingItem) return;

    const updated = await dbClient.claimDonation(claimingItem.id, user, "Within 1 Hour");
    setPickupPass(updated);
    loadData();
  };

  const handleDispatchReport = async (reportId) => {
    await dbClient.dispatchReport(reportId, user.organization_name || user.full_name);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              🏢 NGO & Shelter Partner Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {user?.full_name}</h1>
            <p className="text-sm text-slate-600 mt-1">{user?.organization_name || "Community Food Bank"} • Claim surplus food & service citizen reports</p>
          </div>
        </div>

        {/* SECTION 1: Available Surplus Food Donations Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>🍲</span> Available Food Surplus Feed
            </h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {donations.filter(d => d.status === 'available').length} Listings Available
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading food feed...</div>
          ) : donations.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">No surplus food currently available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{item.category}</span>
                      <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${item.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                        {item.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{item.title}</h3>
                    
                    <div className="text-xs text-slate-500 mt-1">Donor: <strong className="text-slate-800">{item.donor_name}</strong></div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div>📦 <strong>Quantity:</strong> {item.quantity}</div>
                      <div>📍 <strong>Address:</strong> {item.address}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    {item.status === 'available' ? (
                      <button 
                        onClick={() => { setClaimingItem(item); setPickupPass(null); }} 
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <span>🤝</span> Claim Food Donation
                      </button>
                    ) : (
                      <div className="text-center py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">
                        Claimed by {item.claimed_by_name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Citizen Hunger Spot Reports Feed */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>📍</span> Citizen Spotter Hunger Reports
            </h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {citizenReports.filter(r => r.status === 'pending').length} Pending Alerts
            </span>
          </div>

          {citizenReports.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">No citizen reports submitted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {citizenReports.map(report => (
                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${report.urgency === 'Emergency' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                        🚨 {report.urgency} Urgency
                      </span>
                      <span className="text-xs font-bold text-slate-500 capitalize">{report.status}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg">{report.location}</h3>
                    
                    <div className="text-xs font-bold text-emerald-700">
                      👥 Est. People in Need: <span className="text-slate-900 text-sm font-extrabold">~{report.est_people} individuals</span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border-l-4 border-amber-400">
                      {report.description}
                    </p>
                    
                    <div className="text-[11px] text-slate-400">Reported by: {report.reporter_name}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    {report.status === 'pending' ? (
                      <button 
                        onClick={() => handleDispatchReport(report.id)} 
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <span>🚚</span> Dispatch Rescue Team Here
                      </button>
                    ) : (
                      <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                        ✓ Dispatched by {report.serviced_by}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Claim Modal Popup */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <button 
              onClick={() => setClaimingItem(null)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            {!pickupPass ? (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <h3 className="text-xl font-extrabold text-slate-900">Confirm Claim Request</h3>
                <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1 text-slate-700">
                  <div className="font-bold text-slate-900 text-sm">{claimingItem.title}</div>
                  <div>Donor: {claimingItem.donor_name}</div>
                  <div>Quantity: {claimingItem.quantity}</div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all">
                    Confirm & Generate Digital Pass
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Food Claimed Successfully!</h3>
                <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl space-y-2">
                  <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">Digital Pickup Pass PIN</div>
                  <div className="text-4xl font-mono font-black text-emerald-400 tracking-widest">{pickupPass.pickup_pin}</div>
                  <div className="text-[11px] text-slate-200">Present code upon arrival at {pickupPass.address}</div>
                </div>
                <button onClick={() => setClaimingItem(null)} className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
