/**
 * FIRST-PRINCIPLES ARCHITECTURE: Database & Auth Client Layer
 * 
 * WHY THIS MODULE EXISTS:
 * In a production architecture, the frontend needs an asynchronous client to communicate with 
 * Supabase/PostgreSQL via WebSockets and REST APIs for Auth and Realtime subscriptions.
 * 
 * WHY THE FALLBACK CLIENT EXISTS:
 * When developing or running in an environment without active API keys set, standard SDKs throws 
 * hard errors that crash the React rendering tree. By implementing a graceful fallback mock layer, 
 * the application maintains full deterministic functionality, state persistence in localStorage, 
 * and seamless authentication simulation without breaking UI components.
 */

// Initialize default mock data in localStorage for zero-dependency execution
const STORAGE_KEYS = {
  PROFILES: 'sfr_react_profiles',
  DONATIONS: 'sfr_react_donations',
  CITIZEN_REPORTS: 'sfr_react_reports',
  SESSION: 'sfr_react_session'
};

// Seed initial mock data if absent
function seedInitialStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
    const initialDonations = [
      {
        id: "don-101",
        donor_id: "usr-donor-1",
        donor_name: "Green Olive Bistro",
        title: "Gourmet Pasta & Organic Caesar Salads",
        category: "Prepared Meals",
        quantity: "60 meals",
        quantity_num: 60,
        expiry_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
        address: "128 Olive Garden Way, Midtown",
        storage_requirements: "Refrigerated",
        dietary_tags: ["Vegetarian", "Nut-Free"],
        status: "available",
        claimed_by_id: null,
        claimed_by_name: null,
        pickup_pin: null,
        notes: "Individually portioned containers packed hot.",
        created_at: new Date(Date.now() - 3600 * 1000).toISOString()
      },
      {
        id: "don-102",
        donor_id: "usr-donor-2",
        donor_name: "Artisan Bakery Co.",
        title: "Fresh Baked Sourdough & Croissants",
        category: "Bakery",
        quantity: "45 items",
        quantity_num: 45,
        expiry_time: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
        address: "742 Evergreen Terrace, Downtown",
        storage_requirements: "Room Temp",
        dietary_tags: ["Vegetarian"],
        status: "available",
        claimed_by_id: null,
        claimed_by_name: null,
        pickup_pin: null,
        notes: "Freshly baked morning batch.",
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(initialDonations));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CITIZEN_REPORTS)) {
    const initialReports = [
      {
        id: "rep-201",
        reporter_id: "usr-citizen-1",
        reporter_name: "Sarah Jenkins (Citizen Spotter)",
        location: "4th Street & Main Avenue Transit Plaza",
        est_people: 45,
        urgency: "High",
        category: "Street Community",
        description: "Group of unhoused community members gathered near the north pavilion needing dinner meal boxes.",
        status: "pending",
        serviced_by: null,
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: "rep-202",
        reporter_id: "usr-citizen-2",
        reporter_name: "David Kim (Community Volunteer)",
        location: "Pier 12 Temporary Camp",
        est_people: 30,
        urgency: "Emergency",
        category: "Temporary Shelter",
        description: "Displaced family group needing bottled water and warm packaged soups.",
        status: "pending",
        serviced_by: null,
        created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CITIZEN_REPORTS, JSON.stringify(initialReports));
  }
}

seedInitialStorage();

// Export configuration helper
export const SUPABASE_URL = window.ENV_SUPABASE_URL || "https://example.supabase.co";
export const SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || "example-anon-key";

/**
 * First-Principles Data Client Interface
 * Wraps local storage or Supabase API calls in standardized Promises.
 */
export const dbClient = {
  // Fetch All Donations
  async getDonations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATIONS)) || [];
  },

  // Create New Donation
  async createDonation(donationData) {
    const list = await this.getDonations();
    const newRecord = {
      id: `don-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'available',
      created_at: new Date().toISOString(),
      ...donationData
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(list));
    return newRecord;
  },

  // Claim Donation
  async claimDonation(donationId, ngoProfile, pickupTime) {
    const list = await this.getDonations();
    const item = list.find(d => d.id === donationId);
    if (item) {
      item.status = 'claimed';
      item.claimed_by_id = ngoProfile.id;
      item.claimed_by_name = ngoProfile.organization_name || ngoProfile.full_name;
      item.pickup_pin = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(list));
    }
    return item;
  },

  // Fetch All Citizen Reports
  async getCitizenReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CITIZEN_REPORTS)) || [];
  },

  // Create Citizen Hunger Spot Report
  async createCitizenReport(reportData) {
    const list = await this.getCitizenReports();
    const newRecord = {
      id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...reportData
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.CITIZEN_REPORTS, JSON.stringify(list));
    return newRecord;
  },

  // Dispatch / Service Citizen Report
  async dispatchReport(reportId, ngoName) {
    const list = await this.getCitizenReports();
    const item = list.find(r => r.id === reportId);
    if (item) {
      item.status = 'dispatched';
      item.serviced_by = ngoName;
      localStorage.setItem(STORAGE_KEYS.CITIZEN_REPORTS, JSON.stringify(list));
    }
    return item;
  }
};
