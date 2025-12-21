"use client";

import type { SummarizeMonthlySpendingOutput } from "@/ai/flows/summarize-monthly-spending";

type PersonalizedAdviceCardProps = {
  initialSummary: SummarizeMonthlySpendingOutput | null;
};

export default function PersonalizedAdviceCard({ initialSummary }: PersonalizedAdviceCardProps) {
  return (
    <>
      {initialSummary?.summary ? (
        <p className="text-sm text-muted-foreground">
          {initialSummary.summary}
        </p>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4">
          <p>Add your income and expenses to get personalized advice.</p>
        </div>
      )}
    </>
  );
}
