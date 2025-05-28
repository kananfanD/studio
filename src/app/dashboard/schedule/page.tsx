
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, CalendarDays, PlusCircle, Edit3, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export type ScheduleTaskStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Overdue";

export interface ScheduledMachineTask {
  id: string;
  machineName: string;
  taskName: string;
  scheduledDate: string;
  assignedTo?: string;
  priority?: "Low" | "Medium" | "High";
  status: ScheduleTaskStatus;
  notes?: string;
}

const initialScheduledTasks: ScheduledMachineTask[] = [
    { id: "smt001", machineName: "CNC Mill Alpha", taskName: "Spindle Lubrication", scheduledDate: "2024-08-15", status: "Scheduled", priority: "High", assignedTo: "Tech Team A", notes: "Use Grade A lubricant." },
    { id: "smt002", machineName: "Laser Cutter Zeta", taskName: "Optics Cleaning", scheduledDate: "2024-08-20", status: "Scheduled", priority: "Medium", assignedTo: "Jane Doe", notes: "Check for scratches on lens." },
];

export default function ScheduleMaintenancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledMachineTask[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem("scheduledMachineTasks");
    if (storedTasks) {
      try {
        const parsedTasks: ScheduledMachineTask[] = JSON.parse(storedTasks);
        // Sort tasks by scheduledDate
        parsedTasks.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
        setScheduledTasks(parsedTasks);
      } catch (e) {
        console.error("Failed to parse scheduledMachineTasks from localStorage", e);
        setScheduledTasks(initialScheduledTasks.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()));
      }
    } else {
      setScheduledTasks(initialScheduledTasks.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()));
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (hasInitialized) {
      // Sort tasks by scheduledDate before saving
      const tasksToSave = [...scheduledTasks].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
      localStorage.setItem("scheduledMachineTasks", JSON.stringify(tasksToSave));
    }
  }, [scheduledTasks, hasInitialized]);


  const handleDeleteTask = (taskId: string) => {
    setScheduledTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({
      title: "Scheduled Task Deleted",
      description: "The scheduled maintenance task has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    const tableColumn = ["Machine Name", "Task Name", "Scheduled Date", "Status", "Priority", "Assigned To", "Notes"];
    const tableRows: (string | undefined)[][] = [];

    scheduledTasks.forEach(task => {
      const taskData = [
        task.machineName,
        task.taskName,
        task.scheduledDate,
        task.status,
        task.priority || "N/A",
        task.assignedTo || "N/A",
        task.notes || "N/A",
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
        0: { cellWidth: 30 }, 
        1: { cellWidth: 40 }, 
        2: { cellWidth: 25 }, 
        3: { cellWidth: 20 }, 
        4: { cellWidth: 18 }, 
        5: { cellWidth: 25 },
        6: { cellWidth: 30 },
      }
    });
    
    doc.text("Machine Maintenance Schedule", 14, 15);
    doc.save("machine_maintenance_schedule.pdf");
  };

  const getStatusBadgeClass = (status: ScheduleTaskStatus) => {
    switch (status) {
      case "Scheduled": return "bg-blue-500 hover:bg-blue-600 text-primary-foreground";
      case "In Progress": return "bg-yellow-500 hover:bg-yellow-600 text-black";
      case "Completed": return "bg-green-500 hover:bg-green-600 text-primary-foreground";
      case "Cancelled": return "bg-gray-500 hover:bg-gray-600 text-primary-foreground";
      case "Overdue": return "bg-red-600 hover:bg-red-700 text-destructive-foreground";
      default: return "bg-gray-400 text-white";
    }
  };

  const getPriorityBadgeClass = (priority?: "Low" | "Medium" | "High") => {
    if (priority === "High") return ""; // Uses default destructive variant
    if (priority === "Medium") return "bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-600";
    return "border-gray-400 text-muted-foreground hover:bg-gray-100";
  };


  return (
    <>
      <PageHeader
        title="Machine Maintenance Schedule"
        description="Plan and track all scheduled maintenance for industrial machines."
      >
        <Button asChild className="mr-2">
          <Link href="/dashboard/schedule/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Schedule
          </Link>
        </Button>
        <Button onClick={handleDownloadPdf} disabled={scheduledTasks.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF Schedule
        </Button>
      </PageHeader>

      {hasInitialized && scheduledTasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <CalendarDays className="mx-auto h-12 w-12" />
          <p className="mt-2">No scheduled maintenance tasks found.</p>
          <p className="text-sm">Add a new scheduled task to get started.</p>
        </div>
      )}

      {hasInitialized && scheduledTasks.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Machine Name</TableHead>
                    <TableHead className="text-foreground">Task Name</TableHead>
                    <TableHead className="text-foreground">Scheduled Date</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Priority</TableHead>
                    <TableHead className="text-foreground">Assigned To</TableHead>
                    <TableHead className="text-foreground">Notes</TableHead>
                    <TableHead className="text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.machineName}</TableCell>
                      <TableCell>{task.taskName}</TableCell>
                      <TableCell>{task.scheduledDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}
                          className={getPriorityBadgeClass(task.priority)}
                        >
                          {task.priority || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo || "N/A"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-xs">{task.notes || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="mr-1">
                          <Link href={`/dashboard/schedule/new?id=${task.id}&machineName=${encodeURIComponent(task.machineName)}&taskName=${encodeURIComponent(task.taskName)}&scheduledDate=${encodeURIComponent(task.scheduledDate)}&status=${encodeURIComponent(task.status)}${task.assignedTo ? `&assignedTo=${encodeURIComponent(task.assignedTo)}` : ''}${task.priority ? `&priority=${encodeURIComponent(task.priority)}` : ''}${task.notes ? `&notes=${encodeURIComponent(task.notes)}` : ''}`}>
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the scheduled task: "{task.taskName}" for machine "{task.machineName}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
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
