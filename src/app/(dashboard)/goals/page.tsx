"use client";

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getSavingsGoals } from '@/app/actions';
import AddGoalDialog from '@/components/dashboard/add-goal-dialog';
import GoalsList from '@/components/goals/goals-list';
import type { SavingsGoal } from '@/lib/types';

export default function GoalsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    useEffect(() => {
        async function fetchGoals() {
            if (user && firestore) {
                setLoading(true);
                const userGoals = await getSavingsGoals(firestore, user.uid);
                setGoals(userGoals);
                setLoading(false);
            }
        }
        fetchGoals();
    }, [user, firestore]);

    if (loading || isUserLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Savings Goals</h2>
                <AddGoalDialog />
            </div>
            <div className="pt-4">
                <GoalsList goals={goals} />
            </div>
        </main>
    );
}
