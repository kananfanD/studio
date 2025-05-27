
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
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
  { id: "dt001", taskName: "Oil Level Check - Unit A", machineId: "CNC-001", dueDate: "Today", status: "Pending", assignedTo: "John Doe", priority: "High", description: "Check oil level and top up if necessary." , imageUrl: "https://placehold.co/600x400.png?text=Oil+Check" },
  { id: "dt002", taskName: "Pressure Gauge Reading - Unit B", machineId: "PRESS-002", dueDate: "Today", status: "In Progress", assignedTo: "Jane Smith" , priority: "Medium", description: "Record pressure gauge reading." , imageUrl: "https://placehold.co/600x400.png?text=Pressure+Gauge"},
  { id: "dt003", taskName: "Visual Inspection - Conveyor 1", machineId: "CONV-001", dueDate: "Yesterday", status: "Overdue", priority: "High", description: "Visually inspect for any damage or wear.", imageUrl: "https://placehold.co/600x400.png?text=Inspection" },
  { id: "dt004", taskName: "Clean Filters - Compressor X", machineId: "COMP-00X", dueDate: "Today", status: "Completed", assignedTo: "Mike Lee", priority: "Medium", description: "Clean or replace filters as needed.", imageUrl: "https://placehold.co/600x400.png?text=Filter+Clean" },
];

export default function DailyMaintenancePage() {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage if available, otherwise use initialTasks
    const storedTasks = localStorage.getItem("dailyTasks");
    if (storedTasks) {
      setDailyTasks(JSON.parse(storedTasks));
    } else {
      setDailyTasks(initialDailyTasks);
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (dailyTasks.length > 0 || localStorage.getItem("dailyTasks")) { // only save if tasks initialized or previously stored
        localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    }
  }, [dailyTasks]);


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
            editPath="/dashboard/maintenance/daily/new" // Use 'new' page for editing
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
