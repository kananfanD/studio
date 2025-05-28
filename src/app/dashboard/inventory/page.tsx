
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
import type { DailyTask } from "../maintenance/daily/page";
import type { WeeklyTask } from "../maintenance/weekly/page";
import type { MonthlyTask } from "../maintenance/monthly/page";

type MaintenanceTaskType = "Daily" | "Weekly" | "Monthly";

interface CombinedTask {
  id: string;
  taskName: string;
  machineId: string;
  dueDate: string;
  status: TaskStatus;
  type: MaintenanceTaskType;
  assignedTo?: string;
  priority?: "Low" | "Medium" | "High";
  description?: string;
}

export default function InventoryMaintenancePage() {
  const [combinedTasks, setCombinedTasks] = useState<CombinedTask[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const loadTasks = () => {
    let allTasks: CombinedTask[] = [];

    // Load Daily Tasks
    const dailyTasksString = localStorage.getItem("dailyTasks");
    if (dailyTasksString) {
      try {
        const dailyTasks: DailyTask[] = JSON.parse(dailyTasksString);
        allTasks = allTasks.concat(dailyTasks.map(task => ({ ...task, type: "Daily" })));
      } catch (e) {
        console.error("Failed to parse dailyTasks from localStorage", e);
      }
    }

    // Load Weekly Tasks
    const weeklyTasksString = localStorage.getItem("weeklyTasks");
    if (weeklyTasksString) {
      try {
        const weeklyTasks: WeeklyTask[] = JSON.parse(weeklyTasksString);
        allTasks = allTasks.concat(weeklyTasks.map(task => ({ ...task, type: "Weekly" })));
      } catch (e) {
        console.error("Failed to parse weeklyTasks from localStorage", e);
      }
    }

    // Load Monthly Tasks
    const monthlyTasksString = localStorage.getItem("monthlyTasks");
    if (monthlyTasksString) {
      try {
        const monthlyTasks: MonthlyTask[] = JSON.parse(monthlyTasksString);
        allTasks = allTasks.concat(monthlyTasks.map(task => ({ ...task, type: "Monthly" })));
      } catch (e) {
        console.error("Failed to parse monthlyTasks from localStorage", e);
      }
    }
    
    // Sort tasks by due date
    allTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateA.getTime() - dateB.getTime();
      }
      // Fallback for non-standard date strings or if parsing fails
      return a.dueDate.localeCompare(b.dueDate);
    });
    setCombinedTasks(allTasks);
  };
  
  useEffect(() => {
    loadTasks();
    setHasInitialized(true);

    // Listen for storage changes to update if tasks are modified elsewhere
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dailyTasks' || event.key === 'weeklyTasks' || event.key === 'monthlyTasks') {
        loadTasks();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener on component unmount
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
      headStyles: { fillColor: [22, 160, 133] }, // Teal color for header
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 }, // Task Name
        1: { cellWidth: 25 }, // Machine ID
        2: { cellWidth: 18 }, // Type
        3: { cellWidth: 20 }, // Due Date
        4: { cellWidth: 20 }, // Status
        5: { cellWidth: 18 }, // Priority
        6: { cellWidth: 25 }, // Assigned To
      }
    });
    
    doc.text("Maintenance Task Inventory", 14, 15);
    doc.save("maintenance_inventory.pdf");
  };

  return (
    <>
      <PageHeader
        title="Maintenance Task Inventory"
        description="A consolidated view of all daily, weekly, and monthly maintenance tasks."
      >
        <Button onClick={handleDownloadPdf} disabled={combinedTasks.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </PageHeader>

      {hasInitialized && combinedTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <ClipboardList className="mx-auto h-12 w-12" />
          <p className="mt-2">No maintenance tasks found in any category.</p>
          <p className="text-sm">Add tasks in Daily, Weekly, or Monthly sections to see them here.</p>
        </div>
      )}

      {hasInitialized && combinedTasks.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] text-foreground">Task Name</TableHead>
                    <TableHead className="text-foreground">Machine ID</TableHead>
                    <TableHead className="text-foreground">Type</TableHead>
                    <TableHead className="text-foreground">Due Date</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Priority</TableHead>
                    <TableHead className="text-foreground">Assigned To</TableHead>
                    <TableHead className="w-[250px] text-foreground">Description</TableHead>
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
