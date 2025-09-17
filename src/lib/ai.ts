import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import type { CompleteTripPlan, TripRequest } from '@/types/trip'
import {
  isValidJharkhandDestination,
  getCurrentSeason,
  calculateBudgetDistribution,
} from './utils'

type BudgetDistribution = {
  accommodation: number
  food: number
  transport: number
  activities: number
  shopping: number
  dailyBudget: number
  total: number
}

type SeasonalKey = 'Winter' | 'Summer' | 'Monsoon' | 'Post-Monsoon'

const DEST_ALIASES: Record<string, keyof typeof FALLBACK_BUILDERS> = {
  ranchi: 'ranchi',
  deoghar: 'deoghar',
  netarhat: 'netarhat',
  jamshedpur: 'jamshedpur',
  hazaribagh: 'hazaribagh',
}

export class JharkhandTripAI {
  private model = google('gemini-1.5-flash')

  async generateTripPlan(request: TripRequest): Promise<CompleteTripPlan> {
    if (!isValidJharkhandDestination(request.destination)) {
      throw new Error('Only Jharkhand destinations are supported')
    }

    const budgetNum = safeParseBudget(request.budget)
    const days = Math.max(1, Number(request.days || 1))
    const budgetDistribution = normalizeBudget(
      calculateBudgetDistribution(budgetNum, days),
      budgetNum,
      days,
    )

    try {
      const systemPrompt = this.getSystemPrompt(request, budgetDistribution)
      const userPrompt = this.getUserPrompt(request)

      const result = await generateText({
        model: this.model,
        // Concise prompts to respect token limits of flash model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
      })

      const text = (result?.text || '').trim()
      const parsed = this.parseAIResponse(text, request, budgetDistribution)
      return parsed
    } catch (error) {
      // Fallback flow for quota/timeouts/format issues
      return this.getSmartFallbackPlan(request, budgetDistribution)
    }
  }

  private getSystemPrompt(request: TripRequest, budget: BudgetDistribution): string {
    return [
      `You are PLANORA AI, a Jharkhand travel expert and planner.`,
      `Deliver a ${request.days}-day plan for ${request.destination} within ${formatCurrency(budget.total)}.`,
      `Season: ${getCurrentSeason()}. Output short, structured JSON only.`,
      `Keys: tripOverview, dailyItinerary, budgetBreakdown, culturalExperiences, emergencyContacts, travelTips, weatherInfo, enhancementStatus.`,
      `Keep under 1800 tokens.`,
    ].join(' ')
  }

  private getUserPrompt(request: TripRequest): string {
    const interests =
      request?.preferences?.interests?.length
        ? request.preferences.interests.join(', ')
        : 'General sightseeing'
    const startDate = request?.travelDates?.startDate || 'Flexible'

    return [
      `Destination: ${request.destination}, Jharkhand.`,
      `Days: ${request.days}. Travelers: ${request.travelers}.`,
      `Budget: ${request.budget}. Interests: ${interests}.`,
      `Dates: ${startDate}. Include costs, timings, weather tips, and recommendations.`,
      `Return JSON only.`,
    ].join(' ')
  }

  private getSmartFallbackPlan(req: TripRequest, budget: BudgetDistribution): CompleteTripPlan {
    const key = (req.destination || '').trim().toLowerCase()
    const mapped = DEST_ALIASES[key]
    const builder = mapped ? FALLBACK_BUILDERS[mapped] : undefined
    return (builder?.call(this, req, budget)) ?? this.getGenericFallbackPlan(req, budget)
  }

