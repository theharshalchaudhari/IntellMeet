"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);

  const checkUsername = async () => {
    setChecking(true);

    const res = await fetch(`/api/user/check-username?u=${username}`);
    const data = await res.json();

    setChecking(false);

    if (!data.available) {
      alert("Username already taken");
    } else {
      alert("Available");
    }
  };

  const handleContinue = async () => {
    // send to backend
    await fetch("/api/user/complete-profile", {
      method: "POST",
      body: JSON.stringify({ username }),
    });

    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h1>Complete Profile</h1>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={checkUsername}>
        {checking ? "Checking..." : "Check"}
      </button>

      <button onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}