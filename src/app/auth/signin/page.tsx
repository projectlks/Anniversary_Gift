"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { HeartIcon, SparklesIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    void signIn("google", { callbackUrl: "/" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/auth/redirect",
    });

    setLoading(false);
    if (result?.error) {
      setError("Unable to send magic link. Please check your email invite.");
      return;
    }

    setMessage(
      process.env.NODE_ENV === "production"
        ? "Magic link sent. Please check your email inbox."
        : "Magic link created. Check your email or the dev terminal logs.",
    );
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 md:px-8 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl bg-white/85 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 space-y-5 md:space-y-7 transition-all">
        <div className="space-y-1.5 md:space-y-2 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-rose-500 tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-600/90 text-sm md:text-base font-medium">
            Enter your invited email to unlock your memories.
          </p>
        </div>

        <div className="space-y-3.5 md:space-y-4">
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-400" />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-rose-200/80 bg-white/70 rounded-xl pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {message && (
            <div className="bg-green-50 text-green-700 border border-green-200 text-xs md:text-sm rounded-lg p-3 text-center transition-all animate-in fade-in slide-in-from-top-2">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-xs md:text-sm rounded-lg p-3 text-center transition-all animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full group bg-linear-to-r from-rose-400 cursor-pointer to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white py-3 md:py-3.5 text-sm md:text-base rounded-xl font-semibold shadow-lg shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
          {loading ? (
            <SparklesIcon className="animate-spin h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <HeartIcon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
          )}
          {loading ? "Sending Magic..." : "Send Magic Link"}
        </button>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">
          <span className="h-px flex-1 bg-rose-100" />
          <span>or</span>
          <span className="h-px flex-1 bg-rose-100" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-black px-4 py-3 md:py-3.5 rounded-xl shadow-md border border-gray-200 flex items-center justify-center gap-2 text-sm md:text-base font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all">
          <Image
            src="/google-logo.svg"
            alt="Google"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          Sign in with Google
        </button>

        {/* 🌟 [ဒီနေရာလေးမှာ အသစ်ထည့်ပါ] Privacy Policy Link */}
        <p className="text-center text-xs text-gray-500/80 pt-4">
          By signing in, you agree to our{" "}
          <Link
            href="/privacy"
            className="underline hover:text-rose-500 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </main>
  );
}
