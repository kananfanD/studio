
"use client";

import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ClipboardList } from "lucide-react";
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import { translations, type SupportedLanguage, languageMap } from "../settings/page";

export type MaintenanceTaskType = "Daily" | "Weekly" | "Monthly";

export interface CombinedTask {
  id: string;
  taskName: string;
  machineId: string;
  dueDate: string;
  status: TaskStatus;
  type: MaintenanceTaskType;
  assignedTo?: string;
  priority?: "Low" | "Medium" | "High";
  description?: string;
  imageUrl?: string; 
}

export default function InventoryMaintenancePage() {
  const [combinedTasks, setCombinedTasks] = useState<CombinedTask[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

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

  const loadTasks = () => {
    const allTasksLogString = localStorage.getItem("allMaintenanceTasksLog");
    let tasksFromLog: CombinedTask[] = [];

    if (allTasksLogString) {
      try {
        tasksFromLog = JSON.parse(allTasksLogString);
      } catch (e) {
        console.error("Failed to parse allMaintenanceTasksLog from localStorage", e);
      }
    }
    
    tasksFromLog.sort((a, b) => {
      try {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateA.getTime() - dateB.getTime();
        }
      } catch (parseError) {
        // If date parsing fails, fall back to string comparison or a default order
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
    setCombinedTasks(tasksFromLog);
  };
  
  useEffect(() => {
    loadTasks();
    setHasInitialized(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'allMaintenanceTasksLog' || event.key === 'dailyTasks' || event.key === 'weeklyTasks' || event.key === 'monthlyTasks') {
        loadTasks();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    const tableColumn = ["Task Name", "Machine ID", "Type", "Due Date", "Status", "Priority", "Assigned To"];
    const tableRows: (string | undefined)[][] = [];

    combinedTasks.forEach(task => {
      const taskData = [
        task.taskName,
        task.machineId,
        task.type,
        task.dueDate,
        task.status,
        task.priority || "N/A",
        task.assignedTo || "N/A",
      ];
      tableRows.push(taskData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, 
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 }, 
        1: { cellWidth: 25 }, 
        2: { cellWidth: 18 }, 
        3: { cellWidth: 20 }, 
        4: { cellWidth: 20 }, 
        5: { cellWidth: 18 }, 
        6: { cellWidth: 25 }, 
      }
    });
    
    doc.text(currentTranslations.pageTitleMaintenanceLog || "Maintenance Task Log", 14, 15);
    doc.save("maintenance_task_log.pdf");
  };

  return (
    <>
      <PageHeader
        title={currentTranslations.pageTitleMaintenanceLog || "Maintenance Task Log"}
        description={currentTranslations.pageDescriptionMaintenanceLog || "A historical log of all daily, weekly, and monthly maintenance tasks."}
      >
        <Button onClick={handleDownloadPdf} disabled={combinedTasks.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {currentTranslations.downloadPdfButton || "Download PDF"}
        </Button>
      </PageHeader>

      {hasInitialized && combinedTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <ClipboardList className="mx-auto h-12 w-12" />
          <p className="mt-2">{currentTranslations.noMaintenanceTasksInLog || "No maintenance tasks found in the log."}</p>
          <p className="text-sm">{currentTranslations.addTasksToSeeLog || "Add tasks in Daily, Weekly, or Monthly sections to see them here."}</p>
        </div>
      )}

      {hasInitialized && combinedTasks.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] text-foreground">{currentTranslations.taskNameTableHeader || "Task Name"}</TableHead>
                    <TableHead className="text-foreground">{currentTranslations.machineIdTableHeader || "Machine ID"}</TableHead>
                    <TableHead className="text-foreground">{currentTranslations.typeTableHeader || "Type"}</TableHead>
                    <TableHead className="text-foreground">{currentTranslations.dueDateTableHeader || "Due Date"}</TableHead>
                    <TableHead className="text-foreground">{currentTranslations.statusTableHeader || "Status"}</TableHead>
                    <TableHead className="text-foreground">{currentTranslations.priorityTableHeader || "Priority"}</TableHead>
                    <TableHead className="text-foreground">{currentTranslations.assignedToTableHeader || "Assigned To"}</TableHead>
                    <TableHead className="w-[250px] text-foreground">{currentTranslations.descriptionTableHeader || "Description"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedTasks.map((task) => (
                    <TableRow key={`${task.type}-${task.id}`}>
                      <TableCell className="font-medium">{task.taskName}</TableCell>
                      <TableCell>{task.machineId}</TableCell>
                      <TableCell>
                        <Badge 
                           variant={task.type === "Daily" ? "default" : task.type === "Weekly" ? "secondary" : "outline"}
                           className={
                             task.type === "Daily" ? "bg-sky-500 hover:bg-sky-600 text-white" :
                             task.type === "Weekly" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                             "bg-purple-500 hover:bg-purple-600 text-white"
                           }
                        >
                          {task.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Badge 
                           className={
                            task.status === "Completed" ? "bg-green-500 hover:bg-green-600 text-primary-foreground" :
                            task.status === "Pending" ? "bg-blue-500 hover:bg-blue-600 text-primary-foreground" :
                            task.status === "In Progress" ? "bg-yellow-500 hover:bg-yellow-600 text-black" :
                            task.status === "Overdue" ? "bg-red-600 hover:bg-red-700 text-destructive-foreground" :
                            "bg-gray-400 text-white"
                           }
                        >
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}
                          className={
                            task.priority === "High" ? "" : 
                            task.priority === "Medium" ? "bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-600" :
                            "border-gray-400 text-muted-foreground hover:bg-gray-100"
                          }
                        >
                          {task.priority || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo || "N/A"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-xs">{task.description || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

    