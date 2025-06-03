
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

const commonAllowedPaths = ["/dashboard/profile", "/dashboard/settings"];
const operatorAllowedPathPrefixes = ["/dashboard/maintenance", "/dashboard/manuals", "/dashboard", ...commonAllowedPaths];
const warehouseAllowedPathPrefixes = ["/dashboard/stock", "/dashboard", ...commonAllowedPaths];
const maintenanceAllowedPathPrefixes = ["/dashboard"]; 

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

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    applyTheme(); 

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
            if (role === "operator") router.push("/dashboard/maintenance");
            else if (role === "warehouse") router.push("/dashboard/stock");
            else router.push("/dashboard"); 
          }
        } else {
          // If logged in but no role, redirect to login page (which now handles role selection)
          router.push("/"); 
        }
      } else {
        router.push("/"); 
      }
      setIsLoading(false);
    }
  }, [router, pathname]); 

  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
        const currentRoleFromStorage = localStorage.getItem("userRole") as UserRole;
        setUserRole(currentRoleFromStorage); 

        const loggedInStatus = localStorage.getItem("equipCareUserLoggedIn");

        if (loggedInStatus !== "true") {
            setIsAuthorized(false); 
            router.push("/");
            return;
        }

        if (!currentRoleFromStorage) { 
            setIsAuthorized(false);
             // If logged in but no role, redirect to login page (which now handles role selection)
            router.push("/");
            return;
        }
        
        if (isPathAllowed(pathname, currentRoleFromStorage)) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false); 
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
