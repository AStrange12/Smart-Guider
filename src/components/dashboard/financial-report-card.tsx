
"use client";

import type { UserProfile, Expense } from "@/lib/types";
import { useMemo } from "react";
import { AlertCircle, CheckCircle2, TrendingDown } from "lucide-react";

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

  if (income === 0) {
    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5 shrink-0"/>
            <span>Please add your monthly salary in Settings to get a financial report.</span>
        </div>
    );
  }
  if (totalSpent === 0) {
    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5 shrink-0"/>
            <span>You haven't recorded any expenses this month. Add some to see your report.</span>
        </div>
    );
  }

  const needsPercent = Math.round((needsTotal / income) * 100);
  const wantsPercent = Math.round((wantsTotal / income) * 100);
  const savingsPercent = Math.round((savingsTotal / income) * 100);
  
  const needsDiff = needsPercent - budget.needs;
  const wantsDiff = wantsPercent - budget.wants;
  const savingsDiff = savingsPercent - budget.savings;

  const summaryPoints = [];

  if (needsDiff > 5) {
    summaryPoints.push({
      Icon: TrendingDown,
      color: "text-yellow-500",
      text: `Your 'Needs' are at ${needsPercent}%, which is over your ${budget.needs}% target. Consider reviewing fixed costs like subscriptions.`
    });
  } else {
     summaryPoints.push({
      Icon: CheckCircle2,
      color: "text-green-500",
      text: `You're on track with 'Needs' spending at ${needsPercent}%, within your ${budget.needs}% goal.`
    });
  }

  if (wantsDiff > 5) {
    summaryPoints.push({
      Icon: TrendingDown,
      color: "text-yellow-500",
      text: `Spending on 'Wants' is ${wantsPercent}%, exceeding the ${budget.wants}% target. This is a key area to cut back.`
    });
  } else {
     summaryPoints.push({
      Icon: CheckCircle2,
      color: "text-green-500",
      text: `Great discipline! Your 'Wants' are at ${wantsPercent}%, right within your ${budget.wants}% budget.`
    });
  }
  
  if (savingsDiff < -5) {
    summaryPoints.push({
      Icon: AlertCircle,
      color: "text-red-500",
      text: `You're on track to save about ${savingsPercent}%, falling short of your ${budget.savings}% goal. Try to increase your savings rate.`
    });
  } else {
      summaryPoints.push({
      Icon: CheckCircle2,
      color: "text-green-500",
      text: `Excellent! You're on pace to meet or beat your ${budget.savings}% savings goal, currently at ${savingsPercent}%.`
    });
  }


  return (
    <div className="space-y-3">
        {summaryPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
                <point.Icon className={`h-4 w-4 mt-1 shrink-0 ${point.color}`} />
                <p className="text-sm text-muted-foreground">{point.text}</p>
            </div>
        ))}
    </div>
  );
}
