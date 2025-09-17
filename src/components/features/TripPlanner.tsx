'use client';

import { useState, useMemo } from 'react';
import {
  Calendar, MapPin, Users, IndianRupee, Sparkles, Loader2,
  ArrowLeft, Download, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isValidJharkhandDestination } from '@/lib/utils';

interface TripPlannerProps {
  onPlanGenerated?: (plan: any) => void;
}

export default function TripPlanner({ onPlanGenerated }: TripPlannerProps) {
  const [formData, setFormData] = useState({
    destination: '',
    days: '3',
    budget: '',
    travelers: '2',
    startDate: '',
    interests: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [tripPlan, setTripPlan] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const interests = [
    'Temples & Religious Sites', 'Waterfalls & Nature', 'Wildlife & Safaris',
    'Tribal Culture', 'Adventure Activities', 'Photography',
    'Hill Stations', 'Local Cuisine', 'Festivals & Events',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateForm = () => {
    if (!formData.destination.trim()) {
      setError('Please enter a destination');
      return false;
    }
    if (!isValidJharkhandDestination(formData.destination)) {
      setError('Please enter a valid Jharkhand destination (e.g., Ranchi, Deoghar, Netarhat)');
      return false;
    }
    if (!formData.budget || parseInt(formData.budget) < 5000) {
      setError('Please enter a budget of at least ₹5,000');
      return false;
    }
    if (!formData.days || parseInt(formData.days) < 1 || parseInt(formData.days) > 15) {
      setError('Please enter between 1-15 days');
      return false;
    }
    return true;
  };

  const handlePlanTrip = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/planTrip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: formData.destination,
          days: parseInt(formData.days),
          budget: `₹${formData.budget}`,
          travelers: parseInt(formData.travelers),
          preferences: {
            interests: formData.interests,
            budgetCategory: getBudgetCategory(parseInt(formData.budget)),
          },
          travelDates: formData.startDate
            ? {
                startDate: formData.startDate,
                endDate: getEndDate(formData.startDate, parseInt(formData.days)),
              }
            : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate trip plan');

      const result = await response.json();
      if (result.success) {
        setTripPlan(result.tripPlan);
        setShowResults(true);
        onPlanGenerated?.(result.tripPlan);
        // stash for chat assistant context
        sessionStorage.setItem('currentTripPlan', JSON.stringify(result.tripPlan));
      } else {
        setError(result.message || result.error || 'Failed to generate trip plan');
      }
    } catch (err) {
      console.error('Trip planning failed:', err);
      setError('Failed to generate trip plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetCategory = (budget: number) => {
    if (budget < 10000) return 'budget';
    if (budget < 25000) return 'mid-range';
    return 'luxury';
  };

  const getEndDate = (startDate: string, days: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + days - 1);
    return end.toISOString().split('T');
  };

  const handlePlanAnother = () => {
    setShowResults(false);
    setTripPlan(null);
    setStep(1);
    setFormData({ destination: '', days: '3', budget: '', travelers: '2', startDate: '', interests: [] });
    setError('');
  };

  const handleDownloadPlan = () => {
    const content = `
PLANORA AI - Trip Plan
===================

Destination: ${tripPlan?.tripOverview?.destination || 'N/A'}
Duration: ${tripPlan?.tripOverview?.duration || 'N/A'}
Budget: ${tripPlan?.tripOverview?.totalBudget || 'N/A'}
Best Time: ${tripPlan?.tripOverview?.bestTimeToVisit || 'N/A'}

Overview:
${tripPlan?.tripOverview?.overview || 'N/A'}

Budget Breakdown:
- Accommodation: ${tripPlan?.budgetBreakdown?.accommodation || 'N/A'}
- Food: ${tripPlan?.budgetBreakdown?.food || 'N/A'}
- Transportation: ${tripPlan?.budgetBreakdown?.transportation || 'N/A'}
- Activities: ${tripPlan?.budgetBreakdown?.activities || 'N/A'}
- Total: ${tripPlan?.budgetBreakdown?.total || 'N/A'}

Weather Info:
- Season: ${tripPlan?.weatherInfo?.currentSeason || 'N/A'}
- Temperature: ${tripPlan?.weatherInfo?.temperature || 'N/A'}
- Clothing: ${tripPlan?.weatherInfo?.clothing || 'N/A'}

Generated by PLANORA AI - Jharkhand Trip Planner
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripPlan?.tripOverview?.destination || 'Jharkhand'}-Trip-Plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Results view
  if (showResults && tripPlan) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Success header */}
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  🎉 Your {tripPlan.tripOverview?.destination} Trip Plan is Ready!
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{tripPlan.tripOverview?.duration}</span>
                  <span className="inline-flex items-center gap-1"><IndianRupee className="w-4 h-4" />{tripPlan.tripOverview?.totalBudget}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{tripPlan.tripOverview?.state}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigator.share?.({
                      title: `${tripPlan.tripOverview?.destination} Trip Plan`,
                      text: 'Check out my AI-generated trip plan!',
                    })
                  }
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleDownloadPlan}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Overview */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Trip Overview</h2>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700">{tripPlan.tripOverview?.overview}</p>
          </CardContent>
        </Card>

        {/* Budget & Weather */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Budget Breakdown</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <RowPill label="Accommodation" value={tripPlan.budgetBreakdown?.accommodation} color="green" />
              <RowPill label="Food & Dining" value={tripPlan.budgetBreakdown?.food} color="blue" />
              <RowPill label="Transportation" value={tripPlan.budgetBreakdown?.transportation} color="purple" />
              <RowPill label="Activities" value={tripPlan.budgetBreakdown?.activities} color="orange" />
              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Budget:</span>
                  <span className="text-green-600">{tripPlan.budgetBreakdown?.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Weather & Travel Info</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Block title="Current Season" color="blue">
                <p className="text-blue-800">{tripPlan.weatherInfo?.currentSeason}</p>
                <p className="text-blue-800">{tripPlan.weatherInfo?.temperature}</p>
              </Block>
              <Block title="What to Pack" color="green">
                <p className="text-green-800">{tripPlan.weatherInfo?.clothing}</p>
              </Block>
              <Block title="Best Time to Visit" color="orange">
                <p className="text-orange-800">{tripPlan.tripOverview?.bestTimeToVisit}</p>
              </Block>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handlePlanAnother} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Plan Another Trip
          </Button>
          <Button onClick={() => window.open('/chat?context=trip-details', '_blank')} className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Chat with AI for Details
          </Button>
        </div>

        {tripPlan.enhancementStatus && (
          <p className="text-sm text-center text-gray-600">{tripPlan.enhancementStatus}</p>
        )}
      </div>
    );
  }

  // Step 1: Basic details
  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Plan Your Jharkhand Adventure</h2>
            </div>
            <p className="text-gray-600">Tell us about your dream trip and let AI create the perfect itinerary</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <Alert error={error} />}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Destination in Jharkhand"
              placeholder="e.g., Ranchi, Deoghar, Netarhat"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              icon={<MapPin className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              label="Number of Days"
              type="number"
              min="1"
              max="15"
              placeholder="3"
              value={formData.days}
              onChange={(e) => handleInputChange('days', e.target.value)}
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Total Budget (₹)"
              type="number"
              min="5000"
              placeholder="25000"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              icon={<IndianRupee className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              label="Number of Travelers"
              type="number"
              min="1"
              max="10"
              placeholder="2"
              value={formData.travelers}
              onChange={(e) => handleInputChange('travelers', e.target.value)}
              icon={<Users className="w-4 h-4 text-gray-400" />}
              required
            />
          </div>

          <Input
            label="Preferred Start Date (Optional)"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              disabled={!formData.destination || !formData.budget || !formData.days}
            >
              Customize Preferences →
            </Button>
            <Button onClick={handlePlanTrip} disabled={isLoading} loading={isLoading} className="min-w-[140px]">
              {isLoading ? 'Creating Plan...' : 'Create Trip Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Interests
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Customize Your Experience</h2>
          <p className="text-gray-600">Select your interests to get personalized recommendations</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-700">
            What interests you most? (Select multiple)
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={[
                  'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                  formData.interests.includes(interest)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700',
                ].join(' ')}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {error && <Alert error={error} />}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep(1)}>
            ← Back to Details
          </Button>
          <Button onClick={handlePlanTrip} disabled={isLoading} loading={isLoading} className="min-w-[160px]">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Plan...
              </>
            ) : (
              'Create Trip Plan'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RowPill({ label, value, color }: { label: string; value: string; color: 'green' | 'blue' | 'purple' | 'orange' }) {
  const colorMap = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  } as const;
  return (
    <div className="flex justify-between p-3 bg-white border rounded-lg">
      <span className="font-medium text-gray-900">{label}</span>
      <span className={`font-bold ${colorMap[color]!.split(' ')}`}>{value}</span>
    </div>
  );
}

function Block({ title, color, children }: { title: string; color: 'blue' | 'green' | 'orange'; children: React.ReactNode }) {
  const tone = {
    blue: 'bg-blue-50 text-blue-900',
    green: 'bg-green-50 text-green-900',
    orange: 'bg-orange-50 text-orange-900',
  }[color];
  return (
    <div className={`${tone} rounded-lg p-4`}>
      <h4 className="mb-2 font-semibold">{title}</h4>
      <div className={tone.includes('text-') ? tone.replace('text-900', 'text-800') : ''}>{children}</div>
    </div>
  );
}

function Alert({ error }: { error: string }) {
  return <div className="p-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">{error}</div>;
}
