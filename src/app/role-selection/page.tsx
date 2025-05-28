
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { User, Wrench, Warehouse } from "lucide-react";

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleRoleSelect = (role: string, redirectPath: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role);
    }
    router.push(redirectPath);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="items-center text-center">
          <Logo className="mb-6" iconSize={10} textSize="text-3xl" />
          <CardTitle className="text-2xl font-bold">Select Your Role</CardTitle>
          <CardDescription>Choose your role to proceed to the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-16 text-lg justify-start p-4"
            onClick={() => handleRoleSelect("operator", "/dashboard/maintenance")}
          >
            <Wrench className="mr-3 h-6 w-6 text-primary" /> Operator
          </Button>
          <Button
            variant="outline"
            className="w-full h-16 text-lg justify-start p-4"
            onClick={() => handleRoleSelect("maintenance", "/dashboard")}
          >
            <User className="mr-3 h-6 w-6 text-primary" /> Maintenance Staff
          </Button>
          <Button
            variant="outline"
            className="w-full h-16 text-lg justify-start p-4"
            onClick={() => handleRoleSelect("warehouse", "/dashboard/stock")}
          >
            <Warehouse className="mr-3 h-6 w-6 text-primary" /> Warehouse Staff
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
