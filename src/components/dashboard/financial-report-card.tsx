
"use client";

import type { UserProfile, Expense } from "@/lib/types";
import { useMemo } from "react";

type FinancialReportCardProps = {
  userProfile: UserProfile;
  expenses: Expense[];
};

export default function FinancialReportCard({ userProfile, expenses }: FinancialReportCardProps) {
  const { needsTotal, wantsTotal, savingsTotal, totalSpent, income } = useMemo(() => {
    const income = userProfile.salary || 0;
    const needsTotal = expenses.filter(e => e.type === 'need').reduce((acc, exp) => acc + exp.amount, 0);
    const wantsTotal = expenses.filter(e => e.type === 'want').reduce((acc, exp) => acc + exp.amount, 0);
    const totalSpent = needsTotal + wantsTotal;
    const savingsTotal = income > totalSpent ? income - totalSpent : 0;
    return { needsTotal, wantsTotal, savingsTotal, totalSpent, income };
  }, [userProfile, expenses]);

  const budget = userProfile.budget || { needs: 50, wants: 30, savings: 20 };

  const getSummaryMessage = () => {
    if (income === 0) {
      return "Please add your monthly salary in Settings to get a financial report.";
    }
    if (totalSpent === 0) {
      return "You haven't recorded any expenses this month. Add some to see your financial report.";
    }

    const needsPercent = (needsTotal / income) * 100;
    const wantsPercent = (wantsTotal / income) * 100;
    const savingsPercent = (savingsTotal / income) * 100;

    const needsDiff = needsPercent - budget.needs;
    const wantsDiff = wantsPercent - budget.wants;
    const savingsDiff = savingsPercent - budget.savings;

    if (needsDiff > 5) {
      return `You're spending about ${Math.round(needsPercent)}% on 'Needs', which is higher than your ${budget.needs}% target. Try to see where you can cut back.`;
    }
    if (wantsDiff > 5) {
      return `Your 'Wants' are at ${Math.round(wantsPercent)}% of your income, above the ${budget.wants}% target. This might be a good area to reduce spending.`;
    }
    if (savingsDiff < -5) {
      return `You're on track to save about ${Math.round(savingsPercent)}% this month, which is below your ${budget.savings}% goal. Try to increase your savings.`;
    }

    return `Great job! Your spending is closely aligned with the ${budget.needs}/${budget.wants}/${budget.savings} budget. You're on track to save approximately ${Math.round(savingsPercent)}% of your income.`;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {getSummaryMessage()}
      </p>
    </div>
  );
}
