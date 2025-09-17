'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Send, User, Bot, Mountain, ArrowLeft, MapPin, Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Role = 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
  id: string;
}

export default function ChatPageContent() {
  const searchParams = useSearchParams();
const context = searchParams?.get("context") ?? null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<any>(null);

  // Scroll management
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isLoading]);

  // Load contextual trip plan if coming from planner
  useEffect(() => {
    if (context === 'trip-details') {
      const storedTripPlan = sessionStorage.getItem('currentTripPlan');
      if (storedTripPlan) {
        const plan = JSON.parse(storedTripPlan);
        setTripPlan(plan);

        const contextMessage: Message = {
          id: 'context-' + Date.now(),
          role: 'assistant',
          content:
            `Hi! The ${plan.tripOverview?.destination} plan is loaded: ${plan.tripOverview?.duration}, budget ${plan.tripOverview?.totalBudget}.\n\n` +
            `What would you like to know more about?\n• Daily activities and timings\n• Hotel recommendations and contacts\n• Local food and restaurants\n• Transportation options\n• Weather and packing tips\n• Cultural experiences\n• Budget optimization\n• Alternative activities\n\nJust ask anything!`,
        };
        setMessages([contextMessage]);
      }
    }
  }, [context]);

  const placeholder = useMemo(
    () =>
      tripPlan
        ? 'Ask about hotels, food, weather, budget...'
        : 'Ask about Jharkhand destinations (e.g., Plan 3 days in Ranchi under ₹20000)',
    [tripPlan]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse = '';

      if (tripPlan) {
        aiResponse = generateContextualResponse(userMessage.content, tripPlan);
      } else {
        aiResponse =
          `Thanks for asking about “${userMessage.content}”! This assistant plans Jharkhand-only trips to Ranchi, Deoghar, Netarhat, Jamshedpur, Hazaribagh, and Betla.\n\n` +
          `Want a complete trip plan? Share:\n• Destination • Days • Budget • Travelers`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
      };

      // Simulate latency for UX smoothness
      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 650);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, there was a problem responding. Please try again.',
        },
      ]);
      setIsLoading(false);
    }
  };

  // Enter to send, Shift+Enter for newline
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl px-4 mx-auto sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 sm:text-xl">PLANORA AI</h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  {tripPlan ? `${tripPlan.tripOverview?.destination} Trip Assistant` : 'Chat Assistant'}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 font-medium text-gray-700 transition-colors hover:text-green-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl px-4 py-6 mx-auto sm:py-8">
        {/* Title */}
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            {tripPlan ? `${tripPlan.tripOverview?.destination} Trip Assistant` : 'Chat with PLANORA AI'}
          </h2>
          <p className="text-gray-600">
            {tripPlan ? 'Ask anything about your trip plan!' : 'Ask anything about Jharkhand destinations!'}
          </p>
        </div>

        {/* Trip Plan Summary */}
        {tripPlan && (
          <div className="p-4 mb-6 bg-white border border-green-200 shadow-sm rounded-xl sm:p-5">
            <h3 className="mb-3 font-semibold text-green-800">Your Trip Plan</h3>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <Stat label="Destination" icon={<MapPin className="w-4 h-4" />} value={tripPlan.tripOverview?.destination} />
              <Stat label="Duration" icon={<Calendar className="w-4 h-4" />} value={tripPlan.tripOverview?.duration} />
              <Stat label="Budget" icon={<IndianRupee className="w-4 h-4" />} value={tripPlan.tripOverview?.totalBudget} />
              <Stat label="Season" icon={<Mountain className="w-4 h-4" />} value={tripPlan.weatherInfo?.currentSeason} />
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg min-h-[480px] flex flex-col border border-gray-200">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            {messages.length === 0 && !tripPlan && <WelcomeEmptyState />}

            {messages.map((message) => (
              <ChatMessage key={message.id} role={message.role} content={message.content} />
            ))}

            {isLoading && <TypingIndicator />}
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="p-3 border-t bg-gray-50 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="flex-1 rounded-xl border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line • Jharkhand-only planning
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, icon, value }: { label: string; icon: React.ReactNode; value?: string }) {
  return (
    <div className="p-3 border border-green-100 rounded-lg bg-green-50">
      <div className="flex items-center gap-2 font-medium text-green-700">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 text-gray-900">{value || '—'}</div>
    </div>
  );
}

