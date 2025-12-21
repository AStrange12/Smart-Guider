"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SavingsGoal } from "@/lib/types";
import { Target } from "lucide-react";

type GoalsListProps = {
  goals: SavingsGoal[];
};

export default function GoalsList({ goals }: GoalsListProps) {
  return (
    <>
      {goals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            return (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{goal.name}</CardTitle>
                    <Target className="h-5 w-5 text-muted-foreground"/>
                  </div>
                  <CardDescription>{goal.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Progress value={progress} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      ₹{goal.currentAmount.toLocaleString("en-IN")}
                    </span>
                    <span>
                      ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg mt-4">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No savings goals yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Click "Add Goal" to create your first one.</p>
        </div>
      )}
    </>
  );
}
