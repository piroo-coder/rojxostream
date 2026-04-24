'use server';
/**
 * @fileOverview A Genkit flow for generating a deep critical analysis of anime plots.
 *
 * - generateCriticalAnalysis - A function that handles the generation process.
 * - GenerateCriticalAnalysisInput - The input type for the function.
 * - GenerateCriticalAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCriticalAnalysisInputSchema = z.object({
  title: z.string().describe('The title of the anime.'),
  plot: z.string().describe('The detailed plot or summary of the anime.'),
});
export type GenerateCriticalAnalysisInput = z.infer<
  typeof GenerateCriticalAnalysisInputSchema
>;

const GenerateCriticalAnalysisOutputSchema = z.object({
  characterMotivations: z.array(z.object({
    topic: z.string().describe('The specific action or decision of a character.'),
    explanation: z.string().describe('The deep psychological or narrative reason for it.'),
  })).describe('Topic-wise explanation of why characters did what they did.'),
  narrativeEvents: z.array(z.object({
    event: z.string().describe('A key event in the plot.'),
    explanation: z.string().describe('Why this event happened from a narrative/thematic standpoint.'),
  })).describe('Topic-wise explanation of why specific events occurred.'),
  writersMessage: z.string().describe('What the writer is trying to convey to the reader/viewer.'),
  realLifeRelation: z.string().describe('How the story relates to real-life situations and emotions.'),
  importanceToUs: z.string().describe('Why this story is important to us as humans.'),
});
export type GenerateCriticalAnalysisOutput = z.infer<
  typeof GenerateCriticalAnalysisOutputSchema
>;

export async function generateCriticalAnalysis(
  input: GenerateCriticalAnalysisInput
): Promise<GenerateCriticalAnalysisOutput> {
  return generateCriticalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCriticalAnalysisPrompt',
  input: {schema: GenerateCriticalAnalysisInputSchema},
  output: {schema: GenerateCriticalAnalysisOutputSchema},
  prompt: `You are a world-class literary critic and anime scholar. Analyze the following anime: "{{{title}}}".
  
  Using the plot provided: "{{{plot}}}", perform a deep-dive critical analysis.
  
  Your analysis must cover:
  1. Topic-wise explanations of character choices (Why did they do this?).
  2. Topic-wise explanations of major narrative shifts (Why did this happen?).
  3. The core philosophical or thematic message the creator/writer is conveying.
  4. How these fictional struggles mirror real-life human experiences.
  5. Why this story specifically matters to a modern audience.
  
  Be profound, insightful, and professional.`,
});

const generateCriticalAnalysisFlow = ai.defineFlow(
  {
    name: 'generateCriticalAnalysisFlow',
    inputSchema: GenerateCriticalAnalysisInputSchema,
    outputSchema: GenerateCriticalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate critical analysis.');
    }
    return output;
  }
);
