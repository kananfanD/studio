
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import MaintenanceTaskCard, { type TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListChecks, Sunrise, CalendarDays, CalendarRange } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { translations, type SupportedLanguage, languageMap } from "../settings/page";

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

type UserRole = "operator" | "maintenance" | "warehouse" | null;

const initialDailyTasks: DailyTask[] = [
  { id: "dt001", taskName: "Oil Level Check - Unit A", machineId: "CNC-001", dueDate: "Today", status: "Pending", assignedTo: "John Doe", priority: "High", description: "Check oil level and top up if necessary." , imageUrl: "https://placehold.co/600x400.png" },
  { id: "dt002", taskName: "Pressure Gauge Reading - Unit B", machineId: "PRESS-002", dueDate: "Today", status: "In Progress", assignedTo: "Jane Smith" , priority: "Medium", description: "Record pressure gauge reading." , imageUrl: "https://placehold.co/600x400.png"},
];
const initialWeeklyTasks: WeeklyTask[] = [
  { id: "wt001", taskName: "Lubrication - Main Gearbox", machineId: "CNC-001", dueDate: "This Week", status: "Pending", assignedTo: "Team A", priority: "High", description: "Lubricate main gearbox as per schedule.", imageUrl: "https://placehold.co/600x400.png" },
  { id: "wt002", taskName: "Belt Tension Check - Unit C", machineId: "MOTOR-003", dueDate: "This Week", status: "Pending", assignedTo: "Sarah Connor", priority: "Medium", description: "Check and adjust belt tension.", imageUrl: "https://placehold.co/600x400.png" },
];
const initialMonthlyTasks: MonthlyTask[] = [
  { id: "mt001", taskName: "Full System Diagnostics - Unit A", machineId: "CNC-001", dueDate: "End of Month", status: "Pending", priority: "High", description: "Run full system diagnostics.", imageUrl: "https://placehold.co/600x400.png"},
  { id: "mt002", taskName: "Replace Wear Parts - Press 002", machineId: "PRESS-002", dueDate: "Mid Month", status: "Completed", assignedTo: "Maintenance Dept.", priority: "Medium", description: "Replace designated wear parts.", imageUrl: "https://placehold.co/600x400.png" },
];


