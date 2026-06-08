function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

function scoreRowClass(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0;
  if (ratio >= 0.8) return "text-emerald-700 bg-emerald-50";
  if (ratio >= 0.4) return "text-blue-700 bg-blue-50";
  if (value > 0) return "text-amber-700 bg-amber-50";
  return "text-[var(--tdc-muted)] bg-[var(--tdc-bg)]";
}

export default function WeightingMatrix({
  breakdown,
  dimensionMax,
}: {
  breakdown: Record<string, number>;
  dimensionMax: Record<string, number>;
}) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--tdc-muted)]">
        Compatibility weighting matrix
      </p>
      <div className="overflow-hidden rounded-xl border border-[var(--tdc-border)]">
        <div className="grid grid-cols-[1fr_auto_auto] gap-px bg-[var(--tdc-border)] text-sm">
          <div className="bg-[var(--tdc-bg)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--tdc-muted)]">
            Parameter
          </div>
          <div className="bg-[var(--tdc-bg)] px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-[var(--tdc-muted)]">
            Score
          </div>
          <div className="bg-[var(--tdc-bg)] px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-[var(--tdc-muted)]">
            Weight
          </div>
          {Object.entries(breakdown).map(([key, value]) => {
            const max = dimensionMax[key] ?? 20;
            const rowClass = scoreRowClass(value, max);
            return (
              <div key={key} className="contents">
                <div
                  className={`px-4 py-3 font-medium capitalize text-[var(--tdc-text)] ${rowClass}`}
                >
                  {formatLabel(key)}
                </div>
                <div className={`px-4 py-3 text-right font-semibold tabular-nums ${rowClass}`}>
                  {value}
                </div>
                <div className={`px-4 py-3 text-right tabular-nums text-[var(--tdc-muted)] ${rowClass}`}>
                  / {max}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
