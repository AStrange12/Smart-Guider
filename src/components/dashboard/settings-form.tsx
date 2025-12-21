"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { UserProfile } from "@/lib/types";
import { updateUserSettings } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const settingsSchema = z.object({
    salary: z.coerce.number().min(0, "Salary must be a positive number."),
    taxRegime: z.enum(["old", "new"]),
    needs: z.coerce.number().min(0).max(100),
    wants: z.coerce.number().min(0).max(100),
    savings: z.coerce.number().min(0).max(100),
}).refine(data => data.needs + data.wants + data.savings === 100, {
    message: "Budget percentages must add up to 100.",
    path: ["needs"],
});

export default function SettingsForm({ user }: { user: UserProfile }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            salary: user.salary || 0,
            taxRegime: user.taxRegime || 'new',
            needs: user.budget?.needs || 50,
            wants: user.budget?.wants || 30,
            savings: user.budget?.savings || 20,
        },
    });

    const [needs, wants, savings] = form.watch(["needs", "wants", "savings"]);

    async function onSubmit(values: z.infer<typeof settingsSchema>) {
        setIsSubmitting(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        const result = await updateUserSettings(formData);

        if (result?.error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: result.error,
            });
        } else {
            toast({
                title: "Success!",
                description: "Your settings have been updated.",
            });
        }
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monthly Salary (₹)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 50000" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your take-home salary per month.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="taxRegime"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Tax Regime</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="new" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            New Tax Regime
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="old" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Old Tax Regime
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                             <FormDescription>
                                Select your income tax regime for more accurate advice.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <Label>Budget Allocation (50-30-20 Rule)</Label>
                     <p className="text-sm text-muted-foreground">Customize your budget split. The total must be 100%.</p>
                     <div className="flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="needs"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Needs %</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="wants"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Wants %</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                     <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="savings"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Savings %</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                     <div className="flex items-center gap-2">
                        <Progress value={Number(needs) + Number(wants) + Number(savings)} className="w-full" />
                        <span className="text-sm font-medium min-w-12 text-right">
                           {Number(needs) + Number(wants) + Number(savings)}%
                        </span>
                     </div>
                     {form.formState.errors.needs && (
                         <p className="text-sm font-medium text-destructive">{form.formState.errors.needs.message}</p>
                     )}
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    );
}
