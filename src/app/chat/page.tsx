'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mountain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string; id: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, isLoading]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Msg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages((p) => [...p, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const aiMessage: Msg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply ?? '⚠️ No response received.',
      };

      setMessages((p) => [...p, aiMessage]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Error: Could not get reply.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow border">
          {/* Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center shadow">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  PLANORA AI Chat
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  Jharkhand Trip Assistant
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          {/* Messages */}
          <div
            ref={scroller}
            className="h-[26rem] sm:h-[28rem] overflow-y-auto p-4 sm:p-5 space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-center text-gray-600 mt-10">
                <Mountain className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <p className="text-base sm:text-lg font-semibold">
                  Welcome to PLANORA AI!
                </p>
                <p className="text-sm mt-1">
                  Ask anything about Jharkhand destinations.
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Try: “Plan 3 days in Ranchi under ₹20000”
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={[
                    'max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-sm whitespace-pre-wrap shadow-sm',
                    m.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900 border border-gray-200',
                  ].join(' ')}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">PLANORA AI is thinking</span>
                    <span className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:120ms]" />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-3 sm:p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about Jharkhand destinations..."
                className="flex-1 border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-green-600 text-white px-4 sm:px-5 py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-colors"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line • Jharkhand-only
              planning
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
