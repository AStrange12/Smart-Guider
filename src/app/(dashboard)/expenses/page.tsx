import { getExpenses, getUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import AddExpenseDialog from '@/components/dashboard/add-expense-dialog';
import ExpensesDataTable from '@/components/expenses/expenses-data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpendingByCategoryChart from '@/components/expenses/spending-by-category-chart';


export default async function ExpensesPage() {
    const expenses = await getExpenses();
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    const sortedExpenses = expenses.sort((a, b) => b.date.toMillis() - a.date.toMillis());

    const spendingByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(spendingByCategory).map(([category, amount]) => ({
        name: category,
        total: amount,
    }));


    return (
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
                <AddExpenseDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>A breakdown of your spending across all categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SpendingByCategoryChart data={chartData} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>
                        A complete history of your expenses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpensesDataTable expenses={sortedExpenses} />
                </CardContent>
            </Card>
        </main>
    );
}
