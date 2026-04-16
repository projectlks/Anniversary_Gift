"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/lock",
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-xl p-8 space-y-5"
      >
        <h1 className="text-3xl font-bold text-rose-700 text-center">Sign In</h1>
        <p className="text-center text-gray-600 text-sm">
          Enter your invited email to receive a magic link.
        </p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-rose-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
    </main>
  );
}
