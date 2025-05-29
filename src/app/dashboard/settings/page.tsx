
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Trash2, UserCircle2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
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

    const savedNotifications = localStorage.getItem("notificationsEnabled");
    if (savedNotifications === "true") {
      setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
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
     window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      newValue: checked ? 'dark' : 'light',
      storageArea: localStorage,
    }));
  };

  const handleResetTheme = () => {
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    setIsDarkMode(false);
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default (Light).",
      variant: "destructive",
    });
     window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      newValue: 'light',
      storageArea: localStorage,
    }));
  };

  const toggleNotifications = (checked: boolean) => {
    localStorage.setItem("notificationsEnabled", String(checked));
    setNotificationsEnabled(checked);
    toast({
      title: "Notification Settings Updated",
      description: `Notifications ${checked ? "enabled" : "disabled"}.`,
    });
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
          <CardContent className="space-y-4">
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
             <Button variant="outline" onClick={handleResetTheme} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset to Default Theme
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/profile" legacyBehavior>
              <Button variant="outline" className="w-full">
                <UserCircle2 className="mr-2 h-4 w-4" />
                Manage Profile
              </Button>
            </Link>
             <p className="text-sm text-muted-foreground">
              Change your name, avatar, and other personal details.
            </p>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="notifications-toggle" className="flex flex-col space-y-1">
                <span>Enable Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle application notifications on or off.
                </span>
              </Label>
              <div className="flex items-center">
                 <Bell className={`h-5 w-5 mr-2 transition-opacity ${notificationsEnabled ? 'text-primary' : 'opacity-50'}`} />
                <Switch
                  id="notifications-toggle"
                  checked={notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                  aria-label="Toggle notifications"
                />
              </div>
            </div>
             <p className="text-sm text-muted-foreground">
              (This is a placeholder setting for the prototype and does not send actual notifications).
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
