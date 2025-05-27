import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EquipCare Dashboard",
  description: "Manage your industrial equipment maintenance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 pl-64"> {/* Adjust pl based on sidebar width */}
        <div className="p-6 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
