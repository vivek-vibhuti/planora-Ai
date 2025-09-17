'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Cloud, Sun, CloudRain, Snowflake, Wind, Droplets,
  Thermometer, Eye, Umbrella, Shirt, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { WeatherInfo, WeatherForecast, WeatherAlert } from '@/types/weather';

interface WeatherWidgetProps {
  destination: string;
  weatherInfo?: WeatherInfo;
  showForecast?: boolean;
  compact?: boolean;
}

export default function WeatherWidget({
  destination,
  weatherInfo,
  showForecast = false,
  compact = false,
}: WeatherWidgetProps) {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showForecast || !destination) return;
    fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, showForecast]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weather?destination=${encodeURIComponent(destination)}`);
      if (response.ok) {
        const data = await response.json();
        setForecast(data.forecast || []);
        setAlerts(data.alerts || []);
      } else {
        setForecast([]);
        setAlerts([]);
      }
    } catch (error) {
      console.error('Weather fetch failed:', error);
      setForecast([]);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="h-6 w-6 text-gray-500" />;
    if (c.includes('snow')) return <Snowflake className="h-6 w-6 text-blue-300" />;
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  const season = weatherInfo?.currentSeason || 'Season';
  const temp = weatherInfo?.temperature || '—';
  const humidity = weatherInfo?.humidity;
  const wind = weatherInfo?.windSpeed;
  const visibility = weatherInfo?.visibility;

  // Compact banner
  if (compact && weatherInfo) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{destination} Weather</h3>
              <p className="text-sm text-gray-600">{season} • {temp}</p>
            </div>
            <div className="text-right">
              {getWeatherIcon(season)}
              <p className="text-xs text-gray-500 mt-1">Current</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={`${alert.type}-${idx}`}
              className={[
                'flex items-start gap-3 p-4 rounded-lg border',
                alert.severity === 'high'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : alert.severity === 'medium'
                  ? 'bg-orange-50 border-orange-200 text-orange-800'
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800',
              ].join(' ')}
            >
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{alert.type.toUpperCase()}: {alert.message}</p>
                {!!alert.affectedActivities?.length && (
                  <p className="text-sm mt-1">Affected activities: {alert.affectedActivities.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Weather */}
      {weatherInfo ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Current Weather in {destination}</h2>
            <p className="text-gray-600">Live weather conditions and recommendations</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <Thermometer className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Temperature</h3>
                    <p className="text-blue-800">{temp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <Cloud className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Season</h3>
                    <p className="text-green-800">{season}</p>
                  </div>
                </div>

                {(humidity || wind) && (
                  <div className="grid grid-cols-2 gap-4">
                    {humidity && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Droplets className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Humidity</p>
                          <p className="text-sm text-gray-600">{humidity}</p>
                        </div>
                      </div>
                    )}
                    {wind && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Wind className="h-6 w-6 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Wind</p>
                          <p className="text-sm text-gray-600">{wind}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    What to Wear
                  </h3>
                  <p className="text-orange-800 text-sm">{weatherInfo.clothing}</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Weather Precautions
                  </h3>
                  <p className="text-red-800 text-sm">{weatherInfo.precautions}</p>
                </div>

                {visibility && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Visibility
                    </h3>
                    <p className="text-purple-800 text-sm">{visibility}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Forecast */}
      {showForecast && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">7-Day Forecast</h2>
            <p className="text-gray-600">Extended weather outlook for trip planning</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : forecast.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
                {forecast.map((day, idx) => (
                  <div key={`${day.date}-${idx}`} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">{day.date}</p>
                    <div className="flex justify-center mb-3">{getWeatherIcon(day.condition)}</div>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold">{day.high}°/{day.low}°</p>
                      <p className="text-gray-600">{day.condition}</p>
                      <div className="flex items-center justify-center gap-1 text-blue-600">
                        <Umbrella className="h-3 w-3" />
                        <span>{day.chanceOfRain}%</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <Droplets className="h-3 w-3" />
                        <span>{day.humidity}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Weather forecast unavailable</p>
                <p className="text-sm">Using general seasonal recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Seasonal Tips */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Seasonal Travel Tips for {destination}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Best Time to Visit</h4>
              <p className="text-sm text-gray-700 mb-4">
                October to March offers the most pleasant weather for sightseeing and outdoor activities in Jharkhand.
              </p>
              <h4 className="font-medium text-gray-900 mb-2">Current Season Activities</h4>
              <div className="text-sm text-gray-700 space-y-1">
                {season === 'Winter' && (
                  <>
                    <p>• Perfect for waterfall visits and trekking</p>
                    <p>• Ideal weather for wildlife safaris</p>
                    <p>• Great visibility for photography</p>
                  </>
                )}
                {season === 'Summer' && (
                  <>
                    <p>• Visit temples and indoor attractions during day</p>
                    <p>• Early morning and evening outdoor activities</p>
                    <p>• Stay in air-conditioned accommodations</p>
                  </>
                )}
                {season === 'Monsoon' && (
                  <>
                    <p>• Spectacular waterfall experiences</p>
                    <p>• Lush green landscapes for photography</p>
                    <p>• Indoor cultural activities recommended</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Packing Essentials</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• {weatherInfo?.clothing || 'Comfortable seasonal clothing'}</p>
                <p>• Comfortable walking shoes</p>
                <p>• Sunscreen and sunglasses</p>
                <p>• First aid kit and medications</p>
                <p>• Portable charger and camera</p>
                {season === 'Monsoon' && (
                  <>
                    <p>• Waterproof bags for electronics</p>
                    <p>• Quick-dry towels</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
