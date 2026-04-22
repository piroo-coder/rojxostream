'use server';
/**
 * @fileOverview A Genkit flow for administrators to automatically generate a concise 4-5 sentence summary and a moral for anime and movies.
 *
 * - generateMediaSummaryAndMoral - A function that handles the generation process.
 * - GenerateMediaSummaryAndMoralInput - The input type for the generateMediaSummaryAndMoral function.
 * - GenerateMediaSummaryAndMoralOutput - The return type for the generateMediaSummaryAndMoral function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMediaSummaryAndMoralInputSchema = z.object({
  mediaContent: z
    .string()
    .describe('The text or metadata of the anime/movie to summarize.'),
});
export type GenerateMediaSummaryAndMoralInput = z.infer<
  typeof GenerateMediaSummaryAndMoralInputSchema
>;

const GenerateMediaSummaryAndMoralOutputSchema = z.object({
  summary: z.string().describe('A concise 4-5 sentence summary of the media.'),
  moral: z.string().describe('The moral or core message derived from the media.'),
});
export type GenerateMediaSummaryAndMoralOutput = z.infer<
  typeof GenerateMediaSummaryAndMoralOutputSchema
>;

export async function generateMediaSummaryAndMoral(
  input: GenerateMediaSummaryAndMoralInput
): Promise<GenerateMediaSummaryAndMoralOutput> {
  return adminGeneratesMediaSummaryAndMoralFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminGeneratesMediaSummaryAndMoralPrompt',
  input: {schema: GenerateMediaSummaryAndMoralInputSchema},
  output: {schema: GenerateMediaSummaryAndMoralOutputSchema},
  prompt: `As an expert content analyst for anime and movies, your task is to analyze the provided media content and extract its core essence.

First, provide a concise summary of the content, exactly 4 to 5 sentences long. Ensure the summary captures the main plot, characters, and themes without revealing major spoilers.

Second, identify and articulate the central moral or core message conveyed by the media. This should be a clear, single statement or a very short paragraph that encapsulates the media's underlying lesson or philosophy.

Media Content: {{{mediaContent}}}

Follow the output schema strictly.`,
});

const adminGeneratesMediaSummaryAndMoralFlow = ai.defineFlow(
  {
    name: 'adminGeneratesMediaSummaryAndMoralFlow',
    inputSchema: GenerateMediaSummaryAndMoralInputSchema,
    outputSchema: GenerateMediaSummaryAndMoralOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate summary and moral.');
    }
    return output;
  }
);
