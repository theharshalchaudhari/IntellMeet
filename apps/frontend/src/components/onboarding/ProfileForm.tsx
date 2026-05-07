"use client";

import { useState } from "react";
import { Avatar } from "../ui/avatar";
import FileUpload from "@/components/file-upload-special-1";

export default function ProfileForm() {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  const checkUsername = async () => {
    if (!username) return;

    setChecking(true);

    const res = await fetch(`/api/user/check-username?u=${username}`);
    const data = await res.json();

    setChecking(false);
    setAvailable(data.available);
  };

  const handleContinue = async () => {
    if (!available) return;

    await fetch("/api/user/complete-profile", {
      method: "POST",
      body: JSON.stringify({ username }),
    });

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-[100vh] flex">
      <div className="flex w-1/2 flex-col justify-center items-center glass px-10">
        <div className="relative z-10 max-w-8xl text-center flex flex-col -mt-40 items-center gap-6 mx-auto">

          <h1 className="text-4xl md:text-5xl tracking-tight text-foreground">
            Complete Profile
          </h1>

          <div className="flex flex-col items-center mb-6">
          <div className="flex flex-col items-center mb-6">
        <div className="w-40 h-40">
          <FileUpload />
        </div>
  <button className="mt-4 bg-black text-white px-5 py-2 rounded-full text-sm">
    Upload Profile
  </button>
</div>
          </div>

          <p className="text-green-600 text-sm mb-2">
            {available === true && "Username Available"}
          </p>

          <div className="relative">
            <input
              className={`w-full px-5 py-3 rounded-full border outline-none transition
                ${
                  available === true
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setAvailable(null);
              }}
            />

            {available && (
              <span className="absolute right-4 top-3 text-green-600">
                ✓
              </span>
            )}
          </div>

          <button
            onClick={checkUsername}
            className="mt-4 text-sm text-gray-600 underline"
          >
            {checking ? "Checking..." : "Check availability"}
          </button>

          <button
            onClick={handleContinue}
            disabled={!available}
            className="mt-8 w-full bg-black text-white py-4 rounded-full text-lg disabled:opacity-40"
          >
            Save Details
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex items-center justify-center px-16">
        <div className="max-w-md text-gray-700">
          <p className="text-5xl text-gray-300 mb-4">“</p>

          <p className="text-lg leading-relaxed">
            Intellmeet showed up when we were close to giving up. We were stuck,
            exhausted, and nothing was moving. It didn’t just fix our stack — it
            gave us a second chance. Everything started working, and so did we.
          </p>

          <div className="flex items-center mt-6 gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-600">
              @Someone From Future
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}