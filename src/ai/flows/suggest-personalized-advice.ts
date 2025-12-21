'use server';

/**
 * @fileOverview Provides personalized financial advice based on spending analysis and financial goals.
 *
 * - suggestPersonalizedAdvice - A function that generates personalized financial advice.
 * - PersonalizedAdviceInput - The input type for the suggestPersonalizedAdvice function.
 * - PersonalizedAdviceOutput - The return type for the suggestPersonalizedAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAdviceInputSchema = z.object({
  spendingAnalysis: z
    .string()
    .describe('Analysis of the user\'s spending behavior.'),
  financialGoals: z.string().describe('The user\'s financial goals.'),
  taxRegime: z.string().describe('The user\'s tax regime.'),
  salary: z.number().describe('The user\'s monthly salary.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

const PersonalizedAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice for the user.'),
});
export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

export async function suggestPersonalizedAdvice(
  input: PersonalizedAdviceInput
): Promise<PersonalizedAdviceOutput> {
  return suggestPersonalizedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPersonalizedAdvicePrompt',
  input: {schema: PersonalizedAdviceInputSchema},
  output: {schema: PersonalizedAdviceOutputSchema},
  prompt: `You are a financial advisor providing personalized advice to users based on their spending habits and financial goals. Tax regime is {{{taxRegime}}}. Salary is {{{salary}}}.

Spending Analysis: {{{spendingAnalysis}}}

Financial Goals: {{{financialGoals}}}

Provide clear, actionable advice to help the user improve their financial health. Focus on practical steps and relevant recommendations, formatted to be easily understood. Be concise and clear in your response.
`,
});

const suggestPersonalizedAdviceFlow = ai.defineFlow(
  {
    name: 'suggestPersonalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
