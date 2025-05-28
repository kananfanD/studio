
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type UserRole = "operator" | "maintenance" | "warehouse" | null;

const commonAllowedPaths = ["/dashboard/profile"];
const operatorAllowedPathPrefixes = ["/dashboard/maintenance", "/dashboard/manuals", "/dashboard", ...commonAllowedPaths];
const warehouseAllowedPathPrefixes = ["/dashboard/stock", "/dashboard", ...commonAllowedPaths];
const maintenanceAllowedPathPrefixes = ["/dashboard"]; // Allows all under /dashboard

function isPathAllowed(path: string, role: UserRole): boolean {
  if (!role) return false;

  if (role === "maintenance") {
    return path.startsWith("/dashboard");
  }
  if (role === "operator") {
    return operatorAllowedPathPrefixes.some(prefix => path.startsWith(prefix));
  }
  if (role === "warehouse") {
    return warehouseAllowedPathPrefixes.some(prefix => path.startsWith(prefix));
  }
  return false;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem("equipCareUserLoggedIn");
      const role = localStorage.getItem("userRole") as UserRole;
      
      setUserRole(role);

      if (loggedInStatus === "true") {
        if (role) {
          if (isPathAllowed(pathname, role)) {
            setIsAuthorized(true);
          } else {
            // Redirect to a default page for the role if current path is not allowed
            if (role === "operator") router.push("/dashboard/maintenance");
            else if (role === "warehouse") router.push("/dashboard/stock");
            else router.push("/dashboard"); // Maintenance default
          }
        } else {
          router.push("/role-selection"); // Logged in but no role
        }
      } else {
        router.push("/"); // Not logged in
      }
      setIsLoading(false);
    }
  }, [router, pathname]); // Add pathname to dependencies to re-check on path change

  useEffect(() => {
    // This effect handles role changes or direct URL navigation after initial load
    if (!isLoading && typeof window !== 'undefined') {
        const currentRoleFromStorage = localStorage.getItem("userRole") as UserRole;
        setUserRole(currentRoleFromStorage); // Ensure role state is up-to-date

        const loggedInStatus = localStorage.getItem("equipCareUserLoggedIn");

        if (loggedInStatus !== "true") {
            setIsAuthorized(false);
            router.push("/");
            return;
        }

        if (!currentRoleFromStorage) {
            setIsAuthorized(false);
            router.push("/role-selection");
            return;
        }
        
        if (isPathAllowed(pathname, currentRoleFromStorage)) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false); // Important to set to false before redirecting
            if (currentRoleFromStorage === "operator") router.push("/dashboard/maintenance");
            else if (currentRoleFromStorage === "warehouse") router.push("/dashboard/stock");
            else router.push("/dashboard");
        }
    }
  }, [pathname, isLoading, router]);


  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthorized) {
      document.title = "EquipCare Dashboard";
    }
  }, [isAuthorized]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
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
      <DashboardSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} userRole={userRole} />
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
