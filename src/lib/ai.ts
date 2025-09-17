import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import type { CompleteTripPlan, TripRequest } from '@/types/trip'
import { 
  isValidJharkhandDestination, 
  getCurrentSeason, 
  calculateBudgetDistribution 
} from './utils'

export class JharkhandTripAI {
  private model = google('gemini-1.5-flash') // Flash model for quota efficiency

  async generateTripPlan(request: TripRequest): Promise<CompleteTripPlan> {
    if (!isValidJharkhandDestination(request.destination)) {
      throw new Error('Only Jharkhand destinations are supported')
    }

    const budgetNum = parseInt(request.budget.replace(/[₹,]/g, ''))
    const budgetDistribution = calculateBudgetDistribution(budgetNum, request.days)

    try {
      console.log('🤖 Generating AI trip plan...')
      const result = await generateText({
        model: this.model,
        messages: [
          { role: 'system', content: this.getSystemPrompt(request, budgetDistribution) },
          { role: 'user', content: this.getUserPrompt(request) }
        ],
        temperature: 0.7,
        maxTokens: 2000,
      })

      console.log('✅ AI trip plan generated')
      return this.parseAIResponse(result.text, request, budgetDistribution)

    } catch (error) {
      console.error('❌ AI generation failed, using fallback:', error)
      return this.getSmartFallbackPlan(request, budgetDistribution)
    }
  }

  private getSystemPrompt(request: TripRequest, budget: any): string {
    return `You are PLANORA AI, Jharkhand's top travel expert.
Create a concise ${request.days}-day trip plan for ${request.destination} with budget ${request.budget}.
Season: ${getCurrentSeason()}.
Include itinerary, budget, weather tips, recommendations.
Keep response under 2000 tokens.`
  }

  private getUserPrompt(request: TripRequest): string {
    return `Plan ${request.days} days in ${request.destination}, Jharkhand for ${request.travelers} travelers.
Budget: ${request.budget}.
Interests: ${request.preferences?.interests?.join(', ') || 'General sightseeing'}.
Dates: ${request.travelDates?.startDate || 'Flexible'}.

Output as detailed travel plan with costs, timings, and recommendations.`
  }

  private getSmartFallbackPlan(req: TripRequest, budget: any): CompleteTripPlan {
    const dest = req.destination.toLowerCase()
    const plans = {
      ranchi: this.getRanchiFallbackPlan(req, budget),
      deoghar: this.getDeogarFallbackPlan(req, budget),
      netarhat: this.getNetarhatFallbackPlan(req, budget),
      jamshedpur: this.getJamshedpurFallbackPlan(req, budget),
      hazaribagh: this.getHazaribaghFallbackPlan(req, budget),
    }
    return plans[dest as keyof typeof plans] || this.getGenericFallbackPlan(req, budget)
  }

  // Ranchi fallback (full detail, other destinations simplified)
  private getRanchiFallbackPlan(req: TripRequest, budget: any): CompleteTripPlan {
    return {
      tripOverview: {
        destination: 'Ranchi',
        state: 'Jharkhand',
        duration: `${req.days} days`,
        totalBudget: req.budget,
        budgetCategory: budget.accommodation < 8000 ? 'Budget-Friendly' : 'Mid-Range',
        bestTimeToVisit: 'October–March',
        nearestAirport: 'Birsa Munda Airport (IXR)',
        nearestRailway: 'Ranchi Railway Station',
        overview: `Discover Ranchi, the "City of Waterfalls"! This ${req.days}-day journey blends waterfalls, gardens, culture, and food.`
      },
      dailyItinerary: [
        {
          day: 1,
          theme: 'Arrival & City Exploration',
          activities: [
            { time: '10:00 AM', activity: 'Check-in', location: 'Hotel', duration: '2h', cost: '₹0', category: 'accommodation' },
            { time: '12:30 PM', activity: 'Lunch', location: 'Doranda Chowk', duration: '1h', cost: '₹400', category: 'food' },
            { time: '2:00 PM', activity: 'Rock Garden', location: 'Kanke Road', duration: '2.5h', cost: '₹50', category: 'sightseeing' },
            { time: '5:00 PM', activity: 'Tagore Hill', location: 'Morabadi', duration: '2h', cost: '₹30', category: 'sightseeing' }
          ],
          totalDayCost: '₹1,200',
          travelTips: ['Visit Rock Garden in evening', 'Try Doranda Chowk street food']
        },
        {
          day: 2,
          theme: 'Waterfalls',
          activities: [
            { time: '9:30 AM', activity: 'Hundru Falls', location: '35km away', duration: '4h', cost: '₹800', category: 'nature' },
            { time: '2:00 PM', activity: 'Lunch', location: 'Falls restaurant', duration: '1h', cost: '₹450', category: 'food' },
            { time: '4:00 PM', activity: 'Jonha Falls', location: '40km away', duration: '2.5h', cost: '₹600', category: 'nature' }
          ],
          totalDayCost: '₹2,150',
          travelTips: ['Wear non-slip shoes', 'Best in monsoon']
        },
        {
          day: 3,
          theme: 'Culture & Departure',
          activities: [
            { time: '9:00 AM', activity: 'Birsa Zoo', location: 'Ormanjhi', duration: '3h', cost: '₹80', category: 'wildlife' },
            { time: '1:00 PM', activity: 'Lunch', location: 'Local dhaba', duration: '1h', cost: '₹350', category: 'food' },
            { time: '2:30 PM', activity: 'Shopping', location: 'Main Road Market', duration: '2h', cost: '₹1000', category: 'shopping' }
          ],
          totalDayCost: '₹1,430'
        }
      ],
      budgetBreakdown: {
        accommodation: `₹${budget.accommodation}`,
        food: `₹${budget.food}`,
        transportation: `₹${budget.transport}`,
        activities: `₹${budget.activities}`,
        shopping: `₹${budget.shopping}`,
        miscellaneous: '₹500',
        total: req.budget,
        dailyAverage: `₹${budget.dailyBudget}`
      },
      culturalExperiences: [
        { experience: 'Tribal Art Workshop', location: 'Ranchi Art Center', cost: '₹300', bestTime: 'Morning', duration: '2h' }
      ],
      emergencyContacts: { jharkhandTourism: '0651-2331828', police: '100', medical: '108' },
      travelTips: ['Carry cash', 'Respect tribal customs'],
      weatherInfo: {
        currentSeason: getCurrentSeason(),
        temperature: this.getSeasonalTemperature(),
        clothing: this.getSeasonalClothing(),
        precautions: 'Carry sunscreen, water, walking shoes'
      },
      enhancementStatus: '✅ Smart fallback used'
    }
  }

