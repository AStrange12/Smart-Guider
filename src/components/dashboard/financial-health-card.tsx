"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type FinancialHealthCardProps = {
  score: number | undefined | null;
};

export default function FinancialHealthCard({ score }: FinancialHealthCardProps) {
  const safeScore = score || 0;
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 40) return "hsl(var(--destructive))";
    if (s < 70) return "hsl(var(--chart-4))";
    return "hsl(var(--chart-2))";
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {score === undefined || score === null ? (
          <div className="text-muted-foreground text-center py-8">
            <p>Not enough data to calculate score.</p>
            <p className="text-xs">Add more expenses to see your score.</p>
          </div>
        ) : (
          <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="stroke-current text-secondary"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              ></circle>
              {/* Progress circle */}
              <circle
                className="stroke-current transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
                style={{ color: getColor(safeScore) }}
              ></circle>
              {/* Text */}
              <text
                x="50"
                y="50"
                fontFamily="Verdana"
                fontSize="24"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="hsl(var(--foreground))"
              >
                {safeScore}
              </text>
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
