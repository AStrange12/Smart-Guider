
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import {
  getUser,
  getExpenses,
  getSavingsGoals,
  getInvestments,
} from '@/app/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Receipt, Trophy } from 'lucide-react';
import SpendingSplitCard from '@/components/dashboard/spending-split-card';
import FinancialHealthCard from '@/components/dashboard/financial-health-card';
import PersonalizedAdviceCard from '@/components/dashboard/personalized-advice-card';
import RecentExpenses from '@/components/dashboard/recent-expenses';
import SavingsGoals from '@/components/dashboard/savings-goals';
import AddExpenseDialog from '@/components/dashboard/add-expense-dialog';
import AddGoalDialog from '@/components/dashboard/add-goal-dialog';
import MonthEndRiskCard from '@/components/dashboard/month-end-risk-card';
import type { UserProfile, Expense, SavingsGoal, Investment } from '@/lib/types';
import AddInvestmentDialog from '@/components/investments/add-investment-dialog';
import MonthlyComparisonCard from '@/components/dashboard/monthly-comparison-card';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (user && firestore) {
      setLoading(true);
      const [profile, userExpenses, userGoals] = await Promise.all([
        getUser(firestore, user.uid),
        getExpenses(firestore, user.uid),
        getSavingsGoals(firestore, user.uid),
      ]);

      setUserProfile(profile);
      setExpenses(userExpenses);
      setSavingsGoals(userGoals);
      setLoading(false);
    }
  }, [user, firestore]);

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

  const totalSpent = monthlyExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  const income = userProfile.salary || 0;
  
  const needsTotalCurrent = monthlyExpenses.filter(e => e.type === 'need').reduce((acc, exp) => acc + exp.amount, 0);
  const wantsTotalCurrent = monthlyExpenses.filter(e => e.type === 'want').reduce((acc, exp) => acc + exp.amount, 0);
  const savingsTotalCurrent = Math.max(0, income - (needsTotalCurrent + wantsTotalCurrent));

  const needsTotalPrevious = previousMonthExpenses.filter(e => e.type === 'need').reduce((acc, exp) => acc + exp.amount, 0);
  const wantsTotalPrevious = previousMonthExpenses.filter(e => e.type === 'want').reduce((acc, exp) => acc + exp.amount, 0);
  const savingsTotalPrevious = Math.max(0, income - (needsTotalPrevious + wantsTotalPrevious));

  const bonus = userProfile.bonus;

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <AddExpenseDialog onExpenseAdded={fetchData}/>
          <AddGoalDialog onGoalAdded={fetchData}/>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{income.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">Your monthly salary</p>
             {bonus && (
                <div className="mt-2 flex items-center text-xs">
                    <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                    <span className="text-muted-foreground">
                        + ₹{bonus.amount.toLocaleString('en-IN')} ({bonus.type})
                    </span>
                </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent (This Month)</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">
              {income > 0 ? `${((totalSpent / income) * 100).toFixed(1)}% of income` : `100% of income`}
            </p>
          </CardContent>
        </Card>
        <FinancialHealthCard expenses={expenses} userProfile={userProfile} />
        <MonthEndRiskCard income={income} totalSpent={totalSpent} budget={userProfile.budget} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SpendingSplitCard 
          needs={needsTotalCurrent} 
          wants={wantsTotalCurrent} 
          savings={savingsTotalCurrent}
          income={income}
        />
        <RecentExpenses expenses={expenses.slice(0, 10)} onExpenseChange={fetchData}/>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle className="text-sm font-medium">AI Advisor</CardTitle>
            </CardHeader>
            <CardContent>
                 <PersonalizedAdviceCard userProfile={userProfile} expenses={expenses} />
            </CardContent>
        </Card>
        <div className="lg:col-span-3">
            <SavingsGoals goals={savingsGoals} onGoalChange={fetchData}/>
        </div>
       </div>
       <div className="grid gap-4 md:grid-cols-1">
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
       </div>
    </main>
  );
}
