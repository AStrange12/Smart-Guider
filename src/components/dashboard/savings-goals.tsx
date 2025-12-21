"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SavingsGoal } from "@/lib/types";
import { Target } from "lucide-react";

type SavingsGoalsProps = {
  goals: SavingsGoal[];
};

export default function SavingsGoals({ goals }: SavingsGoalsProps) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
        <CardDescription>Track your progress towards your financial goals.</CardDescription>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                      {goal.name} ({goal.category})
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} />
                  <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <span>
                      ₹{goal.currentAmount.toLocaleString("en-IN")}
                    </span>
                    <span>
                      ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No savings goals set yet.</p>
            <p className="text-sm">Click "Add Goal" to create one.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
