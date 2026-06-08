"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import customersData from "@/data/customers.json";
import StatusBadge from "@/components/StatusBadge";
import { getAge, getAvatarColor, getInitials } from "@/lib/avatarUtils";
import type { Profile } from "@/lib/matchingEngine";

function TdcLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="20" cy="24" r="14" fill="#C2185B" opacity="0.85" />
      <circle cx="28" cy="24" r="14" fill="#C2185B" opacity="0.55" />
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email ?? null);
      }
    });
    return () => unsub();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const customers = customersData as Profile[];
  const activeCount = customers.filter((c) => c.status === "active").length;
  const onHoldCount = customers.filter((c) => c.status === "on_hold").length;
  const pausedCount = customers.filter((c) => c.status === "paused").length;

  return (
    <div className="min-h-screen bg-[var(--tdc-bg)]">
      <header className="border-b border-[var(--tdc-border)] bg-[var(--tdc-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <TdcLogo />
            <span className="text-sm font-semibold text-[var(--tdc-text)]">
              Matchmaker Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="hidden text-sm text-[var(--tdc-muted)] sm:inline">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-[var(--tdc-border)] px-3 py-1.5 text-sm font-medium text-[var(--tdc-text)] transition hover:bg-[var(--tdc-rose-light)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--tdc-text)]">My Clients</h1>
          <p className="mt-1 text-sm text-[var(--tdc-muted)]">
            Select a client to find their best matches
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-4 shadow-sm">
            <p className="text-sm text-[var(--tdc-muted)]">Active clients</p>
            <p className="mt-1 text-2xl font-bold text-green-700">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-4 shadow-sm">
            <p className="text-sm text-[var(--tdc-muted)]">On hold</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{onHoldCount}</p>
          </div>
          <div className="rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-4 shadow-sm">
            <p className="text-sm text-[var(--tdc-muted)]">Paused</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tdc-muted)]">{pausedCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-start gap-4 rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-5 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(customer.firstName)}`}
              >
                {getInitials(customer.firstName, customer.lastName)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-[var(--tdc-text)]">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-sm text-[var(--tdc-muted)]">
                  {getAge(customer.dateOfBirth)} · {customer.city}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={customer.status} />
                  <span className="rounded-full bg-[var(--tdc-rose-light)] px-2.5 py-0.5 text-xs capitalize text-[var(--tdc-rose-dark)]">
                    {customer.maritalStatus.replace("_", " ")}
                  </span>
                </div>

                <Link
                  href={`/customer/${customer.id}`}
                  className="mt-4 inline-flex rounded-lg bg-[var(--tdc-rose)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--tdc-rose-dark)]"
                >
                  Find Matches
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
