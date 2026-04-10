
'use server';
/**
 * @fileOverview A Genkit flow for analyzing the overall sentiment of community reviews.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  reviews: z.array(z.string()).describe('A list of review comments to analyze.')
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentAnalysisOutputSchema = z.object({
  score: z.number().describe('Overall sentiment score from 0 (very negative) to 100 (very positive).'),
  summary: z.string().describe('A concise summary of the general traveler sentiment.'),
  topCompliments: z.array(z.string()).describe('Key things visitors are praising.'),
  topConcerns: z.array(z.string()).describe('Common complaints or areas for improvement.')
});
export type SentimentAnalysisOutput = z.infer<typeof SentimentAnalysisOutputSchema>;

export async function analyzeReviewSentiment(input: SentimentAnalysisInput): Promise<SentimentAnalysisOutput> {
  return sentimentAnalysisFlow(input);
}

const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  prompt: `You are a high-level data analyst for the Rumonge Tourism Board. 
Review the following traveler comments and provide a deep sentiment analysis. 

Reviews:
{{#each reviews}}
- "{{this}}"
{{/each}}

Identify the overall score (0-100), write a professional summary, and list specific compliments and concerns.
`,
});

const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema
  },
  async input => {
    if (input.reviews.length === 0) {
      return { 
        score: 100, 
        summary: "No reviews yet. The canvas is clean!", 
        topCompliments: ["N/A"], 
        topConcerns: ["N/A"] 
      };
    }
    const {output} = await sentimentAnalysisPrompt(input);
    if (!output) throw new Error('Failed to analyze sentiment.');
    return output;
  }
);
