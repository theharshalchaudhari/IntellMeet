import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data?.url) {
      return res.status(500).json({ error: "OAuth URL not generated" });
    }

    return res.redirect(data.url);
  } catch (err) {
    console.error("Google Login Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const syncUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || null,
      google_photo: user.user_metadata?.avatar_url || null,
      profile_status: "active",
    });

    await supabase.from("auth_logs").insert({
      user_id: user.id,
      action: "google_login",
      status: "success",
      ip_address: req.ip,
      device: req.headers["user-agent"] || "unknown",
    });

    await supabase.from("sessions").insert({
      user_id: user.id,
      is_active: true,
      ip_address: req.ip,
      device: req.headers["user-agent"] || "unknown",
      created_at: new Date().toISOString(),
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Sync User Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};