  // Ranchi rich fallback; others generic by default
  public getRanchiFallbackPlan(req: TripRequest, budget: BudgetDistribution): CompleteTripPlan {
    const days = Math.max(1, Number(req.days || 3))
    return {
      tripOverview: {
        destination: 'Ranchi',
        state: 'Jharkhand',
        duration: `${days} days`,
        totalBudget: formatCurrency(budget.total),
        budgetCategory: budget.accommodation < 8000 ? 'Budget-Friendly' : 'Mid-Range',
        bestTimeToVisit: 'October–March',
        nearestAirport: 'Birsa Munda Airport (IXR)',
        nearestRailway: 'Ranchi Junction (RNC)',
        overview: `Discover Ranchi, the "City of Waterfalls", blending cascades, gardens, culture, and food over ${days} days.`,
      },
      dailyItinerary: [
        {
          day: 1,
          theme: 'Arrival & City Highlights',
          activities: [
            {
              time: '10:00', activity: 'Check-in', location: 'Hotel', duration: '2h', cost: '₹0', category: 'sightseeing',
              description: ''
            },
            { time: '12:30', activity: 'Lunch', location: 'Doranda Chowk', duration: '1h', cost: '₹400', category: 'food', description: 'Local thali & chaats' },
            { time: '14:00', activity: 'Rock Garden', location: 'Kanke Road', duration: '2.5h', cost: '₹50', category: 'sightseeing', description: 'Lake views & sculptures' },
            { time: '17:00', activity: 'Tagore Hill', location: 'Morabadi', duration: '1.5h', cost: '₹30', category: 'sightseeing', description: 'Sunset viewpoint' },
          ],
          totalDayCost: '₹1,200',
          travelTips: ['Visit Rock Garden by late afternoon for milder sun', 'Doranda Chowk is great for pocket-friendly street food'],
        },
        {
          day: 2,
          theme: 'Waterfalls Circuit',
          activities: [
            { time: '09:30', activity: 'Hundru Falls', location: 'Approx 35 km', duration: '4h', cost: '₹800', category: 'sightseeing', description: 'Steep steps; excellent monsoon flow' },
            { time: '14:00', activity: 'Lunch', location: 'Nearby eatery', duration: '1h', cost: '₹450', category: 'food', description: 'Simple veg meals' },
            { time: '16:00', activity: 'Jonha Falls', location: 'Approx 40 km', duration: '2.5h', cost: '₹600', category: 'sightseeing', description: 'Temple nearby; scenic pool' },
          ],
          totalDayCost: '₹2,150',
          travelTips: ['Wear non-slip shoes', 'Keep a spare towel and water', 'Avoid slippery edges during peak monsoon'],
        },
        {
          day: 3,
          theme: 'Zoo & Market',
          activities: [
            { time: '09:00', activity: 'Birsa Munda Biological Park', location: 'Ormanjhi', duration: '3h', cost: '₹80', category: 'sightseeing', description: 'Green campus; kids friendly' },
            { time: '13:00', activity: 'Lunch', location: 'Local dhaba', duration: '1h', cost: '₹350', category: 'food', description: 'Litti-chokha and regional fare' },
            { time: '14:30', activity: 'Shopping', location: 'Main Road Market', duration: '2h', cost: '₹1,000', category: 'shopping', description: 'Handicrafts; bamboo & tribal art' },
          ],
          totalDayCost: '₹1,430',
          travelTips: ['Carry cash for small vendors', 'Respect local customs and temple dress codes'],
        },
      ],
      budgetBreakdown: {
        accommodation: formatCurrency(budget.accommodation),
        food: formatCurrency(budget.food),
        transportation: formatCurrency(budget.transport),
        activities: formatCurrency(budget.activities),
        shopping: formatCurrency(budget.shopping),
        miscellaneous: '₹500',
        total: formatCurrency(budget.total),
        dailyAverage: formatCurrency(budget.dailyBudget),
      },
      culturalExperiences: [
        {
          experience: 'Tribal Art Workshop',
          location: 'Local Art Center',
          cost: '₹300',
          bestTime: 'Morning',
          duration: '2h',
          description: 'Hands-on Sohrai & Kohbar motifs introduction',
          difficulty: 'easy',
          culturalSignificance: 'Supports local artisans and preserves tribal art traditions',
        },
      ],
      emergencyContacts: {
        jharkhandTourism: '0651-2331828',
        police: '100',
        medical: '108',
        fireService: '101',
        localHelpline: '112',
      },
      travelTips: ['Carry sufficient cash; ATMs can be sparse near waterfalls', 'Keep sunscreen, water, and walking shoes'],
      weatherInfo: {
        currentSeason: getCurrentSeason(),
        temperature: this.getSeasonalTemperature(),
        clothing: this.getSeasonalClothing(),
        precautions: 'Check rainfall before visiting falls; roads may be slippery',
      },
      enhancementStatus: '✅ Smart fallback used',
    }
  }

