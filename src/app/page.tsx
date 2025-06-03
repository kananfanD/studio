"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { User, Wrench, Warehouse } from "lucide-react";
import Link from "next/link";

export default function PreRoleSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleRoleSelect = (role: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role);
    }
    toast({
      title: "Role Noted",
      description: `You've selected ${role}. Please log in.`,
    });
    router.push("/login"); // Redirect to the new login page
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-200 p-4">
      <Card className="w-full max-w-md shadow-xl z-20 bg-card">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" iconSize={10} textSize="text-3xl" />
          <CardTitle className="text-2xl font-bold text-card-foreground">Select Your Role</CardTitle>
          <CardDescription className="text-muted-foreground">Choose your role to proceed to login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-14 text-base justify-start p-4"
            onClick={() => handleRoleSelect("operator")}
          >
            <Wrench className="mr-3 h-6 w-6 text-primary" /> Operator
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 text-base justify-start p-4"
            onClick={() => handleRoleSelect("maintenance")}
          >
            <User className="mr-3 h-6 w-6 text-primary" /> Maintenance Staff
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 text-base justify-start p-4"
            onClick={() => handleRoleSelect("warehouse")}
          >
            <Warehouse className="mr-3 h-6 w-6 text-primary" /> Warehouse Staff
          </Button>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Proceed to Login
            </Link>
          </p>
           <p className="mt-2 text-center text-sm text-muted-foreground">
            New user?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
