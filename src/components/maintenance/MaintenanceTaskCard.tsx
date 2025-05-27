import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Edit3, Trash2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

interface MaintenanceTaskCardProps {
  id: string;
  taskName: string;
  machineId: string;
  dueDate: string;
  status: TaskStatus;
  assignedTo?: string;
  priority?: "Low" | "Medium" | "High";
  imageUrl?: string;
}

const statusColors: Record<TaskStatus, string> = {
  Pending: "bg-blue-500 hover:bg-blue-600",
  "In Progress": "bg-yellow-500 hover:bg-yellow-600",
  Completed: "bg-green-500 hover:bg-green-600",
  Overdue: "bg-red-600 hover:bg-red-700",
};

const statusIcons: Record<TaskStatus, React.ElementType> = {
  Pending: Clock,
  "In Progress": Wrench,
  Completed: CheckCircle2,
  Overdue: Clock,
};

export default function MaintenanceTaskCard({
  id,
  taskName,
  machineId,
  dueDate,
  status,
  assignedTo,
  priority,
  imageUrl = "https://placehold.co/600x400.png",
}: MaintenanceTaskCardProps) {
  const StatusIcon = statusIcons[status];

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={taskName}
          layout="fill"
          objectFit="cover"
          data-ai-hint="maintenance tools"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl tracking-tight">{taskName}</CardTitle>
          <Badge className={cn(statusColors[status], "text-white ml-2 shrink-0")}>{status}</Badge>
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
            <span className="mr-2 text-muted-foreground">&#9679;</span> {/* Bullet point for priority */}
            <span>Priority: <Badge variant={priority === 'High' ? 'destructive' : priority === 'Medium' ? 'secondary' : 'outline'}>{priority}</Badge></span>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2 border-t pt-4">
        <Button variant="outline" size="sm" className="flex-1">
          <Edit3 className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" className="flex-1">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
