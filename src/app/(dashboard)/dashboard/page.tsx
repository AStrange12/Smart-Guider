import { redirect } from 'next/navigation';
import {
  getUser,
  getExpenses,
  getSavingsGoals,
} from '@/app/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Goal, Lightbulb, PiggyBank, Receipt } from 'lucide-react';
import SpendingSplitCard from '@/components/dashboard/spending-split-card';
import FinancialHealthCard from '@/components/dashboard/financial-health-card';
import PersonalizedAdviceCard from '@/components/dashboard/personalized-advice-card';
import RecentExpenses from '@/components/dashboard/recent-expenses';
import SavingsGoals from '@/components/dashboard/savings-goals';
import AddExpenseDialog from '@/components/dashboard/add-expense-dialog';
import AddGoalDialog from '@/components/dashboard/add-goal-dialog';
import { analyzeSpendingBehavior, summarizeMonthlySpending } from '@/ai/flows';
import MonthEndRiskCard from '@/components/dashboard/month-end-risk-card';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const expenses = await getExpenses();
  const savingsGoals = await getSavingsGoals();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyExpenses = expenses.filter(e => e.date.toDate() >= startOfMonth);

  const totalSpent = monthlyExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  const needsTotal = monthlyExpenses.filter(e => e.type === 'need').reduce((acc, exp) => acc + exp.amount, 0);
  const wantsTotal = monthlyExpenses.filter(e => e.type === 'want').reduce((acc, exp) => acc + exp.amount, 0);
  const income = user.salary || 0;
  const savingsTotal = income - totalSpent > 0 ? income - totalSpent : 0;
  
  const spendingAnalysis = await analyzeSpendingBehavior({
    expenses: expenses.map(e => ({...e, date: e.date.toDate().toISOString()})),
    income: income,
  }).catch(() => null);

  const spendingSummary = await summarizeMonthlySpending({
    needs: needsTotal,
    wants: wantsTotal,
    savings: savingsTotal,
    totalIncome: income,
  }).catch(() => null);


  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <AddExpenseDialog />
          <AddGoalDialog />
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
        <FinancialHealthCard score={spendingAnalysis?.financialHealthScore} />
        <MonthEndRiskCard income={income} totalSpent={totalSpent} budget={user.budget} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SpendingSplitCard 
          needs={needsTotal} 
          wants={wantsTotal} 
          savings={savingsTotal}
          income={income}
        />
        <RecentExpenses expenses={expenses.slice(0, 10)} />
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle className="text-sm font-medium">AI Advisor</CardTitle>
            </CardHeader>
            <CardContent>
                 <PersonalizedAdviceCard initialSummary={spendingSummary} />
            </CardContent>
        </Card>
        <div className="lg:col-span-3">
            <SavingsGoals goals={savingsGoals} />
        </div>
       </div>
    </main>
  );
}
