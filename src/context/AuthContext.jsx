import React, { createContext, useContext, useState, useEffect } => React;

/**
 * FIRST-PRINCIPLES REASONING: Authentication & Role-Based Access Control (RBAC)
 * 
 * 1. WHY REACT CONTEXT FOR AUTHENTICATION?
 * Authentication state (active session, user profile, role permissions) is a cross-cutting concern. 
 * If auth state were managed inside individual pages, every route component would have to duplicate 
 * session validation, leading to race conditions and inconsistent UI states. By lifting auth state 
 * into a top-level React Context, we guarantee a single authoritative source of truth across the entire app.
 * 
 * 2. WHY SEPARATE OAUTH AUTHENTICATION FROM ROLE AUTHORIZATION?
 * Third-party OAuth providers (like Google) verify *identity* (who the user is), but they have zero 
 * knowledge of application-specific domain roles (whether this person is a Restaurant Donor, an NGO, 
 * or a Citizen Spotter). Therefore, identity verification must be immediately followed by a role 
 * resolution step that queries or creates the user's domain profile in the database.
 * 
 * 3. WHY INTENT PERSISTENCE BEFORE OAUTH REDIRECTS?
 * During an OAuth handshake (e.g. Google Login), the browser navigates away from the app to Google's 
 * servers and then redirects back. Any transient React component state (like useState) is lost during 
 * page reloads. Hence, the target role intent ('donor', 'ngo', or 'citizen') must be written to 
 * persistent storage (sessionStorage/localStorage) BEFORE initiating the OAuth redirect. Upon return, 
 * the app reads this intent to populate the new database profile accurately.
 */

const AuthContext = createContext(null);

// Preset Demo Profiles for instant 1-click testing & Google OAuth simulation
const PRESET_DEMO_PROFILES = {
  donor: {
    id: "usr-donor-101",
    email: "elena@greenolivebistro.com",
    full_name: "Elena Vance",
    organization_name: "Green Olive Bistro",
    role: "donor",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 345-6789"
  },
  ngo: {
    id: "usr-ngo-102",
    email: "marcus@hopekitchen.org",
    full_name: "Marcus Brody",
    organization_name: "Hope Community Kitchen",
    role: "ngo",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 901-2345"
  },
  citizen: {
    id: "usr-citizen-103",
    email: "sarah.j@citizennet.org",
    full_name: "Sarah Jenkins",
    organization_name: "Citizen Need Spotter",
    role: "citizen",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 123-9876"
  }
};

export const AuthProvider = ({ children }) => {
  // Master Auth State: user profile object containing RLS role and credentials
  const [user, setUser] = useState(() => {
    /* 
     * FIRST PRINCIPLES: Lazy initial state reads localStorage synchronously on mount.
     * This eliminates "flash of unauthenticated UI" (FOUC) when refreshing a protected dashboard.
     */
    const saved = localStorage.getItem('sfr_auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // Sync session changes to localStorage whenever user state updates
  useEffect(() => {
    if (user) {
      localStorage.setItem('sfr_auth_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('sfr_auth_session');
    }
  }, [user]);

  /**
   * Google OAuth Login Trigger
   * 
   * FIRST PRINCIPLES: 
   * 1. Stores the desired entry-point role ('donor' | 'ngo' | 'citizen') into sessionStorage.
   * 2. In a live environment with Supabase, calls supabase.auth.signInWithOAuth({ provider: 'google' }).
   * 3. For instant responsive demo execution, completes login with a structured profile matching the role.
   */
  const loginWithGoogle = async (targetRole) => {
    setLoading(true);
    
    // Store intent in case of full page redirect
    sessionStorage.setItem('sfr_oauth_target_role', targetRole);

    try {
      // Simulate real OAuth network handshake latency (600ms)
      await new Promise(resolve => setTimeout(resolve, 600));

      // Construct authenticated profile with captured role
      const demoTemplate = PRESET_DEMO_PROFILES[targetRole] || PRESET_DEMO_PROFILES.donor;
      const authenticatedUser = {
        ...demoTemplate,
        role: targetRole,
        lastLogin: new Date().toISOString()
      };

      setUser(authenticatedUser);
      setLoading(false);
      return authenticatedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  /**
   * Logout Handler
   * 
   * FIRST PRINCIPLES: 
   * Clearing user state resets the React tree context, triggering automatic re-evaluation of 
   * ProtectedRoute guards. This safely bounces the user out of protected views back to public routes.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sfr_auth_session');
    sessionStorage.removeItem('sfr_oauth_target_role');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
