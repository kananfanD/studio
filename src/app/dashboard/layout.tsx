
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This check needs to be client-side only
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem("equipCareUserLoggedIn");
      if (loggedInStatus === "true") {
        setIsAuthenticated(true);
      } else {
        router.push("/"); // Redirect to login if not logged in
      }
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      document.title = "EquipCare Dashboard";
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {/* Basic loading skeleton for the dashboard layout */}
        <div className="flex w-full h-full">
          <Skeleton className={cn("h-full transition-all duration-300 ease-in-out", isSidebarOpen ? "w-64" : "w-20")} />
          <div className="flex-1 p-6 md:p-8 space-y-8">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "pl-64" : "pl-20"
        )}>
        <div className="p-6 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
