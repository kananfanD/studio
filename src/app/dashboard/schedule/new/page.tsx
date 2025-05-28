
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import type { ScheduledMachineTask, ScheduleTaskStatus } from "./../page";

const scheduleFormSchema = z.object({
  id: z.string().optional(),
  machineName: z.string().min(1, { message: "Machine name is required." }),
  taskName: z.string().min(3, { message: "Task name must be at least 3 characters." }),
  scheduledDate: z.string().min(1, { message: "Scheduled date is required." }),
  assignedTo: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  status: z.enum(["Scheduled", "In Progress", "Completed", "Cancelled", "Overdue"]).default("Scheduled"),
  notes: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export default function NewScheduledTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState<string | null>(null);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      machineName: "",
      taskName: "",
      scheduledDate: new Date().toISOString().split('T')[0],
      assignedTo: "",
      priority: "Medium",
      status: "Scheduled",
      notes: "",
    },
  });

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setIsEditMode(true);
      setTaskIdToEdit(id);
      const machineName = searchParams.get("machineName");
      const taskName = searchParams.get("taskName");
      const scheduledDate = searchParams.get("scheduledDate");
      const assignedTo = searchParams.get("assignedTo");
      const priority = searchParams.get("priority") as "Low" | "Medium" | "High" | undefined;
      const status = searchParams.get("status") as ScheduleTaskStatus | undefined;
      const notes = searchParams.get("notes");

      form.reset({
        id,
        machineName: machineName || "",
        taskName: taskName || "",
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        assignedTo: assignedTo || "",
        priority: priority || "Medium",
        status: status || "Scheduled",
        notes: notes || "",
      });
    }
  }, [searchParams, form]);

  function onSubmit(data: ScheduleFormValues) {
    const storedTasksString = localStorage.getItem("scheduledMachineTasks");
    let tasks: ScheduledMachineTask[] = storedTasksString ? JSON.parse(storedTasksString) : [];
    const taskUniqueId = (isEditMode && taskIdToEdit) ? taskIdToEdit : `smt${Date.now()}`;

    const taskToSave: ScheduledMachineTask = {
        id: taskUniqueId,
        machineName: data.machineName,
        taskName: data.taskName,
        scheduledDate: data.scheduledDate,
        assignedTo: data.assignedTo,
        priority: data.priority || "Medium",
        status: data.status || "Scheduled",
        notes: data.notes,
    };

    if (isEditMode && taskIdToEdit) {
      tasks = tasks.map(task => task.id === taskIdToEdit ? taskToSave : task);
      toast({
        title: "Scheduled Task Updated",
        description: `Scheduled task for ${data.machineName} has been updated.`,
      });
    } else {
      tasks.push(taskToSave);
      toast({
        title: "Scheduled Task Created",
        description: `New scheduled task for ${data.machineName} has been added.`,
      });
    }
    localStorage.setItem("scheduledMachineTasks", JSON.stringify(tasks));
    router.push("/dashboard/schedule");
  }

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Scheduled Maintenance Task" : "Add New Scheduled Maintenance Task"}
        description={isEditMode ? "Update the details of the scheduled task." : "Fill in the details for the new scheduled task."}
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard/schedule">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schedule
          </Link>
        </Button>
      </PageHeader>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="machineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lathe Machine XL-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name / Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Annual Inspection, Bearing Replacement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the date for this maintenance task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Maintenance Team B, John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="Medium">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="Scheduled">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details or instructions for the task."
                        className="resize-none"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Schedule" : "Save Schedule"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
