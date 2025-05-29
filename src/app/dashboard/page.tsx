
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
  CalendarRange,
} from "lucide-react";
import Link from "next/link";
import type { DailyTask } from "./maintenance/page"; 
import type { WeeklyTask } from "./maintenance/page"; 
import type { MonthlyTask } from "./maintenance/page"; 
import type { StockItem } from "./stock/page";
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { translations, type SupportedLanguage, languageMap } from "./settings/page";


export default function DashboardPage() {
  const [pendingDailyTasks, setPendingDailyTasks] = useState<number>(0);
  const [lowStockComponents, setLowStockComponents] = useState<number>(0);
  const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState<number>(0);
  const [machinesOperational, setMachinesOperational] = useState<string>("0%");
  const [userName, setUserName] = useState("User");

  const [currentTranslations, setCurrentTranslations] = useState(translations.en);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const loadLanguage = () => {
      const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
      if (savedLanguage && languageMap[savedLanguage]) {
        setSelectedLanguage(savedLanguage);
        setCurrentTranslations(translations[savedLanguage] || translations.en);
      } else {
        setSelectedLanguage("en");
        setCurrentTranslations(translations.en);
      }
    };
    loadLanguage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLanguage') {
        loadLanguage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


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
        const dailyTasksData: DailyTask[] = JSON.parse(dailyTasksString);
        const pending = dailyTasksData.filter(task => task.status === "Pending" || task.status === "In Progress" || task.status === "Overdue").length;
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
        const weeklyTasksData: WeeklyTask[] = JSON.parse(weeklyTasksString);
        const completed = weeklyTasksData.filter(task => task.status === "Completed").length;
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

  const pageTitle = currentTranslations.pageTitleDashboard?.replace('{userName}', userName) || `Welcome, ${userName}!`;
  const pageDescription = currentTranslations.pageDescriptionDashboard || "Here's a summary of your maintenance activities.";


  return (
    <>
      <PageHeader 
        title={pageTitle}
        description={pageDescription}
      >
        <Button asChild>
          <Link href="/dashboard/maintenance/daily/new"> 
            <Sunrise className="mr-2 h-4 w-4" /> {currentTranslations.sidebarMaintenanceTasks?.split(' ')[0] || "New Daily Task"}
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title={currentTranslations.pendingDailyTasks || "Pending Daily Tasks"}
          value={pendingDailyTasks}
          icon={CalendarClock}
          description={currentTranslations.tasksNeedingAttention || "Tasks needing attention"}
          className="bg-card border-primary/20"
          iconClassName="text-primary"
        />
        <StatCard
          title={currentTranslations.componentsLowStock || "Components Low Stock"}
          value={lowStockComponents}
          icon={AlertTriangle}
          description={currentTranslations.orderNewPartsSoon || "Order new parts soon"}
          className="bg-card border-destructive/30"
          iconClassName="text-destructive"
        />
        <StatCard
          title={currentTranslations.completedThisWeek || "Completed This Week"}
          value={completedWeeklyTasks}
          icon={ListChecks}
          description={currentTranslations.weeklyMaintenanceTasks || "Weekly maintenance tasks"}
          className="bg-card border-green-500/30"
          iconClassName="text-green-500"
        />
        <StatCard
          title={currentTranslations.machinesOperational || "Machines Operational"}
          value={machinesOperational}
          icon={CheckCircle2}
          description={currentTranslations.overallEquipmentEffectiveness || "Overall equipment effectiveness"}
          className="bg-card border-blue-500/30"
          iconClassName="text-blue-500"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">{currentTranslations.quickActions || "Quick Actions"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/maintenance" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">{currentTranslations.sidebarMaintenanceTasks || "Maintenance Tasks"}</h3>
                <p className="text-sm text-muted-foreground">{currentTranslations.viewAllMaintenanceTasks || "View all maintenance tasks"}</p>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/inventory" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">{currentTranslations.sidebarMaintenanceLog || "Maintenance Log"}</h3>
                <p className="text-sm text-muted-foreground">{currentTranslations.viewHistoricalTaskLog || "View historical task log"}</p>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/stock" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <PackageCheck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">{currentTranslations.sidebarComponentStock || "Component Stock"}</h3>
                <p className="text-sm text-muted-foreground">{currentTranslations.checkInventoryLevels || "Check inventory levels"}</p>
              </div>
            </Card>
          </Link>
           <Link href="/dashboard/manuals" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <BookOpenText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">{currentTranslations.sidebarManuals || "Maintenance Manuals"}</h3>
                <p className="text-sm text-muted-foreground">{currentTranslations.accessPdfGuides || "Access PDF guides"}</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </>
  );
}

    