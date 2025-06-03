
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
import { LogIn, User, Wrench, Warehouse } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onLoginSubmit(values: z.infer<typeof formSchema>) {
    console.log("Login submitted:", values);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('equipCareUserLoggedIn', 'true');
    }

    toast({
      title: "Login Successful",
      description: "Please select your role to continue.",
    });
    setShowRoleSelection(true); // Show role selection UI
  }

  const handleRoleSelect = (role: string, redirectPath: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role);
    }
    toast({
        title: "Role Selected",
        description: `Proceeding as ${role}.`,
    });
    router.push(redirectPath);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-200 p-4">
      <Card className="w-full max-w-md shadow-xl z-20 bg-card">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" iconSize={10} textSize="text-3xl" />
          {!showRoleSelection ? (
            <>
              <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground">Sign in to access EquipCare Hub</CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold text-card-foreground">Select Your Role</CardTitle>
              <CardDescription className="text-muted-foreground">Choose your role to proceed to the dashboard.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {!showRoleSelection ? (
            <>
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
            </>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-14 text-base justify-start p-4"
                onClick={() => handleRoleSelect("operator", "/dashboard/maintenance")}
              >
                <Wrench className="mr-3 h-6 w-6 text-primary" /> Operator
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 text-base justify-start p-4"
                onClick={() => handleRoleSelect("maintenance", "/dashboard")}
              >
                <User className="mr-3 h-6 w-6 text-primary" /> Maintenance Staff
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 text-base justify-start p-4"
                onClick={() => handleRoleSelect("warehouse", "/dashboard/stock")}
              >
                <Warehouse className="mr-3 h-6 w-6 text-primary" /> Warehouse Staff
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
