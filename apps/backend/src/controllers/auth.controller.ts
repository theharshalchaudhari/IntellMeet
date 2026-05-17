import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getGoogleProfileData = (user: any) => {
  const identityData = user?.identities?.[0]?.identity_data || {};

  return {
    name:
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      identityData.full_name ||
      identityData.name ||
      null,
    googlePhoto:
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      user?.user_metadata?.picture_url ||
      identityData.avatar_url ||
      identityData.picture ||
      identityData.picture_url ||
      null,
  };
};

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

    const googleProfileData = getGoogleProfileData(user);

    const upsertData = {
      id: user.id,
      email: user.email,
      name: googleProfileData.name,
      google_photo: googleProfileData.googlePhoto,
      profile_status: "pending",
    };

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert([upsertData], { onConflict: "id" });

    if (upsertError) {
      console.error("Profile upsert error:", upsertError);
      return res.status(500).json({ error: "Failed to sync user profile" });
    }

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