
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center justify-center">
            <Image src="https://i.ibb.co/wHk5fgy/Chat-GPT-Image-Dec-24-2025-03-48-49-PM.png" alt="Salary Guider Logo" width={32} height={32} className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">Salary Guider</span>
        </Link>
       </div>
       <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your financial dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm isRegister={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
           <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>Get started with your personalized financial advisor.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm isRegister={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
