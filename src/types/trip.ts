// Trip planning types

export interface TripRequest {
  destination: string;
  days: number;
  budget: string;
  travelers: number;
  preferences?: TripPreferences;
  travelDates?: { startDate: string; endDate: string };

  // Optional ops/analytics
  tripId?: string;
  source?: 'web' | 'chat' | 'api';
  channel?: string;
}

export interface TripPreferences {
  interests: string[];
  budgetCategory: 'ultra-budget' | 'budget' | 'mid-range' | 'luxury';
  accommodationType: 'hostel' | 'guesthouse' | 'hotel' | 'resort' | 'any';
  foodPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'any';
  activityLevel: 'relaxed' | 'moderate' | 'active' | 'adventure';
  culturalInterest: 'high' | 'medium' | 'low';

  // Optional refinement
  transportPreference?: 'public' | 'cab' | 'self-drive' | 'mixed';
}

export interface TripOverview {
  destination: string;
  state: 'Jharkhand';
  duration: string;
  totalBudget: string;
  budgetCategory: string;
  bestTimeToVisit: string;
  nearestAirport: string;
  nearestRailway: string;
  overview: string;

  // Optional routing/derivatives
  destinationSlug?: string;
  coordinatesCenter?: { lat: number; lng: number };
}

export interface Activity {
  time: string;
  activity: string;
  location: string;
  duration: string;
  cost: string;
  description: string;
  category: 'sightseeing' | 'food' | 'shopping' | 'adventure' | 'religious' | 'cultural';
  coordinates?: { lat: number; lng: number };
  bookingRequired?: boolean;
  contactInfo?: string;

  // Optional ops/UI flags
  ticketUrl?: string;
  priority?: 'must-see' | 'nice-to-have';
}

export interface DailyItinerary {
  day: number;
  theme: string;
  activities: Activity[];
  totalDayCost: string;
  weatherConsiderations?: string;
  travelTips?: string[];

  // Optional meta
  distanceEstimateKm?: number;
  travelTimeEstimate?: string;
}

export interface BudgetBreakdown {
  accommodation: string;
  food: string;
  transportation: string;
  activities: string;
  shopping: string;
  miscellaneous: string;
  total: string;
  dailyAverage: string;

  // Optional computed numeric fields for charts
  numeric?: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    shopping: number;
    miscellaneous: number;
    total: number;
    dailyAverage: number;
  };
}

export interface CulturalExperience {
  experience: string;
  description: string;
  location: string;
  cost: string;
  bestTime: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  culturalSignificance: string;

  // Optional
  contactInfo?: string;
  coordinates?: { lat: number; lng: number };
}

export interface EmergencyContacts {
  jharkhandTourism: string;
  police: string;
  medical: string;
  fireService: string;
  localHelpline: string;
  nearestHospital?: string;
  touristHelpline?: string;

  // Optional UI helpers
  lastVerified?: string;
}

export interface WeatherInfo {
  currentSeason: string;
  temperature: string;
  clothing: string;
  precautions: string;
  humidity?: string;
  windSpeed?: string;
  visibility?: string;

  // Optional UI badges
  dataQuality?: 'live' | 'fallback';
}

// NEW: Agentic add-ons for cuisine, crafts, timing, and logistics
export interface EnhancedPlan {
  localCuisine?: {
    highlights: string[];
    areas?: string[];
    suggestedSlots?: {
      day1_breakfast?: string;
      day2_dinner?: string;
      day3_snacks?: string;
    };
  };
  handicrafts?: {
    buy: string[];
    markets?: string[];
    notes?: string[];
  };
  season?: {
    current?: string;
    advice?: string[];
    bestTime?: string;
  };
  microItinerary?: {
    day1?: string[];
    day2?: string[];
    day3?: string[];
  };
  logistics?: {
    transport?: string[];
    packing?: string[];
  };
}

export interface RealTimeEnhancements {
  attractionReviews: Review[];
  localGuides: LocalGuide[];
  currentNews: NewsItem[];
  dataSource: string;
  lastUpdated: string;
  searchesUsed: number;
  apiStatus: {
    reviews: 'success' | 'fallback' | 'error';
    guides: 'success' | 'fallback' | 'error';
    news: 'success' | 'fallback' | 'error';
  };

  // Optional
  weatherSource?: 'openweather' | 'fallback';
}

export interface CompleteTripPlan {
  tripOverview: TripOverview;
  dailyItinerary: DailyItinerary[];
  budgetBreakdown: BudgetBreakdown;
  culturalExperiences: CulturalExperience[];
  emergencyContacts: EmergencyContacts;
  travelTips: string[];
  weatherInfo: WeatherInfo;
  realTimeEnhancements?: RealTimeEnhancements;
  enhancementStatus: string;

  // NEW: agentic enrichment
  enhanced?: EnhancedPlan;

  // Optional persistence/routing
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  text: string;
  source: string;
  rating: string;
  reviewer: string;
  title?: string;
  url?: string;
  date?: string;
  helpfulVotes?: number;

  // Optional parse metadata
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface LocalGuide {
  name: string;
  contact: string;
  source: string;
  description: string;
  url?: string;
  verified: boolean;
  specializations: string[];
  languages: string[];
  priceRange: string;
  availability: string;
  rating?: number;
  experienceYears?: number;

  // Optional
  serviceAreas?: string[];
}

export interface NewsItem {
  title: string;
  snippet: string;
  source: string;
  date: string;
  link: string;
  thumbnail?: string;
  relevance: 'high' | 'medium' | 'low';

  // Optional
  category?: 'events' | 'policy' | 'attraction' | 'general';
}
