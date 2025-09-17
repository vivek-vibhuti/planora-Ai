export interface Hotel {
  // core
  name: string;
  location: string;
  priceRange: string;
  contactNumber: string;
  address: string;
  amenities: string[];
  whyRecommended: string;
  bookingTips: string;

  // optional UX/data
  id?: string;                 // for DB/Prisma or keyed lists
  url?: string;                // hotel site/listing
  alternativeOptions?: string;
  rating?: number;
  reviews?: number;
  coordinates?: { lat: number; lng: number };
  images?: string[];
  cancellationPolicy?: string;
  checkInTime?: string;
  checkOutTime?: string;

  // normalization/meta
  destinationSlug?: string;    // e.g., ranchi, netarhat
  source?: string;             // serpapi, tourism.jharkhand, manual
  verified?: boolean;          // verified source badge
  lastUpdated?: string;        // ISO string for freshness badges
}

export interface BookingRequest {
  type: 'hotel' | 'transport' | 'activity' | 'guide';
  details: {
    name: string;
    dates: { checkIn: string; checkOut: string };
    guests: number;
    preferences?: string[];
  };
  contactInfo: { name: string; email: string; phone: string };
  specialRequests?: string;

  // optional for smoother server mapping / analytics
  destination?: string;        // normalized destination for DB filtering
  tripId?: string;             // link to generated trip
  source?: 'web' | 'chat' | 'api';
  channel?: string;            // 'organic', 'referral', etc.
  providerContact?: string;    // used to populate confirmation when known
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  confirmationDetails?: {
    providerContact: string;
    nextSteps: string[];
    paymentInfo?: string;
    cancellationPolicy: string;
    supportEmail?: string;     // handy for footer CTA
    supportPhone?: string;     // or helpline
  };
  error?: string;

  // telemetry (optional, non-breaking)
  statusCode?: number;         // surface 200/400/500 to UI without branching by fetch status
  requestId?: string;          // for support/debug tracing
}

export interface BookingStrategy {
  strategy: string;
  description: string;
  expectedSavings: string;
  bestTiming: string;
  riskLevel: 'low' | 'medium' | 'high';
  applicableFor: string[];

  // optional examples / applicability hints
  examples?: string[];
  notes?: string;
}

export interface LocalConnection {
  type: 'guide' | 'driver' | 'cook' | 'photographer' | 'translator';
  name: string;
  contact: string;
  specialization: string;
  cost: string;
  availability: string;
  languages: string[];
  verified: boolean;
  description: string;

  // optional metadata
  id?: string;
  source?: string;            // justdial, sulekha, official
  rating?: number;
  reviewsCount?: number;
  serviceArea?: string[];     // areas covered
}
