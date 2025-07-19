"use client";

import { signInWithGoogle } from "@/actions/auth";
import React, { useTransition } from "react";
import { FcGoogle } from "react-icons/fc";

const LoginGoogle = () => {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await signInWithGoogle();
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 h-10 mt-6 px-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-150"
    >
      <FcGoogle className="text-2xl" />
      <span className="text-gray-800 font-medium">
        {isPending ? "Redirecting..." : "Login with Google"}
      </span>
    </button>
  );
};

export default LoginGoogle;
