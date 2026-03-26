'use server';
/**
 * @fileOverview A Genkit flow for generating personalized tourist itineraries for Rumonge Commune.
 *
 * - generateItinerary - A function that handles the itinerary generation process.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of interests (e.g., nature, history, relaxation, adventure).'),
  lengthOfStayDays: z
    .number()
    .int()
    .min(1)
    .describe('The number of days for the itinerary.'),
  preferredPace: z
    .enum(['relaxed', 'moderate', 'fast'])
    .describe('The preferred pace of activities: "relaxed", "moderate", or "fast".')
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the generated itinerary.'),
  itinerary: z
    .array(
      z.object({
        day: z.number().describe('The day number in the itinerary.'),
        activities: z
          .array(z.string().describe('A description of an activity for this day.'))
          .describe('A list of activities planned for this day.')
      })
    )
    .describe('A daily breakdown of the personalized itinerary for Rumonge Commune.')
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(
  input: GenerateItineraryInput
): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const generateItineraryPrompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an expert travel planner and local guide for Rumonge Commune, Burundi.
Your task is to create a personalized travel itinerary for a tourist visiting Rumonge Commune.

Generate a detailed itinerary for a stay of {{{lengthOfStayDays}}} days, taking into account the user's interests and preferred pace.

User Interests: {{{interests}}}
Preferred Pace: {{{preferredPace}}}
Length of Stay: {{{lengthOfStayDays}}} days

Highlight the natural wonders, cultural heritage, and local traditions of Rumonge Commune. Ensure the activities are realistic and engaging.

Provide the output in the specified JSON format, including a brief summary of the itinerary and a daily breakdown of activities.
`
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema
  },
  async input => {
    const {output} = await generateItineraryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate itinerary. No output from prompt.');
    }
    return output;
  }
);
