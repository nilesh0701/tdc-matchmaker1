"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import customersData from "@/data/customers.json";
import StatusBadge from "@/components/StatusBadge";
import TdcLogo from "@/components/TdcLogo";
import { getAge, getAvatarColor, getInitials } from "@/lib/avatarUtils";
import type { Profile } from "@/lib/matchingEngine";

type StatusFilter = "all" | "active" | "on_hold" | "paused";

const FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "On Hold", value: "on_hold" },
  { label: "Paused", value: "paused" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      const matchesSearch =
        !query ||
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query) ||
        customer.country.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [customers, searchQuery, statusFilter]);

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

        {/* Search & filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tdc-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by name or location..."
              className="w-full rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--tdc-text)] transition-colors duration-200 placeholder:text-[var(--tdc-muted)] focus:border-[var(--tdc-rose)] focus:outline-none focus:ring-2 focus:ring-[var(--tdc-rose)]/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  statusFilter === option.value
                    ? "bg-[var(--tdc-text)] text-white shadow-sm"
                    : "border border-[var(--tdc-border)] bg-[var(--tdc-surface)] text-[var(--tdc-muted)] hover:border-gray-300 hover:text-[var(--tdc-text)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--tdc-border)] bg-[var(--tdc-surface)] py-16 text-center">
            <p className="text-sm font-medium text-[var(--tdc-text)]">No clients found</p>
            <p className="mt-1 text-sm text-[var(--tdc-muted)]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-start gap-4 rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
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
        )}
      </main>
    </div>
  );
}
