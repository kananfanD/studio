
"use client";

import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, CalendarDays, ListFilter } from "lucide-react";
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";
import type { CombinedTask, MaintenanceTaskType } from "@/app/dashboard/inventory/page"; // Re-use types

export default function ScheduleMaintenancePage() {
  const [scheduledTasks, setScheduledTasks] = useState<CombinedTask[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

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
    
    // Filter out completed tasks for a "schedule" view, sort by due date
    tasksFromLog = tasksFromLog
      .filter(task => task.status !== "Completed")
      .sort((a, b) => {
        // Basic date sort, assuming YYYY-MM-DD or similar sortable strings for dueDate
        // More robust date parsing might be needed for varied date formats
        try {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return dateA.getTime() - dateB.getTime();
          }
        } catch (e) {
          // Fallback for non-standard date strings
        }
        return a.dueDate.localeCompare(b.dueDate);
      });
    setScheduledTasks(tasksFromLog);
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

    scheduledTasks.forEach(task => {
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
    
    doc.text("Maintenance Schedule", 14, 15);
    doc.save("maintenance_schedule.pdf");
  };

  return (
    <>
      <PageHeader
        title="Schedule Maintenance"
        description="View upcoming and pending maintenance tasks for all machines."
      >
        {/* Optional: Add filter button here in the future */}
        {/* <Button variant="outline"> <ListFilter className="mr-2 h-4 w-4" /> Filter </Button> */}
        <Button onClick={handleDownloadPdf} disabled={scheduledTasks.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF Schedule
        </Button>
      </PageHeader>

      {hasInitialized && scheduledTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <CalendarDays className="mx-auto h-12 w-12" />
          <p className="mt-2">No upcoming or pending maintenance tasks found.</p>
          <p className="text-sm">All tasks are completed or no tasks have been added yet.</p>
        </div>
      )}

      {hasInitialized && scheduledTasks.length > 0 && (
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
                  {scheduledTasks.map((task) => (
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
                            "bg-gray-400 text-white" // Should not happen due to filter
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
