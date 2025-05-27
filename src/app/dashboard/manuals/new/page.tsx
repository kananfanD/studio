
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

const manualFormSchema = z.object({
  manualTitle: z.string().min(3, { message: "Manual title must be at least 3 characters." }),
  machineType: z.string().min(1, { message: "Machine type is required." }),
  version: z.string().optional(),
  lastUpdated: z.string().optional(),
  pdfUrl: z.string().url({ message: "Please enter a valid PDF URL." }),
  coverImageUrl: z.string().url({ message: "Please enter a valid Cover Image URL." }).optional().or(z.literal('')),
  dataAihint: z.string().max(60, {message: "AI Hint too long, max 60 characters"}).optional().describe("One or two keywords for Unsplash search, space separated."),
});

type ManualFormValues = z.infer<typeof manualFormSchema>;

export default function NewManualPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ManualFormValues>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: {
      manualTitle: "",
      machineType: "",
      version: "",
      lastUpdated: new Date().toISOString().split('T')[0],
      pdfUrl: "",
      coverImageUrl: "",
      dataAihint: "",
    },
  });

  function onSubmit(data: ManualFormValues) {
    console.log("New manual data:", data);
    toast({
      title: "Manual Added",
      description: `${data.manualTitle} has been added successfully.`,
    });
    router.push("/dashboard/manuals");
  }

  return (
    <>
      <PageHeader
        title="Add New Manual"
        description="Fill in the details for the new maintenance manual."
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard/manuals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manuals
          </Link>
        </Button>
      </PageHeader>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Manual Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="manualTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manual Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CNC Mill XM500 Operator Manual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="machineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CNC XM500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastUpdated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Updated (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/manual.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Optional)</FormLabel>
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
                    <FormLabel>Cover Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., cnc machine" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>One or two keywords for AI image search if no Cover Image URL is provided.</FormDescription>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Manual
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
