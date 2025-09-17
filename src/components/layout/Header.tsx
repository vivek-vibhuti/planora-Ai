'use client';

import Link from 'next/link';
import { Mountain, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const nav = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/destinations', label: 'Destinations' },
      { href: '/about', label: 'About' },
    ],
    []
  );

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">PLANORA AI</h1>
              <p className="text-xs text-gray-500 -mt-1">Jharkhand Trip Planner</p>
            </div>
            <span className="sm:hidden text-lg font-bold text-gray-800">PLANORA AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'font-medium transition-colors',
                  isActive(item.href) ? 'text-green-600' : 'text-gray-700 hover:text-green-600',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA + mini attribution */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">View Sample</Button>
            <Link href="/plan">
              <Button>Plan Trip</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
            <nav className="flex flex-col gap-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'px-2 py-2 rounded-lg font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-green-700 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50',
                  ].join(' ')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-3">
                <Button variant="outline" size="sm" onClick={() => setIsMenuOpen(false)}>
                  View Sample
                </Button>
                <Link href="/plan">
                  <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                    Plan Trip
                  </Button>
                </Link>
              </div>

              {/* Powered by row (mobile) */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <span className="text-[11px] px-2 py-1 rounded-full bg-blue-600/10 text-blue-700 text-center">Gemini</span>
                <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-600/10 text-emerald-700 text-center">SerpAPI</span>
                <span className="text-[11px] px-2 py-1 rounded-full bg-yellow-600/10 text-yellow-700 text-center">OpenWeather</span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
