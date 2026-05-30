import { create } from 'zustand';
import { supabase } from '@repo/auth/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: { 
    id: string; 
    name: string; 
    email: string; 
    role: string;
    avatarUrl?: string | null;
  } | null;
  loading: boolean;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  setUser: (user) => {
    if (user) {
      const userData = {
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email!,
        role: user.user_metadata?.role || 'account',
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      };
      
      console.log('Setting user in store:', userData);

      set({
        isAuthenticated: true,
        user: userData,
        loading: false,
      });
    } else {
      set({ isAuthenticated: false, user: null, loading: false }); 
    }
  },
  logout: async () => {
    console.log('Logging out and clearing session...');
    await supabase.auth.signOut();
    
    // Clear the specific shared cookie as well
    document.cookie = `intellmeet-auth-token=; path=/; max-age=0; SameSite=Lax`;
    
    set({ isAuthenticated: false, user: null, loading: false });
    window.location.href = 'http://localhost:3000';
  },
  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        useAuthStore.getState().setUser(session.user);
      } else {
        // Log cookies for debugging if session is missing
        console.warn('No session found. Available cookies:', document.cookie.split(';').map(c => c.trim().split('=')[0]));
        set({ isAuthenticated: false, user: null, loading: false });
      }
    } catch (error) {
      console.error('Session check error:', error);
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
}));

// Initialize session check and auth listener
const initAuth = async () => {
  if (typeof window !== 'undefined') {
    console.log('INIT_AUTH: Origin:', window.location.origin);
    console.log('INIT_AUTH: All cookies length:', document.cookie.length);
  }
  
  // Cleanup potentially problematic domain=localhost cookies from previous versions
  // These can block the port-agnostic cookies we need.
  if (typeof window !== 'undefined') {
    const badCookie = `intellmeet-auth-token=; path=/; max-age=0; SameSite=Lax; domain=localhost`;
    document.cookie = badCookie;
  }

  // Give browser a moment to process cookies from crossover
  await new Promise(r => setTimeout(r, 600));

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      console.log('INIT_AUTH: Success!', session.user.email);
      useAuthStore.getState().setUser(session.user);
    } else {
      console.warn('INIT_AUTH: No session found. Checking cookies manually...');
      
      // Log all cookies found on this port
      const allCookies = document.cookie.split(';').map(c => c.trim().split('=')[0]);
      console.log('Available cookies names:', allCookies);

      const hasCookie = document.cookie.includes('intellmeet-auth-token');
      const hasChunks = document.cookie.includes('intellmeet-auth-token-chunks');
      const hasLocalStorage = localStorage.getItem('intellmeet-auth-token') !== null;
      
      console.log('Manual intellmeet-auth-token check:', (hasCookie || hasChunks) ? 'Found in cookies' : hasLocalStorage ? 'Found in localStorage (cross-port)' : 'Not Found');
      
      if ((hasCookie || hasChunks || hasLocalStorage) && !session) {
        console.log('Token exists but session missing, attempting recovery...');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) useAuthStore.getState().setUser(user);
      }
      
      if (!hasCookie && !hasChunks && !hasLocalStorage && !session) {
        useAuthStore.getState().setUser(null);
      }
    }
  } catch (error) {
    console.error('INIT_AUTH: Critical failure', error);
    useAuthStore.getState().setUser(null);
  }

  supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('AUTH_EVENT:', event, session?.user?.email || 'no-user');
    
    if (session?.user) {
      useAuthStore.getState().setUser(session.user);
      
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        try {
          await fetch(`${apiUrl}/auth/sync`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (err) {
          console.error('INIT_AUTH: Sync failed', err);
        }
      }
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.getState().setUser(null);
    }
  });
};

initAuth();
