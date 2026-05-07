"use client";

import type { Metadata } from "next";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return router.push("/");
      }

      await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      router.push("/onboarding");
    };

    run();
  }, [router]);

  return <div>Signing you in...</div>;
}