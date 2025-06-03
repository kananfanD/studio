
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import ManualCard from "@/components/manuals/ManualCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, UploadCloud, BookOpenText } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { translations, type SupportedLanguage, languageMap } from "../settings/page";

export interface Manual {
  id: string;
  manualTitle: string;
  machineType: string;
  version?: string;
  lastUpdated?: string;
  pdfUrl: string;
  coverImageUrl?: string;
  dataAihint?: string;
}

type UserRole = "operator" | "maintenance-planner" | "warehouse" | null;

const initialManuals: Manual[] = [
  { id: "man001", manualTitle: "CNC Mill XM500 Operator Manual", machineType: "CNC XM500", version: "3.1", lastUpdated: "2023-05-15", pdfUrl: "#", coverImageUrl: "https://placehold.co/600x400.png", dataAihint:"cnc machine"},
  { id: "man002", manualTitle: "Hydraulic Press HP-20 Maintenance Guide", machineType: "HP-20 Press", version: "1.5", lastUpdated: "2022-11-01", pdfUrl: "#", coverImageUrl: "https://placehold.co/600x400.png", dataAihint:"hydraulic press"},
  { id: "man003", manualTitle: "Robotic Arm KUKA-R800 Service Manual", machineType: "KUKA R800", version: "2.0 Rev B", lastUpdated: "2024-01-20", pdfUrl: "#", coverImageUrl: "https://placehold.co/600x400.png", dataAihint:"robotic arm" },
];

export default function ManualBookPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<UserRole>(null);

  const [currentTranslations, setCurrentTranslations] = useState(translations.en);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const loadLanguageAndRole = () => {
      const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
      if (savedLanguage && languageMap[savedLanguage]) {
        setSelectedLanguage(savedLanguage);
        setCurrentTranslations(translations[savedLanguage] || translations.en);
      } else {
        setSelectedLanguage("en");
        setCurrentTranslations(translations.en);
      }
      const role = localStorage.getItem("userRole") as UserRole;
      setUserRole(role);
    };
    loadLanguageAndRole();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLanguage' || event.key === 'userRole') {
        loadLanguageAndRole();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  useEffect(() => {
    const storedManuals = localStorage.getItem("manuals");
    if (storedManuals) {
      try {
        setManuals(JSON.parse(storedManuals));
      } catch (e) {
        console.error("Failed to parse manuals from localStorage", e);
        setManuals(initialManuals);
      }
    } else {
      setManuals(initialManuals);
      localStorage.setItem("manuals", JSON.stringify(initialManuals));
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
   if(hasInitialized) {
    localStorage.setItem("manuals", JSON.stringify(manuals));
   }
  }, [manuals, hasInitialized]);

  const handleDeleteManual = (manualId: string) => {
    if (userRole === "operator") {
        toast({
            title: "Action Not Allowed",
            description: "Operators cannot delete manuals.",
            variant: "destructive",
        });
        return;
    }
    setManuals(prevManuals => prevManuals.filter(manual => manual.id !== manualId));
    toast({
      title: currentTranslations.manualDeletedToastTitle || "Manual Deleted",
      description: currentTranslations.manualDeletedToastDescription || "The manual has been successfully deleted.",
      variant: "destructive",
    });
  };
  
  return (
    <>
      <PageHeader 
        title={currentTranslations.pageTitleManuals || "Maintenance Manuals"}
        description={currentTranslations.pageDescriptionManuals || "Access and manage all technical manuals and guides."}
      >
        {userRole !== "operator" && (
          <Button asChild>
            <Link href="/dashboard/manuals/new">
              <UploadCloud className="mr-2 h-4 w-4" /> {currentTranslations.uploadNewManualButton || "Upload New Manual"}
            </Link>
          </Button>
        )}
      </PageHeader>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {manuals.map(manual => (
          <ManualCard 
            key={manual.id} 
            {...manual} 
            onDelete={() => handleDeleteManual(manual.id)}
            editPath="/dashboard/manuals/new"
            coverImageUrl={manual.coverImageUrl || "https://placehold.co/600x400.png"}
            dataAihint={manual.dataAihint}
            userRole={userRole}
          />
        ))}
        {hasInitialized && manuals.length === 0 && (
          <div className="col-span-full text-center py-10">
            <BookOpenText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">{currentTranslations.noManualsFound || "No manuals found"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{currentTranslations.getStartedByUploadingManual || "Get started by uploading a new manual."}</p>
            <div className="mt-6">
              {userRole !== "operator" && (
                <Button asChild>
                  <Link href="/dashboard/manuals/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> {currentTranslations.uploadManualButton || "Upload Manual"}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