  private getGenericFallbackPlan(req: TripRequest, budget: any): CompleteTripPlan {
    return {
      tripOverview: {
        destination: req.destination,
        state: 'Jharkhand',
        duration: `${req.days} days`,
        totalBudget: req.budget,
        budgetCategory: 'Mid-Range',
        bestTimeToVisit: 'Oct–Mar',
        nearestAirport: 'Birsa Munda Airport',
        nearestRailway: 'Nearest Railway',
        overview: `Explore ${req.destination}, Jharkhand in ${req.days} days.`
      },
      dailyItinerary: this.generateBasicItinerary(req),
      budgetBreakdown: {
        accommodation: `₹${budget.accommodation}`,
        food: `₹${budget.food}`,
        transportation: `₹${budget.transport}`,
        activities: `₹${budget.activities}`,
        shopping: `₹${budget.shopping}`,
        miscellaneous: '₹500',
        total: req.budget,
        dailyAverage: `₹${budget.dailyBudget}`
      },
      culturalExperiences: [],
      emergencyContacts: { jharkhandTourism: '0651-2331828', police: '100', medical: '108' },
      travelTips: ['Best Oct–Mar', 'Carry ID'],
      weatherInfo: {
        currentSeason: getCurrentSeason(),
        temperature: this.getSeasonalTemperature(),
        clothing: this.getSeasonalClothing(),
        precautions: 'Pack appropriately'
      },
      enhancementStatus: '⚠️ Generic fallback used'
    }
  }

  private generateBasicItinerary(req: TripRequest) {
    return Array.from({ length: req.days }, (_, i) => ({
      day: i + 1,
      theme: `Day ${i + 1} - Explore ${req.destination}`,
      activities: [{ time: '9:00 AM', activity: 'Sightseeing', location: req.destination, duration: '4h', cost: '₹500', category: 'sightseeing' }],
      totalDayCost: '₹1500'
    }))
  }

  private getSeasonalTemperature(): string {
    const season = getCurrentSeason()
    return { Winter: '10–25°C', Summer: '25–40°C', Monsoon: '20–30°C', 'Post-Monsoon': '15–28°C' }[season] || '15–28°C'
  }

  private getSeasonalClothing(): string {
    const season = getCurrentSeason()
    return {
      Winter: 'Light woolens',
      Summer: 'Cotton, sunscreen',
      Monsoon: 'Raincoat, quick-dry',
      'Post-Monsoon': 'Light layers'
    }[season] || 'Comfortable clothes'
  }

  private getDeogarFallbackPlan(req: TripRequest, b: any) { return this.getGenericFallbackPlan(req, b) }
  private getNetarhatFallbackPlan(req: TripRequest, b: any) { return this.getGenericFallbackPlan(req, b) }
  private getJamshedpurFallbackPlan(req: TripRequest, b: any) { return this.getGenericFallbackPlan(req, b) }
  private getHazaribaghFallbackPlan(req: TripRequest, b: any) { return this.getGenericFallbackPlan(req, b) }

  private parseAIResponse(_: string, req: TripRequest, budget: any): CompleteTripPlan {
    // TODO: Proper parser. For now, fallback.
    return this.getGenericFallbackPlan(req, budget)
  }
}

export const jharkhandAI = new JharkhandTripAI()
