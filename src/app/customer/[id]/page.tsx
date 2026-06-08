"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { findMatches, Profile, MatchResult } from "@/lib/matchingEngine";
import NotesEditor from "@/components/NotesEditor";
import CompatibilityBar from "@/components/CompatibilityBar";
import WeightingMatrix from "@/components/WeightingMatrix";
import {
  getAge,
  getAvatarColor,
  getInitials,
  formatIncome,
} from "@/lib/avatarUtils";

import customersData from "@/data/customers.json";
import poolData from "@/data/pool.json";

const MALE_DIMENSION_MAX: Record<string, number> = {
  age: 20,
  income: 15,
  height: 10,
  kids: 20,
  religion: 10,
  diet: 10,
  language: 15,
};

const FEMALE_DIMENSION_MAX: Record<string, number> = {
  age: 15,
  relocation: 20,
  familyType: 15,
  kids: 15,
  income: 10,
  religion: 10,
  language: 15,
};

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[var(--tdc-border)]/50 py-2 last:border-0">
      <span className="text-sm text-[var(--tdc-muted)]">{label}</span>
      <span className="text-right text-sm font-medium capitalize text-[var(--tdc-text)]">
        {value}
      </span>
    </div>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const customer = (customersData as Profile[]).find((c) => c.id === id);
  const pool = poolData as Profile[];

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [notes, setNotes] = useState("");
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [aiIntros, setAiIntros] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!customer) return;

    setMatches(findMatches(customer, pool));

    const loadNotes = async () => {
      try {
        const notesRef = doc(db, "notes", customer.id);
        const snapshot = await getDoc(notesRef);
        if (snapshot.exists()) {
          setNotes(snapshot.data().text || "");
        } else {
          setNotes(customer.notes || "");
        }
      } catch {
        setNotes(customer.notes || "");
      } finally {
        setNotesLoaded(true);
      }
    };
    loadNotes();
  }, [customer, pool]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (!customer) {
    return (
      <div className="p-8 text-center text-sm text-[var(--tdc-muted)]">
        Client not found.
      </div>
    );
  }

  const dimensionMax =
    customer.gender === "male" ? MALE_DIMENSION_MAX : FEMALE_DIMENSION_MAX;

  const generateAiNote = async (match: MatchResult) => {
    setLoadingAi((prev) => ({ ...prev, [match.profile.id]: true }));
    try {
      const res = await fetch("/api/generate-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          match: match.profile,
          score: match.score,
        }),
      });
      const data = await res.json();
      setAiIntros((prev) => ({
        ...prev,
        [match.profile.id]: data.intro || data.error,
      }));
    } catch {
      setAiIntros((prev) => ({
        ...prev,
        [match.profile.id]: "Could not generate a note right now. Please try again.",
      }));
    } finally {
      setLoadingAi((prev) => ({ ...prev, [match.profile.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tdc-bg)]">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-[var(--tdc-text)] px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[var(--tdc-rose)] hover:text-[var(--tdc-rose-dark)]"
        >
          ← All clients
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left panel — Profile */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tdc-muted)]">
                Profile
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tdc-rose)] text-lg font-semibold text-white">
                  {getInitials(customer.firstName, customer.lastName)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--tdc-text)]">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="text-sm capitalize text-[var(--tdc-muted)]">
                    {customer.designation} @ {customer.company}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <ProfileField label="Gender" value={customer.gender} />
                <ProfileField label="Date of Birth" value={customer.dateOfBirth} />
                <ProfileField label="Age" value={getAge(customer.dateOfBirth)} />
                <ProfileField label="City" value={customer.city} />
                <ProfileField label="Country" value={customer.country} />
                <ProfileField label="Height" value={`${customer.heightCm} cm`} />
                <ProfileField label="Income" value={`${formatIncome(customer.income)}/yr`} />
                <ProfileField
                  label="Education"
                  value={`${customer.degree} (${customer.college})`}
                />
                <ProfileField
                  label="Religion"
                  value={`${customer.religion} · ${customer.caste}`}
                />
                <ProfileField label="Mother Tongue" value={customer.motherTongue} />
                <ProfileField label="Languages" value={customer.languages.join(", ")} />
                <ProfileField label="Diet" value={customer.diet.replace("_", " ")} />
                <ProfileField label="Family Type" value={customer.familyType} />
                <ProfileField
                  label="Manglik Status"
                  value={customer.manglik ? "Yes" : "No"}
                />
                <ProfileField label="Siblings" value={customer.siblings} />
                <ProfileField label="Want Kids" value={customer.wantKids} />
                <ProfileField label="Open to Relocate" value={customer.openToRelocate} />
                <ProfileField label="Open to Pets" value={customer.openToPets} />
                <ProfileField label="Email" value={customer.email} />
                <ProfileField label="Phone" value={customer.phone} />
                <ProfileField
                  label="Marital Status"
                  value={customer.maritalStatus.replace("_", " ")}
                />
              </div>
            </div>

            {notesLoaded && (
              <NotesEditor
                customerId={customer.id}
                initialValue={notes}
                onSaved={() => triggerToast("Notes saved ✓")}
              />
            )}
          </div>

          {/* Right panel — Matches */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-[var(--tdc-text)]">
              Top matches for {customer.firstName}
            </h3>

            <div className="mt-4 space-y-4">
              {matches.map((match) => (
                <div
                  key={match.profile.id}
                  className="rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(match.profile.firstName)}`}
                      >
                        {getInitials(match.profile.firstName, match.profile.lastName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--tdc-text)]">
                          {match.profile.firstName} {match.profile.lastName}
                          <span className="font-normal text-[var(--tdc-muted)]">
                            {" "}
                            · {getAge(match.profile.dateOfBirth)}
                          </span>
                        </h4>
                        <p className="text-sm text-[var(--tdc-muted)]">
                          {match.profile.city}
                        </p>
                        <p className="text-sm capitalize text-[var(--tdc-muted)]">
                          {match.profile.designation} @ {match.profile.company}
                        </p>
                      </div>
                    </div>
                    <CompatibilityBar score={match.score} tier={match.tier} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[var(--tdc-bg)] p-3 text-sm sm:grid-cols-4">
                    <div>
                      <span className="block text-xs text-[var(--tdc-muted)]">Religion</span>
                      <span className="font-medium">{match.profile.religion}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[var(--tdc-muted)]">Diet</span>
                      <span className="font-medium capitalize">
                        {match.profile.diet.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-[var(--tdc-muted)]">Income</span>
                      <span className="font-medium">{formatIncome(match.profile.income)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[var(--tdc-muted)]">Relocation</span>
                      <span className="font-medium capitalize">
                        {match.profile.openToRelocate}
                      </span>
                    </div>
                  </div>

                  <WeightingMatrix
                    breakdown={match.breakdown}
                    dimensionMax={dimensionMax}
                  />

                  {aiIntros[match.profile.id] && (
                    <div className="mt-4 rounded-r-lg border-l-4 border-[var(--tdc-rose)] bg-[var(--tdc-rose-light)]/50 p-3 text-sm text-[var(--tdc-text)]">
                      {aiIntros[match.profile.id]}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => generateAiNote(match)}
                      disabled={loadingAi[match.profile.id]}
                      className="rounded-lg border border-[var(--tdc-border)] px-4 py-2 text-sm font-medium text-[var(--tdc-text)] transition hover:bg-[var(--tdc-rose-light)] disabled:opacity-50"
                    >
                      {loadingAi[match.profile.id] ? "Generating..." : "Generate AI note"}
                    </button>
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="rounded-lg bg-[var(--tdc-rose)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--tdc-rose-dark)]"
                    >
                      Send match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Send match modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--tdc-text)]">
              Send match proposal
            </h3>
            <p className="mt-2 text-sm text-[var(--tdc-muted)]">
              You&apos;re about to share{" "}
              <strong>
                {selectedMatch.profile.firstName} {selectedMatch.profile.lastName}
              </strong>
              &apos;s profile with{" "}
              <strong>
                {customer.firstName} {customer.lastName}
              </strong>
              .
            </p>

            <div className="mt-4 rounded-lg border border-[var(--tdc-border)] bg-[var(--tdc-bg)] p-4 text-sm">
              <p className="font-semibold text-[var(--tdc-text)]">
                {selectedMatch.profile.firstName} {selectedMatch.profile.lastName}
                <span className="font-normal text-[var(--tdc-muted)]">
                  {" "}
                  · {getAge(selectedMatch.profile.dateOfBirth)} · {selectedMatch.profile.city}
                </span>
              </p>
              <p className="mt-1 capitalize text-[var(--tdc-muted)]">
                {selectedMatch.profile.designation} @ {selectedMatch.profile.company}
              </p>
              <p className="mt-2 text-[var(--tdc-text)]">
                {selectedMatch.profile.religion} ·{" "}
                {selectedMatch.profile.diet.replace("_", " ")}
              </p>
              <div className="mt-3 max-w-xs">
                <CompatibilityBar
                  score={selectedMatch.score}
                  tier={selectedMatch.tier}
                />
              </div>
            </div>

            {aiIntros[selectedMatch.profile.id] && (
              <div className="mt-3 rounded-lg border-l-4 border-[var(--tdc-rose)] bg-[var(--tdc-rose-light)]/50 p-3 text-sm italic text-[var(--tdc-text)]">
                {aiIntros[selectedMatch.profile.id]}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMatch(null)}
                className="rounded-lg border border-[var(--tdc-border)] px-4 py-2 text-sm font-medium text-[var(--tdc-text)] transition hover:bg-[var(--tdc-bg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedMatch(null);
                  triggerToast(
                    `Match sent to ${customer.firstName} ${customer.lastName} ✓`
                  );
                }}
                className="rounded-lg bg-[var(--tdc-rose)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--tdc-rose-dark)]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
