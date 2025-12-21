import { getUser, getExpenses } from '@/app/actions';
import { redirect } from 'next/navigation';
import { analyzeSpendingBehavior } from '@/ai/flows/analyze-spending-behavior';
import AdviceGenerator from '@/components/advice/advice-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdvicePage() {
    const user = await getUser();
    if (!user) {
        redirect('/login');
    }

    const expenses = await getExpenses();

    const spendingAnalysisResult = await analyzeSpendingBehavior({
        expenses: expenses.map(e => ({...e, date: e.date.toDate().toISOString()})),
        income: user.salary || 0,
    }).catch(() => null);

    return (
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Personalized AI Advice</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Financial Advisor</CardTitle>
                    <CardDescription>
                        Get tailored advice from our AI based on your spending and goals.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AdviceGenerator 
                        userProfile={user} 
                        spendingAnalysisSummary={spendingAnalysisResult?.summary || 'No spending data available.'}
                    />
                </CardContent>
            </Card>
        </main>
    );
}
