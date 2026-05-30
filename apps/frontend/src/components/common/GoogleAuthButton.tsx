"use client";

import React from "react";
import { supabaseClient } from "@/lib/supabaseClient";

const GoogleAuthButton = () => {
  const handleLogin = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="relative block bg-primary text-primary-foreground px-8 py-3 rounded-xl text-base font-semibold"
    >
      Get Started
    </button>
  );
};

export default GoogleAuthButton;