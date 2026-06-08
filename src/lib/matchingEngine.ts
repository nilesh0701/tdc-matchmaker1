// ============================================================
// TDC Matchmaker Engine v1
// Gender-specific scoring per TDC brief + Indian matrimonial research
// Max score: 100 points
// ============================================================

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  city: string;
  country: string;
  heightCm: number;
  income: number;            // annual INR
  company: string;
  designation: string;
  college: string;
  degree: string;
  maritalStatus: 'never_married' | 'divorced' | 'widowed';
  religion: string;
  caste: string;
  motherTongue: string;
  languages: string[];
  diet: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'jain';
  wantKids: 'yes' | 'no' | 'maybe';
  openToRelocate: 'yes' | 'no' | 'maybe';
  openToPets: 'yes' | 'no' | 'maybe';
  familyType: 'joint' | 'nuclear' | 'open';
  manglik: boolean;
  siblings: number;
  email: string;
  phone: string;
  status: 'active' | 'matched' | 'on_hold' | 'paused';
  photo?: string;
  notes?: string;
}

export interface MatchResult {
  profile: Profile;
  score: number;
  tier: 'High Potential' | 'Good Match' | 'Possible Match';
  breakdown: Record<string, number>;
  summary: string;
}

function getAge(dob: string): number {
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}

function scoreMaleCustomer(
  customer: Profile,
  candidate: Profile
): Record<string, number> {
  const breakdown: Record<string, number> = {};
  const ageDiff = getAge(customer.dateOfBirth) - getAge(candidate.dateOfBirth);

  // Age: woman 2-7 years younger = ideal
  breakdown.age =
    ageDiff >= 2 && ageDiff <= 7 ? 20
    : ageDiff > 0 && ageDiff < 2 ? 12
    : ageDiff >= 8 && ageDiff <= 12 ? 8
    : 0;

  // Income: woman earns less or equal
  breakdown.income =
    candidate.income <= customer.income ? 15
    : candidate.income <= customer.income * 1.15 ? 8
    : 0;

  // Height: woman shorter by 3-15cm is ideal
  const heightDiff = customer.heightCm - candidate.heightCm;
  breakdown.height =
    heightDiff >= 3 && heightDiff <= 15 ? 10
    : heightDiff > 0 ? 6
    : 0;

  // Kids: hard alignment
  breakdown.kids =
    customer.wantKids === candidate.wantKids ? 20
    : customer.wantKids === 'maybe' || candidate.wantKids === 'maybe' ? 10
    : 0;

  // Religion
  breakdown.religion = customer.religion === candidate.religion ? 10 : 0;

  // Diet
  breakdown.diet =
    customer.diet === candidate.diet ? 10
    : customer.diet === 'vegetarian' && candidate.diet === 'jain' ? 8
    : 5;

  // Language overlap
  const overlap = candidate.languages.filter(l =>
    customer.languages.includes(l)
  ).length;
  breakdown.language = Math.min(overlap * 5, 15);

  return breakdown;
}

function scoreFemaleCustomer(
  customer: Profile,
  candidate: Profile
): Record<string, number> {
  const breakdown: Record<string, number> = {};
  const ageDiff = getAge(candidate.dateOfBirth) - getAge(customer.dateOfBirth);

  // Age: man same age or up to 8 yrs older
  breakdown.age =
    ageDiff >= 0 && ageDiff <= 5 ? 15
    : ageDiff >= -2 && ageDiff < 0 ? 10
    : ageDiff > 5 && ageDiff <= 8 ? 8
    : 0;

  // Relocation: biggest factor for women post-marriage
  breakdown.relocation =
    customer.openToRelocate === candidate.openToRelocate ? 20
    : customer.openToRelocate === 'maybe' || candidate.openToRelocate === 'maybe' ? 12
    : 0;

  // Family type
  breakdown.familyType =
    customer.familyType === candidate.familyType ? 15
    : customer.familyType === 'open' || candidate.familyType === 'open' ? 8
    : 0;

  // Kids
  breakdown.kids =
    customer.wantKids === candidate.wantKids ? 15
    : customer.wantKids === 'maybe' || candidate.wantKids === 'maybe' ? 8
    : 0;

  // Income: man earns same or more
  breakdown.income =
    candidate.income >= customer.income ? 10
    : candidate.income >= customer.income * 0.85 ? 6
    : 0;

  // Religion
  breakdown.religion = customer.religion === candidate.religion ? 10 : 0;

  // Language overlap
  const overlap = candidate.languages.filter(l =>
    customer.languages.includes(l)
  ).length;
  breakdown.language = Math.min(overlap * 5, 15);

  return breakdown;
}

export function findMatches(customer: Profile, pool: Profile[]): MatchResult[] {
  const eligible = pool.filter(
    p => p.gender !== customer.gender && p.status !== 'matched'
  );

  return eligible
    .map(candidate => {
      const breakdown =
        customer.gender === 'male'
          ? scoreMaleCustomer(customer, candidate)
          : scoreFemaleCustomer(customer, candidate);

      const score = Math.round(
        (Object.values(breakdown).reduce((a, b) => a + b, 0) / 100) * 100
      );

      const tier: MatchResult['tier'] =
        score >= 70 ? 'High Potential'
        : score >= 45 ? 'Good Match'
        : 'Possible Match';

      const strongPoints = Object.entries(breakdown)
        .filter(([, v]) => v > 0)
        .map(([k]) => k);

      return {
        profile: candidate,
        score,
        tier,
        breakdown,
        summary: `Strong alignment on: ${strongPoints.join(', ')}.`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}