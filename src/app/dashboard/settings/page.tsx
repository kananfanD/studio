
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      toast({ title: "Theme Changed", description: "Dark mode enabled." });
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      toast({ title: "Theme Changed", description: "Light mode enabled." });
    }
     // Dispatch a storage event so other parts of the app can react if needed
     window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      newValue: checked ? 'dark' : 'light',
      storageArea: localStorage,
    }));
  };

  const handleResetSettings = () => {
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    setIsDarkMode(false);
    // Optionally, reset other settings here if they are added later
    toast({
      title: "Settings Reset",
      description: "Theme has been reset to default (Light).",
      variant: "destructive",
    });
     window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      newValue: 'light', // or null if you prefer to signify removal
      storageArea: localStorage,
    }));
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application preferences."
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Switch between light and dark themes.
                </span>
              </Label>
              <div className="flex items-center">
                <Sun className={`h-5 w-5 mr-2 transition-opacity ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
                <Switch
                  id="theme-toggle"
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
                <Moon className={`h-5 w-5 ml-2 transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
              </div>
            </div>
             <Button variant="outline" onClick={handleResetSettings} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset to Default Theme
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for more settings categories */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Account (Placeholder)</CardTitle>
            <CardDescription>Manage your account details (coming soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Further account settings will appear here.</p>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Notifications (Placeholder)</CardTitle>
            <CardDescription>Configure notification preferences (coming soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Notification settings will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
