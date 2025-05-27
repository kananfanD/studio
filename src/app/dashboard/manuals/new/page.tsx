
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
import type { Manual } from "./../page";

const manualFormSchema = z.object({
  id: z.string().optional(),
  manualTitle: z.string().min(3, { message: "Manual title must be at least 3 characters." }),
  machineType: z.string().min(1, { message: "Machine type is required." }),
  version: z.string().optional(),
  lastUpdated: z.string().optional(),
  pdfUrl: z.string().url({ message: "Please enter a valid PDF URL." }), // PDF is still a URL
  coverImageUrl: z.string().optional().or(z.literal('')), // For uploaded cover image or URL
  dataAihint: z.string().max(60, {message: "AI Hint too long, max 60 characters"}).optional().describe("One or two keywords for Unsplash search, space separated."),
});

type ManualFormValues = z.infer<typeof manualFormSchema>;

export default function NewManualPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [manualIdToEdit, setManualIdToEdit] = useState<string | null>(null);

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

  const watchedCoverImageUrl = form.watch("coverImageUrl");

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("coverImageUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setIsEditMode(true);
      setManualIdToEdit(id);
      const manualTitle = searchParams.get("manualTitle");
      const machineType = searchParams.get("machineType");
      const version = searchParams.get("version");
      const lastUpdated = searchParams.get("lastUpdated");
      const pdfUrl = searchParams.get("pdfUrl");
      const coverImageUrl = searchParams.get("coverImageUrl");
      const dataAihint = searchParams.get("dataAihint");

      form.reset({
        id,
        manualTitle: manualTitle || "",
        machineType: machineType || "",
        version: version || "",
        lastUpdated: lastUpdated || new Date().toISOString().split('T')[0],
        pdfUrl: pdfUrl || "",
        coverImageUrl: coverImageUrl || "",
        dataAihint: dataAihint || "",
      });
    }
  }, [searchParams, form]);

  function onSubmit(data: ManualFormValues) {
    const storedManualsString = localStorage.getItem("manuals");
    let manuals: Manual[] = storedManualsString ? JSON.parse(storedManualsString) : [];

    if (isEditMode && manualIdToEdit) {
      manuals = manuals.map(manual => manual.id === manualIdToEdit ? { ...manual, ...data, id: manualIdToEdit } : manual);
      toast({
        title: "Manual Updated",
        description: `${data.manualTitle} has been updated successfully.`,
      });
    } else {
      const newManual: Manual = {
        ...data,
        id: `man${Date.now()}`,
        pdfUrl: data.pdfUrl || "#", // Ensure pdfUrl is not empty
      };
      manuals.push(newManual);
      toast({
        title: "Manual Added",
        description: `${data.manualTitle} has been added successfully.`,
      });
    }
    localStorage.setItem("manuals", JSON.stringify(manuals));
    router.push("/dashboard/manuals");
  }

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Manual" : "Add New Manual"}
        description={isEditMode ? "Update the details of the maintenance manual." : "Fill in the details for the new maintenance manual."}
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
                     <FormDescription>The URL to the PDF document.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverImageUpload}
                      />
                    </FormControl>
                    <FormDescription>Upload a cover image for the manual. If left blank, a default placeholder will be used. You can also still provide an external URL in this field if you manually type/paste it.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedCoverImageUrl && (
                <div className="mt-4">
                  <FormLabel>Cover Image Preview</FormLabel>
                  <div className="relative mt-2 h-64 w-full max-w-xs rounded-md border bg-muted/30 flex items-center justify-center">
                    <Image
                      src={watchedCoverImageUrl}
                      alt="Cover Image Preview"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                      data-ai-hint="manual cover"
                    />
                  </div>
                </div>
              )}
               <FormField
                control={form.control}
                name="dataAihint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., cnc machine" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>One or two keywords for AI image search if no Cover Image is uploaded or URL provided.</FormDescription>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Manual" : "Save Manual"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