export default function MaintenanceTasksPage() {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [monthlyTasks, setMonthlyTasks] = useState<MonthlyTask[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const { toast } = useToast();

  const [currentTranslations, setCurrentTranslations] = useState(translations.en);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const loadLanguageAndRole = () => {
      const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
      if (savedLanguage && languageMap[savedLanguage]) {
        setSelectedLanguage(savedLanguage);
        setCurrentTranslations(translations[savedLanguage] || translations.en);
      } else {
        setSelectedLanguage("en");
        setCurrentTranslations(translations.en);
      }
      const role = localStorage.getItem("userRole") as UserRole;
      setUserRole(role);
    };
    loadLanguageAndRole();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLanguage' || event.key === 'userRole') {
        loadLanguageAndRole();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const loadTasks = () => {
    const storedDaily = localStorage.getItem("dailyTasks");
    setDailyTasks(storedDaily ? JSON.parse(storedDaily) : initialDailyTasks);
    if(!storedDaily) localStorage.setItem("dailyTasks", JSON.stringify(initialDailyTasks));


    const storedWeekly = localStorage.getItem("weeklyTasks");
    setWeeklyTasks(storedWeekly ? JSON.parse(storedWeekly) : initialWeeklyTasks);
     if(!storedWeekly) localStorage.setItem("weeklyTasks", JSON.stringify(initialWeeklyTasks));


    const storedMonthly = localStorage.getItem("monthlyTasks");
    setMonthlyTasks(storedMonthly ? JSON.parse(storedMonthly) : initialMonthlyTasks);
    if(!storedMonthly) localStorage.setItem("monthlyTasks", JSON.stringify(initialMonthlyTasks));
    
    setHasInitialized(true);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    }
  }, [dailyTasks, hasInitialized]);

  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("weeklyTasks", JSON.stringify(weeklyTasks));
    }
  }, [weeklyTasks, hasInitialized]);

  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("monthlyTasks", JSON.stringify(monthlyTasks));
    }
  }, [monthlyTasks, hasInitialized]);

  const handleDeleteTask = (taskId: string, type: "daily" | "weekly" | "monthly") => {
    if (userRole === "operator") {
        toast({
            title: "Action Not Allowed",
            description: "Operators cannot delete tasks.",
            variant: "destructive",
        });
        return;
    }
    let taskName = "";
    if (type === "daily") {
      const taskToDelete = dailyTasks.find(task => task.id === taskId);
      taskName = taskToDelete?.taskName || "Task";
      setDailyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } else if (type === "weekly") {
      const taskToDelete = weeklyTasks.find(task => task.id === taskId);
      taskName = taskToDelete?.taskName || "Task";
      setWeeklyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } else if (type === "monthly") {
      const taskToDelete = monthlyTasks.find(task => task.id === taskId);
      taskName = taskToDelete?.taskName || "Task";
      setMonthlyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Task Deleted`,
      description: `The task "${taskName}" has been successfully deleted.`,
      variant: "destructive",
    });
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if ((event.key === 'dailyTasks' || event.key === 'weeklyTasks' || event.key === 'monthlyTasks') && event.newValue) {
        loadTasks();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getButtonInfo = () => {
    switch (activeTab) {
      case "daily":
        return { text: currentTranslations.addNewDailyTask || "Add New Daily Task", href: "/dashboard/maintenance/daily/new", icon: Sunrise };
      case "weekly":
        return { text: currentTranslations.addNewWeeklyTask || "Add New Weekly Task", href: "/dashboard/maintenance/weekly/new", icon: CalendarDays };
      case "monthly":
        return { text: currentTranslations.addNewMonthlyTask || "Add New Monthly Task", href: "/dashboard/maintenance/monthly/new", icon: CalendarRange };
      default:
        return { text: currentTranslations.addNewTask || "Add New Task", href: "#", icon: PlusCircle };
    }
  };

  const { text: buttonText, href: buttonHref, icon: ButtonIcon } = getButtonInfo();

  return (
    <>
      <PageHeader
        title={currentTranslations.pageTitleMaintenanceTasks || "Maintenance Tasks"}
        description={currentTranslations.pageDescriptionMaintenanceTasks || "Manage and track all maintenance activities."}
      >
        {userRole !== "operator" && (
          <Button asChild className="w-full sm:w-auto">
            <Link href={buttonHref}>
              <ButtonIcon className="mr-2 h-4 w-4" /> {buttonText}
            </Link>
          </Button>
        )}
      </PageHeader>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "daily" | "weekly" | "monthly")} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="daily" className="py-2">{currentTranslations.dailyTasksTab || "Daily Tasks"}</TabsTrigger>
          <TabsTrigger value="weekly" className="py-2">{currentTranslations.weeklyTasksTab || "Weekly Tasks"}</TabsTrigger>
          <TabsTrigger value="monthly" className="py-2">{currentTranslations.monthlyTasksTab || "Monthly Tasks"}</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dailyTasks.map(task => (
              <MaintenanceTaskCard
                key={task.id}
                {...task}
                onDelete={() => handleDeleteTask(task.id, "daily")}
                editPath="/dashboard/maintenance/daily/new"
                imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
                userRole={userRole}
              />
            ))}
          </div>
          {hasInitialized && dailyTasks.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <ListChecks className="mx-auto h-12 w-12" />
              <p className="mt-2">{currentTranslations.noDailyTasksFound || "No daily tasks found."}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="weekly">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {weeklyTasks.map(task => (
              <MaintenanceTaskCard
                key={task.id}
                {...task}
                onDelete={() => handleDeleteTask(task.id, "weekly")}
                editPath="/dashboard/maintenance/weekly/new"
                imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
                userRole={userRole}
              />
            ))}
          </div>
          {hasInitialized && weeklyTasks.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <ListChecks className="mx-auto h-12 w-12" />
              <p className="mt-2">{currentTranslations.noWeeklyTasksFound || "No weekly tasks found."}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {monthlyTasks.map(task => (
              <MaintenanceTaskCard
                key={task.id}
                {...task}
                onDelete={() => handleDeleteTask(task.id, "monthly")}
                editPath="/dashboard/maintenance/monthly/new"
                imageUrl={task.imageUrl || "https://placehold.co/600x400.png"}
                userRole={userRole}
              />
            ))}
          </div>
          {hasInitialized && monthlyTasks.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <ListChecks className="mx-auto h-12 w-12" />
              <p className="mt-2">{currentTranslations.noMonthlyTasksFound || "No monthly tasks found."}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
    
