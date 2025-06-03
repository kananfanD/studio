
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
import type { CombinedTask, MaintenanceTaskType } from "../inventory/page";

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
  dataAihint?: string;
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
  dataAihint?: string;
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
  dataAihint?: string;
}

type UserRole = "operator" | "maintenance" | "warehouse" | null;

const initialDailyTasks: DailyTask[] = [
  { id: "dtsort001", taskName: "Pembersihan Sensor Optik", machineId: "SORT-TBK-01", dueDate: "Today", status: "Pending", assignedTo: "Operator Pagi", priority: "High", description: "Bersihkan semua sensor optik dari debu dan residu tembakau.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "sensor industrial" },
  { id: "dtsort002", taskName: "Cek Tekanan Udara Kompresor", machineId: "SORT-TBK-01", dueDate: "Today", status: "Pending", assignedTo: "Operator Pagi", priority: "Medium", description: "Pastikan tekanan udara pada kompresor ejector sesuai standar.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "air compressor" },
  { id: "dtsort003", taskName: "Inspeksi Conveyor Belt", machineId: "SORT-TBK-01", dueDate: "Today", status: "In Progress", assignedTo: "Operator Pagi", priority: "Medium", description: "Periksa kondisi fisik conveyor belt, pastikan tidak ada sobekan atau benda asing.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "conveyor belt"},
];
const initialWeeklyTasks: WeeklyTask[] = [
  { id: "wtsort001", taskName: "Kalibrasi Kamera Pemilah", machineId: "SORT-TBK-01", dueDate: "This Week", status: "Pending", assignedTo: "Tim Maintenance", priority: "High", description: "Lakukan kalibrasi pada kamera pemilah warna dan ukuran.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "camera lens" },
  { id: "wtsort002", taskName: "Pembersihan Area Ejector", machineId: "SORT-TBK-01", dueDate: "This Week", status: "Pending", assignedTo: "Tim Maintenance", priority: "Medium", description: "Bersihkan nozel ejector dan area sekitarnya dari penumpukan tembakau.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "machine nozzle" },
  { id: "wtsort003", taskName: "Cek Pelumasan Bearing Conveyor", machineId: "SORT-TBK-01", dueDate: "This Week", status: "Pending", assignedTo: "Tim Maintenance", priority: "Medium", description: "Periksa dan tambahkan pelumas pada bearing conveyor jika diperlukan.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "machine bearing" },
];
const initialMonthlyTasks: MonthlyTask[] = [
  { id: "mtsort001", taskName: "Pemeriksaan Umum Panel Listrik", machineId: "SORT-TBK-01", dueDate: "End of Month", status: "Pending", priority: "High", description: "Periksa koneksi kabel dan kebersihan panel listrik utama mesin.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "electrical panel"},
  { id: "mtsort002", taskName: "Penggantian Filter Udara Kompresor", machineId: "SORT-TBK-01", dueDate: "End of Month", status: "Pending", assignedTo: "Tim Maintenance", priority: "Medium", description: "Ganti filter udara pada sistem kompresor ejector.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "air filter" },
  { id: "mtsort003", taskName: "Backup Konfigurasi Sistem", machineId: "SORT-TBK-01", dueDate: "Mid Month", status: "Completed", assignedTo: "Ahli IT", priority: "High", description: "Lakukan backup penuh konfigurasi sistem pemilahan.", imageUrl: "https://placehold.co/600x400.png", dataAihint: "server system"},
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
      // Also listen for direct task list changes to reload
      if ((event.key === 'dailyTasks' || event.key === 'weeklyTasks' || event.key === 'monthlyTasks' || event.key === 'allMaintenanceTasksLog') && event.newValue) {
        loadTasksAndPopulateLog(); // Re-run the loading and log population logic
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const loadTasksAndPopulateLog = () => {
    let isInitialPopulationForAnyType = false;

    const storedDaily = localStorage.getItem("dailyTasks");
    if (!storedDaily) {
      localStorage.setItem("dailyTasks", JSON.stringify(initialDailyTasks));
      setDailyTasks(initialDailyTasks);
      isInitialPopulationForAnyType = true;
    } else {
      setDailyTasks(JSON.parse(storedDaily));
    }

    const storedWeekly = localStorage.getItem("weeklyTasks");
    if (!storedWeekly) {
      localStorage.setItem("weeklyTasks", JSON.stringify(initialWeeklyTasks));
      setWeeklyTasks(initialWeeklyTasks);
      isInitialPopulationForAnyType = true;
    } else {
      setWeeklyTasks(JSON.parse(storedWeekly));
    }

    const storedMonthly = localStorage.getItem("monthlyTasks");
    if (!storedMonthly) {
      localStorage.setItem("monthlyTasks", JSON.stringify(initialMonthlyTasks));
      setMonthlyTasks(initialMonthlyTasks);
      isInitialPopulationForAnyType = true;
    } else {
      setMonthlyTasks(JSON.parse(storedMonthly));
    }
    
    // If any of the task types were initialized, attempt to initialize the log
    if (isInitialPopulationForAnyType) {
      const storedAllTasksLog = localStorage.getItem("allMaintenanceTasksLog");
      // Check if log is missing or is an empty array string
      if (!storedAllTasksLog || (storedAllTasksLog && JSON.parse(storedAllTasksLog).length === 0) ) {
        const combinedInitialLog: CombinedTask[] = [];

        initialDailyTasks.forEach(task => combinedInitialLog.push({ ...task, type: "Daily" as MaintenanceTaskType, imageUrl: task.imageUrl || "https://placehold.co/600x400.png" }));
        initialWeeklyTasks.forEach(task => combinedInitialLog.push({ ...task, type: "Weekly" as MaintenanceTaskType, imageUrl: task.imageUrl || "https://placehold.co/600x400.png" }));
        initialMonthlyTasks.forEach(task => combinedInitialLog.push({ ...task, type: "Monthly" as MaintenanceTaskType, imageUrl: task.imageUrl || "https://placehold.co/600x400.png" }));
        
        localStorage.setItem("allMaintenanceTasksLog", JSON.stringify(combinedInitialLog));
        // Dispatch event so inventory page can update if it's open
        window.dispatchEvent(new StorageEvent('storage', { key: 'allMaintenanceTasksLog', newValue: JSON.stringify(combinedInitialLog), storageArea: localStorage }));
      }
    }
    setHasInitialized(true);
  };


  useEffect(() => {
    loadTasksAndPopulateLog();
  }, []); // Initial load

  // Separate useEffects to save individual task lists when they change
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

    // Also remove from allMaintenanceTasksLog
    const storedAllTasksLogString = localStorage.getItem("allMaintenanceTasksLog");
    if (storedAllTasksLogString) {
        let allTasksLog: CombinedTask[] = JSON.parse(storedAllTasksLogString);
        allTasksLog = allTasksLog.filter(task => task.id !== taskId);
        localStorage.setItem("allMaintenanceTasksLog", JSON.stringify(allTasksLog));
        window.dispatchEvent(new StorageEvent('storage', { key: 'allMaintenanceTasksLog', newValue: JSON.stringify(allTasksLog), storageArea: localStorage }));
    }

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Task Deleted`,
      description: `The task "${taskName}" has been successfully deleted.`,
      variant: "destructive",
    });
  };

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
                dataAihint={task.dataAihint}
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
                dataAihint={task.dataAihint}
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
                dataAihint={task.dataAihint}
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
    
