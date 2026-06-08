"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import TdcLogo from "@/components/TdcLogo";

interface LoginFormProps {
  compact?: boolean;
  onSuccess?: () => void;
}

export default function LoginForm({ compact = false, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.();
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-md space-y-6"}>
      <div className="flex flex-col items-center text-center">
        <TdcLogo size={compact ? 40 : 48} />
        <h2
          className={`mt-4 font-bold text-[var(--tdc-text)] ${compact ? "text-xl" : "text-2xl"}`}
        >
          The Date Crew
        </h2>
        <p className="mt-1 text-sm text-[var(--tdc-muted)]">Welcome back</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--tdc-text)]">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-[var(--tdc-border)] px-3 py-2.5 text-sm text-[var(--tdc-text)] transition-colors duration-200 focus:border-[var(--tdc-rose)] focus:outline-none focus:ring-2 focus:ring-[var(--tdc-rose)]/20"
            placeholder="matchmaker@tdc.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--tdc-text)]">Password</label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-lg border border-[var(--tdc-border)] px-3 py-2.5 text-sm text-[var(--tdc-text)] transition-colors duration-200 focus:border-[var(--tdc-rose)] focus:outline-none focus:ring-2 focus:ring-[var(--tdc-rose)]/20"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--tdc-rose)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--tdc-rose-dark)] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
