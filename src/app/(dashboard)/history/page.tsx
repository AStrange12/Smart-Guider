
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import {
  getUser,
  getExpenses,
} from '@/app/actions';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import MonthlyComparisonCard from '@/components/dashboard/monthly-comparison-card';
import type { UserProfile, Expense } from '@/lib/types';

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (user && firestore) {
      setLoading(true);
      const [profile, userExpenses] = await Promise.all([
        getUser(firestore, user.uid),
        getExpenses(firestore, user.uid),
      ]);

      setUserProfile(profile);
      setExpenses(userExpenses);
      setLoading(false);
    }
  }, [user, firestore]);

   useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  if (loading || isUserLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
  }
  
  if (!userProfile) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
  const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfPreviousMonth = new Date(currentYear, currentMonth, 0);

  const monthlyExpenses = expenses.filter(e => e.date.toDate() >= startOfCurrentMonth);
  const previousMonthExpenses = expenses.filter(e => {
      const expenseDate = e.date.toDate();
      return expenseDate >= startOfPreviousMonth && expenseDate <= endOfPreviousMonth;
  });

  const income = userProfile.salary || 0;
  
  const needsTotalCurrent = monthlyExpenses.filter(e => e.type === 'need').reduce((acc, exp) => acc + exp.amount, 0);
  const wantsTotalCurrent = monthlyExpenses.filter(e => e.type === 'want').reduce((acc, exp) => acc + exp.amount, 0);
  const savingsTotalCurrent = Math.max(0, income - (needsTotalCurrent + wantsTotalCurrent));

  const needsTotalPrevious = previousMonthExpenses.filter(e => e.type === 'need').reduce((acc, exp) => acc + exp.amount, 0);
  const wantsTotalPrevious = previousMonthExpenses.filter(e => e.type === 'want').reduce((acc, exp) => acc + exp.amount, 0);
  const savingsTotalPrevious = Math.max(0, income - (needsTotalPrevious + wantsTotalPrevious));

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">History</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Comparison</CardTitle>
          <CardDescription>
            A look at your spending habits for the current vs. previous month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyComparisonCard
            current={{
              needs: needsTotalCurrent,
              wants: wantsTotalCurrent,
              savings: savingsTotalCurrent
            }}
            previous={{
              needs: needsTotalPrevious,
              wants: wantsTotalPrevious,
              savings: savingsTotalPrevious
            }}
          />
        </CardContent>
       </Card>
    </main>
  );
}
