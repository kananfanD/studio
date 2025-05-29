
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { type TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListChecks } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export interface MonthlyTask {
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

const initialMonthlyTasks: MonthlyTask[] = [
  { id: "mt001", taskName: "Full System Diagnostics - Unit A", machineId: "CNC-001", dueDate: "End of Month", status: "Pending", priority: "High", description: "Run full system diagnostics.", imageUrl: "https://placehold.co/600x400.png"},
  { id: "mt002", taskName: "Replace Wear Parts - Press 002", machineId: "PRESS-002", dueDate: "Mid Month", status: "Completed", assignedTo: "Maintenance Dept.", priority: "Medium", description: "Replace designated wear parts.", imageUrl: "https://placehold.co/600x400.png" },
  { id: "mt003", taskName: "Calibration Check - All Robots", machineId: "ROBOT-CELL", dueDate: "This Month", status: "Pending", priority: "Medium", description: "Perform calibration checks.", imageUrl: "https://placehold.co/600x400.png" },
];

export default function MonthlyMaintenancePage() {
  const [monthlyTasks, setMonthlyTasks] = useState<MonthlyTask[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem("monthlyTasks");
    if (storedTasks) {
      try {
        setMonthlyTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse monthlyTasks from localStorage", e);
        localStorage.setItem("monthlyTasks", JSON.stringify(initialMonthlyTasks)); // Reset if corrupted
        setMonthlyTasks(initialMonthlyTasks);
      }
    } else {
      localStorage.setItem("monthlyTasks", JSON.stringify(initialMonthlyTasks));
      setMonthlyTasks(initialMonthlyTasks);
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if(hasInitialized){
        localStorage.setItem("monthlyTasks", JSON.stringify(monthlyTasks));
    }
  }, [monthlyTasks, hasInitialized]);

  const handleDeleteTask = (taskId: string) => {
    setMonthlyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The monthly task has been successfully deleted.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'monthlyTasks' && event.newValue) {
        try { 
          setMonthlyTasks(JSON.parse(event.newValue)); 
        } catch(e) { 
          console.error("Failed to parse monthlyTasks from storage event", e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      <PageHeader 
        title="Monthly Maintenance Tasks"
        description="Oversee and log comprehensive monthly maintenance checks."
      >
        <Button asChild>
          <Link href="/dashboard/maintenance/monthly/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Monthly Task
          </Link>
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {monthlyTasks.map(task => (
          <MaintenanceTaskCard 
            key={task.id} 
            {...task} 
            onDelete={() => handleDeleteTask(task.id)}
            editPath="/dashboard/maintenance/monthly/new"
            imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
          />
        ))}
      </div>
      {hasInitialized && monthlyTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <ListChecks className="mx-auto h-12 w-12" />
          <p className="mt-2">No monthly tasks found.</p>
          <p className="text-sm">Add a new monthly task to get started.</p>
        </div>
      )}
    </>
  );
}
