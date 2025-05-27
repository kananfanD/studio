
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
import type { DailyTask } from "./../page"; // Import the Task type
import type { TaskStatus } from "@/components/maintenance/MaintenanceTaskCard";

const taskFormSchema = z.object({
  id: z.string().optional(), // For editing
  taskName: z.string().min(3, { message: "Task name must be at least 3 characters." }),
  machineId: z.string().min(1, { message: "Machine ID is required." }),
  dueDate: z.string().min(1, {message: "Due date is required."}),
  assignedTo: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  description: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed", "Overdue"]).default("Pending"),
  imageUrl: z.string().url({ message: "Please enter a valid Image URL." }).optional().or(z.literal('')),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function NewDailyTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState<string | null>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: "",
      machineId: "",
      dueDate: new Date().toISOString().split('T')[0], // Default to today
      assignedTo: "",
      priority: "Medium",
      description: "",
      status: "Pending",
      imageUrl: "",
    },
  });

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setIsEditMode(true);
      setTaskIdToEdit(id);
      const taskName = searchParams.get("taskName");
      const machineId = searchParams.get("machineId");
      const dueDate = searchParams.get("dueDate");
      const assignedTo = searchParams.get("assignedTo");
      const priority = searchParams.get("priority") as "Low" | "Medium" | "High" | undefined;
      const description = searchParams.get("description");
      const status = searchParams.get("status") as TaskStatus | undefined;
      const imageUrl = searchParams.get("imageUrl");

      form.reset({
        id,
        taskName: taskName || "",
        machineId: machineId || "",
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        assignedTo: assignedTo || "",
        priority: priority || "Medium",
        description: description || "",
        status: status || "Pending",
        imageUrl: imageUrl || "",
      });
    }
  }, [searchParams, form]);

  function onSubmit(data: TaskFormValues) {
    const storedTasksString = localStorage.getItem("dailyTasks");
    let tasks: DailyTask[] = storedTasksString ? JSON.parse(storedTasksString) : [];

    if (isEditMode && taskIdToEdit) {
      tasks = tasks.map(task => task.id === taskIdToEdit ? { ...task, ...data, id: taskIdToEdit } : task);
      toast({
        title: "Daily Task Updated",
        description: `${data.taskName} has been updated successfully.`,
      });
    } else {
      const newTask: DailyTask = {
        ...data,
        id: `dt${Date.now()}`, // Generate a unique ID
        priority: data.priority || "Medium",
        status: data.status || "Pending",
      };
      tasks.push(newTask);
      toast({
        title: "Daily Task Created",
        description: `${data.taskName} has been added successfully.`,
      });
    }
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
    router.push("/dashboard/maintenance/daily");
  }

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Daily Task" : "Add New Daily Task"}
        description={isEditMode ? "Update the details of the daily maintenance task." : "Fill in the details for the new daily maintenance task."}
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard/maintenance/daily">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Daily Tasks
          </Link>
        </Button>
      </PageHeader>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Oil Level Check - Unit A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="machineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CNC-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the due date for this task.
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
                      <Input placeholder="e.g., John Doe" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="Pending">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
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
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://placehold.co/600x400.png" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>If left blank, a default placeholder will be used. e.g., https://placehold.co/600x400.png?text=My+Image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Task" : "Save Task"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
