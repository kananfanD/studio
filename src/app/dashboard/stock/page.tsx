
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StockItemCard from "@/components/stock/StockItemCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export interface StockItem {
  id: string;
  componentName: string;
  partNumber: string;
  quantity: number;
  location: string;
  minStockLevel?: number;
  imageUrl?: string;
  dataAihint?: string;
}

const initialStockItems: StockItem[] = [
  { id: "stk001", componentName: "Bearing SKF-6205", partNumber: "SKF-6205-2Z", quantity: 50, location: "Shelf A1", minStockLevel: 10, imageUrl: "https://placehold.co/600x400.png", dataAihint:"bearing metal"},
  { id: "stk002", componentName: "Filter Element H-24", partNumber: "FLT-H-24B", quantity: 5, location: "Cabinet B3", minStockLevel: 8, imageUrl: "https://placehold.co/600x400.png", dataAihint:"filter industrial"},
  { id: "stk003", componentName: "V-Belt XPA-1250", partNumber: "VBT-XPA-1250", quantity: 20, location: "Shelf A2", minStockLevel: 5, imageUrl: "https://placehold.co/600x400.png", dataAihint:"belt rubber" },
  { id: "stk004", componentName: "Hydraulic Oil ISO VG 46", partNumber: "OIL-HYD-VG46", quantity: 150, location: "Storage Area 1 (Liters)", minStockLevel: 50, imageUrl: "https://placehold.co/600x400.png", dataAihint:"oil drum" },
];


export default function ComponentStockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedItems = localStorage.getItem("stockItems");
    if (storedItems) {
      try {
        setStockItems(JSON.parse(storedItems));
      } catch (e) {
        console.error("Failed to parse stockItems from localStorage", e);
        setStockItems(initialStockItems);
      }
    } else {
      setStockItems(initialStockItems);
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (hasInitialized){
        localStorage.setItem("stockItems", JSON.stringify(stockItems));
    }
  }, [stockItems, hasInitialized]);

  const handleDeleteItem = (itemId: string) => {
    setStockItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: "Stock Item Deleted",
      description: "The stock item has been successfully deleted.",
      variant: "destructive",
    });
  };

  return (
    <>
      <PageHeader 
        title="Component Stock Management"
        description="Track inventory levels for all machine components."
      >
        <Button asChild>
          <Link href="/dashboard/stock/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Component
          </Link>
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stockItems.map(item => (
          <StockItemCard 
            key={item.id} 
            {...item} 
            onDelete={() => handleDeleteItem(item.id)}
            editPath="/dashboard/stock/new"
            imageUrl={item.imageUrl || "https://placehold.co/600x400.png"}
            dataAihint={item.dataAihint}
          />
        ))}
      </div>
      {stockItems.length === 0 && (
         <div className="col-span-full text-center py-10">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No stock items found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new component.</p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/dashboard/stock/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Component
                </Link>
              </Button>
            </div>
          </div>
      )}
    </>
  );
}
