import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const weeklyTasks: { id: string; taskName: string; machineId: string; dueDate: string; status: TaskStatus; assignedTo?: string; priority?: "Low" | "Medium" | "High" }[] = [
  { id: "wt001", taskName: "Lubrication - Main Gearbox", machineId: "CNC-001", dueDate: "This Week", status: "Pending", assignedTo: "Team A", priority: "High" },
  { id: "wt002", taskName: "Belt Tension Check - Unit C", machineId: "MOTOR-003", dueDate: "This Week", status: "Pending", assignedTo: "Sarah Connor", priority: "Medium"},
  { id: "wt003", taskName: "Safety System Test - All Units", machineId: "ALL", dueDate: "End of Week", status: "In Progress", priority: "High" },
];

export default function WeeklyMaintenancePage() {
  return (
    <>
      <PageHeader 
        title="Weekly Maintenance Tasks"
        description="Schedule and monitor weekly maintenance routines."
      >
        <Button asChild>
          <Link href="/dashboard/maintenance/weekly/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Weekly Task
          </Link>
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyTasks.map(task => (
          <MaintenanceTaskCard key={task.id} {...task} />
        ))}
      </div>
    </>
  );
}
