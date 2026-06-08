"use client";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--tdc-bg)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-8 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