function ChatMessage({ role, content }: { role: Role; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`flex items-start gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            isUser ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
          }`}
          aria-hidden
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        <div
          className={`rounded-lg p-3 sm:p-4 shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
            isUser ? 'bg-green-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fadeIn">
      <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
        <Bot className="w-4 h-4" />
      </div>
      <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">PLANORA AI is thinking</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:120ms]"></span>
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:240ms]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeEmptyState() {
  return (
    <div className="max-w-2xl mx-auto mt-12 text-center text-gray-600 sm:mt-16">
      <div className="flex items-center justify-center mx-auto mb-4 text-green-600 rounded-full h-14 w-14 bg-green-50">
        <Mountain className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold">Welcome to PLANORA AI</h3>
      <p className="mt-2 text-sm">Plan Jharkhand trips only—Ranchi, Deoghar, Netarhat, Jamshedpur, Hazaribagh, Betla.</p>
      <div className="grid grid-cols-2 gap-2 mt-5 text-left md:grid-cols-3">
        {[
          '3 days in Ranchi under ₹20000, waterfalls focus',
          'Family trip to Deoghar, temple timings and budget food',
          'Netarhat sunrise/sunset points, 2-day plan',
          'Betla safari options and fees this weekend',
          'Hazaribagh day trip with local food',
          'Ranchi + Jonha + Hundru combo plan',
        ].map((t) => (
          <span
            key={t}
            className="px-3 py-2 text-sm text-gray-700 bg-white border rounded-lg cursor-default hover:bg-gray-50"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400">Try: "Plan 3 days in Ranchi under ₹20000"</p>
    </div>
  );
}

// Contextual responder
function generateContextualResponse(question: string, plan: any): string {
  const q = question.toLowerCase();

  if (q.includes('hotel') || q.includes('accommodation') || q.includes('stay')) {
    return (
      `For your ${plan.tripOverview?.destination} trip, here are accommodation recommendations:\n\n` +
      `Budget: ${plan.budgetBreakdown?.accommodation}\n\n` +
      `🏨 Recommended Hotels:\n` +
      `• Budget: Local guesthouses (₹800–1500/night)\n` +
      `• Mid-range: Business hotels (₹2000–3500/night)\n` +
      `• Premium: 4★ hotels (₹4000–6000/night)\n\n` +
      `Booking Tips:\n` +
      `• Book 1–2 weeks in advance\n` +
      `• Ask for corporate/long-stay discounts\n` +
      `• Check packages including meals\n\n` +
      `Contacts:\n` +
      `• Jharkhand Tourism: 0651-2331828\n` +
      `Would you like specific hotel names and numbers for ${plan.tripOverview?.destination}?`
    );
  }

  if (q.includes('food') || q.includes('restaurant') || q.includes('eat')) {
    const perDay =
      Math.round(
        (parseInt(plan.budgetBreakdown?.food?.replace(/[₹,]/g, '') || '0') /
          (parseInt(plan.tripOverview?.duration?.replace(/[^\d]/g, '') || '1') || 1)) || 0
      ) || 0;

    return (
      `Food & Dining in ${plan.tripOverview?.destination}:\n\n` +
      `Budget: ${plan.budgetBreakdown?.food}\n\n` +
      `Must-Try:\n` +
      `• Litti Chokha • Thekua • Handia (if you drink)\n` +
      `• Rugra (mushroom curry) • Bamboo shoot curry\n\n` +
      `Where to Eat:\n` +
      `• Local dhabas: ₹100–200/meal\n` +
      `• Mid-range: ₹300–500/meal\n` +
      `• Hotel restaurants: ₹400–800/meal\n\n` +
      `Safety:\n` +
      `• Drink bottled water • Pick popular vendors\n\n` +
      `Daily food budget ≈ ₹${perDay} per day covers 3 meals.`
    );
  }

  if (q.includes('weather') || q.includes('clothes') || q.includes('pack')) {
    const season = plan.weatherInfo?.currentSeason;
    return (
      `Weather & Packing for ${plan.tripOverview?.destination}:\n\n` +
      `Current Season: ${season}\n` +
      `Temperature: ${plan.weatherInfo?.temperature}\n\n` +
      `What to Pack:\n${plan.weatherInfo?.clothing}\n\n` +
      `Essentials:\n` +
      `• Comfortable shoes • Sunscreen & sunglasses • Light daypack\n` +
      `• Power bank • First-aid basics • ID copies\n\n` +
      `Season Tips:\n` +
      `${season === 'Winter' ? '• Light woolen jacket • Warm socks' : ''}` +
      `${season === 'Summer' ? '• Extra water • Light cotton • Hat' : ''}` +
      `${season === 'Monsoon' ? '• Raincoat/umbrella • Quick-dry • Waterproof bag' : ''}`
    );
  }

  if (q.includes('budget') || q.includes('cost') || q.includes('money')) {
    const total = parseInt(plan.tripOverview?.totalBudget?.replace(/[₹,]/g, '') || '0');
    const accommodation = parseInt(plan.budgetBreakdown?.accommodation?.replace(/[₹,]/g, '') || '0');
    const food = parseInt(plan.budgetBreakdown?.food?.replace(/[₹,]/g, '') || '0');
    const transport = parseInt(plan.budgetBreakdown?.transportation?.replace(/[₹,]/g, '') || '0');
    const activities = parseInt(plan.budgetBreakdown?.activities?.replace(/[₹,]/g, '') || '0');
    const shopping = parseInt(plan.budgetBreakdown?.shopping?.replace(/[₹,]/g, '') || '0');

    const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

    return (
      `Budget for your ${plan.tripOverview?.destination} trip:\n\n` +
      `Total: ${plan.tripOverview?.totalBudget}\n` +
      `Daily Average: ${plan.budgetBreakdown?.dailyAverage}\n\n` +
      `Breakdown:\n` +
      `• 🏨 Accommodation: ${plan.budgetBreakdown?.accommodation} (${pct(accommodation)}%)\n` +
      `• 🍽️ Food: ${plan.budgetBreakdown?.food} (${pct(food)}%)\n` +
      `• 🚗 Transportation: ${plan.budgetBreakdown?.transportation} (${pct(transport)}%)\n` +
      `• 🎯 Activities: ${plan.budgetBreakdown?.activities} (${pct(activities)}%)\n` +
      `• 🛍️ Shopping: ${plan.budgetBreakdown?.shopping} (${pct(shopping)}%)\n\n` +
      `Save More:\n` +
      `• Book direct • Eat at dhabas • Use shared transport • Shop local markets\n` +
      `Buffer: Keep 10–15% (≈ ₹${Math.round(total * 0.12)}) for emergencies.`
    );
  }

  return (
    `Based on your ${plan.tripOverview?.destination} plan:\n\n` +
    `Summary:\n` +
    `• Destination: ${plan.tripOverview?.destination}\n` +
    `• Duration: ${plan.tripOverview?.duration}\n` +
    `• Budget: ${plan.tripOverview?.totalBudget}\n` +
    `• Best time: ${plan.tripOverview?.bestTimeToVisit}\n\n` +
    `Ask for:\n` +
    `• Daily schedules • Hotels • Food • Transport • Weather/packing • Culture • Budget tips • Alternatives\n\n` +
    `Examples:\n` +
    `• "Hotels in ${plan.tripOverview?.destination}"\n` +
    `• "What should I pack?"\n` +
    `• "How to save on food?"\n` +
    `• "Transport options?"`
  );
}
