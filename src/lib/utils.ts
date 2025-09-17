import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Date Utilities
 * - formatDate: respects en-IN locale, guards invalid input
 * - getDateRange: returns consistent UTC ISO (YYYY-MM-DD) without TZ drift
 * - toISODate: helper to normalize to YYYY-MM-DD in local time safely
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function toISODateLocal(d: Date): string {
  // Normalize to local date without time zone drift by reconstructing Y-M-D
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDateRange(startDate: string, days: number): { start: string; end: string } {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime()) || days < 1) {
    const today = new Date();
    return { start: toISODateLocal(today), end: toISODateLocal(today) };
  }
  const end = new Date(start);
  end.setDate(start.getDate() + Math.max(0, days - 1));
  return { start: toISODateLocal(start), end: toISODateLocal(end) };
}

/**
 * Location Utilities
 * - isValidJharkhandDestination: trims, normalizes, and checks aliases
 */
const JH_LOCATIONS = [
  'ranchi','deoghar','netarhat','jamshedpur','hazaribagh','betla',
  'dhanbad','bokaro','parasnath','giridih','chaibasa','palamu','latehar',
  'dumka','godda','pakur','sahebganj','koderma','chatra','garhwa',
  'ramgarh','khunti','simdega','west singhbhum','east singhbhum'
] as const;

const LOCATION_ALIASES: Record<string, string> = {
  'betla national park': 'betla',
  'betla park': 'betla',
  'parasnath hill': 'parasnath',
  'parasnath hills': 'parasnath',
};

export function isValidJharkhandDestination(destination: string): boolean {
  const lowerDest = destination.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalized = LOCATION_ALIASES[lowerDest] || lowerDest;
  return JH_LOCATIONS.some(loc => normalized.includes(loc) || loc.includes(normalized));
}

/**
 * Budget Utilities
 * - parseBudget: robust INR parsing (handles ₹, commas, spaces)
 * - formatCurrency: INR 0 decimals
 * - calculateBudgetDistribution: guards days >= 1
 */
export function parseBudget(budget: string): number {
  const n = parseInt(budget.replace(/[₹,\s]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safe);
}

export function calculateBudgetDistribution(totalBudget: number, days: number) {
  const t = Math.max(0, Math.floor(totalBudget) || 0);
  const d = Math.max(1, Math.floor(days) || 1);
  return {
    accommodation: Math.round(t * 0.40), // 40%
    food: Math.round(t * 0.25),          // 25%
    transport: Math.round(t * 0.20),     // 20%
    activities: Math.round(t * 0.10),    // 10%
    shopping: Math.round(t * 0.05),      // 5%
    dailyBudget: Math.round(t / d),
  };
}

/**
 * Season Utilities
 * - getCurrentSeason: same mapping, explicit months
 * - getSeasonRecommendations: typed object with safe fallback
 */
export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 12 || month <= 2) return 'Winter';       // Dec–Feb
  if (month >= 3 && month <= 5) return 'Summer';        // Mar–May
  if (month >= 6 && month <= 9) return 'Monsoon';       // Jun–Sep
  return 'Post-Monsoon';                                // Oct–Nov
}

type Season = 'Winter' | 'Summer' | 'Monsoon' | 'Post-Monsoon';
type SeasonRec = { clothing: string[]; activities: string[]; tips: string[] };

const SEASON_RECS: Record<Season, SeasonRec> = {
  Winter: {
    clothing: ['Light woolens', 'Warm jacket', 'Comfortable shoes'],
    activities: ['Sightseeing', 'Trekking', 'Wildlife safari', 'Photography'],
    tips: ['Best time for outdoor activities', 'Pack layers for temperature variation'],
  },
  Summer: {
    clothing: ['Cotton clothes', 'Sun hat', 'Sunglasses', 'Light colors'],
    activities: ['Early morning visits', 'Indoor attractions', 'Temple visits'],
    tips: ['Avoid midday sun', 'Stay hydrated', 'Plan indoor activities during peak hours'],
  },
  Monsoon: {
    clothing: ['Raincoat', 'Umbrella', 'Quick-dry clothes', 'Non-slip footwear'],
    activities: ['Waterfall visits', 'Indoor cultural activities', 'Photography'],
    tips: ['Check road conditions', 'Carry extra clothes', 'Be cautious near water bodies'],
  },
  'Post-Monsoon': {
    clothing: ['Light layers', 'Light jacket for evening'],
    activities: ['All outdoor activities', 'Photography', 'Trekking'],
    tips: ['Perfect weather for all activities', 'Excellent visibility for photography'],
  },
};

export function getSeasonRecommendations(season: string) {
  const key = (season as Season) || 'Winter';
  return SEASON_RECS[key] || SEASON_RECS.Winter;
}
