'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Send, User, Bot, Mountain, ArrowLeft, MapPin, Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string; id: string };

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<any>(null);

  // Smooth auto-scroll on new content
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isLoading]);

  // Load trip plan from sessionStorage and greet with context
  useEffect(() => {
    const storedTripPlan = sessionStorage.getItem('currentTripPlan');
    if (!storedTripPlan) return;
    try {
      const plan = JSON.parse(storedTripPlan);
      setTripPlan(plan);
      const welcome: Msg = {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content:
          `Hi! The ${plan.tripOverview?.destination} plan is loaded: ${plan.tripOverview?.duration}, budget ${plan.tripOverview?.totalBudget}.\n\n` +
          `What would you like to know more about?\n` +
          `• Hotel recommendations and bookings\n` +
          `• Local food and restaurants\n` +
          `• Transportation options\n` +
          `• Weather and packing tips\n` +
          `• Budget optimization\n` +
          `• Activities and sightseeing\n` +
          `• Cultural experiences\n\n` +
          `Just ask me anything!`,
      };
      setMessages([welcome]);
    } catch (err) {
      console.error('Error loading trip plan:', err);
    }
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
    }
  }, []);

  const placeholder = useMemo(
    () => (tripPlan ? 'Ask about hotels, food, weather, budget...' : 'Ask about Jharkhand destinations...'),
    [tripPlan]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Msg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((p) => [...p, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse = '';
      aiResponse = tripPlan
        ? generateContextualResponse(text, tripPlan)
        : `Thanks for asking about "${text}"! I can help you plan trips to Jharkhand destinations like Ranchi, Deoghar, Netarhat, Jamshedpur, and Hazaribagh.\n\n` +
          `Would you like me to create a complete trip plan for you? Just tell me:\n` +
          `• Which destination interests you?\n` +
          `• How many days?\n` +
          `• Your budget range?\n` +
          `• Number of travelers?`;

      const aiMessage: Msg = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse };

      setTimeout(() => {
        setMessages((p) => [...p, aiMessage]);
        setIsLoading(false);
      }, 650);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I had trouble processing your request. Please try again.',
        },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">PLANORA AI</h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  {tripPlan ? `${tripPlan.tripOverview?.destination} Trip Assistant` : 'Chat Assistant'}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors flex items-center gap-2"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {tripPlan ? `${tripPlan.tripOverview?.destination} Trip Assistant` : 'Chat with PLANORA AI'}
          </h2>
          <p className="text-gray-600">
            {tripPlan ? 'Ask anything about your trip plan!' : 'Ask anything about Jharkhand destinations!'}
          </p>
        </div>

        {/* Trip Plan Summary */}
        {tripPlan && (
          <div className="bg-white border border-green-200 rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-3">Your Trip Plan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <PlanStat icon={<MapPin className="h-4 w-4" />} label="Destination" value={tripPlan.tripOverview?.destination} />
              <PlanStat icon={<Calendar className="h-4 w-4" />} label="Duration" value={tripPlan.tripOverview?.duration} />
              <PlanStat icon={<IndianRupee className="h-4 w-4" />} label="Budget" value={tripPlan.tripOverview?.totalBudget} />
              <PlanStat icon={<Mountain className="h-4 w-4" />} label="Season" value={tripPlan.weatherInfo?.currentSeason} />
            </div>
          </div>
        )}

        {/* Chat container */}
        <div className="bg-white rounded-xl shadow-lg min-h-[500px] flex flex-col border border-gray-200">
          <div ref={scroller} className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            {messages.length === 0 && !tripPlan && <WelcomeState />}

            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} />
            ))}

            {isLoading && <Typing />}
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="border-t bg-gray-50 p-3 sm:p-4">
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
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
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

function PlanStat({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-green-100 bg-green-50 p-3">
      <div className="flex items-center gap-2 text-green-700 font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 text-gray-900">{value || '—'}</div>
    </div>
  );
}

