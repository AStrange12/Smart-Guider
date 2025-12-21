"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getUser } from '@/app/actions';
import SettingsForm from '@/components/dashboard/settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserProfile } from '@/lib/types';

export default function SettingsPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    useEffect(() => {
        async function fetchUserProfile() {
            if (user) {
                setLoading(true);
                const profile = await getUser(user.uid);
                setUserProfile(profile);
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, [user]);

    if (loading || isUserLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }
    
    if (!userProfile) return null;

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
                    <SettingsForm user={userProfile} />
                </CardContent>
            </Card>
        </main>
    );
}
