
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type UserRole = "operator" | "maintenance-planner" | "warehouse" | null;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onLoginSubmit(values: LoginFormValues) {
    console.log("Login submitted:", values);
    
    let userRole: UserRole = null;
    if (typeof window !== 'undefined') {
      localStorage.setItem('equipCareUserLoggedIn', 'true');
      userRole = localStorage.getItem("userRole") as UserRole;
    }

    if (!userRole) {
        toast({
            title: "Role Not Selected",
            description: "Please select your role first before logging in.",
            variant: "destructive",
        });
        router.push("/"); 
        return;
    }

    let roleDisplayName = userRole;
    if (userRole === 'maintenance-planner') {
        roleDisplayName = 'Maintenance Planner';
    } else if (userRole === 'operator') {
        roleDisplayName = 'Operator';
    } else if (userRole === 'warehouse') {
        roleDisplayName = 'Warehouse Staff';
    }


    toast({
      title: "Login Successful",
      description: `Welcome! Redirecting as ${roleDisplayName}...`,
    });

    if (userRole === "operator") {
      router.push("/dashboard/maintenance");
    } else if (userRole === "warehouse") {
      router.push("/dashboard/stock");
    } else if (userRole === "maintenance-planner") {
      router.push("/dashboard");
    } else {
      router.push("/"); 
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-200 p-4">
      <Card className="w-full max-w-md shadow-xl z-20 bg-card">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" iconSize={10} textSize="text-3xl" />
          <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to access EquipCare Hub</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
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
                    <FormLabel className="text-card-foreground">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" variant="default">
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Want to change your role?{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Select role again
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
