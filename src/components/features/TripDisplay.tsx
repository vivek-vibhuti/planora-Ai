'use client';

import { useState, useMemo } from 'react';
import {
  MapPin, Calendar, IndianRupee, Clock, Phone,
  Cloud, Download, Share2, ChevronDown, ChevronRight,
  Thermometer, AlertTriangle, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CompleteTripPlan } from '@/types/trip';

interface TripDisplayProps {
  tripPlan: CompleteTripPlan;
}

type Tab = 'itinerary' | 'budget' | 'weather' | 'contacts';

export default function TripDisplay({ tripPlan }: TripDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');

  const onDownloadPDF = () => {
    console.log('Downloading PDF...');
  };

  const onShare = async () => {
    const title = `${tripPlan.tripOverview.destination} Trip Plan - PLANORA AI`;
    const text = `Check out my AI-generated trip plan for ${tripPlan.tripOverview.destination}!`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch { /* cancelled */ }
    } else if (navigator.clipboard && url) {
      await navigator.clipboard.writeText(url);
    }
  };

  const budget = tripPlan.budgetBreakdown;
  const weather = tripPlan.weatherInfo;
  const contactsEntries = useMemo(
    () => Object.entries(tripPlan.emergencyContacts || {}),
    [tripPlan]
  );
  const enhanced = tripPlan.enhanced;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {tripPlan.tripOverview.destination} Adventure
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{tripPlan.tripOverview.duration}</span>
                <span className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4" />{tripPlan.tripOverview.totalBudget}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{tripPlan.tripOverview.state}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{tripPlan.tripOverview.overview}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={onDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <nav className="flex gap-6 overflow-x-auto px-1">
          <TabButton id="itinerary" label="Daily Itinerary" Icon={Calendar} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="budget" label="Budget Breakdown" Icon={IndianRupee} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="weather" label="Weather Info" Icon={Cloud} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="contacts" label="Emergency Contacts" Icon={Phone} activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>

      {/* Itinerary */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {tripPlan.dailyItinerary.map((day) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{day.theme}</h3>
                      <p className="text-sm text-gray-600">{day.activities.length} activities • {day.totalDayCost}</p>
                    </div>
                  </div>
                  {expandedDay === day.day ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>

              {expandedDay === day.day && (
                <CardContent className="border-t bg-gray-50 animate-fadeIn">
                  <div className="space-y-4">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">{activity.time}</span>
                            <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                          </div>
                          <div className="text-sm font-medium text-gray-600">{activity.cost}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{activity.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />{activity.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        {activity.contactInfo && (
                          <div className="mt-2 text-sm text-green-600 inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />{activity.contactInfo}
                          </div>
                        )}
                      </div>
                    ))}

                    {day.travelTips?.length ? (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 mb-2 inline-flex items-center gap-2">
                          <Info className="h-4 w-4" /> Day {day.day} Tips
                        </h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {day.travelTips.map((tip, i) => <li key={i}>• {tip}</li>)}
                        </ul>
                      </div>
                    ) : null}

                    {day.weatherConsiderations && (
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h5 className="font-medium text-orange-900 mb-2 inline-flex items-center gap-2">
                          <Thermometer className="h-4 w-4" /> Weather Considerations
                        </h5>
                        <p className="text-sm text-orange-800">{day.weatherConsiderations}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Budget */}
      {activeTab === 'budget' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Budget Breakdown</h2>
            <p className="text-gray-600">Detailed cost analysis for your {tripPlan.tripOverview.duration} trip</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <BudgetRow label="Accommodation" value={budget.accommodation} color="green" />
                <BudgetRow label="Food & Dining" value={budget.food} color="blue" />
                <BudgetRow label="Transportation" value={budget.transportation} color="purple" />
                <BudgetRow label="Activities" value={budget.activities} color="orange" />
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Shopping" value={budget.shopping} />
                  <Row label="Miscellaneous" value={budget.miscellaneous} />
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Budget:</span>
                      <span className="text-green-600">{budget.total}</span>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    Daily Average: {budget.dailyAverage}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather */}
      {activeTab === 'weather' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Weather Information</h2>
            <p className="text-gray-600">Current season and weather recommendations</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Current Conditions</h3>
                  <p className="text-blue-800">{weather.currentSeason} season</p>
                  <p className="text-blue-800">{weather.temperature}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">What to Wear</h3>
                  <p className="text-green-800">{weather.clothing}</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2 inline-flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Weather Precautions
                </h3>
                <p className="text-orange-800">{weather.precautions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts */}
      {activeTab === 'contacts' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
            <p className="text-gray-600">Important numbers to keep handy during your trip</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {contactsEntries.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900 capitalize">{humanize(k)}:</span>
                  <a href={`tel:${v}`} className="text-green-600 font-medium hover:text-green-700">{v}</a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cultural Experiences */}
      {tripPlan.culturalExperiences?.length ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Cultural Experiences</h2>
            <p className="text-gray-600">Authentic local experiences to enrich your journey</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {tripPlan.culturalExperiences.map((exp, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{exp.experience}</h3>
                  <p className="text-gray-600 text-sm mb-3">{exp.description}</p>
                  <div className="space-y-2 text-sm">
                    <Row label="Location" value={exp.location} />
                    <Row label="Cost" value={<span className="font-medium text-green-600">{exp.cost}</span>} />
                    <Row label="Duration" value={exp.duration} />
                    <Row label="Best Time" value={exp.bestTime} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Travel Tips */}
      {tripPlan.travelTips?.length ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Travel Tips</h2>
            <p className="text-gray-600">Essential advice for your Jharkhand adventure</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {tripPlan.travelTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-blue-800">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Local Cuisine */}
      {enhanced?.localCuisine?.highlights?.length ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Local Cuisine</h2>
            <p className="text-gray-600">Must-try dishes and food zones</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Highlights</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {enhanced.localCuisine.highlights.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                {enhanced.localCuisine.areas?.length ? (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Food Areas</h3>
                    <p className="text-sm text-gray-700">{enhanced.localCuisine.areas.join(', ')}</p>
                  </div>
                ) : null}
                {enhanced.localCuisine.suggestedSlots ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-1">Suggested Slots</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      {enhanced.localCuisine.suggestedSlots.day1_breakfast && <li>Day 1 breakfast: {enhanced.localCuisine.suggestedSlots.day1_breakfast}</li>}
                      {enhanced.localCuisine.suggestedSlots.day2_dinner && <li>Day 2 dinner: {enhanced.localCuisine.suggestedSlots.day2_dinner}</li>}
                      {enhanced.localCuisine.suggestedSlots.day3_snacks && <li>Day 3 snacks: {enhanced.localCuisine.suggestedSlots.day3_snacks}</li>}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Handicrafts & Shopping */}
      {enhanced?.handicrafts?.buy?.length ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Handicrafts & Shopping</h2>
            <p className="text-gray-600">Where and what to buy</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Buy</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {enhanced.handicrafts.buy.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                {enhanced.handicrafts.markets?.length ? (
                  <Row label="Markets" value={enhanced.handicrafts.markets.join(', ')} />
                ) : null}
                {enhanced.handicrafts.notes?.length ? (
                  <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-900">
                    <span className="font-medium">Notes: </span>{enhanced.handicrafts.notes.join(' · ')}
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* 3-Day Micro Itinerary */}
      {(enhanced?.microItinerary?.day1?.length ||
        enhanced?.microItinerary?.day2?.length ||
        enhanced?.microItinerary?.day3?.length) ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">3-Day Micro Itinerary</h2>
            <p className="text-gray-600">Quick slots to pair with your day plan</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Day 1</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {enhanced?.microItinerary?.day1?.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Day 2</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {enhanced?.microItinerary?.day2?.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Day 3</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {enhanced?.microItinerary?.day3?.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function TabButton({
  id, label, Icon, activeTab, setActiveTab,
}: {
  id: Tab; label: string; Icon: React.ComponentType<any>;
  activeTab: Tab; setActiveTab: (t: Tab) => void;
}) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={[
        'py-3 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2 transition-colors',
        isActive ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      ].join(' ')}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function BudgetRow({ label, value, color }: { label: string; value: string; color: 'green' | 'blue' | 'purple' | 'orange' }) {
  const colorMap = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  } as const;
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-white border">
      <span className="font-medium text-gray-900">{label}</span>
      <span className={`font-bold ${colorMap[color]!.split(' ')}`}>{value}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  );
}

function humanize(key: string) {
  return key.replace(/([A-Z])/g, ' $1').trim();
}
