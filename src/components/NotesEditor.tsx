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
      <textarea
        className="mt-3 w-full rounded-lg border border-[var(--tdc-border)] p-3 text-sm text-[var(--tdc-text)] focus:border-[var(--tdc-rose)] focus:outline-none focus:ring-1 focus:ring-[var(--tdc-rose)]"
        rows={5}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add private notes about this client..."
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 w-full rounded-lg bg-[var(--tdc-rose)] py-2 text-sm font-medium text-white transition hover:bg-[var(--tdc-rose-dark)] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save notes"}
      </button>
    </div>
  );
}
