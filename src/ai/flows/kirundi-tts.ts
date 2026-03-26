
'use server';
/**
 * @fileOverview A Genkit flow for converting Kirundi phrases to speech.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import wav from 'wav';

const KirundiTTSInputSchema = z.string().describe('The Kirundi phrase to speak.');
export type KirundiTTSInput = z.infer<typeof KirundiTTSInputSchema>;

const KirundiTTSOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a WAV data URI.')
});
export type KirundiTTSOutput = z.infer<typeof KirundiTTSOutputSchema>;

export async function speakKirundi(phrase: KirundiTTSInput): Promise<KirundiTTSOutput> {
  return kirundiTTSFlow(phrase);
}

const kirundiTTSFlow = ai.defineFlow(
  {
    name: 'kirundiTTSFlow',
    inputSchema: KirundiTTSInputSchema,
    outputSchema: KirundiTTSOutputSchema,
  },
  async (phrase) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Choosing a neutral, clear voice
          },
        },
      },
      prompt: `Please say this Kirundi phrase clearly and naturally: ${phrase}`,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
