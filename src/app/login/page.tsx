"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
      router.push("/dashboard");
    } catch (err: any) {
      setError("Authentication failed. Please verify management access credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 border border-gray-200 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">The Date Crew</h2>
          <p className="mt-2 text-sm text-gray-500">Internal Matchmaker Administration Platform</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Operator Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="matchmaker@tdc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Access Key</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? "Authorizing Operator System..." : "Authenticate Session"}
          </button>
        </form>

        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Demo Access Profile</span>
          <div className="text-xs text-gray-600 space-y-0.5">
            <div><strong>User:</strong> matchmaker@tdc.com</div>
            <div><strong>Pass:</strong> tdc2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}