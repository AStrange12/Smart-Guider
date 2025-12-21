'use server';

/**
 * @fileOverview An AI agent that analyzes user spending behavior.
 *
 * - analyzeSpendingBehavior - A function that analyzes spending behavior and provides insights.
 * - AnalyzeSpendingBehaviorInput - The input type for the analyzeSpendingBehavior function.
 * - AnalyzeSpendingBehaviorOutput - The return type for the analyzeSpendingBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingBehaviorInputSchema = z.object({
  expenses: z.array(
    z.object({
      category: z.string().describe('The category of the expense.'),
      amount: z.number().describe('The amount of the expense.'),
      date: z.string().describe('The date of the expense in ISO format.'),
    })
  ).describe('An array of expenses to analyze.'),
  income: z.number().describe('The user`s monthly income'),
});
export type AnalyzeSpendingBehaviorInput = z.infer<typeof AnalyzeSpendingBehaviorInputSchema>;

const AnalyzeSpendingBehaviorOutputSchema = z.object({
  summary: z.string().describe('A summary of the user`s spending behavior.'),
  insights: z.array(
    z.string().describe('Specific insights into the user`s spending, including potential areas for improvement.')
  ).describe('An array of insights.'),
  financialHealthScore: z.number().describe('A financial health score out of 100'),
});
export type AnalyzeSpendingBehaviorOutput = z.infer<typeof AnalyzeSpendingBehaviorOutputSchema>;

export async function analyzeSpendingBehavior(input: AnalyzeSpendingBehaviorInput): Promise<AnalyzeSpendingBehaviorOutput> {
  return analyzeSpendingBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingBehaviorPrompt',
  input: {schema: AnalyzeSpendingBehaviorInputSchema},
  output: {schema: AnalyzeSpendingBehaviorOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending behavior based on their expenses and income, and provide insights and a financial health score.

  Income: {{income}}
  Expenses:
  {{#each expenses}}
  - Category: {{category}}, Amount: {{amount}}, Date: {{date}}
  {{/each}}

  Provide a summary of their spending behavior, specific insights into potential areas for improvement, and a financial health score out of 100.
`,
});

const analyzeSpendingBehaviorFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingBehaviorFlow',
    inputSchema: AnalyzeSpendingBehaviorInputSchema,
    outputSchema: AnalyzeSpendingBehaviorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
