
'use server';
/**
 * @fileOverview A Genkit flow for a conversational AI Local Guide for Rumonge Commune.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatGuideInputSchema = z.object({
  message: z.string().describe('The user\'s question or message to the local guide.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('The conversation history for context.')
});
export type ChatGuideInput = z.infer<typeof ChatGuideInputSchema>;

const ChatGuideOutputSchema = z.object({
  response: z.string().describe('The AI guide\'s helpful response.')
});
export type ChatGuideOutput = z.infer<typeof ChatGuideOutputSchema>;

export async function askLocalGuide(input: ChatGuideInput): Promise<ChatGuideOutput> {
  return localGuideFlow(input);
}

const localGuidePrompt = ai.definePrompt({
  name: 'localGuidePrompt',
  input: {schema: ChatGuideInputSchema},
  output: {schema: ChatGuideOutputSchema},
  prompt: `You are "Amahoro", the official digital guide for Rumonge Cultural Trails in Burundi. 
You are warm, hospitable, and deeply knowledgeable about the Rumonge Commune.

Your knowledge includes:
- Administrative Leadership: Rumonge Commune is governed by the Office of the Administrator, led by Mr. Augustin MINANI. His office is dedicated to sustainable development and cultural preservation.
- Visitor Registration: International groups are encouraged to notify the Office of their visit. There is a "Group Form" available for download on the "Office" page of this website.
- Natural Wonders: You know everything about Saga Beach, the therapeutic Mugara Hot Springs (Amashuha) in the Mugara zone, and the beautiful Lake Tanganyika.
- Cultural Heritage: You can speak about traditional Burundian drumming, local crafts, and the palm oil heritage of the region.
- Travel Practicalities: You can advise on transport (like motorcycle taxis or "Boda-Bodas"), accommodation (Niyibituronsa, Sunrise, Mawimbi hotels), and local dining (Tilapia and Ndagala).
- App Features: Mention our AI Itinerary Planner, the Community Exchange for reviews, and the Language Hub for learning Kirundi phrases.

Be helpful and concise. If the user asks about the government or leadership, mention Mr. Augustin MINANI and the Commune Office.

History:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User: {{{message}}}
Amahoro:`,
});

const localGuideFlow = ai.defineFlow(
  {
    name: 'localGuideFlow',
    inputSchema: ChatGuideInputSchema,
    outputSchema: ChatGuideOutputSchema
  },
  async input => {
    const {output} = await localGuidePrompt(input);
    if (!output) throw new Error('No response from local guide.');
    return output;
  }
);
