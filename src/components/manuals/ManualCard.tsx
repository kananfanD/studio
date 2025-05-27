
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, Download, Eye, FileText, Layers, Edit3, Trash2 } from "lucide-react";
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

interface ManualCardProps {
  id: string;
  manualTitle: string;
  machineType: string;
  version?: string;
  lastUpdated?: string;
  pdfUrl: string;
  coverImageUrl?: string;
  dataAihint?: string;
  onDelete: (id: string) => void;
  editPath: string;
}

export default function ManualCard({
  id,
  manualTitle,
  machineType,
  version,
  lastUpdated,
  pdfUrl,
  coverImageUrl = "https://placehold.co/600x400.png",
  dataAihint,
  onDelete,
  editPath,
}: ManualCardProps) {

  const editUrl = `${editPath}?id=${id}&manualTitle=${encodeURIComponent(manualTitle)}&machineType=${encodeURIComponent(machineType)}${version ? `&version=${encodeURIComponent(version)}` : ''}${lastUpdated ? `&lastUpdated=${encodeURIComponent(lastUpdated)}` : ''}&pdfUrl=${encodeURIComponent(pdfUrl)}${coverImageUrl ? `&coverImageUrl=${encodeURIComponent(coverImageUrl)}` : ''}${dataAihint ? `&dataAihint=${encodeURIComponent(dataAihint)}` : ''}`;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative h-64 w-full">
        <Image
          src={coverImageUrl || "https://placehold.co/600x400.png?text=Manual+Cover"}
          alt={manualTitle}
          layout="fill"
          objectFit="cover"
          data-ai-hint={dataAihint || "technical manual"}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">{manualTitle}</CardTitle>
        <CardDescription>For Machine: {machineType}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        {version && (
          <div className="flex items-center">
            <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Version: {version}</span>
          </div>
        )}
        {lastUpdated && (
          <div className="flex items-center">
            <BookOpenText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        )}
         <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Format: PDF Document</span>
          </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={editUrl}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
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
                This action cannot be undone. This will permanently delete the manual
                &quot;{manualTitle}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="outline" size="sm" className="col-span-1 flex-1" asChild>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 h-4 w-4" /> View PDF
          </a>
        </Button>
        <Button variant="default" size="sm" className="col-span-1 flex-1" asChild>
          <a href={pdfUrl} download={`${manualTitle.replace(/\s+/g, '_')}.pdf`}>
            <Download className="mr-2 h-4 w-4" /> Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
