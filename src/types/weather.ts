export interface WeatherInfo {
  currentSeason: string
  temperature: string
  clothing: string
  precautions: string
  humidity?: string
  windSpeed?: string
  visibility?: string
}

export interface WeatherIntelligence {
  currentSeason: string
  expectedWeather: string
  temperature: string
  rainfall: string
  weatherWarnings: string[]
  clothingRecommendations: string[]
  weatherBasedActivities: WeatherActivity[]
  seasonalConsiderations: string[]
  bestTimeToVisit: string
  weatherAlerts?: WeatherAlert[]
}

export interface WeatherActivity {
  activity: string
  suitableWeather: string
  alternativeIfBadWeather: string
  season: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any'
}

export interface WeatherAlert {
  type: 'warning' | 'advisory' | 'watch'
  message: string
  severity: 'low' | 'medium' | 'high'
  validUntil: string
  affectedActivities: string[]
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  humidity: number
  chanceOfRain: number
  windSpeed: number
  uvIndex: number
  sunrise: string
  sunset: string
}
