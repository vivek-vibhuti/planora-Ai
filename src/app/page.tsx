import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TripPlanner from '@/components/features/TripPlanner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Mountain, Sparkles, Calendar, MapPin, Users, IndianRupee, 
  Search, Cloud, MessageSquare, Zap 
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full shadow-lg bg-white/80 backdrop-blur">
              <Mountain className="w-5 h-5 text-green-600" />
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Powered by AI • Real-time Data</span>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl sm:mb-6">
              <span className="text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text">
                PLANORA AI
              </span>
              <span className="block mt-2 text-2xl text-gray-700 sm:text-3xl md:text-4xl">
                Jharkhand Trip Planner
              </span>
            </h1>

            <p className="max-w-3xl mx-auto mb-8 text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
              Experience the land of forests, waterfalls, and rich tribal culture with <strong>real-time AI planning</strong>.
              From live weather updates to current local recommendations, discover Jharkhand with intelligence that adapts to today's conditions.
            </p>

            {/* Enhanced features highlight */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 text-green-700 bg-green-100 rounded-full">
                <Search className="w-4 h-4" />
                Live Local Search
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-blue-700 bg-blue-100 rounded-full">
                <Cloud className="w-4 h-4" />
                Real-time Weather
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-purple-700 bg-purple-100 rounded-full">
                <Zap className="w-4 h-4" />
                Instant Planning
              </div>
            </div>

            {/* Primary CTA row */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#plan"
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition-colors bg-green-600 shadow-lg sm:px-8 rounded-xl hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <IndianRupee className="w-5 h-5 mr-2" />
                Start Planning with AI
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-green-700 transition-colors border-2 border-green-600 sm:px-8 rounded-xl hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with AI Assistant
              </Link>
            </div>
          </div>

          {/* Trip Planner Widget */}
          <div id="plan" className="max-w-4xl mx-auto">
            <TripPlanner />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl sm:mb-4">
              Real-Time AI Trip Planning Features
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
              Advanced AI with live data integration for the most current Jharkhand travel experience
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Search,
                title: 'Live Local Search',
                desc: 'Real-time SERP API integration finds current local cuisine, handicrafts, and attractions',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: Cloud,
                title: 'Weather Intelligence',
                desc: 'OpenWeather API provides live conditions, seasonal advice, and packing recommendations',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Sparkles,
                title: 'Gemini AI Planning',
                desc: 'Advanced AI creates personalized itineraries using real-time data and local expertise',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: MapPin,
                title: 'Enhanced Local Insights',
                desc: 'Current handicraft markets, authentic restaurants, and cultural experiences from live search',
                color: 'from-orange-500 to-orange-600',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={i}
                  className="transition-all duration-300 border-0 shadow-lg group hover:shadow-xl motion-reduce:transition-none hover:-translate-y-1 bg-white/80 backdrop-blur"
                >
                  <CardHeader className="pb-3 text-center sm:pb-4">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform motion-reduce:transition-none`}
                    >
                      <Icon className="text-white h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-center text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 bg-white/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl sm:mb-4">
              Popular Jharkhand Destinations
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">Discover hidden gems with current local insights and weather data</p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Ranchi',
                desc: 'Capital city with stunning waterfalls and Rock Garden',
                popular: 'Hundru Falls, Dassam Falls, Rock Garden',
                enhanced: 'Live weather + local dhuska spots',
                emoji: '🏔️',
                slug: 'ranchi',
              },
              {
                name: 'Deoghar',
                desc: 'Sacred city with the famous Baidyanath Jyotirlinga',
                popular: 'Baidyanath Temple, Naulakha Temple',
                enhanced: 'Current temple timings + local guides',
                emoji: '🛕',
                slug: 'deoghar',
              },
              {
                name: 'Netarhat',
                desc: 'Hill station known as the Queen of Chotanagpur',
                popular: 'Sunrise Point, Magnolia Sunset Point',
                enhanced: 'Weather forecasts + sunrise times',
                emoji: '🌅',
                slug: 'netarhat',
              },
              {
                name: 'Jamshedpur',
                desc: 'Steel city with beautiful parks and lakes',
                popular: 'Jubilee Park, Dimna Lake, Dalma Wildlife',
                enhanced: 'Local handicraft markets + weather',
                emoji: '🏭',
                slug: 'jamshedpur',
              },
              {
                name: 'Hazaribagh',
                desc: 'Wildlife sanctuary and scenic hill station',
                popular: 'Hazaribagh National Park, Canary Hill',
                enhanced: 'Park timings + seasonal wildlife tips',
                emoji: '🦌',
                slug: 'hazaribagh',
              },
              {
                name: 'Betla National Park',
                desc: 'Tiger reserve with ancient Palamau Fort',
                popular: 'Tiger Safari, Palamau Fort, Betla Fort',
                enhanced: 'Safari availability + weather conditions',
                emoji: '🐅',
                slug: 'betla-national-park',
              },
            ].map((dest, i) => (
              <Card
                key={i}
                className="transition-all duration-300 group hover:shadow-xl motion-reduce:transition-none hover:-translate-y-1 bg-white/90 backdrop-blur"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl sm:text-3xl">{dest.emoji}</span>
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{dest.name}</h3>
                  </div>
                  <p className="mb-4 text-gray-600">{dest.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="p-3 mb-3 rounded-lg bg-green-50">
                    <p className="mb-1 text-sm font-medium text-green-800">Popular Attractions:</p>
                    <p className="text-sm text-green-700">{dest.popular}</p>
                  </div>
                  <div className="p-3 mb-4 rounded-lg bg-blue-50">
                    <p className="mb-1 text-sm font-medium text-blue-800">AI Enhanced:</p>
                    <p className="text-sm text-blue-700">{dest.enhanced}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`#plan`}
                      className="flex-1 px-3 py-2 font-medium text-center text-green-700 transition-colors rounded-lg hover:text-green-800 bg-green-50 hover:bg-green-100"
                    >
                      Plan Trip
                    </Link>
                    <Link
                      href={`/chat?q=Plan trip to ${dest.name}`}
                      className="font-medium text-blue-700 hover:text-blue-800"
                    >
                      Chat →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Features Showcase */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            What Makes Planora AI Different?
          </h2>
          <div className="grid gap-6 mb-8 sm:grid-cols-3">
            <div className="p-6 bg-white/80 backdrop-blur rounded-xl">
              <Search className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Live Data Integration</h3>
              <p className="text-sm text-gray-600">Real-time search for current local food, handicrafts, and attractions</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur rounded-xl">
              <Cloud className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Weather Intelligence</h3>
              <p className="text-sm text-gray-600">Current conditions, seasonal advice, and packing recommendations</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur rounded-xl">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Interactive Chat</h3>
              <p className="text-sm text-gray-600">Ask questions and get instant responses with live data</p>
            </div>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-gray-900 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-50"
          >
            <MessageSquare className="w-5 h-5" />
            Try the AI Chat Assistant
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl sm:mb-6">
            Ready to Explore Jharkhand with AI?
          </h2>
          <p className="mb-6 text-lg sm:text-xl sm:mb-8 opacity-90">
            Join thousands of travelers using real-time AI planning for authentic Jharkhand experiences
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="#plan"
              className="px-6 py-3 text-lg font-bold text-green-600 transition-colors bg-white shadow-lg sm:px-8 sm:py-4 rounded-xl hover:bg-gray-50"
            >
              <IndianRupee className="inline w-5 h-5 mr-2" />
              Start Planning with Real-time Data
            </Link>
            <Link
              href="/chat"
              className="px-6 py-3 text-lg font-bold text-white transition-colors border-2 border-white sm:px-8 sm:py-4 rounded-xl hover:bg-white hover:text-green-600"
            >
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Chat with AI Assistant
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
