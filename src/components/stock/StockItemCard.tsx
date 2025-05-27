import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit3, Package, PackageCheck, PackageMinus, PackagePlus, Scaling } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockItemCardProps {
  id: string;
  componentName: string;
  partNumber: string;
  quantity: number;
  location: string;
  minStockLevel?: number;
  imageUrl?: string;
}

export default function StockItemCard({
  id,
  componentName,
  partNumber,
  quantity,
  location,
  minStockLevel,
  imageUrl = "https://placehold.co/600x400.png",
}: StockItemCardProps) {
  const isLowStock = minStockLevel !== undefined && quantity < minStockLevel;

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl", isLowStock && "border-destructive")}>
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={componentName}
          layout="fill"
          objectFit="cover"
          data-ai-hint="machine parts"
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
      <CardFooter className="gap-2 border-t pt-4">
        <Button variant="outline" size="sm" className="flex-1">
          <Edit3 className="mr-2 h-4 w-4" /> Adjust Stock
        </Button>
         <Button variant="default" size="sm" className="flex-1">
          <PackagePlus className="mr-2 h-4 w-4" /> Order More
        </Button>
      </CardFooter>
    </Card>
  );
}
