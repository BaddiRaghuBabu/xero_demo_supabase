"use client";

import LoginGithub from "./LoginGithub"; // ✅ Make sure path is correct
import React from "react";

export default function LoginPage() {
  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      {/* ✅ Use the LoginGithub component */}
      <LoginGithub />
    </div>
  );
}
