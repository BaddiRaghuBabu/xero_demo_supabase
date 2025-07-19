'use client';

import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    setLoading(false);

    if (result.status === "success") {
      toast.success("Account created successfully!");
      router.push("/login");
    } else {
      toast.error(result.status);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg max-w-md mx-auto mt-10">
        <Toaster position="bottom-right" richColors />
        <h2 className="text-2xl font-bold">Create Account</h2>
        <input name="username" type="text" placeholder="Username" required className="w-full p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" required className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" required className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </>
  );
};

export default SignUpForm;