  public getGenericFallbackPlan(req: TripRequest, budget: BudgetDistribution): CompleteTripPlan {
    const days = Math.max(1, Number(req.days || 2))
    return {
      tripOverview: {
        destination: req.destination,
        state: 'Jharkhand',
        duration: `${days} days`,
        totalBudget: formatCurrency(budget.total),
        budgetCategory: budget.accommodation < 8000 ? 'Budget-Friendly' : 'Mid-Range',
        bestTimeToVisit: 'Oct–Mar',
        nearestAirport: 'Birsa Munda Airport (IXR)',
        nearestRailway: 'Nearest major junction',
        overview: `Explore ${req.destination} with a balanced plan covering highlights, local food, and culture.`,
      },
      dailyItinerary: this.generateBasicItinerary(req),
      budgetBreakdown: {
        accommodation: formatCurrency(budget.accommodation),
        food: formatCurrency(budget.food),
        transportation: formatCurrency(budget.transport),
        activities: formatCurrency(budget.activities),
        shopping: formatCurrency(budget.shopping),
        miscellaneous: '₹500',
        total: formatCurrency(budget.total),
        dailyAverage: formatCurrency(budget.dailyBudget),
      },
      culturalExperiences: [],
      emergencyContacts: {
        jharkhandTourism: '0651-2331828',
        police: '100',
        medical: '108',
        fireService: '101',
        localHelpline: '112',
      },
      travelTips: ['Best travel window: Oct–Mar', 'Carry a government ID for hotel check-in'],
      weatherInfo: {
        currentSeason: getCurrentSeason(),
        temperature: this.getSeasonalTemperature(),
        clothing: this.getSeasonalClothing(),
        precautions: 'Pack appropriate shoes and a light jacket',
      },
      enhancementStatus: '⚠️ Generic fallback used',
    }
  }

  private generateBasicItinerary(req: TripRequest) {
    const days = Math.max(1, Number(req.days || 1))
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      theme: `Day ${i + 1} - Explore ${req.destination}`,
      activities: [
        {
          time: '09:00',
          activity: 'Sightseeing',
          location: String(req.destination),
          duration: '4h',
          cost: '₹500',
          category: 'sightseeing' as 'sightseeing',
          description: '', // Added description property to satisfy Activity type
        },
      ],
      totalDayCost: '₹1,500',
    }))
  }

  private getSeasonalTemperature(): string {
    const season = getCurrentSeason() as SeasonalKey
    const map: Record<SeasonalKey, string> = {
      Winter: '10–25°C',
      Summer: '25–40°C',
      Monsoon: '20–30°C',
      'Post-Monsoon': '15–28°C',
    }
    return map[season] || '15–28°C'
  }

  private getSeasonalClothing(): string {
    const season = getCurrentSeason() as SeasonalKey
    const map: Record<SeasonalKey, string> = {
      Winter: 'Light woolens',
      Summer: 'Cotton, sunscreen',
      Monsoon: 'Raincoat, quick-dry',
      'Post-Monsoon': 'Light layers',
    }
    return map[season] || 'Comfortable clothes'
  }

  private parseAIResponse(text: string, req: TripRequest, budget: BudgetDistribution): CompleteTripPlan {
    // Try to extract JSON block if present
    const json = extractJson(text)
    if (json) {
      try {
        const obj = JSON.parse(json)
        // Minimal validation for required sections; fill gaps with generic fallback parts
        return mergeWithFallback(obj as Partial<CompleteTripPlan>, this.getGenericFallbackPlan(req, budget))
      } catch {
        // fall through to generic
      }
    }
    // If model returns plain text or malformed JSON
    return this.getSmartFallbackPlan(req, budget)
  }
}

