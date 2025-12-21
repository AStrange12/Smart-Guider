import { getUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/dashboard/settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
    const user = await getUser();
    if (!user) {
        redirect('/login');
    }

    return (
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                        Update your financial information and budget preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm user={user} />
                </CardContent>
            </Card>
        </main>
    );
}
