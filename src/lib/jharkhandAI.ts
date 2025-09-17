// src/lib/jharkhandAI.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const jharkhandAI = {
  async generateTripPlan({
    destination,
    days,
    budget,
  }: {
    destination: string;
    days: number;
    budget: string;
  }) {
    const model = google('models/gemini-1.5-flash');

    const prompt = `
    Create a detailed ${days}-day trip plan for ${destination} in Jharkhand.
    Budget: ${budget}.
    Include must-visit places, food, travel tips, and cultural experiences.
    `;

    const result = await generateText({
      model,
      prompt,
    });

    return {
      destination,
      days,
      budget,
      plan: result.text,
      weatherInfo: {}, // placeholder to be enhanced later
    };
  },
};
