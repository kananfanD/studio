
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const stockItemFormSchema = z.object({
  componentName: z.string().min(3, { message: "Component name must be at least 3 characters." }),
  partNumber: z.string().min(1, { message: "Part number is required." }),
  quantity: z.coerce.number().min(0, { message: "Quantity cannot be negative." }),
  location: z.string().min(1, { message: "Location is required." }),
  minStockLevel: z.coerce.number().min(0, { message: "Minimum stock level cannot be negative." }).optional(),
  imageUrl: z.string().url({ message: "Please enter a valid Image URL." }).optional().or(z.literal('')),
  dataAihint: z.string().max(60, {message: "AI Hint too long, max 60 characters"}).optional().describe("One or two keywords for Unsplash search, space separated."),
});

type StockItemFormValues = z.infer<typeof stockItemFormSchema>;

export default function NewStockItemPage() {
  const router = useRouter();
  const { toast } = useToast();

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

  function onSubmit(data: StockItemFormValues) {
    console.log("New stock item data:", data);
    toast({
      title: "Stock Item Added",
      description: `${data.componentName} has been added to stock.`,
    });
    router.push("/dashboard/stock");
  }

  return (
    <>
      <PageHeader
        title="Add New Stock Component"
        description="Fill in the details for the new component."
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
                        // Ensure the value passed to input is string or number
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
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://placehold.co/600x400.png" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>If left blank, a default placeholder will be used.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataAihint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., bearing metal" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>One or two keywords for AI image search if no Image URL is provided.</FormDescription>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Component
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
