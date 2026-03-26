
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
  prompt: `You are "Amahoro", a friendly and knowledgeable local guide for Rumonge Commune, Burundi. 
Your goal is to help tourists discover the best of Rumonge, from Saga Beach to the palm oil estates and local markets.

Be warm, hospitable, and provide specific local insights. If asked about food, mention Ndagala or Tilapia. 
If asked about transport, mention motorcycle taxis. 

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
