"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { FileUpload, FileUploadTrigger } from "@/components/ui/file-upload";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabaseClient } from "@/lib/supabaseClient";

interface UserProfile {
  email: string;
  name: string;
  google_photo: string;
  user_photo?: string | null;
  photo?: string | null;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadPhotoToCloudinary(file: File) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured in the frontend environment");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message || "Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url as string;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!username.trim()) {
        setAvailable(null);
        return;
      }

      setChecking(true);
      try {
        const res = await fetch(`/api/user/check-username?u=${encodeURIComponent(username)}`);
        const data = await res.json();
        setAvailable(data.available);
      } catch (error) {
        console.error("Error checking username:", error);
        setAvailable(false);
      } finally {
        setChecking(false);
      }
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        window.location.href = "/";
        return;
      }

      const res = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Error fetching profile:", {
          status: res.status,
          ...errorBody,
        });
        throw new Error("Failed to fetch profile");
      }

      const payload = await res.json();
      const profileData = payload?.profile as UserProfile | null;

      if (!profileData) {
        console.warn("No profile data found for user", session.user.id);
        setLoading(false);
        return;
      }

      setProfile(profileData as UserProfile);
      setPreviewUrl(profileData.photo || profileData.user_photo || profileData.google_photo || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setUploadedPhotoUrl("");
      setPreviewUrl((current) => {
        if (current && current.startsWith("blob:")) {
          URL.revokeObjectURL(current);
        }
        return url;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async () => {
    if (!available || !username.trim()) return;

    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        throw new Error("No session found");
      }

      let photoUrl = uploadedPhotoUrl || profile?.user_photo || profile?.google_photo || null;

      if (selectedFiles.length > 0 && selectedFiles[0] && !uploadedPhotoUrl) {
        photoUrl = await uploadPhotoToCloudinary(selectedFiles[0]);
        setUploadedPhotoUrl(photoUrl);
        setPreviewUrl(photoUrl);
      }

      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          username,
          photoUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to complete profile");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error completing profile:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="text-foreground">Loading profile...</div>
      </div>
    );
  }

  const avatarPreview = previewUrl || "https://github.com/shadcn.png";

  return (
    <div className="min-h-[100vh] flex">
      <div className="flex w-1/2 flex-col justify-center items-center glass px-10">
        <div className="relative z-10 max-w-md text-center flex flex-col items-center gap-6 mx-auto">
          <h1 className="text-4xl md:text-5xl tracking-tight text-foreground">
            Complete Profile
          </h1>

          <FileUpload
            value={selectedFiles}
            onValueChange={handleFileChange}
            accept="image/*"
            maxFiles={1}
            maxSize={2 * 1024 * 1024}
          >
            <FileUploadTrigger asChild>
              <button className="group relative cursor-pointer rounded-full">
                <Avatar className="size-40">
                  <AvatarImage src={avatarPreview} alt="Profile" />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="size-6 text-white" />
                </div>
              </button>
            </FileUploadTrigger>
          </FileUpload>

          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={profile?.name || ""}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ""}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition ${
                    available === true
                      ? "border-green-600 bg-green-50 dark:bg-green-950"
                      : available === false
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-card"
                  } text-foreground`}
                />
                {checking && (
                  <span className="absolute right-4 top-3 text-muted-foreground text-sm">
                    Checking...
                  </span>
                )}
                {!checking && available === true && (
                  <span className="absolute right-4 top-3 text-green-600 font-semibold">
                    Available
                  </span>
                )}
                {!checking && available === false && (
                  <span className="absolute right-4 top-3 text-destructive text-sm">
                    Taken
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!available || !username.trim() || submitting}
              className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center px-16">
        <div className="max-w-md">
          <p className="text-5xl text-muted mb-4">"</p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Intellmeet showed up when we were close to giving up. We were stuck,
            exhausted, and nothing was moving. It didn't just fix our stack — it
            gave us a second chance. Everything started working, and so did we.
          </p>
          <div className="flex items-center mt-6 gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full" />
            <span className="text-sm text-muted-foreground">
              @Someone From Future
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}