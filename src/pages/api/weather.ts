import type { NextApiRequest, NextApiResponse } from 'next';
import { jharkhandWeather } from '@/lib/weather';
import type { WeatherInfo, WeatherForecast, WeatherAlert } from '@/types/weather';

interface WeatherApiResponse {
  success: boolean;
  destination?: string;
  current?: WeatherInfo;
  forecast?: WeatherForecast[];
  alerts?: WeatherAlert[];
  error?: string;
  lastUpdated?: string;
  apiStatus?: {
    current: 'success' | 'fallback';
    forecast: 'success' | 'fallback';
    intelligence: 'success' | 'fallback';
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherApiResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'PLANORA AI');

    const { destination } = req.query;

    if (!destination || typeof destination !== 'string' || !destination.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Destination parameter is required',
      });
    }

    const dest = destination.trim();

    console.log(`🌤️ Fetching weather data for ${dest}`);

    // Fetch in parallel
    const [currentWeather, forecast, weatherIntelligence] = await Promise.allSettled([
      jharkhandWeather.getCurrentWeatherInfo(dest),
      jharkhandWeather.getWeeklyForecast(dest),
      jharkhandWeather.getWeatherIntelligence(dest),
    ]);

    const current: WeatherInfo | undefined =
      currentWeather.status === 'fulfilled' ? currentWeather.value : undefined;

    const forecastData: WeatherForecast[] =
      forecast.status === 'fulfilled' && Array.isArray(forecast.value)
        ? forecast.value
        : [];

    const intelligence =
      weatherIntelligence.status === 'fulfilled' ? weatherIntelligence.value : undefined;

    // Build alerts
    const alerts: WeatherAlert[] = [];

    if (intelligence?.weatherWarnings?.length) {
      for (const msg of intelligence.weatherWarnings) {
        alerts.push({
          type: 'advisory',
          message: msg,
          severity: 'medium',
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          affectedActivities: ['Outdoor activities', 'Sightseeing'],
        });
      }
    }

    // Heat advisory: parse numeric temp from string like "34°C (feels like 36°C)"
    const tempNum = parseFirstNumberFromString(current?.temperature);
    if (intelligence?.currentSeason === 'Summer' && typeof tempNum === 'number' && tempNum >= 35) {
      alerts.push({
        type: 'warning',
        message: 'High temperature warning — avoid outdoor activities during 11 AM – 4 PM',
        severity: 'high',
        validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        affectedActivities: ['Waterfall visits', 'Trekking', 'Wildlife safaris'],
      });
    }

    if (intelligence?.currentSeason === 'Monsoon') {
      alerts.push({
        type: 'advisory',
        message: 'Monsoon season — roads to remote waterfalls may be challenging',
        severity: 'medium',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        affectedActivities: ['Waterfall visits', 'Remote sightseeing', 'Trekking'],
      });
    }

    return res.status(200).json({
      success: true,
      destination: dest,
      current,
      forecast: forecastData,
      alerts,
      lastUpdated: new Date().toISOString(),
      apiStatus: {
        current: currentWeather.status === 'fulfilled' ? 'success' : 'fallback',
        forecast: forecast.status === 'fulfilled' ? 'success' : 'fallback',
        intelligence: weatherIntelligence.status === 'fulfilled' ? 'success' : 'fallback',
      },
    });
  } catch (error) {
    console.error('Weather API failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
    });
  }
}

function parseFirstNumberFromString(s?: string): number | undefined {
  if (!s) return undefined;
  const m = s.match(/-?\d+(\.\d+)?/);
  return m ? Number(m) : undefined;
}

export const config = {
  api: {
    responseLimit: '2mb',
  },
  maxDuration: 20,
};