// ---- helpers & constants ----

const FALLBACK_BUILDERS = {
  ranchi: JharkhandTripAI.prototype.getRanchiFallbackPlan,
  deoghar: JharkhandTripAI.prototype.getGenericFallbackPlan,
  netarhat: JharkhandTripAI.prototype.getGenericFallbackPlan,
  jamshedpur: JharkhandTripAI.prototype.getGenericFallbackPlan,
  hazaribagh: JharkhandTripAI.prototype.getGenericFallbackPlan,
} as const

function formatCurrency(n: number | string): string {
  const num = typeof n === 'number' ? n : safeParseBudget(n)
  return `₹${num.toLocaleString('en-IN')}`
}

function safeParseBudget(budget: string | number | undefined | null): number {
  if (typeof budget === 'number' && Number.isFinite(budget)) return budget
  if (typeof budget === 'string') {
    const cleaned = budget.replace(/[^\d]/g, '')
    const num = Number(cleaned)
    if (Number.isFinite(num) && num > 0) return num
  }
  // Default sensible budget for 2–3 days local trip
  return 15000
}

function normalizeBudget(input: any, total: number, days: number): BudgetDistribution {
  const accommodation = toNum(input?.accommodation, Math.round(total * 0.35))
  const food = toNum(input?.food, Math.round(total * 0.2))
  const transport = toNum(input?.transport ?? input?.transportation, Math.round(total * 0.2))
  const activities = toNum(input?.activities, Math.round(total * 0.15))
  const shopping = toNum(input?.shopping, Math.round(total * 0.05))
  const sum = accommodation + food + transport + activities + shopping
  // Adjust minor mismatch
  const delta = total - sum
  const miscAdjust = delta !== 0 ? Math.round(delta) : 0
  const dailyBudget = Math.max(1, Math.round(total / Math.max(1, days)))

  return {
    accommodation,
    food,
    transport,
    activities,
    shopping: shopping + (miscAdjust > 0 ? miscAdjust : 0),
    dailyBudget,
    total,
  }
}

function toNum(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^\d.-]/g, ''))
    if (Number.isFinite(n)) return n
  }
  return fallback
}

function extractJson(text: string): string | null {
  // Prefer fenced code block ``````
  const fenced = text.match(/``````/i)
  if (fenced?.[1]) return fenced[1].trim()
  // Or first {...} block that looks like JSON
  const brace = text.match(/\{[\s\S]*\}$/)
  if (brace?.[0]) return brace[0].trim()
  return null
}

function mergeWithFallback(partial: Partial<CompleteTripPlan>, fallback: CompleteTripPlan): CompleteTripPlan {
  // Deep merge: use partial if present, else fallback
  return {
    tripOverview: { ...fallback.tripOverview, ...partial.tripOverview },
    dailyItinerary: partial.dailyItinerary ?? fallback.dailyItinerary,
    budgetBreakdown: { ...fallback.budgetBreakdown, ...partial.budgetBreakdown },
    culturalExperiences: partial.culturalExperiences ?? fallback.culturalExperiences,
    emergencyContacts: { ...fallback.emergencyContacts, ...partial.emergencyContacts },
    travelTips: partial.travelTips ?? fallback.travelTips,
    weatherInfo: { ...fallback.weatherInfo, ...partial.weatherInfo },
    enhancementStatus: partial.enhancementStatus ?? fallback.enhancementStatus,
  }
}

