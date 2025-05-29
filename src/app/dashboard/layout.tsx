
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react"; 

type UserRole = "operator" | "maintenance" | "warehouse" | null;

const commonAllowedPaths = ["/dashboard/profile", "/dashboard/settings"]; // Added /dashboard/settings
const operatorAllowedPathPrefixes = ["/dashboard/maintenance", "/dashboard/manuals", "/dashboard", ...commonAllowedPaths];
const warehouseAllowedPathPrefixes = ["/dashboard/stock", "/dashboard", ...commonAllowedPaths];
const maintenanceAllowedPathPrefixes = ["/dashboard"]; 

function isPathAllowed(path: string, role: UserRole): boolean {
  if (!role) return false;

  if (role === "maintenance") {
    // Maintenance staff can access any path starting with /dashboard
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

const MOBILE_BREAKPOINT = 768; // md breakpoint

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Effect to apply theme from localStorage on initial load and when it changes
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    applyTheme(); // Apply on initial load

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        applyTheme();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            // Redirect to a default allowed page for the role if current path is not allowed
            if (role === "operator") router.push("/dashboard/maintenance");
            else if (role === "warehouse") router.push("/dashboard/stock");
            else router.push("/dashboard"); // Default for maintenance
          }
        } else {
          // If logged in but no role (e.g., direct navigation after login but before role selection)
          router.push("/role-selection"); 
        }
      } else {
        // If not logged in
        router.push("/"); 
      }
      setIsLoading(false);
    }
  }, [router, pathname]); 

  // This effect re-evaluates authorization when pathname or loading state changes,
  // ensuring that if a user navigates to a disallowed page, they are redirected.
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
        const currentRoleFromStorage = localStorage.getItem("userRole") as UserRole;
        setUserRole(currentRoleFromStorage); // Ensure userRole state is up-to-date

        const loggedInStatus = localStorage.getItem("equipCareUserLoggedIn");

        if (loggedInStatus !== "true") {
            setIsAuthorized(false); // Not authorized if not logged in
            router.push("/");
            return;
        }

        if (!currentRoleFromStorage) { // No role selected
            setIsAuthorized(false);
            router.push("/role-selection");
            return;
        }
        
        // Check if the current path is allowed for the stored role
        if (isPathAllowed(pathname, currentRoleFromStorage)) {
            setIsAuthorized(true);
        } else {
            // If current path is not allowed, mark as not authorized and redirect
            setIsAuthorized(false); 
            if (currentRoleFromStorage === "operator") router.push("/dashboard/maintenance");
            else if (currentRoleFromStorage === "warehouse") router.push("/dashboard/stock");
            else router.push("/dashboard"); // Default for maintenance or other roles
        }
    }
  }, [pathname, isLoading, router]); // Depend on pathname and isLoading


  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthorized) {
      document.title = "EquipCare Dashboard";
    }
  }, [isAuthorized]);

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  }

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex w-full h-full">
          <Skeleton className={cn("h-full transition-all duration-300 ease-in-out", isMobileView ? "w-0" : (isDesktopSidebarOpen ? "w-64" : "w-20"))} />
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
      {isMobileView ? (
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px] flex flex-col bg-sidebar text-sidebar-foreground">
            <DashboardSidebar 
              isOpen={true} 
              onToggle={() => setIsMobileSidebarOpen(false)} 
              userRole={userRole}
              isMobileView={true} 
            />
          </SheetContent>
        </Sheet>
      ) : (
        <DashboardSidebar 
            isOpen={isDesktopSidebarOpen} 
            onToggle={toggleDesktopSidebar} 
            userRole={userRole}
            isMobileView={false}
        />
      )}
      
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isMobileView ? "pl-0" : (isDesktopSidebarOpen ? "pl-64" : "pl-20")
        )}>
        {isMobileView && (
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 border-b">
             <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </div>
        )}
        <div className="p-4 md:p-6 lg:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
