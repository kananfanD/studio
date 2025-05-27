
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export interface WeeklyTask {
  id: string;
  taskName: string;
  machineId: string;
  dueDate: string;
  status: TaskStatus;
  assignedTo?: string;
  priority?: "Low" | "Medium" | "High";
  description?: string;
  imageUrl?: string;
}

const initialWeeklyTasks: WeeklyTask[] = [
  { id: "wt001", taskName: "Lubrication - Main Gearbox", machineId: "CNC-001", dueDate: "This Week", status: "Pending", assignedTo: "Team A", priority: "High", description: "Lubricate main gearbox as per schedule.", imageUrl: "https://placehold.co/600x400.png?text=Lubrication" },
  { id: "wt002", taskName: "Belt Tension Check - Unit C", machineId: "MOTOR-003", dueDate: "This Week", status: "Pending", assignedTo: "Sarah Connor", priority: "Medium", description: "Check and adjust belt tension.", imageUrl: "https://placehold.co/600x400.png?text=Belt+Check" },
  { id: "wt003", taskName: "Safety System Test - All Units", machineId: "ALL", dueDate: "End of Week", status: "In Progress", priority: "High", description: "Test all safety interlocks and e-stops.", imageUrl: "https://placehold.co/600x400.png?text=Safety+Test"},
];

export default function WeeklyMaintenancePage() {
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem("weeklyTasks");
    if (storedTasks) {
      setWeeklyTasks(JSON.parse(storedTasks));
    } else {
      setWeeklyTasks(initialWeeklyTasks);
    }
  }, []);

  useEffect(() => {
    if (weeklyTasks.length > 0 || localStorage.getItem("weeklyTasks")) {
     localStorage.setItem("weeklyTasks", JSON.stringify(weeklyTasks));
    }
  }, [weeklyTasks]);

  const handleDeleteTask = (taskId: string) => {
    setWeeklyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The weekly task has been successfully deleted.",
      variant: "destructive",
    });
  };

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
          <MaintenanceTaskCard 
            key={task.id} 
            {...task} 
            onDelete={() => handleDeleteTask(task.id)}
            editPath="/dashboard/maintenance/weekly/new"
          />
        ))}
      </div>
      {weeklyTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <p>No weekly tasks found. Add a new task to get started.</p>
        </div>
      )}
    </>
  );
}
