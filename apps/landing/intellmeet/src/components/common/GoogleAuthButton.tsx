"use client";

import React, { useEffect, useState } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";

const DASHBOARD_URL = import.meta.env.PUBLIC_DASHBOARD_URL || "http://localhost:5173/dashboard";
const STORAGE_KEY = "intellmeet-auth-token";
const AUTH_BOOT_DELAY_MS = 200;

const hasStoredSessionState = () => {
	if (typeof window === "undefined") {
		return false;
	}

	return (
		document.cookie.includes(STORAGE_KEY) ||
		document.cookie.includes(`${STORAGE_KEY}-chunks`) ||
		localStorage.getItem(STORAGE_KEY) !== null
	);
};

const GoogleAuthButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const client = getSupabaseClient();
    console.log("[Landing Auth] button mount", {
      path: window.location.pathname,
      hasClient: !!client,
      storedSessionState: hasStoredSessionState(),
    });

    if (!client) {
      console.warn("[Landing Auth] Supabase client unavailable in button");
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    const initializeAuth = async () => {
      console.log("[Landing Auth] bootstrapping session check");
      await new Promise((resolve) => setTimeout(resolve, AUTH_BOOT_DELAY_MS));

      const result = await client.auth.getSession();
      const session = result.data.session;
      console.log("[Landing Auth] getSession result", {
        hasSession: !!session,
        userId: session?.user?.id ?? null,
        userEmail: session?.user?.email ?? null,
      });

      if (!session && hasStoredSessionState()) {
        console.log("[Landing Auth] session missing, trying getUser from stored auth state");
        const userResult = await client.auth.getUser();
        const user = userResult.data.user;
        console.log("[Landing Auth] getUser result", {
          hasUser: !!user,
          userId: user?.id ?? null,
          userEmail: user?.email ?? null,
        });

        if (user) {
          const metadata = user.user_metadata;
          const image = metadata?.avatar_url || metadata?.picture || metadata?.image_url || null;
          console.log("[Landing Auth] recovered authenticated user from storage", {
            avatarUrl: typeof image === "string" ? image : null,
          });

          if (mounted) {
            setIsAuthenticated(true);
            setAvatarUrl(typeof image === "string" ? image : null);
            setLoading(false);
          }

          return;
        }
      }

      const metadata = session?.user?.user_metadata;
      const image = metadata?.avatar_url || metadata?.picture || metadata?.image_url || null;

      if (mounted) {
        console.log("[Landing Auth] applying session state to header", {
          isAuthenticated: !!session,
          avatarUrl: typeof image === "string" ? image : null,
        });
        setIsAuthenticated(!!session);
        setAvatarUrl(typeof image === "string" ? image : null);
        setLoading(false);
      }
    };

    initializeAuth().catch(() => {
      console.error("[Landing Auth] initializeAuth failed");
      if (mounted) {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event: unknown, session: unknown) => {
      const currentSession = session as {
        user?: {
          id?: string;
          email?: string;
          user_metadata?: Record<string, unknown>;
        };
      } | null;
      const metadata = currentSession?.user?.user_metadata;
      const image = metadata?.avatar_url || metadata?.picture || metadata?.image_url || null;
      console.log("[Landing Auth] auth state change", {
        hasSession: !!currentSession,
        userId: currentSession?.user?.id ?? null,
        avatarUrl: typeof image === "string" ? image : null,
      });
      setIsAuthenticated(!!currentSession);
      setAvatarUrl(typeof image === "string" ? image : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    const returnTo = `${window.location.origin}/`;
    console.log("[Landing Auth] login clicked", {
      returnTo,
      authUrl: `/api/auth/google?return_to=${encodeURIComponent(returnTo)}`,
    });
    window.location.href = `/api/auth/google?return_to=${encodeURIComponent(returnTo)}`;
  };

  if (loading) {
    return (
      <div className="relative flex items-center gap-3">
        <div className="h-12 w-32 animate-pulse rounded-xl bg-primary/20" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <a
          href={DASHBOARD_URL}
          className="relative block rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground"
        >
          Dashboard
        </a>

        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border bg-muted shadow-sm">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">U</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="relative block rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground"
    >
      Get Started
    </button>
  );
};

export default GoogleAuthButton;