"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How are client profiles secured?",
    answer:
      "All matchmaker sessions are protected by Firebase Authentication with encrypted transport (TLS 1.3). Operator notes are stored in Firestore with project-level security rules, and API keys for AI generation never leave the server.",
  },
  {
    question: "What compliance standards does the platform follow?",
    answer:
      "The Date Crew operates under strict data-minimization principles. Client biodata is used exclusively for compatibility scoring within the operator console. No profile data is shared externally without explicit matchmaker authorization.",
  },
  {
    question: "Can we configure custom matching filters?",
    answer:
      "The scoring engine applies research-backed gender-specific weights for age, income, lifestyle, and values. Custom per-client rules can be recorded in operator notes and factored into manual review before any proposal is sent.",
  },
  {
    question: "How does the AI assist matchmakers?",
    answer:
      "Claude generates warm, personalized 2–3 sentence compatibility notes based on both profiles and the algorithmic score. Notes appear on match cards and in send proposals, with automatic fallback if the API is unavailable.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-[var(--tdc-border)] rounded-2xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] shadow-sm">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--tdc-bg)]"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-[var(--tdc-text)]">
                {item.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--tdc-rose-light)] text-[var(--tdc-rose)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--tdc-muted)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
