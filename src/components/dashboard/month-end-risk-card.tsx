"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, TrendingDown } from "lucide-react";
import type { UserProfile } from "@/lib/types";

type MonthEndRiskCardProps = {
  income: number;
  totalSpent: number;
  budget: UserProfile['budget'];
};

export default function MonthEndRiskCard({ income, totalSpent, budget }: MonthEndRiskCardProps) {
  const [projectedSpending, setProjectedSpending] = useState<number | null>(null);
  
  const [statusInfo, setStatusInfo] = useState({
    statusText: "On Track",
    Icon: ShieldCheck,
    colorClass: "text-green-500",
    description: "Your projected spending is well within your budget."
  });

  useEffect(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    let currentProjectedSpending: number | null = 0;

    if (totalSpent > 0 && daysPassed > 0) {
      const dailyAverage = totalSpent / daysPassed;
      currentProjectedSpending = dailyAverage * daysInMonth;
    }
    setProjectedSpending(currentProjectedSpending);

    const spendingLimit = income * (((budget?.needs || 50) + (budget?.wants || 30)) / 100);

    let newStatus = {
        statusText: "On Track",
        Icon: ShieldCheck,
        colorClass: "text-green-500",
        description: "Your projected spending is well within your budget."
    };

    if (currentProjectedSpending !== null) {
      if (currentProjectedSpending > income) {
        newStatus = {
          statusText: "Debt Risk",
          Icon: AlertTriangle,
          colorClass: "text-red-500",
          description: `Projected to spend ₹${(currentProjectedSpending - income).toLocaleString('en-IN')} more than your income.`,
        };
      } else if (currentProjectedSpending > spendingLimit) {
        newStatus = {
          statusText: "Overspending Risk",
          Icon: TrendingDown,
          colorClass: "text-yellow-500",
          description: `Projected to overspend on needs/wants by ₹${(currentProjectedSpending - spendingLimit).toLocaleString('en-IN')}.`,
        };
      }
    }
    setStatusInfo(newStatus);

  }, [totalSpent, income, budget]);

  const { Icon, statusText, colorClass, description } = statusInfo;
  const isCalculable = projectedSpending !== null && income > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Month-End Risk</CardTitle>
        <Icon className={`h-4 w-4 ${isCalculable ? colorClass : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        {!isCalculable ? (
           <div className="text-center text-muted-foreground pt-4">
             <p>Add income and expenses to calculate risk.</p>
           </div>
        ) : (
          <>
            <div className={`text-2xl font-bold ${colorClass}`}>{statusText}</div>
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
