"use client";

import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NotesEditorProps {
  customerId: string;
  initialValue: string;
  onSaved?: () => void;
}

export default function NotesEditor({
  customerId,
  initialValue,
  onSaved,
}: NotesEditorProps) {
  const [notes, setNotes] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setNotes(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "notes", customerId), { text: notes }, { merge: true });
      onSaved?.();
    } catch {
      // Firestore errors surface via parent toast if needed
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[var(--tdc-text)]">Notes</h3>

      <div className="relative mt-3">
        <textarea
          className={`w-full rounded-xl border p-3 text-sm text-[var(--tdc-text)] transition-all duration-200 placeholder:text-[var(--tdc-muted)] focus:outline-none ${
            focused
              ? "border-[var(--tdc-rose)] ring-2 ring-[var(--tdc-rose)]/20"
              : "border-[var(--tdc-border)]"
          } ${saving ? "opacity-60" : ""}`}
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={saving}
          placeholder="Add private notes about this client..."
        />

        {saving && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full bg-[var(--tdc-surface)] px-4 py-2 text-sm font-medium text-[var(--tdc-rose)] shadow-md">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Syncing to Firestore…
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 w-full rounded-lg bg-[var(--tdc-rose)] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--tdc-rose-dark)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save notes"}
      </button>
    </div>
  );
}
