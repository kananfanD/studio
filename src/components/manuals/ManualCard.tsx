import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, Download, Eye, FileText, Layers } from "lucide-react";

interface ManualCardProps {
  id: string;
  manualTitle: string;
  machineType: string;
  version?: string;
  lastUpdated?: string;
  pdfUrl: string; // Placeholder for actual PDF link
  coverImageUrl?: string;
}

export default function ManualCard({
  id,
  manualTitle,
  machineType,
  version,
  lastUpdated,
  pdfUrl,
  coverImageUrl = "https://placehold.co/600x400.png",
}: ManualCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative h-64 w-full"> {/* Taller image for book cover look */}
        <Image
          src={coverImageUrl}
          alt={manualTitle}
          layout="fill"
          objectFit="cover"
          data-ai-hint="technical manual"
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
      <CardFooter className="gap-2 border-t pt-4">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 h-4 w-4" /> View PDF
          </a>
        </Button>
        <Button variant="default" size="sm" className="flex-1" asChild>
          <a href={pdfUrl} download={`${manualTitle.replace(/\s+/g, '_')}.pdf`}>
            <Download className="mr-2 h-4 w-4" /> Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
