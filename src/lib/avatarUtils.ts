const AVATAR_COLORS = [
  'bg-[var(--tdc-rose)]',      // A-C
  'bg-amber-500',              // D-F
  'bg-emerald-500',            // G-I
  'bg-sky-500',                // J-L
  'bg-violet-500',             // M-O
  'bg-orange-500',             // P-R
  'bg-teal-500',               // S-U
  'bg-indigo-500',             // V-X
  'bg-pink-400',               // Y-Z
];

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getAvatarColor(name: string): string {
  const letter = name.charAt(0).toUpperCase();
  const code = letter.charCodeAt(0);
  if (code >= 65 && code <= 67) return AVATAR_COLORS[0];
  if (code >= 68 && code <= 70) return AVATAR_COLORS[1];
  if (code >= 71 && code <= 73) return AVATAR_COLORS[2];
  if (code >= 74 && code <= 76) return AVATAR_COLORS[3];
  if (code >= 77 && code <= 79) return AVATAR_COLORS[4];
  if (code >= 80 && code <= 82) return AVATAR_COLORS[5];
  if (code >= 83 && code <= 85) return AVATAR_COLORS[6];
  if (code >= 86 && code <= 88) return AVATAR_COLORS[7];
  return AVATAR_COLORS[8];
}

export function getAge(dob: string): number {
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}

export function formatIncome(income: number): string {
  return `₹${(income / 100000).toFixed(1)}L`;
}
