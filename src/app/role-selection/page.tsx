
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { User, Wrench, Warehouse } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader"; // Assuming you might want a header
import Link from "next/link";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();

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
          <CardTitle className="text-2xl font-bold text-card-foreground">Select Your Role</CardTitle>
          <CardDescription className="text-muted-foreground">Choose your role to continue to the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
           <div className="pt-4 text-center">
            <Button variant="link" asChild>
              <Link href="/">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
