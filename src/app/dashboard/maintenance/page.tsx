
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, ListChecks } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard from "@/components/maintenance/MaintenanceTaskCard";
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Interfaces from individual pages
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

// Initial data (can be kept for fallback if needed, or removed if localStorage is always populated)
const initialDailyTasks: DailyTask[] = [
  { id: "dt001", taskName: "Oil Level Check - Unit A", machineId: "CNC-001", dueDate: "Today", status: "Pending", assignedTo: "John Doe", priority: "High", description: "Check oil level and top up if necessary.", imageUrl: "https://placehold.co/600x400.png" },
];
const initialWeeklyTasks: WeeklyTask[] = [
  { id: "wt001", taskName: "Lubrication - Main Gearbox", machineId: "CNC-001", dueDate: "This Week", status: "Pending", assignedTo: "Team A", priority: "High", description: "Lubricate main gearbox as per schedule.", imageUrl: "https://placehold.co/600x400.png" },
];
const initialMonthlyTasks: MonthlyTask[] = [
  { id: "mt001", taskName: "Full System Diagnostics - Unit A", machineId: "CNC-001", dueDate: "End of Month", status: "Pending", priority: "High", description: "Run full system diagnostics.", imageUrl: "https://placehold.co/600x400.png" },
];


export default function MaintenancePage() {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [monthlyTasks, setMonthlyTasks] = useState<MonthlyTask[]>([]);
  
  const [hasInitializedDaily, setHasInitializedDaily] = useState(false);
  const [hasInitializedWeekly, setHasInitializedWeekly] = useState(false);
  const [hasInitializedMonthly, setHasInitializedMonthly] = useState(false);
  
  const { toast } = useToast();

  // Load Daily Tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem("dailyTasks");
    if (storedTasks) {
      try {
        setDailyTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse dailyTasks from localStorage", e);
        setDailyTasks(initialDailyTasks); 
      }
    } else {
      setDailyTasks(initialDailyTasks);
    }
    setHasInitializedDaily(true);
  }, []);

  useEffect(() => {
    if (hasInitializedDaily) {
      localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    }
  }, [dailyTasks, hasInitializedDaily]);

  // Load Weekly Tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem("weeklyTasks");
    if (storedTasks) {
      try {
        setWeeklyTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse weeklyTasks from localStorage", e);
        setWeeklyTasks(initialWeeklyTasks);
      }
    } else {
      setWeeklyTasks(initialWeeklyTasks);
    }
    setHasInitializedWeekly(true);
  }, []);

  useEffect(() => {
    if (hasInitializedWeekly) {
      localStorage.setItem("weeklyTasks", JSON.stringify(weeklyTasks));
    }
  }, [weeklyTasks, hasInitializedWeekly]);

  // Load Monthly Tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem("monthlyTasks");
    if (storedTasks) {
      try {
        setMonthlyTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse monthlyTasks from localStorage", e);
        setMonthlyTasks(initialMonthlyTasks);
      }
    } else {
      setMonthlyTasks(initialMonthlyTasks);
    }
    setHasInitializedMonthly(true);
  }, []);

  useEffect(() => {
    if (hasInitializedMonthly) {
      localStorage.setItem("monthlyTasks", JSON.stringify(monthlyTasks));
    }
  }, [monthlyTasks, hasInitializedMonthly]);

  const handleDeleteDailyTask = (taskId: string) => {
    setDailyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({ title: "Daily Task Deleted", variant: "destructive" });
  };
  const handleDeleteWeeklyTask = (taskId: string) => {
    setWeeklyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({ title: "Weekly Task Deleted", variant: "destructive" });
  };
  const handleDeleteMonthlyTask = (taskId: string) => {
    setMonthlyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({ title: "Monthly Task Deleted", variant: "destructive" });
  };

  // Listen to storage events to update tasks if changed in other tabs/pages
    useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dailyTasks' && event.newValue) {
        try { setDailyTasks(JSON.parse(event.newValue)); } catch(e) { console.error(e); }
      }
      if (event.key === 'weeklyTasks' && event.newValue) {
         try { setWeeklyTasks(JSON.parse(event.newValue)); } catch(e) { console.error(e); }
      }
      if (event.key === 'monthlyTasks' && event.newValue) {
        try { setMonthlyTasks(JSON.parse(event.newValue)); } catch(e) { console.error(e); }
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
        title="Maintenance Tasks"
        description="Manage all scheduled maintenance activities: Daily, Weekly, and Monthly."
      />
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-0 mb-6">
          <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Tasks</TabsTrigger>
        </TabsList>

        {/* Daily Tasks Tab */}
        <TabsContent value="daily">
          <div className="flex justify-end mb-6">
            <Button asChild>
              <Link href="/dashboard/maintenance/daily/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Daily Task
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dailyTasks.map(task => (
              <MaintenanceTaskCard
                key={task.id}
                {...task}
                onDelete={() => handleDeleteDailyTask(task.id)}
                editPath="/dashboard/maintenance/daily/new"
                imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
              />
            ))}
          </div>
          {hasInitializedDaily && dailyTasks.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <ListChecks className="mx-auto h-12 w-12" />
              <p className="mt-2">No daily tasks found.</p>
              <p className="text-sm">Add a new daily task to get started.</p>
            </div>
          )}
        </TabsContent>

        {/* Weekly Tasks Tab */}
        <TabsContent value="weekly">
          <div className="flex justify-end mb-6">
            <Button asChild>
              <Link href="/dashboard/maintenance/weekly/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Weekly Task
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {weeklyTasks.map(task => (
              <MaintenanceTaskCard
                key={task.id}
                {...task}
                onDelete={() => handleDeleteWeeklyTask(task.id)}
                editPath="/dashboard/maintenance/weekly/new"
                imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
              />
            ))}
          </div>
          {hasInitializedWeekly && weeklyTasks.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
               <ListChecks className="mx-auto h-12 w-12" />
              <p className="mt-2">No weekly tasks found.</p>
              <p className="text-sm">Add a new weekly task to get started.</p>
            </div>
          )}
        </TabsContent>

        {/* Monthly Tasks Tab */}
        <TabsContent value="monthly">
          <div className="flex justify-end mb-6">
            <Button asChild>
              <Link href="/dashboard/maintenance/monthly/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Monthly Task
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {monthlyTasks.map(task => (
              <MaintenanceTaskCard
                key={task.id}
                {...task}
                onDelete={() => handleDeleteMonthlyTask(task.id)}
                editPath="/dashboard/maintenance/monthly/new"
                imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
              />
            ))}
          </div>
          {hasInitializedMonthly && monthlyTasks.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
               <ListChecks className="mx-auto h-12 w-12" />
              <p className="mt-2">No monthly tasks found.</p>
              <p className="text-sm">Add a new monthly task to get started.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
