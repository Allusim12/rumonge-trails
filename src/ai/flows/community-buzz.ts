'use server';
/**
 * @fileOverview A Genkit flow for summarizing community reviews and sentiment.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunityBuzzInputSchema = z.object({
  reviews: z.array(z.object({
    userName: z.string(),
    comment: z.string(),
    rating: z.number()
  })).describe('An array of recent traveler reviews.')
});
export type CommunityBuzzInput = z.infer<typeof CommunityBuzzInputSchema>;

const CommunityBuzzOutputSchema = z.object({
  summary: z.string().describe('A concise, engaging summary of the community sentiment.'),
  trendingTopics: z.array(z.string()).describe('List of trending keywords or places mentioned.')
});
export type CommunityBuzzOutput = z.infer<typeof CommunityBuzzOutputSchema>;

export async function getCommunityBuzz(input: CommunityBuzzInput): Promise<CommunityBuzzOutput> {
  return communityBuzzFlow(input);
}

const communityBuzzPrompt = ai.definePrompt({
  name: 'communityBuzzPrompt',
  input: {schema: CommunityBuzzInputSchema},
  output: {schema: CommunityBuzzOutputSchema},
  prompt: `You are the Community Manager for Rumonge Cultural Trails. 
Based on these recent traveler reviews, provide a warm, encouraging summary of what visitors are loving right now. 
Identify 3-4 trending topics or places.

Reviews:
{{#each reviews}}
- {{userName}} ({{rating}} stars): "{{comment}}"
{{/each}}

Keep the tone hospitable and adventurous.`,
});

const communityBuzzFlow = ai.defineFlow(
  {
    name: 'communityBuzzFlow',
    inputSchema: CommunityBuzzInputSchema,
    outputSchema: CommunityBuzzOutputSchema
  },
  async input => {
    if (input.reviews.length === 0) {
      return { 
        summary: "The community is just getting started! Be the first to share your Rumonge story.", 
        trendingTopics: ["New Arrivals", "First Discoveries"] 
      };
    }
    const {output} = await communityBuzzPrompt(input);
    if (!output) throw new Error('Failed to generate community buzz.');
    return output;
  }
);