function Bubble({ role, content }: { role: Role; content: string }) {
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
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
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

function Typing() {
  return (
    <div className="flex gap-3 animate-fadeIn">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
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

function WelcomeState() {
  return (
    <div className="text-center text-gray-600 mt-12 sm:mt-16 max-w-2xl mx-auto">
      <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-green-50 text-green-600">
        <Mountain className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold">Welcome to PLANORA AI</h3>
      <p className="mt-2 text-sm">Plan Jharkhand trips—Ranchi, Deoghar, Netarhat, Jamshedpur, Hazaribagh, Betla.</p>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2 text-left">
        {[
          '3 days in Ranchi under ₹20000, waterfalls focus',
          'Family trip to Deoghar, temple timings and budget food',
          'Netarhat sunrise/sunset points, 2-day plan',
          'Betla safari options and fees this weekend',
          'Hazaribagh day trip with local food',
          'Ranchi + Jonha + Hundru combo plan',
        ].map((t) => (
          <span key={t} className="bg-white border hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm cursor-default">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// Contextual responses
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
      `• Ask for corporate discounts\n` +
      `• Check meal-included packages\n\n` +
      `Contacts:\n` +
      `• Jharkhand Tourism: 0651-2331828\n` +
      `Would you like specific hotel names and contacts for ${plan.tripOverview?.destination}?`
    );
  }

  if (q.includes('food') || q.includes('restaurant') || q.includes('eat')) {
    return (
      `Food & Dining in ${plan.tripOverview?.destination}:\n\n` +
      `Budget: ${plan.budgetBreakdown?.food}\n\n` +
      `Must-Try:\n` +
      `• Litti Chokha • Thekua • Handia • Rugra • Bamboo shoot curry\n\n` +
      `Where to Eat:\n` +
      `• Dhabas: ₹100–200/meal\n` +
      `• Mid-range: ₹300–500/meal\n` +
      `• Hotel restaurants: ₹400–800/meal\n\n` +
      `Safety:\n` +
      `• Drink bottled water • Choose popular vendors`
    );
  }

  if (q.includes('weather') || q.includes('clothes') || q.includes('pack')) {
    return (
      `Weather & Packing for ${plan.tripOverview?.destination}:\n\n` +
      `Current Season: ${plan.weatherInfo?.currentSeason}\n` +
      `Temperature: ${plan.weatherInfo?.temperature}\n\n` +
      `What to Pack:\n${plan.weatherInfo?.clothing}\n\n` +
      `Essentials:\n` +
      `• Comfortable shoes • Sunscreen & sunglasses • Light daypack\n` +
      `• Power bank • First-aid basics • ID copies`
    );
  }

  if (q.includes('budget') || q.includes('cost') || q.includes('money')) {
    return (
      `Budget for your ${plan.tripOverview?.destination} trip:\n\n` +
      `Total: ${plan.tripOverview?.totalBudget}\n` +
      `Daily Average: ${plan.budgetBreakdown?.dailyAverage}\n\n` +
      `Breakdown:\n` +
      `• 🏨 Accommodation: ${plan.budgetBreakdown?.accommodation}\n` +
      `• 🍽️ Food: ${plan.budgetBreakdown?.food}\n` +
      `• 🚗 Transportation: ${plan.budgetBreakdown?.transportation}\n` +
      `• 🎯 Activities: ${plan.budgetBreakdown?.activities}\n\n` +
      `Save More:\n` +
      `• Book direct • Eat at dhabas • Use shared transport • Shop local`
    );
  }

  return (
    `Based on your ${plan.tripOverview?.destination} trip plan:\n\n` +
    `Summary:\n` +
    `• Destination: ${plan.tripOverview?.destination}\n` +
    `• Duration: ${plan.tripOverview?.duration}\n` +
    `• Budget: ${plan.tripOverview?.totalBudget}\n` +
    `• Best time: ${plan.tripOverview?.bestTimeToVisit}\n\n` +
    `Ask for:\n` +
    `• Hotels • Food • Transport • Weather/packing • Budget tips • Alternatives`
  );
}
