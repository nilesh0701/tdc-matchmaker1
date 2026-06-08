import type { MatchResult } from "@/lib/matchingEngine";

const TIER_STYLES: Record<
  MatchResult["tier"],
  { bar: string; track: string; label: string; text: string }
> = {
  "High Potential": {
    bar: "bg-emerald-500",
    track: "bg-emerald-100",
    label: "text-emerald-700",
    text: "Emerald",
  },
  "Good Match": {
    bar: "bg-blue-500",
    track: "bg-blue-100",
    label: "text-blue-700",
    text: "Sapphire",
  },
  "Possible Match": {
    bar: "bg-amber-500",
    track: "bg-amber-100",
    label: "text-amber-700",
    text: "Amber",
  },
};

export default function CompatibilityBar({
  score,
  tier,
}: {
  score: number;
  tier: MatchResult["tier"];
}) {
  const styles = TIER_STYLES[tier];

  return (
    <div className="w-full min-w-[140px] max-w-[200px]">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className={`text-lg font-bold tabular-nums ${styles.label}`}>
          {score}%
        </span>
        <span className={`text-xs font-medium ${styles.label}`}>{tier}</span>
      </div>
      <div className={`h-2.5 overflow-hidden rounded-full ${styles.track}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${styles.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
