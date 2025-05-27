import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const monthlyTasks: { id: string; taskName: string; machineId: string; dueDate: string; status: TaskStatus; assignedTo?: string; priority?: "Low" | "Medium" | "High" }[] = [
  { id: "mt001", taskName: "Full System Diagnostics - Unit A", machineId: "CNC-001", dueDate: "End of Month", status: "Pending", priority: "High"},
  { id: "mt002", taskName: "Replace Wear Parts - Press 002", machineId: "PRESS-002", dueDate: "Mid Month", status: "Completed", assignedTo: "Maintenance Dept.", priority: "Medium" },
  { id: "mt003", taskName: "Calibration Check - All Robots", machineId: "ROBOT-CELL", dueDate: "This Month", status: "Pending", priority: "Medium" },
];

export default function MonthlyMaintenancePage() {
  return (
    <>
      <PageHeader 
        title="Monthly Maintenance Tasks"
        description="Oversee and log comprehensive monthly maintenance checks."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Monthly Task
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {monthlyTasks.map(task => (
          <MaintenanceTaskCard key={task.id} {...task} />
        ))}
      </div>
    </>
  );
}
