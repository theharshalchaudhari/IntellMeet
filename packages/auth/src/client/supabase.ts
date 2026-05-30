import { createClient } from "@supabase/supabase-js";

const isBrowser = typeof window !== 'undefined';

// Use a unified storage key across all applications
const STORAGE_KEY = 'intellmeet-auth-token';

// Heuristic to get env vars across Vite and Next.js
// Bundlers need the full string literal to perform static replacement.
const supabaseUrl = 
  (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined) || 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined);

const supabaseAnonKey = 
  (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : undefined) || 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined);

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error("Supabase environment variables are missing!", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    });
  }
}

const CHUNK_SIZE = 3000;

const cookieStorage = {
  getItem: (key: string) => {
    if (!isBrowser) return null;
    const cookies = document.cookie.split(';').map(c => c.trim());

    // First check if it's a chunked cookie
    const chunkCountMatch = cookies.find(row => row.startsWith(`${key}-chunks=`));
    if (chunkCountMatch) {
      const countStr = chunkCountMatch.split('=')[1];
      const count = countStr ? parseInt(countStr, 10) : 0;
      if (count === 0) return localStorage.getItem(key);
      let combinedValue = '';
      for (let i = 0; i < count; i++) {
        const chunkMatch = cookies.find(row => row.startsWith(`${key}.${i}=`));
        if (chunkMatch) {
          const parts = chunkMatch.split('=');
          parts.shift();
          combinedValue += parts.join('=');
        }
      }
      if (combinedValue) {
        try {
          const decoded = decodeURIComponent(combinedValue);
          if (key === STORAGE_KEY) {
            console.log(`[AuthStorage] Found chunked cookie for ${key}. Total length: ${decoded.length}`);
          }
          return decoded;
        } catch (e) {
          console.error('[AuthStorage] Error decoding chunked cookie:', e);
        }
      }
    }
    
    // Fallback to non-chunked cookie check
    const matches = cookies.filter(row => row.startsWith(`${key}=`));
    
    if (matches.length > 0) {
      for (const row of matches) {
        const parts = row.split('=');
        parts.shift();
        const value = parts.join('=');
        
        if (value && value !== 'undefined' && value !== 'null') {
          try {
            const decoded = decodeURIComponent(value);
            if (key === STORAGE_KEY) {
              console.log(`[AuthStorage] Found standard cookie for ${key}. Length: ${decoded.length}`);
            }
            return decoded;
          } catch (e) {
            console.error('[AuthStorage] Error decoding cookie:', e);
          }
        }
      }
    }

    // Fallback to localStorage (critical for cross-port localhost scenarios)
    const localVal = localStorage.getItem(key);
    if (localVal && key === STORAGE_KEY) {
      console.log(`[AuthStorage] Found in localStorage for ${key} (cross-port recovery). Length: ${localVal.length}`);
    }
    return localVal;
  },
  setItem: (key: string, value: string) => {
    if (!isBrowser) return;
    
    if (key === STORAGE_KEY) {
      console.log(`[AuthStorage] Setting ${key}. Value length: ${value.length}`);
    }

    // Always save to localStorage as a fallback for cross-port scenarios on localhost
    localStorage.setItem(key, value);
    
    const encoded = encodeURIComponent(value);
    
    // Clear any previous state
    cookieStorage.removeItem(key);

    if (encoded.length > CHUNK_SIZE) {
      // Chunking logic
      const count = Math.ceil(encoded.length / CHUNK_SIZE);
      console.log(`[AuthStorage] Value is too large (${encoded.length} bytes), splitting into ${count} chunks.`);
      
      for (let i = 0; i < count; i++) {
        const start = i * CHUNK_SIZE;
        const chunk = encoded.substring(start, start + CHUNK_SIZE);
        document.cookie = `${key}.${i}=${chunk}; path=/; max-age=31104000; SameSite=Lax`;
      }
      document.cookie = `${key}-chunks=${count}; path=/; max-age=31104000; SameSite=Lax`;
    } else {
      // Standard set
      document.cookie = `${key}=${encoded}; path=/; max-age=31104000; SameSite=Lax`;
    }
    
    if (key === STORAGE_KEY) {
      const getSuccess = cookieStorage.getItem(key);
      if (!getSuccess) {
        console.error(`[AuthStorage] FAILED to verify storage for ${key}.`);
      } else {
        console.log(`[AuthStorage] Successfully stored ${key}`);
      }
    }
  },
  removeItem: (key: string) => {
    if (!isBrowser) return;
    
    if (key === STORAGE_KEY) {
      console.log(`[AuthStorage] Removing cookie for ${key}`);
    }

    localStorage.removeItem(key);

    const cookies = document.cookie.split(';');
    
    // Remove standard cookie
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
    
    // Check for and remove chunks
    const chunkCountMatch = cookies.find(row => row.trim().startsWith(`${key}-chunks=`));
    if (chunkCountMatch) {
      const countStr = chunkCountMatch.split('=')[1];
      const count = countStr ? parseInt(countStr, 10) : 0;
      for (let i = 0; i < count; i++) {
        document.cookie = `${key}.${i}=; path=/; max-age=0; SameSite=Lax`;
      }
      document.cookie = `${key}-chunks=; path=/; max-age=0; SameSite=Lax`;
    }

    // Defensive: also clear any possible stray chunks (in case count was lost)
    for (let i = 0; i < 10; i++) {
        document.cookie = `${key}.${i}=; path=/; max-age=0; SameSite=Lax`;
    }
  },
};


export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      storage: isBrowser ? cookieStorage : undefined,
      storageKey: STORAGE_KEY,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);