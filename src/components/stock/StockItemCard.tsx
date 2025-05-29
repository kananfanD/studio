
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit3, Package, PackageCheck, PackageMinus, PackagePlus, Scaling, Trash2 } from "lucide-react";
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

interface StockItemCardProps {
  id: string;
  componentName: string;
  partNumber: string;
  quantity: number;
  location: string;
  minStockLevel?: number;
  imageUrl?: string;
  dataAihint?: string;
  onDelete: (id: string) => void;
  editPath: string;
}

export default function StockItemCard({
  id,
  componentName,
  partNumber,
  quantity,
  location,
  minStockLevel,
  imageUrl = "https://placehold.co/600x400.png",
  dataAihint,
  onDelete,
  editPath,
}: StockItemCardProps) {
  const isLowStock = minStockLevel !== undefined && quantity < minStockLevel;

  const editUrl = `${editPath}?id=${id}&componentName=${encodeURIComponent(componentName)}&partNumber=${encodeURIComponent(partNumber)}&quantity=${quantity}&location=${encodeURIComponent(location)}${minStockLevel !== undefined ? `&minStockLevel=${minStockLevel}` : ''}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}${dataAihint ? `&dataAihint=${encodeURIComponent(dataAihint)}` : ''}`;

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl", isLowStock && "border-destructive")}>
      <div className="relative h-40 sm:h-48 w-full">
        <Image
          src={imageUrl || "https://placehold.co/600x400.png?text=Component"}
          alt={componentName}
          layout="fill"
          objectFit="cover"
          data-ai-hint={dataAihint || "machine parts"}
        />
         {isLowStock && (
          <Badge variant="destructive" className="absolute right-2 top-2">
            <AlertTriangle className="mr-1 h-3 w-3" /> Low Stock
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">{componentName}</CardTitle>
        <CardDescription>Part No: {partNumber}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center">
          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Quantity: <span className="font-semibold">{quantity}</span> units</span>
        </div>
        <div className="flex items-center">
          <Scaling className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Location: {location}</span>
        </div>
        {minStockLevel !== undefined && (
             <div className="flex items-center">
             <PackageMinus className="mr-2 h-4 w-4 text-muted-foreground" />
             <span>Min. Stock: {minStockLevel} units</span>
           </div>
        )}
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
                This action cannot be undone. This will permanently delete the stock item
                &quot;{componentName}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Example additional action, can be removed or repurposed */}
        <Button variant="default" size="sm" className="col-span-2 flex-1 mt-2">
          <PackagePlus className="mr-2 h-4 w-4" /> Order More
        </Button>
      </CardFooter>
    </Card>
  );
}
