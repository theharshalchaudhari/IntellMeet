import express, { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/middleware/auth.middleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getGoogleProfileData = async (token: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  const identityData = user?.identities?.[0]?.identity_data || {};

  return {
    user,
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
  }
}

router.get("/check-username", async (req: Request, res: Response) => {
  try {
    const username = req.query.u as string;

    if (!username || username.length < 3) {
      return res.json({ available: false });
    }

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.toLowerCase())
      .single();

    res.json({ available: !data });
  } catch {
    res.json({ available: false });
  }
});

router.get(
  "/me",
  (req: AuthRequest, res: Response, next: NextFunction) => auth(req, res, next),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const token = req.headers.authorization?.split(" ")[1];

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("email, name, google_photo, username, user_photo, profile_status")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message, code: error.code });
      }

      if (data && !data.google_photo && token) {
        const { user, googlePhoto, name } = await getGoogleProfileData(token);

        if (user && googlePhoto) {
          const { error: backfillError } = await supabase
            .from("profiles")
            .update({
              google_photo: googlePhoto,
              name: data.name || name,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (!backfillError) {
            data.google_photo = googlePhoto;
            data.name = data.name || name;
          }
        }
      }

      return res.json({
        profile: {
          ...data,
          photo: data?.user_photo || data?.google_photo || null,
        },
      });
    } catch (err) {
      console.error("Get profile error:", err);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

router.post(
  "/complete-profile",
  (req: AuthRequest, res: Response, next: NextFunction) => auth(req, res, next),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { username, photoUrl } = req.body;

      if (!userId || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.toLowerCase(),
          user_photo: typeof photoUrl === "string" && photoUrl.trim() ? photoUrl.trim() : null,
          profile_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      res.json({ ok: true });
    } catch (err) {
      console.error("Complete profile error:", err);
      res.status(500).json({ error: "Failed to complete profile" });
    }
  }
);

export default router;