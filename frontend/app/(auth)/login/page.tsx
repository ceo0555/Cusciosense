"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back 👋
        </h1>
        <p className="text-sm text-slate-500">
          Enter your school email or phone to access SchoolOS.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="principal@school.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password / OTP
            </label>
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
