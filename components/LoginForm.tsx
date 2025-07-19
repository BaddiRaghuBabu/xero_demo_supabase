"use client";

import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import AuthButton from "./AuthButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "@/actions/auth";
import LoginGithub from "./LoginGithub";
import LoginGoogle from "./LoginGoogle";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);
    setLoading(false);

    if (result.status === "success") {
      toast.success("Logged in successfully!");
      router.push("/");
    } else {
      toast.error(result.status || "Login failed");
    }
  };

  return (
<div className="space-y-4 p-6  rounded-lg max-w-md mx-auto ">

  <Card className="w-full max-w-sm shadow-xl p-2 ">
    <CardHeader>
      <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
    </CardHeader>

    <CardContent className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <AuthButton type="login" loading={loading} />

        <div className="flex flex-col items-center gap-1 mt-2">
          <Link
            href="/forgot-password"
            className="text-blue-500 text-xs hover:underline"
          >
            Forgot Password?
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        <LoginGoogle />
        <LoginGithub />
      </div>
    </CardContent>
  </Card>
</div>

  );
};

export default LoginForm;
