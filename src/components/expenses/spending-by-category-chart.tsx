"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

interface SpendingByCategoryChartProps {
    data: { name: string; total: number }[];
}

export default function SpendingByCategoryChart({ data }: SpendingByCategoryChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No spending data available to display chart.
            </div>
        )
    }
    return (
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                     <Tooltip 
                        cursor={{ fill: 'hsl(var(--secondary))' }} 
                        content={<ChartTooltipContent 
                            formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                        />}
                     />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
