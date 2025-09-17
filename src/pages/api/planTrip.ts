import type { NextApiRequest, NextApiResponse } from 'next';
import { jharkhandAI } from '@/lib/ai';
import { jharkhandSerpAPI } from '@/lib/serpApi';
import { jharkhandWeather } from '@/lib/weather';
import type { TripRequest, CompleteTripPlan } from '@/types/trip';
import { isValidJharkhandDestination, parseBudget } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'PLANORA AI');

    const tripRequest = req.body as TripRequest;

    // Basic validation
    if (!tripRequest?.destination || !tripRequest?.days || !tripRequest?.budget) {
      return res.status(400).json({ error: 'Missing required fields: destination, days, and budget' });
    }

    // Normalize inputs
    const destination = tripRequest.destination.trim();
    const days = Number(tripRequest.days);
    const budgetStr = typeof tripRequest.budget === 'string' ? tripRequest.budget : String(tripRequest.budget);
    const budgetNum = parseBudget(budgetStr);

    if (!Number.isFinite(days) || days < 1 || days > 15) {
      return res.status(400).json({ error: 'Days must be between 1 and 15' });
    }

    if (budgetNum < 5000) {
      return res.status(400).json({ error: 'Budget must be at least ₹5,000' });
    }

    // Jharkhand-only guard
    if (!isValidJharkhandDestination(destination)) {
      return res.status(400).json({
        error:
          'Only Jharkhand destinations are supported. Please enter a valid Jharkhand location like Ranchi, Deoghar, Netarhat, Jamshedpur, Hazaribagh, or Betla.',
      });
    }

    console.log(`🎯 Planning trip for ${destination}, ${days} days, ${budgetStr}`);

    // Step 1: Base AI plan
    console.log('🤖 Generating AI trip plan...');
    const baseTripPlan = await jharkhandAI.generateTripPlan({
      ...tripRequest,
      destination,
      days,
      budget: budgetStr,
    });

    // Step 2: Real-time enhancements in parallel
    console.log('🔍 Enhancing with real-time intelligence...');
    const [weatherIntelligence, reviews, guides, news] = await Promise.all([
      jharkhandWeather.getWeatherIntelligence(destination).catch((e) => {
        console.warn('Weather enhancement failed:', e);
        return null;
      }),
      jharkhandSerpAPI.searchJharkhandReviews(destination).catch((e) => {
        console.warn('Reviews enhancement failed:', e);
        return [] as any[];
      }),
      jharkhandSerpAPI.findJharkhandGuides(destination).catch((e) => {
        console.warn('Guides enhancement failed:', e);
        return [] as any[];
      }),
      jharkhandSerpAPI.getJharkhandTourismNews().catch((e) => {
        console.warn('News enhancement failed:', e);
        return [] as any[];
      }),
    ]);

    // Step 3: Merge results safely
    const enhancedTripPlan: CompleteTripPlan = {
      ...baseTripPlan,
      weatherInfo:
        weatherIntelligence
          ? {
              currentSeason: weatherIntelligence.currentSeason,
              temperature: weatherIntelligence.temperature,
              clothing: (weatherIntelligence.clothingRecommendations || []).join(', '),
              precautions: (weatherIntelligence.seasonalConsiderations || []).join(', '),
              humidity: baseTripPlan.weatherInfo?.humidity, // keep base or undefined
              windSpeed: baseTripPlan.weatherInfo?.windSpeed,
              visibility: baseTripPlan.weatherInfo?.visibility,
            }
          : baseTripPlan.weatherInfo,
      realTimeEnhancements: {
        attractionReviews: Array.isArray(reviews) ? reviews : [],
        localGuides: Array.isArray(guides) ? guides : [],
        currentNews: Array.isArray(news) ? news : [],
        dataSource: 'SerpAPI + OpenWeather + Gemini AI',
        lastUpdated: new Date().toISOString(),
        searchesUsed: 3,
        apiStatus: {
          reviews: Array.isArray(reviews) ? 'success' : 'fallback',
          guides: Array.isArray(guides) ? 'success' : 'fallback',
          news: Array.isArray(news) ? 'success' : 'fallback',
        },
      },
      enhancementStatus: '✅ Enhanced with real-time intelligence from SerpAPI & OpenWeather',
    };

    const enhancementStats = {
      reviewsFound: enhancedTripPlan.realTimeEnhancements.attractionReviews.length,
      guidesFound: enhancedTripPlan.realTimeEnhancements.localGuides.length,
      newsFound: enhancedTripPlan.realTimeEnhancements.currentNews.length,
      weatherEnhanced: !!weatherIntelligence,
    };

    console.log('✅ Trip plan enhanced:', enhancementStats);

    // Step 4: Generate trip ID
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    // Respond
    return res.status(200).json({
      success: true,
      tripId,
      tripPlan: enhancedTripPlan,
      enhancementStats,
      message: `Trip plan generated successfully for ${destination}!`,
    });
  } catch (error: any) {
    console.error('Trip planning failed:', error);
    return res.status(500).json({
      error: 'Failed to generate trip plan',
      message: error?.message || 'Unknown error occurred',
      suggestion: 'Please try again with a valid Jharkhand destination like Ranchi, Deoghar, or Netarhat.',
    });
  }
}

export const config = {
  api: { responseLimit: '8mb' },
  maxDuration: 60,
};
