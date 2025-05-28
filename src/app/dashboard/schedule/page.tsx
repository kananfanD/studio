
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { CombinedTask, MaintenanceTaskType } from "../inventory/page"; // Reusing CombinedTask type
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";

export default function MaintenanceSchedulePage() {
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
    
    // Sort tasks by due date
    tasksFromLog.sort((a, b) => {
      // Assuming dueDate is a string that can be compared, or convert to Date objects for robust sorting
      // For simplicity, direct string comparison is used here if dates are consistently formatted (e.g., YYYY-MM-DD)
      // A more robust solution would involve new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      // after ensuring date strings are valid.
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.dueDate.localeCompare(b.dueDate); // Fallback for non-standard or varied date strings
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

  return (
    <>
      <PageHeader
        title="Jadwal Perawatan Mesin"
        description="Tampilan kalender dan tabel untuk semua jadwal perawatan mesin."
      />

      {hasInitialized && scheduledTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <CalendarDays className="mx-auto h-12 w-12" />
          <p className="mt-2">Tidak ada jadwal perawatan yang ditemukan.</p>
          <p className="text-sm">Tambahkan tugas di menu Maintenance untuk melihat jadwal di sini.</p>
        </div>
      )}

      {hasInitialized && scheduledTasks.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] text-foreground">Nama Tugas</TableHead>
                    <TableHead className="text-foreground">ID Mesin</TableHead>
                    <TableHead className="text-foreground">Tipe</TableHead>
                    <TableHead className="text-foreground">Jatuh Tempo</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Prioritas</TableHead>
                    <TableHead className="text-foreground">Ditugaskan Kepada</TableHead>
                    <TableHead className="w-[250px] text-foreground">Deskripsi</TableHead>
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
