
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import type { StockItem } from "./../page";

const stockItemFormSchema = z.object({
  id: z.string().optional(),
  componentName: z.string().min(3, { message: "Component name must be at least 3 characters." }),
  partNumber: z.string().min(1, { message: "Part number is required." }),
  quantity: z.coerce.number().min(0, { message: "Quantity cannot be negative." }),
  location: z.string().min(1, { message: "Location is required." }),
  minStockLevel: z.coerce.number().min(0, { message: "Minimum stock level cannot be negative." }).optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  dataAihint: z.string().max(60, {message: "AI Hint too long, max 60 characters"}).optional().describe("One or two keywords for Unsplash search, space separated."),
});

type StockItemFormValues = z.infer<typeof stockItemFormSchema>;

export default function NewStockItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemIdToEdit, setItemIdToEdit] = useState<string | null>(null);

  const form = useForm<StockItemFormValues>({
    resolver: zodResolver(stockItemFormSchema),
    defaultValues: {
      componentName: "",
      partNumber: "",
      quantity: 0,
      location: "",
      minStockLevel: 0,
      imageUrl: "",
      dataAihint: "",
    },
  });

  const watchedImageUrl = form.watch("imageUrl");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setIsEditMode(true);
      setItemIdToEdit(id);
      const componentName = searchParams.get("componentName");
      const partNumber = searchParams.get("partNumber");
      const quantity = searchParams.get("quantity");
      const location = searchParams.get("location");
      const minStockLevel = searchParams.get("minStockLevel");
      const imageUrl = searchParams.get("imageUrl");
      const dataAihint = searchParams.get("dataAihint");

      form.reset({
        id,
        componentName: componentName || "",
        partNumber: partNumber || "",
        quantity: quantity ? parseInt(quantity) : 0,
        location: location || "",
        minStockLevel: minStockLevel ? parseInt(minStockLevel) : 0,
        imageUrl: imageUrl || "",
        dataAihint: dataAihint || "",
      });
    }
  }, [searchParams, form]);

  function onSubmit(data: StockItemFormValues) {
    const storedItemsString = localStorage.getItem("stockItems");
    let items: StockItem[] = storedItemsString ? JSON.parse(storedItemsString) : [];

    if (isEditMode && itemIdToEdit) {
      items = items.map(item => item.id === itemIdToEdit ? { ...item, ...data, id: itemIdToEdit } : item);
      toast({
        title: "Stock Item Updated",
        description: `${data.componentName} has been updated successfully.`,
      });
    } else {
      const newItem: StockItem = {
        ...data,
        id: `stk${Date.now()}`,
      };
      items.push(newItem);
      toast({
        title: "Stock Item Added",
        description: `${data.componentName} has been added to stock.`,
      });
    }
    localStorage.setItem("stockItems", JSON.stringify(items));
    router.push("/dashboard/stock");
  }

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Stock Component" : "Add New Stock Component"}
        description={isEditMode ? "Update the details of the component." : "Fill in the details for the new component."}
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard/stock">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stock List
          </Link>
        </Button>
      </PageHeader>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Component Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="componentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bearing SKF-6205" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SKF-6205-2Z" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Shelf A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock Level (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} 
                        value={field.value === undefined || field.value === null ? '' : field.value}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                    <FormLabel>Image (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                      />
                    </FormControl>
                    <FormDescription>Upload an image for the component.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedImageUrl && (
                <div className="mt-4">
                  <FormLabel>Image Preview</FormLabel>
                  <div className="relative mt-2 h-48 w-full max-w-xs rounded-md border bg-muted/30 flex items-center justify-center">
                    <Image
                      src={watchedImageUrl}
                      alt="Image Preview"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                      data-ai-hint="component image"
                    />
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="dataAihint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., bearing metal" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>One or two keywords for AI image search if no Image is uploaded or URL provided.</FormDescription>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Component" : "Save Component"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
