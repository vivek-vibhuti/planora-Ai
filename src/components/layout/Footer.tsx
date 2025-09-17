import Link from 'next/link';
import { Mountain, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">PLANORA AI</h3>
                <p className="text-sm text-gray-400">Jharkhand Trip Planner</p>
              </div>
            </div>
            <p className="text-gray-300 mb-5 max-w-md">
              Discover the hidden gems of Jharkhand with AI-powered trip planning. From the spiritual vibes of Deoghar to the natural beauty of Netarhat, let us craft the perfect adventure.
            </p>

            {/* Powered by */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Powered by</h4>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs bg-blue-600/20 text-blue-300 border border-blue-700/40"
                  title="Gemini LLM for itinerary generation"
                >
                  Gemini AI
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-700/40"
                  title="SerpAPI for real-time search and reviews"
                >
                  SerpAPI
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs bg-yellow-600/20 text-yellow-300 border border-yellow-700/40"
                  title="OpenWeather for live weather and forecasts"
                >
                  OpenWeather
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/plan" className="text-gray-300 hover:text-white transition-colors">Plan Trip</Link></li>
              <li><Link href="/sample-itinerary" className="text-gray-300 hover:text-white transition-colors">Sample Itinerary</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+91 651-2331828</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400" />
                <span>hello@planora.ai</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 mt-1" />
                <span>
                  Jharkhand Tourism Board
                  <br />
                  Ranchi, Jharkhand, India
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold text-gray-400 mb-2">Emergency Contacts</h5>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Tourist Helpline: 0651-2400496</div>
                <div>Police: 100 | Medical: 108</div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <h4 className="text-lg font-semibold mb-4">Popular Jharkhand Destinations</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Ranchi', 'Deoghar', 'Netarhat', 'Jamshedpur', 'Hazaribagh', 'Betla National Park'].map((d) => (
              <Link
                key={d}
                href={`/destinations/${d.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} PLANORA AI. All rights reserved. Powered by Gemini AI & Real-time Intelligence.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
