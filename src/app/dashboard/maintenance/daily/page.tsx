import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const dailyTasks: { id: string; taskName: string; machineId: string; dueDate: string; status: TaskStatus; assignedTo?: string; priority?: "Low" | "Medium" | "High" }[] = [
  { id: "dt001", taskName: "Oil Level Check - Unit A", machineId: "CNC-001", dueDate: "Today", status: "Pending", assignedTo: "John Doe", priority: "High" },
  { id: "dt002", taskName: "Pressure Gauge Reading - Unit B", machineId: "PRESS-002", dueDate: "Today", status: "In Progress", assignedTo: "Jane Smith" , priority: "Medium"},
  { id: "dt003", taskName: "Visual Inspection - Conveyor 1", machineId: "CONV-001", dueDate: "Yesterday", status: "Overdue", priority: "High" },
  { id: "dt004", taskName: "Clean Filters - Compressor X", machineId: "COMP-00X", dueDate: "Today", status: "Completed", assignedTo: "Mike Lee", priority: "Medium" },
];

export default function DailyMaintenancePage() {
  return (
    <>
      <PageHeader 
        title="Daily Maintenance Tasks"
        description="Manage and track all daily maintenance activities."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Daily Task
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dailyTasks.map(task => (
          <MaintenanceTaskCard key={task.id} {...task} />
        ))}
      </div>
    </>
  );
}
