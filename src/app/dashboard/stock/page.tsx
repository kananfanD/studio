import PageHeader from "@/components/dashboard/PageHeader";
import StockItemCard from "@/components/stock/StockItemCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const stockItems = [
  { id: "stk001", componentName: "Bearing SKF-6205", partNumber: "SKF-6205-2Z", quantity: 50, location: "Shelf A1", minStockLevel: 10, imageUrl: "https://placehold.co/600x400.png?text=Bearing" , dataAihint:"bearing metal"},
  { id: "stk002", componentName: "Filter Element H-24", partNumber: "FLT-H-24B", quantity: 5, location: "Cabinet B3", minStockLevel: 8, imageUrl: "https://placehold.co/600x400.png?text=Filter" , dataAihint:"filter industrial"},
  { id: "stk003", componentName: "V-Belt XPA-1250", partNumber: "VBT-XPA-1250", quantity: 20, location: "Shelf A2", minStockLevel: 5, imageUrl: "https://placehold.co/600x400.png?text=V-Belt", dataAihint:"belt rubber" },
  { id: "stk004", componentName: "Hydraulic Oil ISO VG 46", partNumber: "OIL-HYD-VG46", quantity: 150, location: "Storage Area 1 (Liters)", minStockLevel: 50, imageUrl: "https://placehold.co/600x400.png?text=Oil+Drum", dataAihint:"oil drum" },
];

export default function ComponentStockPage() {
  return (
    <>
      <PageHeader 
        title="Component Stock Management"
        description="Track inventory levels for all machine components."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Component
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stockItems.map(item => (
          <StockItemCard key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}
