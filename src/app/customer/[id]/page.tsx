"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { findMatches, Profile, MatchResult } from "@/lib/matchingEngine";

import customersData from "@/data/customers.json";
import poolData from "@/data/pool.json";

export default function CustomerDetailPage() {
  const { id } = useParams();
  
  const customer = (customersData as Profile[]).find((c) => c.id === id);
  const pool = poolData as Profile[];

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [aiIntros, setAiIntros] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (customer) {
      setMatches(findMatches(customer, pool));
      
      const syncInternalNotes = async () => {
        try {
          const folderReference = doc(db, "notes", customer.id);
          const dataSnapshot = await getDoc(folderReference);
          if (dataSnapshot.exists()) {
            setNotes(dataSnapshot.data().text || "");
          } else {
            setNotes(customer.notes || "");
          }
        } catch (e) {
          setNotes(customer.notes || "");
        }
      };
      syncInternalNotes();
    }
  }, [customer, pool]);

  if (!customer) {
    return <div className="p-8 text-center text-sm font-semibold text-gray-500">Customer directory entry not found.</div>;
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await setDoc(doc(db, "notes", customer.id), { text: notes }, { merge: true });
      triggerSystemToast("Firestore cluster data synchronization complete.");
    } catch (err) {
      triggerSystemToast("Database save operation rejected.");
    } finally {
      setSavingNotes(false);
    }
  };

  const executeGenerationChain = async (match: MatchResult) => {
    setLoadingAi((prev) => ({ ...prev, [match.profile.id]: true }));
    try {
      const res = await fetch("/api/generate-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, match: match.profile, score: match.score }),
      });
      const data = await res.json();
      setAiIntros((prev) => ({ ...prev, [match.profile.id]: data.intro }));
    } catch (err) {
      setAiIntros((prev) => ({ ...prev, [match.profile.id]: "Fallback translation vector execution failure." }));
    } finally {
      setLoadingAi((prev) => ({ ...prev, [match.profile.id]: false }));
    }
  };

  const triggerSystemToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-sm text-gray-800">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 border border-gray-800 px-5 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="text-xs font-semibold text-gray-500 hover:text-black transition tracking-wide uppercase">
          &larr; Return to Control Grid
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Left Column: Comprehensive Customer Dossier */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Core Dossier</span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">{customer.firstName} {customer.lastName}</h2>
              <p className="text-xs text-gray-500 capitalize">{customer.designation} @ {customer.company}</p>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Net Income:</span><span className="font-medium text-gray-900"> samples ₹{(customer.income / 100000).toFixed(1)}L/yr</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Physical Height:</span><span className="font-medium text-gray-900">{customer.heightCm} cm</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Background:</span><span className="font-medium text-gray-900 text-right">{customer.degree} ({customer.college})</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Demographics:</span><span className="font-medium text-gray-900">{customer.religion} • {customer.caste}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Diet Preference:</span><span className="font-medium text-gray-900 capitalize">{customer.diet}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Kinship System:</span><span className="font-medium text-gray-900 capitalize">{customer.familyType}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Manglik Status:</span><span className="font-medium text-gray-900">{customer.manglik ? "Positive" : "Negative"}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Relocation Openness:</span><span className="font-medium text-gray-900 capitalize">{customer.openToRelocate}</span></div>
              </div>
            </div>

            {/* Live Firestore Operator Workspace */}
            <div className="rounded-xl bg-white p-5 border border-gray-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Operator Annotations</h3>
              <textarea
                className="mt-3 w-full rounded-md border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Initialize custom log metrics or specific matching rules manually..."
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="mt-2 w-full rounded bg-black py-2 text-xs font-medium text-white hover:bg-gray-800 transition disabled:bg-gray-400"
              >
                {savingNotes ? "Committing Changes..." : "Push Workspace Logs"}
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Match Ranking Arrays */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Ranked Matching Pool Array</h3>
            
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.profile.id} className="rounded-xl bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{match.profile.firstName} {match.profile.lastName}</h4>
                      <p className="text-xs text-gray-400 capitalize">{match.profile.city} • {match.profile.designation} at {match.profile.company}</p>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        match.tier === "High Potential" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        match.tier === "Good Match" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-orange-50 text-orange-700 border-orange-200"
                      }`}>
                        {match.score}% ({match.tier})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 sm:grid-cols-4">
                    <div><span className="block text-[10px] uppercase font-semibold text-gray-400">Community</span>{match.profile.religion}</div>
                    <div><span className="block text-[10px] uppercase font-semibold text-gray-400">Diet</span><span className="capitalize">{match.profile.diet}</span></div>
                    <div><span className="block text-[10px] uppercase font-semibold text-gray-400">Income Bracket</span>₹{(match.profile.income / 100000).toFixed(1)}L</div>
                    <div><span className="block text-[10px] uppercase font-semibold text-gray-400">Relocation</span><span className="capitalize">{match.profile.openToRelocate}</span></div>
                  </div>

                  {aiIntros[match.profile.id] ? (
                    <div className="mt-3 rounded-r border-l-4 border-black bg-gray-50 p-3 text-xs text-gray-700 font-medium">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Generated Transmission Copy</span>
                      {aiIntros[match.profile.id]}
                    </div>
                  ) : (
                    <p className="mt-2.5 text-xs text-gray-400 italic bg-gray-50/50 p-2 rounded">Static telemetry match trace: {match.summary}</p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => executeGenerationChain(match)}
                      disabled={loadingAi[match.profile.id]}
                      className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-40"
                    >
                      {loadingAi[match.profile.id] ? "Compiling Vector Analysis..." : "Compile AI Insight Copy"}
                    </button>
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="rounded bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
                    >
                      Propose Package Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Dispatch Authorization Overlay Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-5 border border-gray-200 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">Authorize Profile Transmission</h3>
            <p className="mt-1 text-xs text-gray-500">
              You are authorizing the dispatch of client folder <strong>{selectedMatch.profile.firstName} {selectedMatch.profile.lastName}</strong> to primary contact point <strong>{customer.firstName}</strong>.
            </p>
            
            {aiIntros[selectedMatch.profile.id] && (
              <div className="mt-3 rounded bg-gray-50 p-3 text-xs text-gray-600 italic border border-gray-200">
                {aiIntros[selectedMatch.profile.id]}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMatch(null)}
                className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Abort
              </button>
              <button
                onClick={() => {
                  setSelectedMatch(null);
                  triggerSystemToast(`Match dossier transmitted successfully to: ${customer.email}`);
                }}
                className="rounded bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}