
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; 
import { 
  CalendarClock, 
  AlertTriangle, 
  PackageCheck, 
  Wrench, 
  PlusCircle, 
  ListChecks, 
  CheckCircle2, 
  BookOpenText,
  ClipboardList,
  Sunrise,
  CalendarDays,
  CalendarRange
} from "lucide-react";
import Link from "next/link";
import type { DailyTask } from "./maintenance/daily/page"; 
import type { WeeklyTask } from "./maintenance/weekly/page"; 
import type { MonthlyTask } from "./maintenance/monthly/page"; 
import type { StockItem } from "./stock/page";
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";


export default function DashboardPage() {
  const [pendingDailyTasks, setPendingDailyTasks] = useState<number>(0);
  const [lowStockComponents, setLowStockComponents] = useState<number>(0);
  const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState<number>(0);
  const [machinesOperational, setMachinesOperational] = useState<string>("0%");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedProfileString = localStorage.getItem("userProfile");
        if (storedProfileString) {
            try {
                const storedProfile = JSON.parse(storedProfileString);
                setUserName(storedProfile.name || "User");
            } catch (e) {
                // Keep default if parse fails
            }
        }
    }

    const dailyTasksString = localStorage.getItem("dailyTasks");
    if (dailyTasksString) {
      try {
        const dailyTasks: DailyTask[] = JSON.parse(dailyTasksString);
        const pending = dailyTasks.filter(task => task.status === "Pending" || task.status === "In Progress" || task.status === "Overdue").length;
        setPendingDailyTasks(pending);
      } catch (e) {
        console.error("Failed to parse dailyTasks for dashboard stats", e);
      }
    }

    const stockItemsString = localStorage.getItem("stockItems");
    if (stockItemsString) {
      try {
        const stockItems: StockItem[] = JSON.parse(stockItemsString);
        const lowStock = stockItems.filter(item => item.minStockLevel !== undefined && item.quantity < item.minStockLevel).length;
        setLowStockComponents(lowStock);
      } catch (e) {
        console.error("Failed to parse stockItems for dashboard stats", e);
      }
    }

    const weeklyTasksString = localStorage.getItem("weeklyTasks");
    if (weeklyTasksString) {
      try {
        const weeklyTasks: WeeklyTask[] = JSON.parse(weeklyTasksString);
        const completed = weeklyTasks.filter(task => task.status === "Completed").length;
        setCompletedWeeklyTasks(completed);
      } catch (e) {
        console.error("Failed to parse weeklyTasks for dashboard stats", e);
      }
    }

    let allTasks: { status: TaskStatus }[] = [];
    const taskKeys = ["dailyTasks", "weeklyTasks", "monthlyTasks"];
    taskKeys.forEach(key => {
      const tasksString = localStorage.getItem(key);
      if (tasksString) {
        try {
          const tasks = JSON.parse(tasksString);
          allTasks = allTasks.concat(tasks.map((task: any) => ({ status: task.status })));
        } catch (e) {
          console.error(`Failed to parse ${key} for operational stats`, e);
        }
      }
    });

    if (allTasks.length > 0) {
      const overdueTasks = allTasks.filter(task => task.status === "Overdue").length;
      const operationalPercentage = Math.round(((allTasks.length - overdueTasks) / allTasks.length) * 100);
      setMachinesOperational(`${operationalPercentage}%`);
    } else {
      setMachinesOperational("100%"); 
    }

  }, []);

  return (
    <>
      <PageHeader 
        title={`Welcome, ${userName}!`}
        description="Here's a summary of your maintenance activities."
      >
        <Button asChild>
          <Link href="/dashboard/maintenance/daily/new"> 
            <PlusCircle className="mr-2 h-4 w-4" /> New Daily Task
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Pending Daily Tasks"
          value={pendingDailyTasks}
          icon={CalendarClock}
          description="Tasks needing attention"
          className="bg-card border-primary/20"
          iconClassName="text-primary"
        />
        <StatCard
          title="Components Low Stock"
          value={lowStockComponents}
          icon={AlertTriangle}
          description="Order new parts soon"
          className="bg-card border-destructive/30"
          iconClassName="text-destructive"
        />
        <StatCard
          title="Completed This Week"
          value={completedWeeklyTasks}
          icon={ListChecks}
          description="Weekly maintenance tasks"
          className="bg-card border-green-500/30"
          iconClassName="text-green-500"
        />
        <StatCard
          title="Machines Operational"
          value={machinesOperational}
          icon={CheckCircle2}
          description="Overall equipment effectiveness"
          className="bg-card border-blue-500/30"
          iconClassName="text-blue-500"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/maintenance/daily" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <Sunrise className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Daily Maintenance</h3>
                <p className="text-sm text-muted-foreground">View daily tasks</p>
              </div>
            </Card>
          </Link>
           <Link href="/dashboard/maintenance/weekly" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <CalendarDays className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Weekly Maintenance</h3>
                <p className="text-sm text-muted-foreground">View weekly tasks</p>
              </div>
            </Card>
          </Link>
           <Link href="/dashboard/maintenance/monthly" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <CalendarRange className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Monthly Maintenance</h3>
                <p className="text-sm text-muted-foreground">View monthly tasks</p>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/inventory" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Maintenance Log</h3>
                <p className="text-sm text-muted-foreground">View historical task log</p>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/stock" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <PackageCheck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Component Stock</h3>
                <p className="text-sm text-muted-foreground">Check inventory levels</p>
              </div>
            </Card>
          </Link>
           <Link href="/dashboard/manuals" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <BookOpenText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Maintenance Manuals</h3>
                <p className="text-sm text-muted-foreground">Access PDF guides</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </>
  );
}
