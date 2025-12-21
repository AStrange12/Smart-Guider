'use server';
/**
 * @fileOverview Summarizes monthly spending into Needs, Wants, and Savings categories.
 *
 * - summarizeMonthlySpending - A function that summarizes monthly expenses based on the 50-30-20 rule.
 * - SummarizeMonthlySpendingInput - The input type for the summarizeMonthlySpending function.
 * - SummarizeMonthlySpendingOutput - The return type for the summarizeMonthlySpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMonthlySpendingInputSchema = z.object({
  needs: z.number().describe('Total expenses categorized as needs.'),
  wants: z.number().describe('Total expenses categorized as wants.'),
  savings: z.number().describe('Total expenses categorized as savings.'),
  totalIncome: z.number().describe('Total income for the month.'),
});
export type SummarizeMonthlySpendingInput = z.infer<
  typeof SummarizeMonthlySpendingInputSchema
>;

const SummarizeMonthlySpendingOutputSchema = z.object({
  summary: z.string().describe('A summary of monthly spending, highlighting adherence to the 50-30-20 rule and areas for improvement.'),
});
export type SummarizeMonthlySpendingOutput = z.infer<
  typeof SummarizeMonthlySpendingOutputSchema
>;

export async function summarizeMonthlySpending(
  input: SummarizeMonthlySpendingInput
): Promise<SummarizeMonthlySpendingOutput> {
  return summarizeMonthlySpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMonthlySpendingPrompt',
  input: {schema: SummarizeMonthlySpendingInputSchema},
  output: {schema: SummarizeMonthlySpendingOutputSchema},
  prompt: `You are a financial advisor providing a summary of monthly spending based on the 50-30-20 rule.

  Total Income: {{totalIncome}}
  Needs: {{needs}}
  Wants: {{wants}}
  Savings: {{savings}}

  Provide a concise summary of the user's spending, indicating whether they are following the 50-30-20 rule (50% needs, 30% wants, 20% savings).
  Also, provide personalized advice on areas where they can improve their spending habits.
`,
});

const summarizeMonthlySpendingFlow = ai.defineFlow(
  {
    name: 'summarizeMonthlySpendingFlow',
    inputSchema: SummarizeMonthlySpendingInputSchema,
    outputSchema: SummarizeMonthlySpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
