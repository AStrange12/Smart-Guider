import { getSavingsGoals, getUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import AddGoalDialog from '@/components/dashboard/add-goal-dialog';
import GoalsList from '@/components/goals/goals-list';

export default async function GoalsPage() {
    const goals = await getSavingsGoals();
    const user = await getUser();

    if (!user) {
        redirect('/login');
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
