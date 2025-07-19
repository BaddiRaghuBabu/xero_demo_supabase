// components/Logout.tsx (client)
"use client";

import { signOut } from "@/actions/auth";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signOut(); // ✅ server-side logout
      toast.success("Successfully logged out"); // ✅ feedback
      router.push("/login"); // ✅ correct redirect
    } catch (error) {
      toast.error("Logout failed"); // ✅ error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-600 text-white text-sm px-4 py-2 rounded-md cursor-pointer">
      <form onSubmit={handleLogout}>
        <button type="submit" disabled={loading}>
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </form>
    </div>
  );
};

export default Logout;
