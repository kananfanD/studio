import PageHeader from "@/components/dashboard/PageHeader";
import ManualCard from "@/components/manuals/ManualCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, UploadCloud, BookOpenText } from "lucide-react"; // Ensured BookOpenText is imported
import Link from "next/link";

const manuals = [
  { id: "man001", manualTitle: "CNC Mill XM500 Operator Manual", machineType: "CNC XM500", version: "3.1", lastUpdated: "2023-05-15", pdfUrl: "/manuals/cnc_xm500_op.pdf", coverImageUrl: "https://placehold.co/600x400.png?text=CNC+Manual" , dataAihint:"cnc machine"},
  { id: "man002", manualTitle: "Hydraulic Press HP-20 Maintenance Guide", machineType: "HP-20 Press", version: "1.5", lastUpdated: "2022-11-01", pdfUrl: "/manuals/hp20_maint.pdf", coverImageUrl: "https://placehold.co/600x400.png?text=Press+Manual" , dataAihint:"hydraulic press"},
  { id: "man003", manualTitle: "Robotic Arm KUKA-R800 Service Manual", machineType: "KUKA R800", version: "2.0 Rev B", lastUpdated: "2024-01-20", pdfUrl: "/manuals/kuka_r800_service.pdf", coverImageUrl: "https://placehold.co/600x400.png?text=Robot+Manual" , dataAihint:"robotic arm" },
];

export default function ManualBookPage() {
  return (
    <>
      <PageHeader 
        title="Maintenance Manuals"
        description="Access and manage all technical manuals and guides."
      >
        <Button asChild>
          <Link href="/dashboard/manuals/new">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload New Manual
          </Link>
        </Button>
      </PageHeader>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {manuals.map(manual => (
          <ManualCard key={manual.id} {...manual} />
        ))}
        {/* Placeholder for empty state */}
        {manuals.length === 0 && (
          <div className="col-span-full text-center py-10">
            <BookOpenText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No manuals found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by uploading a new manual.</p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/dashboard/manuals/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Upload Manual
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
