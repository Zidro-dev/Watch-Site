"use client";

import { useState } from "react";
import { registerUser } from "../auth/actions";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2560&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-sm text-gray-400 mb-8">Join the ultimate hybrid anime streaming platform.</p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              name="fullName"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary transition"
              placeholder="Eren Yeager"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              name="username"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary transition"
              placeholder="titan_slayer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary transition"
              placeholder="eren@paradis.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-4 py-3 focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 transition flex items-center justify-center disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
