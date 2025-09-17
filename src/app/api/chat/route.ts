// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';
import type { NextRequest } from 'next/server';

const JH_LIST = [
  'ranchi','deoghar','netarhat','jamshedpur','hazaribagh','betla',
  'dhanbad','bokaro','parasnath','giridih','chaibasa','palamu','latehar'
];

function isJharkhandQuery(messages: UIMessage[]) {
  const text = messages
    .map(m => (typeof m.content === 'string' ? m.content : ''))
    .join(' ')
    .toLowerCase();
  return JH_LIST.some(d => text.includes(d));
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-powered-by': 'PLANORA AI',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gemini-1.5-pro', context } = (await req.json()) as {
      messages: UIMessage[];
      model?: 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-1.0-pro' | 'gemini-2.0-flash';
      context?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse(
        {
          error: 'No messages provided.',
          code: 'BAD_REQUEST',
          hint: 'Send at least one user message mentioning a Jharkhand destination.',
          destinations: JH_LIST,
        },
        400
      );
    }

    if (!isJharkhandQuery(messages)) {
      return jsonResponse(
        {
          error:
            'This planner supports Jharkhand destinations only (e.g., Ranchi, Deoghar, Netarhat, Jamshedpur, Hazaribagh, Betla). Please include a Jharkhand location.',
          code: 'JHARKHAND_ONLY',
          hint: 'Add a supported destination in your question.',
          destinations: JH_LIST,
        },
        400
      );
    }

    const geminiModel =
      model === 'gemini-1.5-flash'
        ? google('gemini-1.5-flash-latest')
        : model === 'gemini-1.0-pro'
        ? google('gemini-1.0-pro')
        : model === 'gemini-2.0-flash'
        ? google('gemini-2.0-flash-exp')
        : google('gemini-1.5-pro-latest');

    const system =
      'You are PLANORA AI, a Jharkhand-only trip planner. Provide concise, day-wise itineraries, INR budgets, hotel booking tips with contact, weather notes, transport, and safety for Ranchi/Deoghar/Netarhat/Jamshedpur/Hazaribagh/Betla. Be practical and structured.';

    // Build optional enhanced block when context indicates a plan
    const enhanced =
      context === 'planTrip'
        ? {
            localCuisine: {
              highlights: [
                'Dhuska with ghugni',
                'Litti chokha',
                'Pitha (varieties)',
                'Bamboo shoot curry',
                'Mutton curry (khassi)',
                'Thekua',
                'Tilkut'
              ],
              areas: ['Upper Bazar', 'Firayalal Chowk', 'Kanke Road'],
              suggestedSlots: {
                day1_breakfast: 'Dhuska at Upper Bazar',
                day2_dinner: 'Litti chokha after waterfalls',
                day3_snacks: 'Tilkut/Thekua for journey'
              }
            },
            handicrafts: {
              buy: ['Dhokra brasswork', 'Bamboo/cane craft', 'Sohrai/Kohvar art', 'Tussar silk'],
              markets: ['Jharcraft outlets', 'Firayalal Chowk', 'Ratu Road', 'Kanke Road'],
              notes: ['Prefer Jharcraft-certified', 'Pack fragile brass carefully']
            },
            season: {
              current: 'Monsoon',
              advice: [
                'Early-start waterfall visits',
                'Avoid swimming in high flow',
                'Add 30–45 mins for slippery trails'
              ],
              bestTime: 'Oct–Mar'
            },
            microItinerary: {
              day1: ['Arrive, Rock Garden & Kanke Lake', 'Dhuska breakfast', 'Litti chokha dinner', 'Market stroll'],
              day2: ['Dassam & Hundru Falls loop', 'Craft shopping evening', 'Pitha/rolls tasting'],
              day3: ['Pahari Mandir', 'Museum/café', 'Jharcraft pickups']
            },
            logistics: {
              transport: ['Cab for falls loop', 'UPI + cash', 'Confirm last-mile autos'],
              packing: ['Poncho', 'Dry bag', 'Spare socks']
            }
          }
        : undefined;

    // If JSON mode preferred for planTrip:
    if (context === 'planTrip-json') {
      const base = { enhancementStatus: enhanced ? 'ok' : 'none' };
      return jsonResponse({ ...base, enhanced });
    }

    // Default: stream text + prepend enhanced as SSE event
    const result = streamText({
      model: geminiModel,
      messages: convertToModelMessages(messages),
      system,
    });

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Send enhanced first as a custom event for immediate UI render
    if (enhanced) {
      const firstChunk = `event: plan.enhanced\ndata: ${JSON.stringify(enhanced)}\n\n`;
      await writer.write(new TextEncoder().encode(firstChunk));
    }

    const resp = result.toAIStreamResponse({
      headers: {
        'x-model': model,
        'x-region': 'IN',
        'cache-control': 'no-store',
      },
    });

    const original = (resp as Response).body!;
    original.pipeTo(writable).catch(() => { /* swallow pipe errors on client disconnect */ });

    return new Response(readable, {
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        'x-powered-by': 'PLANORA AI',
      },
    });
  } catch (err: any) {
    return jsonResponse(
      {
        error: 'Failed to process chat request.',
        code: 'SERVER_ERROR',
        hint: 'Please retry in a moment. If the issue persists, try switching the model.',
        details: process.env.NODE_ENV === 'development' ? String(err?.message || err) : undefined,
      },
      500
    );
  }
}
