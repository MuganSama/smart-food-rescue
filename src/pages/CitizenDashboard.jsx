import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { dbClient } from '../supabase.js';

/**
 * Citizen Spotter Dashboard Component (Protected Route: '/citizen')
 * 
 * FIRST PRINCIPLES:
 * Accessible ONLY to authenticated users with role === 'citizen'.
 * Empowers local citizens to notify the network of locations where unhoused communities 
 * or individuals urgently need food.
 */
export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [location, setLocation] = useState('');
  const [estPeople, setEstPeople] = useState('35');
  const [urgency, setUrgency] = useState('High');
  const [category, setCategory] = useState('Street Community');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const data = await dbClient.getCitizenReports();
    setMyReports(data);
    setLoading(false);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!location || !estPeople) return;

    setSubmitting(true);
    await dbClient.createCitizenReport({
      reporter_id: user.id,
      reporter_name: user.full_name,
      location,
      est_people: parseInt(estPeople) || 10,
      urgency,
      category,
      description
    });

    setLocation('');
    setDescription('');
    setSubmitting(false);
    loadReports();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-8 border-amber-500">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              📍 Community Citizen Spotter Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {user?.full_name}</h1>
            <p className="text-sm text-slate-600 mt-1">Report hunger spots so local NGOs can dispatch food quickly</p>
          </div>
        </div>

        {/* Report Hunger Spot Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>📢</span> Report a Location Where People Need Food
          </h2>

          <form onSubmit={handleReportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Location / Landmark Address *</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="e.g., 4th Street & Main Avenue Transit Plaza" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white text-sm outline-none transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estimated People in Need *</label>
              <input 
                type="number" 
                value={estPeople} 
                onChange={e => setEstPeople(e.target.value)} 
                placeholder="35" 
                min="1" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white text-sm outline-none transition-all" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Urgency Level *</label>
              <select 
                value={urgency} 
                onChange={e => setUrgency(e.target.value)} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 text-sm outline-none"
              >
                <option value="Emergency">Emergency (Immediate Food Need)</option>
                <option value="High">High (Needed Today)</option>
                <option value="Medium">Medium (Daily / Regular Requirement)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Description & Details</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows="3" 
                placeholder="e.g., Group of 35 unhoused community members near the pavilion. Warm boxed meals or sandwiches needed." 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white text-sm outline-none transition-all" 
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-md shadow-amber-500/30 transition-all"
              >
                {submitting ? "Broadcasting..." : "Broadcast Hunger Spot Alert"}
              </button>
            </div>
          </form>
        </div>

        {/* My Submitted Reports List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📡</span> My Submitted Spotter Alerts
          </h2>

          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading alerts...</div>
          ) : myReports.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">No alerts submitted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myReports.map(report => (
                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${report.urgency === 'Emergency' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {report.urgency} Urgency
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${report.status === 'pending' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      {report.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{report.location}</h3>

                  <div className="text-xs text-emerald-700 font-bold">Est. People: ~{report.est_people}</div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">{report.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
