
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Edit3, Trash2, Wrench, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/alert-dialog"

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
type UserRole = "operator" | "maintenance-planner" | "warehouse" | null;

interface MaintenanceTaskCardProps {
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
  onDelete: (id: string) => void;
  editPath: string; 
  userRole: UserRole;
}

const statusColors: Record<TaskStatus, string> = {
  Pending: "bg-blue-500 hover:bg-blue-600",
  "In Progress": "bg-yellow-500 hover:bg-yellow-600 text-black", 
  Completed: "bg-green-500 hover:bg-green-600",
  Overdue: "bg-red-600 hover:bg-red-700",
};

const statusIcons: Record<TaskStatus, React.ElementType> = {
  Pending: Clock,
  "In Progress": Wrench,
  Completed: CheckCircle2,
  Overdue: AlertTriangle, 
};

export default function MaintenanceTaskCard({
  id,
  taskName,
  machineId,
  dueDate,
  status,
  assignedTo,
  priority,
  description,
  imageUrl = "https://placehold.co/600x400.png",
  dataAihint,
  onDelete,
  editPath,
  userRole,
}: MaintenanceTaskCardProps) {
  const StatusIcon = statusIcons[status];

  const editUrl = `${editPath}?id=${id}&taskName=${encodeURIComponent(taskName)}&machineId=${encodeURIComponent(machineId)}&dueDate=${encodeURIComponent(dueDate)}&status=${encodeURIComponent(status)}${assignedTo ? `&assignedTo=${encodeURIComponent(assignedTo)}` : ''}${priority ? `&priority=${encodeURIComponent(priority)}` : ''}${description ? `&description=${encodeURIComponent(description)}` : ''}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}${dataAihint ? `&dataAihint=${encodeURIComponent(dataAihint || "")}` : ''}`;

  // Operator (Operator & Maintenance) and Maintenance Planner can delete. Warehouse cannot.
  const canDeleteTask = userRole === "operator" || userRole === "maintenance-planner";

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative h-40 sm:h-48 w-full">
        <Image
          src={imageUrl || "https://placehold.co/600x400.png?text=Task+Image"}
          alt={taskName}
          layout="fill"
          objectFit="cover"
          data-ai-hint={dataAihint || "maintenance tools"}
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl tracking-tight">{taskName}</CardTitle>
          <Badge className={cn(statusColors[status], "text-white ml-2 shrink-0 flex items-center", status === "In Progress" ? "text-black" : "text-white" )}>
            <StatusIcon className="mr-1 h-3.5 w-3.5" />
            {status}
          </Badge>
        </div>
        <CardDescription>Machine ID: {machineId}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Due Date: {dueDate}</span>
        </div>
        {assignedTo && (
          <div className="flex items-center">
            <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Assigned to: {assignedTo}</span>
          </div>
        )}
        {priority && (
          <div className="flex items-center">
             <Badge 
                variant={priority === 'High' ? 'destructive' : priority === 'Medium' ? 'secondary' : 'outline'} 
                className={cn(
                    "capitalize",
                    priority === 'Medium' ? "bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-600" : "",
                    priority === 'Low' ? "border-gray-400 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                )}
            >
                {priority}
            </Badge>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="gap-2 border-t pt-4">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={editUrl}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        {canDeleteTask && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task
                  &quot;{taskName}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
