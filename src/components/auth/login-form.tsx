
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Chrome } from "lucide-react";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormProps = {
  isRegister?: boolean;
}

export function LoginForm({ isRegister = false }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    if (!auth) return;

    // Handle redirect from Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        // This can happen if the user closes the popup.
        // We can generally ignore this error.
        console.error("Google sign-in redirect error:", error.message);
      })
      .finally(() => {
        setGoogleLoading(false);
      });
      
    // Handle redirect for email/password and direct Google sign-in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            router.push('/dashboard');
        } else {
            // Ensure loading state is reset if auth fails or user signs out
            setLoading(false);
            setGoogleLoading(false);
        }
    });

    return () => unsubscribe();

  }, [auth, router]);
  

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const authPromise = isRegister
      ? createUserWithEmailAndPassword(auth, values.email, values.password)
      : signInWithEmailAndPassword(auth, values.email, values.password);

    authPromise.catch((error: any) => {
      console.error("Authentication Error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
      setLoading(false); // Reset loading state on error
    });
    // The onAuthStateChanged listener will handle the redirect on success.
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch((error: any) => {
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
      setGoogleLoading(false);
    });
  };
  

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading || googleLoading} className="w-full">
            {loading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            )}
            {isRegister ? "Register" : "Sign In"}
          </Button>
        </form>
      </Form>
       <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={loading || googleLoading} onClick={handleGoogleSignIn}>
        {googleLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
        Google
      </Button>
    </div>
  );
}
