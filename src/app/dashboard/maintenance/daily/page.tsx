
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { type TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export interface DailyTask {
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

const initialDailyTasks: DailyTask[] = [
  { id: "dt001", taskName: "Oil Level Check - Unit A", machineId: "CNC-001", dueDate: "Today", status: "Pending", assignedTo: "John Doe", priority: "High", description: "Check oil level and top up if necessary." , imageUrl: "https://placehold.co/600x400.png" },
  { id: "dt002", taskName: "Pressure Gauge Reading - Unit B", machineId: "PRESS-002", dueDate: "Today", status: "In Progress", assignedTo: "Jane Smith" , priority: "Medium", description: "Record pressure gauge reading." , imageUrl: "https://placehold.co/600x400.png"},
  { id: "dt003", taskName: "Visual Inspection - Conveyor 1", machineId: "CONV-001", dueDate: "Yesterday", status: "Overdue", priority: "High", description: "Visually inspect for any damage or wear.", imageUrl: "https://placehold.co/600x400.png" },
  { id: "dt004", taskName: "Clean Filters - Compressor X", machineId: "COMP-00X", dueDate: "Today", status: "Completed", assignedTo: "Mike Lee", priority: "Medium", description: "Clean or replace filters as needed.", imageUrl: "https://placehold.co/600x400.png" },
];

export default function DailyMaintenancePage() {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem("dailyTasks");
    if (storedTasks) {
      try {
        setDailyTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse dailyTasks from localStorage", e);
        setDailyTasks(initialDailyTasks); // Fallback to initial if parse fails
      }
    } else {
      setDailyTasks(initialDailyTasks);
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    }
  }, [dailyTasks, hasInitialized]);


  const handleDeleteTask = (taskId: string) => {
    setDailyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The daily task has been successfully deleted.",
      variant: "destructive",
    });
  };

  return (
    <>
      <PageHeader 
        title="Daily Maintenance Tasks"
        description="Manage and track all daily maintenance activities."
      >
        <Button asChild>
          <Link href="/dashboard/maintenance/daily/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Daily Task
          </Link>
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dailyTasks.map(task => (
          <MaintenanceTaskCard 
            key={task.id} 
            {...task} 
            onDelete={() => handleDeleteTask(task.id)}
            editPath="/dashboard/maintenance/daily/new" 
            // Ensure imageUrl is passed, default in card if undefined/empty
            imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
            // dataAihint can be added to DailyTask interface and form if needed
          />
        ))}
      </div>
      {dailyTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <p>No daily tasks found. Add a new task to get started.</p>
        </div>
      )}
    </>
  );
}
