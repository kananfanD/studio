
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import type { Metadata } from "next";
import { useState } from "react";
import { cn } from "@/lib/utils";

// export const metadata: Metadata = { // Metadata cannot be used in client components directly
//   title: "EquipCare Dashboard",
//   description: "Manage your industrial equipment maintenance.",
// };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // It's better to set document title in a client component using useEffect if needed
  if (typeof window !== 'undefined') {
    document.title = "EquipCare Dashboard";
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
