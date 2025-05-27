
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
import { ArrowLeft, Save, FileText } from "lucide-react";
import type { Manual } from "./../page";

const manualFormSchema = z.object({
  id: z.string().optional(),
  manualTitle: z.string().min(3, { message: "Manual title must be at least 3 characters." }),
  machineType: z.string().min(1, { message: "Machine type is required." }),
  version: z.string().optional(),
  lastUpdated: z.string().optional(),
  pdfUrl: z.string().optional().or(z.literal('')), // Can be a data URI or external URL, or empty
  coverImageUrl: z.string().optional().or(z.literal('')), 
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
  const watchedPdfUrl = form.watch("pdfUrl");

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

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("pdfUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else if (file) {
      form.setValue("pdfUrl", "", { shouldValidate: true }); // Clear if invalid file was previously set
      form.setError("pdfUrl", { type: "manual", message: "Please upload a valid PDF file." });
    } else {
       // If user cancels file selection, clear the PDF URL or handle as needed
       // form.setValue("pdfUrl", ""); // Optional: clear if no file selected
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setIsEditMode(true);
      setManualIdToEdit(id);
      // Instead of relying on potentially very long data URIs in query params,
      // ideally, we'd fetch the full manual object from localStorage here using the ID.
      // For now, we'll proceed with query params but be mindful of URL length limits.
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
        pdfUrl: data.pdfUrl || "", // Ensure pdfUrl is empty string if not provided
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
                render={({ field }) => ( // field is not directly used for file input value
                  <FormItem>
                    <FormLabel>PDF Document</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handlePdfUpload}
                        // value is not set directly for file inputs
                      />
                    </FormControl>
                     <FormDescription>Upload the PDF document for the manual. If a PDF was previously set, uploading a new one will replace it.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedPdfUrl && (
                <div className="mt-2 text-sm p-3 border rounded-md bg-muted/30">
                  <p className="font-medium text-foreground flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-primary" /> Current PDF:
                  </p>
                  {watchedPdfUrl.startsWith('data:application/pdf;base64,') ? (
                    <>
                      <p className="text-muted-foreground mt-1">A PDF file has been uploaded.</p>
                      <a href={watchedPdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs block mt-1">View Uploaded PDF</a>
                    </>
                  ) : ( // Assumed to be an external URL
                    <p className="text-muted-foreground mt-1">
                      URL: <a href={watchedPdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{watchedPdfUrl}</a>
                    </p>
                  )}
                   <p className="text-xs text-muted-foreground mt-2">Uploading a new PDF will replace the current one.</p>
                </div>
              )}

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
                        // value is not set here for file inputs
                      />
                    </FormControl>
                    <FormDescription>Upload a cover image for the manual. If left blank, a default placeholder will be used. Replaces any existing image/URL.</FormDescription>
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

    