// src/lib/weather.ts
import axios from 'axios';
import type { WeatherInfo, WeatherIntelligence, WeatherForecast, WeatherAlert } from '@/types/weather';

export class JharkhandWeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private timeout = 10000;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ OPENWEATHER_API_KEY not set. Weather will use fallbacks.');
    }
  }

  async getWeatherIntelligence(destination: string): Promise<WeatherIntelligence> {
    try {
      const coords = this.getJharkhandCoordinates(destination);
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(coords),
        this.getForecast(coords),
      ]);
      return this.buildWeatherIntelligence(current, forecast, destination);
    } catch (error) {
      console.error('Weather intelligence failed:', error);
      return this.getFallbackWeatherIntelligence(destination);
    }
  }

  async getCurrentWeatherInfo(destination: string): Promise<WeatherInfo> {
    try {
      const coords = this.getJharkhandCoordinates(destination);
      const weather = await this.getCurrentWeather(coords);

      const main = weather?.main || {};
      const wind = weather?.wind || {};
      const vis = typeof weather?.visibility === 'number' ? weather.visibility : undefined;
      const w0 = Array.isArray(weather?.weather) ? weather.weather : undefined;

      return {
        currentSeason: this.getCurrentSeason(),
        temperature: `${Math.round(main.temp)}°C (feels like ${Math.round(main.feels_like)}°C)`,
        clothing: this.getClothingRecommendations(main.temp),
        precautions: this.getWeatherPrecautions(weather),
        humidity: typeof main.humidity === 'number' ? `${main.humidity}%` : undefined,
        windSpeed: `${wind.speed ?? 0} m/s`,
        visibility: typeof vis === 'number' ? `${Math.round(vis / 100) / 10} km` : 'Good',
      };
    } catch (error) {
      console.error('Current weather failed:', error);
      return this.getFallbackWeatherInfo();
    }
  }

  async getWeeklyForecast(destination: string): Promise<WeatherForecast[]> {
    try {
      const coords = this.getJharkhandCoordinates(destination);
      const forecast = await this.getForecast(coords);
      const list = Array.isArray(forecast?.list) ? forecast.list : [];

      // Every 8th item approximates one day in the 3-hourly forecast (5-day window)
      return list
        .filter((_, i) => i % 8 === 0)
        .slice(0, 7)
        .map((item: any) => {
          const main = item?.main || {};
          const w0 = Array.isArray(item?.weather) ? item.weather : undefined;
          const dt = typeof item?.dt === 'number' ? item.dt : Date.now() / 1000;
          const pop = typeof item?.pop === 'number' ? item.pop : 0;
          const wind = item?.wind || {};
          // Note: Sys sunrise/sunset often not present on forecast list entries
          return {
            date: new Date(dt * 1000).toLocaleDateString('en-IN'),
            high: Math.round(main.temp_max ?? main.temp ?? 0),
            low: Math.round(main.temp_min ?? main.temp ?? 0),
            condition: w0?.description || '—',
            humidity: main.humidity ?? 0,
            chanceOfRain: Math.round(pop * 100),
            windSpeed: wind.speed ?? 0,
            uvIndex: this.calculateUVIndex(w0?.id ?? 800),
            sunrise: '—',
            sunset: '—',
          } as WeatherForecast;
        });
    } catch (error) {
      console.error('Forecast failed:', error);
      return this.getFallbackForecast();
    }
  }

  // Low-level calls
  private async getCurrentWeather(coords: { lat: number; lon: number }) {
    if (!this.apiKey) throw new Error('OpenWeather API key not found');
    const res = await axios.get(`${this.baseUrl}/weather`, {
      params: { lat: coords.lat, lon: coords.lon, appid: this.apiKey, units: 'metric' },
      timeout: this.timeout,
    });
    return res.data;
  }

  private async getForecast(coords: { lat: number; lon: number }) {
    if (!this.apiKey) throw new Error('OpenWeather API key not found');
    const res = await axios.get(`${this.baseUrl}/forecast`, {
      params: { lat: coords.lat, lon: coords.lon, appid: this.apiKey, units: 'metric' },
      timeout: this.timeout,
    });
    return res.data;
  }

  // Builders
  private buildWeatherIntelligence(current: any, forecast: any, destination: string): WeatherIntelligence {
    const season = this.getCurrentSeason();
    const main = current?.main || {};
    const w0 = Array.isArray(current?.weather) ? current.weather : undefined;

    const temp = Number(main.temp) || 0;
    const tempMin = Number(main.temp_min ?? temp) || 0;
    const tempMax = Number(main.temp_max ?? temp) || 0;
    const condMain = w0?.main || 'Clear';
    const condDesc = w0?.description || condMain;

    return {
      currentSeason: season,
      expectedWeather: condDesc,
      temperature: `${Math.round(temp)}°C (Range: ${Math.round(tempMin)}°C - ${Math.round(tempMax)}°C)`,
      rainfall: this.getRainfallInfo(season, current),
      weatherWarnings: this.generateWeatherWarnings(current, forecast),
      clothingRecommendations: this.getDetailedClothingRecommendations(temp, season),
      weatherBasedActivities: this.getWeatherActivities(temp, condMain, season),
      seasonalConsiderations: this.getSeasonalConsiderations(season),
      bestTimeToVisit: this.getBestTimeToVisit(destination),
      weatherAlerts: this.generateWeatherAlerts(current, forecast),
    };
  }

  // Helpers
  private getCurrentSeason(): string {
    const m = new Date().getMonth() + 1;
    if (m >= 12 || m <= 2) return 'Winter';
    if (m >= 3 && m <= 5) return 'Summer';
    if (m >= 6 && m <= 9) return 'Monsoon';
    return 'Post-Monsoon';
  }

  private getJharkhandCoordinates(destination: string): { lat: number; lon: number } {
    const map: Record<string, { lat: number; lon: number }> = {
      ranchi: { lat: 23.3441, lon: 85.3096 },
      jamshedpur: { lat: 22.8046, lon: 86.2029 },
      deoghar: { lat: 24.4822, lon: 86.6967 },
      dhanbad: { lat: 23.7957, lon: 86.4304 },
      hazaribagh: { lat: 23.9929, lon: 85.3677 },
      bokaro: { lat: 23.6693, lon: 86.1511 },
      netarhat: { lat: 23.4667, lon: 84.25 },
      betla: { lat: 23.8833, lon: 84.1833 },
      parasnath: { lat: 23.95, lon: 86.15 },
    };
    const aliases: Record<string, string> = {
      'betla national park': 'betla',
      'betla park': 'betla',
      'parasnath hill': 'parasnath',
      'parasnath hills': 'parasnath',
    };
    const key = (destination || '').toLowerCase().trim();
    const norm = aliases[key] || key;
    return map[norm] || map['ranchi'];
  }

  private getClothingRecommendations(temp: number): string {
    if (temp < 15) return 'Heavy woolens, jacket, warm cap, gloves recommended';
    if (temp < 25) return 'Light woolens, sweater, light jacket for evenings';
    if (temp < 35) return 'Cotton clothes, light fabrics, sun hat recommended';
    return 'Light cotton, breathable fabrics, sun protection essential';
  }

  private getDetailedClothingRecommendations(temp: number, season: string): string[] {
    const rec: string[] = [];
    if (season === 'Winter') {
      rec.push('Light woolen sweater or cardigan', 'Warm jacket for mornings and evenings', 'Long pants or jeans', 'Closed shoes with socks');
      if (temp < 10) rec.push('Warm cap and light gloves');
    } else if (season === 'Summer') {
      rec.push('Cotton t-shirts and shirts', 'Light colored clothing', 'Sun hat or cap', 'Sunglasses', 'Comfortable walking shoes');
    } else if (season === 'Monsoon') {
      rec.push('Quick-dry clothing', 'Waterproof jacket or raincoat', 'Umbrella', 'Non-slip footwear', 'Plastic bags for electronics');
    } else {
      rec.push('Light layers', 'Comfortable shoes');
    }
    return rec;
  }

  private getWeatherActivities(temp: number, conditionMain: string, season: string): any[] {
    const out: any[] = [];
    const cond = (conditionMain || '').toLowerCase();

    if (season === 'Winter') {
      out.push({
        activity: 'Waterfall visits (Hundru, Dassam, Jonha)',
        suitableWeather: 'Clear, sunny days',
        alternativeIfBadWeather: 'Visit museums or temples',
        season: 'Winter',
        timeOfDay: 'morning' as const,
      });
      out.push({
        activity: 'Wildlife safaris at Betla National Park',
        suitableWeather: 'Clear weather, mild temperatures',
        alternativeIfBadWeather: 'Visit Birsa Zoological Park',
        season: 'Winter',
        timeOfDay: 'morning' as const,
      });
    }

    if (!cond.includes('rain')) {
      out.push({
        activity: 'Temple visits (Baidyanath, Parasnath)',
        suitableWeather: 'Any weather except heavy rain',
        alternativeIfBadWeather: 'Indoor cultural activities',
        season,
        timeOfDay: 'any' as const,
      });
    }

    return out;
  }

  private generateWeatherWarnings(current: any, _forecast: any): string[] {
    const warnings: string[] = [];
    const main = current?.main || {};
    const wind = current?.wind || {};
    const w0 = Array.isArray(current?.weather) ? current.weather : undefined;

    if (Number(main.temp) > 35) warnings.push('High temperature alert - stay hydrated and avoid midday sun');
    if (Number(main.temp) < 5) warnings.push('Cold weather warning - dress warmly and carry extra layers');
    if ((w0?.main || '').toLowerCase().includes('rain')) warnings.push('Rainy conditions - carry umbrella and wear appropriate footwear');
    if (Number(wind.speed) > 10) warnings.push('Windy conditions - secure loose items and be cautious outdoors');

    return warnings;
  }

  private generateWeatherAlerts(current: any, _forecast: any): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const main = current?.main || {};
    if (Number(main.temp) < 8) {
      alerts.push({
        type: 'warning',
        message: 'Cold wave conditions - temperatures below 8°C',
        severity: 'medium',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        affectedActivities: ['Early morning sightseeing', 'Outdoor photography'],
      });
    }
    return alerts;
  }

  private getRainfallInfo(season: string, current: any): string {
    const rain = current?.rain || {};
    if (season === 'Monsoon') return 'High - expect regular rainfall';
    if (season === 'Winter') return 'Minimal - dry season';
    const lastHour = typeof rain['1h'] === 'number' ? `${rain['1h']}mm in last hour` : undefined;
    return lastHour || 'Low to moderate depending on season';
  }

  private getSeasonalConsiderations(season: string): string[] {
    const map: Record<string, string[]> = {
      Winter: [
        'Best time for sightseeing with pleasant weather',
        'Pack warm clothes for early morning and evening',
        'Ideal for outdoor activities and trekking',
      ],
      Summer: [
        'Very hot during day, plan indoor activities during peak hours',
        'Carry sun protection and stay hydrated',
        'Early morning and evening best for outdoor activities',
      ],
      Monsoon: [
        'Heavy rainfall may affect travel plans',
        'Roads to remote areas may be difficult',
        'Beautiful green landscapes but limited outdoor activities',
      ],
      'Post-Monsoon': [
        'Pleasant weather with clear skies',
        'Excellent for photography and sightseeing',
        'Waterfalls at their most beautiful',
      ],
    };
    return map[season] || map['Winter'];
  }

  private getBestTimeToVisit(_destination: string): string {
    return 'October to March (Winter and Post-Monsoon) - pleasant weather, ideal for sightseeing and outdoor activities';
  }

  private getWeatherPrecautions(weather: any): string {
    const main = weather?.main || {};
    const w0 = Array.isArray(weather?.weather) ? weather.weather : undefined;
    const precautions: string[] = [];
    if (Number(main.temp) > 30) precautions.push('Stay hydrated');
    if (Number(main.temp) < 15) precautions.push('Keep warm');
    if ((w0?.main || '').toLowerCase().includes('rain')) precautions.push('Carry rain gear');
    if (Number(main.humidity) > 80) precautions.push('Be prepared for humid conditions');
    return precautions.join(', ') || 'Take normal weather precautions';
  }

  private calculateUVIndex(weatherId: number): number {
    if (weatherId >= 200 && weatherId < 300) return 2; // Thunderstorm
    if (weatherId >= 300 && weatherId < 600) return 4; // Drizzle/Rain
    if (weatherId >= 600 && weatherId < 700) return 3; // Snow
    if (weatherId >= 700 && weatherId < 800) return 5; // Atmosphere
    if (weatherId === 800) return 8; // Clear
    return 6; // Clouds
  }

  // Fallbacks
  private getFallbackWeatherIntelligence(destination: string): WeatherIntelligence {
    const season = this.getCurrentSeason();
    return {
      currentSeason: season,
      expectedWeather: season === 'Winter' ? 'Pleasant and cool' : 'Variable',
      temperature: season === 'Winter' ? '10°C - 25°C' : '15°C - 30°C',
      rainfall: season === 'Monsoon' ? 'High' : 'Low',
      weatherWarnings: [],
      clothingRecommendations: this.getDetailedClothingRecommendations(20, season),
      weatherBasedActivities: this.getWeatherActivities(20, 'Clear', season),
      seasonalConsiderations: this.getSeasonalConsiderations(season),
      bestTimeToVisit: this.getBestTimeToVisit(destination),
      weatherAlerts: [],
    };
  }

  private getFallbackWeatherInfo(): WeatherInfo {
    const season = this.getCurrentSeason();
    return {
      currentSeason: season,
      temperature: season === 'Winter' ? '15°C - 22°C' : '20°C - 28°C',
      clothing: this.getClothingRecommendations(season === 'Winter' ? 18 : 25),
      precautions: 'Standard weather precautions recommended',
    };
  }

  private getFallbackForecast(): WeatherForecast[] {
    const out: WeatherForecast[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        date: d.toLocaleDateString('en-IN'),
        high: 25,
        low: 15,
        condition: 'Pleasant',
        humidity: 60,
        chanceOfRain: 10,
        windSpeed: 5,
        uvIndex: 6,
        sunrise: '—',
        sunset: '—',
      });
    }
    return out;
  }
}

// Export singleton instance
export const jharkhandWeather = new JharkhandWeatherService();
