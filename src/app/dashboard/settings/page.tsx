
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Trash2, UserCircle2, Bell, Languages, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type SupportedLanguage = "en" | "id" | "ja" | "ko" | "zh-TW";

const languageMap: Record<SupportedLanguage, string> = {
  "en": "English",
  "id": "Indonesian",
  "ja": "Japanese",
  "ko": "Korean",
  "zh-TW": "Taiwanese",
};

// Simple translation dictionary for demonstration
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    settingsTitle: "Settings",
    settingsDescription: "Manage your application preferences.",
    backToDashboard: "Back to Dashboard",
    appearanceTitle: "Appearance",
    appearanceDescription: "Customize the look and feel of the application.",
    darkModeLabel: "Dark Mode",
    darkModeDescription: "Switch between light and dark themes.",
    resetThemeButton: "Reset to Default Theme",
    accountTitle: "Account",
    accountDescription: "Manage your profile information.",
    manageProfileButton: "Manage Profile",
    manageProfileDescription: "Change your name, avatar, and other personal details.",
    notificationsTitle: "Notifications",
    notificationsDescription: "Configure how you receive notifications.",
    enableNotificationsLabel: "Enable Notifications",
    enableNotificationsDescription: "Toggle application notifications on or off.",
    notificationsPlaceholder: "(This is a placeholder setting for the prototype and does not send actual notifications).",
    languageTitle: "Language",
    languageDescription: "Select your preferred language for the application.",
    appLanguageLabel: "Application Language",
    languagePlaceholder: "Note: Language selection is a placeholder. Actual UI translation is not yet implemented in this prototype.",
    themeChangedToast: "Theme Changed",
    darkModeEnabledToast: "Dark mode enabled.",
    lightModeEnabledToast: "Light mode enabled.",
    themeResetToast: "Theme Direset",
    themeResetDescriptionToast: "Theme has been reset to default (Light).",
    notificationSettingsUpdatedToast: "Notification Settings Updated",
    notificationsEnabledToast: "Notifications enabled.",
    notificationsDisabledToast: "Notifications disabled.",
    languageChangedToast: "Language Changed",
    languageSetToToast: "Language set to {lang}. (UI translation not yet implemented)",
  },
  id: {
    settingsTitle: "Pengaturan",
    settingsDescription: "Kelola preferensi aplikasi Anda.",
    backToDashboard: "Kembali ke Dasbor",
    appearanceTitle: "Tampilan",
    appearanceDescription: "Sesuaikan tampilan dan nuansa aplikasi.",
    darkModeLabel: "Mode Gelap",
    darkModeDescription: "Beralih antara tema terang dan gelap.",
    resetThemeButton: "Atur Ulang ke Tema Default",
    accountTitle: "Akun",
    accountDescription: "Kelola informasi profil Anda.",
    manageProfileButton: "Kelola Profil",
    manageProfileDescription: "Ubah nama, avatar, dan detail pribadi lainnya.",
    notificationsTitle: "Notifikasi",
    notificationsDescription: "Konfigurasikan cara Anda menerima notifikasi.",
    enableNotificationsLabel: "Aktifkan Notifikasi",
    enableNotificationsDescription: "Aktifkan atau nonaktifkan notifikasi aplikasi.",
    notificationsPlaceholder: "(Ini adalah pengaturan placeholder untuk prototipe dan tidak mengirim notifikasi aktual).",
    languageTitle: "Bahasa",
    languageDescription: "Pilih bahasa pilihan Anda untuk aplikasi.",
    appLanguageLabel: "Bahasa Aplikasi",
    languagePlaceholder: "Catatan: Pilihan bahasa adalah placeholder. Terjemahan UI aktual belum diimplementasikan dalam prototipe ini.",
    themeChangedToast: "Tema Diubah",
    darkModeEnabledToast: "Mode gelap diaktifkan.",
    lightModeEnabledToast: "Mode terang diaktifkan.",
    themeResetToast: "Tema Direset",
    themeResetDescriptionToast: "Tema telah direset ke default (Terang).",
    notificationSettingsUpdatedToast: "Pengaturan Notifikasi Diperbarui",
    notificationsEnabledToast: "Notifikasi diaktifkan.",
    notificationsDisabledToast: "Notifikasi dinonaktifkan.",
    languageChangedToast: "Bahasa Diubah",
    languageSetToToast: "Bahasa diatur ke {lang}. (Terjemahan UI belum diimplementasikan)",
  },
  // Other languages would be stubs for this demo
  ja: { ...translations.en, settingsTitle: "設定" }, // Stub
  ko: { ...translations.en, settingsTitle: "설정" }, // Stub
  "zh-TW": { ...translations.en, settingsTitle: "設置" }, // Stub
};

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const { toast } = useToast();

  // State for translated texts on this page
  const [t, setT] = useState(translations.en);

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
    setNotificationsEnabled(savedNotifications === "true");

    const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
    if (savedLanguage && languageMap[savedLanguage]) {
      setSelectedLanguage(savedLanguage);
      setT(translations[savedLanguage] || translations.en);
    } else {
      setT(translations.en); // Default to English
    }
  }, []);

  // Update translations when selectedLanguage changes
  useEffect(() => {
    setT(translations[selectedLanguage] || translations.en);
  }, [selectedLanguage]);

  const toggleTheme = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      toast({ title: t.themeChangedToast, description: t.darkModeEnabledToast });
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      toast({ title: t.themeChangedToast, description: t.lightModeEnabledToast });
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
      title: t.themeResetToast,
      description: t.themeResetDescriptionToast,
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
      title: t.notificationSettingsUpdatedToast,
      description: checked ? t.notificationsEnabledToast : t.notificationsDisabledToast,
    });
  };

  const handleLanguageChange = (value: string) => {
    const newLang = value as SupportedLanguage;
    setSelectedLanguage(newLang);
    localStorage.setItem("userLanguage", newLang);
    // The useEffect for selectedLanguage will update 't'
    toast({
      title: t.languageChangedToast, // This will use the 'previous' language for the toast itself
      description: (translations[newLang] || translations.en).languageSetToToast.replace("{lang}", languageMap[newLang]),
    });
    // For a full app, you'd trigger a global language update here
  };

  return (
    <>
      <PageHeader
        title={t.settingsTitle}
        description={t.settingsDescription}
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToDashboard}
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t.appearanceTitle}</CardTitle>
            <CardDescription>{t.appearanceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
                <span>{t.darkModeLabel}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t.darkModeDescription}
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
              {t.resetThemeButton}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t.accountTitle}</CardTitle>
            <CardDescription>{t.accountDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/profile" legacyBehavior>
              <Button variant="outline" className="w-full">
                <UserCircle2 className="mr-2 h-4 w-4" />
                {t.manageProfileButton}
              </Button>
            </Link>
             <p className="text-sm text-muted-foreground">
              {t.manageProfileDescription}
            </p>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t.notificationsTitle}</CardTitle>
            <CardDescription>{t.notificationsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="notifications-toggle" className="flex flex-col space-y-1">
                <span>{t.enableNotificationsLabel}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t.enableNotificationsDescription}
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
              {t.notificationsPlaceholder}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t.languageTitle}</CardTitle>
            <CardDescription>{t.languageDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <Label htmlFor="language-select" className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <span>{t.appLanguageLabel}</span>
                </Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language-select" className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(languageMap) as SupportedLanguage[]).map((langKey) => (
                      <SelectItem key={langKey} value={langKey}>
                        {languageMap[langKey]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.languagePlaceholder}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

    