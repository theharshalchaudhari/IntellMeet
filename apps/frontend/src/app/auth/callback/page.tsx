"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      console.log("CallbackPage: Checking session...");
      
      // Wait a moment for Supabase to process URL parameters (code exchange)
      await new Promise(r => setTimeout(r, 800));

      const { data: { session }, error } = await supabaseClient.auth.getSession();
      
      console.log("CallbackPage: getSession result", { 
        hasSession: !!session, 
        error: error?.message,
        url: window.location.href 
      });

      if (!session) {
        // One last try: if there's a code in the URL, maybe it just hasn't processed?
        // But getSession should have waited.
        console.error("Auth failed: No session after timeout");
        return router.replace("/?auth=failed");
      }

      const syncRes = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Quick check if user already has a completed profile
      try {
        const userRes = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const userData = await userRes.json();
        
        if (userData?.profile?.profile_status === 'active') {
          console.log("Profile active, performing hard redirect to dashboard");
          window.location.href = "http://localhost:5173/dashboard";
          return;
        }
      } catch (e) {
        console.error("Profile check failed", e);
      }

      router.replace("/onboarding");
    };

    run();
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-5 rounded-2xl border border-border/40 bg-background/70 px-10 py-8 shadow-2xl backdrop-blur-xl">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full border border-red-500/20" />

          <div className="absolute h-14 w-14 animate-spin rounded-full border-2 border-transparent border-t-red-500 border-r-red-400" />

          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
        </div>

        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Signing you in...
          </h1>

          <p className="text-sm text-muted-foreground">
            Syncing your session securely
          </p>
        </div>
      </div>
    </div>
  );
}