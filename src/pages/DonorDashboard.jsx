import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { dbClient } from '../supabase.js';

/**
 * Donor Dashboard Component (Protected Route: '/donor')
 * 
 * FIRST PRINCIPLES:
 * Accessible ONLY to authenticated users with role === 'donor'.
 * Allows restaurants and caterers to submit surplus food listings into the system 
 * and manage active handovers with claiming NGOs.
 */
export const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prepared Meals');
  const [quantity, setQuantity] = useState('40 meals');
  const [expiryHours, setExpiryHours] = useState('4');
  const [address, setAddress] = useState(user?.address || '128 Olive Garden Way, Midtown');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    setLoading(true);
    const data = await dbClient.getDonations();
    setDonations(data);
    setLoading(false);
  };

  const handlePostDonation = async (e) => {
    e.preventDefault();
    if (!title || !quantity || !address) return;

    setSubmitting(true);
    const quantityNum = parseInt(quantity) || 20;

    await dbClient.createDonation({
      donor_id: user.id,
      donor_name: user.organization_name || user.full_name,
      title,
      category,
      quantity,
      quantity_num: quantityNum,
      expiry_time: new Date(Date.now() + parseFloat(expiryHours) * 3600 * 1000).toISOString(),
      address,
      notes
    });

    setTitle('');
    setNotes('');
    setSubmitting(false);
    loadDonations();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              🏨 Restaurant Donor Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {user?.full_name}</h1>
            <p className="text-sm text-slate-600 mt-1">{user?.organization_name || "Surplus Food Donor"} • Manage food listings & handovers</p>
          </div>
        </div>

        {/* Post Surplus Food Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>➕</span> Post Surplus Food Item
          </h2>

          <form onSubmit={handlePostDonation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Food Item Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., 50 Trays of Fresh Pasta & Organic Salad Sets" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Category *</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 text-sm outline-none"
              >
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Bakery">Bakery & Pastry</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Packaged Goods">Packaged Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Quantity (Servings / Weight) *</label>
              <input 
                type="text" 
                value={quantity} 
                onChange={e => setQuantity(e.target.value)} 
                placeholder="e.g., 60 meals" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Expiry Time Window *</label>
              <select 
                value={expiryHours} 
                onChange={e => setExpiryHours(e.target.value)} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 text-sm outline-none"
              >
                <option value="2">Expiring in 2 Hours (Urgent)</option>
                <option value="4">Expiring in 4 Hours</option>
                <option value="8">Expiring in 8 Hours</option>
                <option value="12">Expiring Today (12 Hours)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Pickup Address *</label>
              <input 
                type="text" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all" 
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Special Instructions / Packaging Info</label>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                rows="2" 
                placeholder="e.g., Packed hot in insulated thermal bags. Please bring transport boxes." 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all" 
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-all"
              >
                {submitting ? "Publishing..." : "Publish Surplus Food Donation"}
              </button>
            </div>
          </form>
        </div>

        {/* My Listed Donations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📋</span> My Past & Active Food Listings
          </h2>

          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading listings...</div>
          ) : donations.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">No surplus food listings posted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{item.category}</span>
                      <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${item.status === 'available' ? 'bg-emerald-500 text-white' : item.status === 'claimed' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{item.title}</h3>
                    
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div>📦 <strong>Quantity:</strong> {item.quantity}</div>
                      <div>📍 <strong>Address:</strong> {item.address}</div>
                    </div>

                    {item.status === 'claimed' && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-extrabold text-amber-900">🤝 Claimed by: {item.claimed_by_name}</div>
                        <div className="text-amber-800 font-mono font-bold">Pickup Security PIN: {item.pickup_pin || '4921'}</div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                    <span>ID: {item.id}</span>
                    <span>Posted recently</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
