
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type MonthlyData = {
  needs: number;
  wants: number;
  savings: number;
};

type MonthlyComparisonCardProps = {
  current: MonthlyData;
  previous: MonthlyData;
};

const chartConfig = {
  current: {
    label: "Current Month",
    color: "hsl(var(--chart-1))",
  },
  previous: {
    label: "Previous Month",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MonthlyComparisonCard({ current, previous }: MonthlyComparisonCardProps) {

  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const previousMonthName = new Date(now.getFullYear(), now.getMonth() - 1).toLocaleString('default', { month: 'long' });

  const chartData = [
    { name: "Needs", current: current.needs, previous: previous.needs },
    { name: "Wants", current: current.wants, previous: previous.wants },
    { name: "Savings", current: current.savings, previous: previous.savings },
  ];
  
  const hasPreviousData = previous.needs > 0 || previous.wants > 0 || previous.savings > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>{currentMonthName} vs. {previousMonthName}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasPreviousData ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent
                    formatter={(value, name) => (
                        <div className="flex flex-col">
                            <span className="capitalize">{name}</span>
                            <span className="font-bold">₹{Number(value).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    labelFormatter={(label) => <div className="font-bold">{label}</div>}
                  />}
                />
                <Legend />
                <Bar dataKey="previous" fill="var(--color-previous)" radius={4} name={previousMonthName}/>
                <Bar dataKey="current" fill="var(--color-current)" radius={4} name={currentMonthName}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground text-center">
                <div>
                    <p>No data available for the previous month to make a comparison.</p>
                    <p className="text-sm">Keep using the app to see your monthly trends.</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
