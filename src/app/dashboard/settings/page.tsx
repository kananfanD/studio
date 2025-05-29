
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

export type SupportedLanguage = "en" | "id" | "ja" | "ko" | "zh-TW";

export const languageMap: Record<SupportedLanguage, string> = {
  "en": "English",
  "id": "Indonesian",
  "ja": "Japanese",
  "ko": "Korean",
  "zh-TW": "Taiwanese",
};

// Define English translations separately to avoid self-reference issues
const englishTranslations = {
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
  languagePlaceholder: "Note: UI translation is partially implemented for demonstration.", // Updated placeholder
  themeChangedToast: "Theme Changed",
  darkModeEnabledToast: "Dark mode enabled.",
  lightModeEnabledToast: "Light mode enabled.",
  themeResetToast: "Theme Reset",
  themeResetDescriptionToast: "Theme has been reset to default (Light).",
  notificationSettingsUpdatedToast: "Notification Settings Updated",
  notificationsEnabledToast: "Notifications enabled.",
  notificationsDisabledToast: "Notifications disabled.",
  languageChangedToast: "Language Changed",
  languageSetToToast: "Language set to {lang}.",

  // Sidebar labels
  sidebarDashboard: "Dashboard",
  sidebarMaintenanceTasks: "Maintenance Tasks",
  sidebarMaintenanceLog: "Maintenance Log",
  sidebarComponentStock: "Component Stock",
  sidebarManuals: "Manuals",
  sidebarProfile: "Profile",
  sidebarSettings: "Settings",
  sidebarLogout: "Log out",
  sidebarMyAccount: "My Account",


  // Page Headers
  pageTitleDashboard: "Welcome, {userName}!",
  pageDescriptionDashboard: "Here's a summary of your maintenance activities.",
  pageTitleMaintenanceTasks: "Maintenance Tasks",
  pageDescriptionMaintenanceTasks: "Manage and track all maintenance activities.",
  addNewDailyTask: "Add New Daily Task",
  addNewWeeklyTask: "Add New Weekly Task",
  addNewMonthlyTask: "Add New Monthly Task",
  dailyTasksTab: "Daily Tasks",
  weeklyTasksTab: "Weekly Tasks",
  monthlyTasksTab: "Monthly Tasks",
  noDailyTasksFound: "No daily tasks found.",
  noWeeklyTasksFound: "No weekly tasks found.",
  noMonthlyTasksFound: "No monthly tasks found.",
  pageTitleMaintenanceLog: "Maintenance Task Log",
  pageDescriptionMaintenanceLog: "A historical log of all daily, weekly, and monthly maintenance tasks.",
  downloadPdfButton: "Download PDF",
  noMaintenanceTasksInLog: "No maintenance tasks found in the log.",
  addTasksToSeeLog: "Add tasks in Daily, Weekly, or Monthly sections to see them here.",
  taskNameTableHeader: "Task Name",
  machineIdTableHeader: "Machine ID",
  typeTableHeader: "Type",
  dueDateTableHeader: "Due Date",
  statusTableHeader: "Status",
  priorityTableHeader: "Priority",
  assignedToTableHeader: "Assigned To",
  descriptionTableHeader: "Description",
  pageTitleComponentStock: "Component Stock Management",
  pageDescriptionComponentStock: "Track inventory levels for all machine components.",
  addNewComponentButton: "Add New Component",
  stockItemDeletedToastTitle: "Stock Item Deleted",
  stockItemDeletedToastDescription: "The stock item has been successfully deleted.",
  noStockItemsFound: "No stock items found",
  getStartedByAddingComponent: "Get started by adding a new component.",
  addComponentButton: "Add Component",
  pageTitleManuals: "Maintenance Manuals",
  pageDescriptionManuals: "Access and manage all technical manuals and guides.",
  uploadNewManualButton: "Upload New Manual",
  manualDeletedToastTitle: "Manual Deleted",
  manualDeletedToastDescription: "The manual has been successfully deleted.",
  noManualsFound: "No manuals found",
  getStartedByUploadingManual: "Get started by uploading a new manual.",
  uploadManualButton: "Upload Manual",
  pageTitleProfile: "My Profile",
  pageDescriptionProfile: "Manage your account details and preferences.",
  profileUpdatedToastTitle: "Profile Updated",
  profileUpdatedToastDescription: "Your profile information has been saved.",
  memberRole: "Member",
  editProfileInformationTitle: "Edit Profile Information",
  fullNameLabel: "Full Name",
  yourFullNamePlaceholder: "Your full name",
  changeProfilePictureLabel: "Change Profile Picture",
  uploadAvatarDescription: "Upload a new image for your avatar. Recommended size: 200x200px.",
  newAvatarPreviewLabel: "New Avatar Preview",
  saveChangesButton: "Save Changes",
  pendingDailyTasks: "Pending Daily Tasks",
  tasksNeedingAttention: "Tasks needing attention",
  componentsLowStock: "Components Low Stock",
  orderNewPartsSoon: "Order new parts soon",
  completedThisWeek: "Completed This Week",
  weeklyMaintenanceTasks: "Weekly maintenance tasks",
  machinesOperational: "Machines Operational",
  overallEquipmentEffectiveness: "Overall equipment effectiveness",
  quickActions: "Quick Actions",
  viewAllMaintenanceTasks: "View all maintenance tasks",
  viewHistoricalTaskLog: "View historical task log",
  checkInventoryLevels: "Check inventory levels",
  accessPdfGuides: "Access PDF guides",

  // Account Security on Profile Page
  accountSecurityTitle: "Account Security",
  accountSecurityDescriptionSimulated: "Change your email or password (Simulated for prototype)",
  emailAddressLabel: "Email Address",
  yourEmailPlaceholder: "your.email@example.com",
  currentPasswordLabel: "Current Password",
  currentPasswordPlaceholder: "Enter current password",
  currentPasswordDescriptionSimulated: "Required to change password (Simulated)",
  newPasswordLabel: "New Password",
  newPasswordPlaceholder: "Enter new password",
  confirmNewPasswordLabel: "Confirm New Password",
  confirmNewPasswordPlaceholder: "Confirm new password",
  passwordChangeSimulatedTitle: "Password Change (Simulated)",
  passwordChangeSimulatedDescription: "Password change is simulated and not actually stored securely in this prototype.",
};

// Simple translation dictionary for demonstration
export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: englishTranslations,
  id: {
    ...englishTranslations, // Start with English as base, then override
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
    languagePlaceholder: "Catatan: Terjemahan UI diimplementasikan sebagian untuk demonstrasi.", // Updated placeholder
    themeChangedToast: "Tema Diubah",
    darkModeEnabledToast: "Mode gelap diaktifkan.",
    lightModeEnabledToast: "Mode terang diaktifkan.",
    themeResetToast: "Tema Direset",
    themeResetDescriptionToast: "Tema telah direset ke default (Terang).",
    notificationSettingsUpdatedToast: "Pengaturan Notifikasi Diperbarui",
    notificationsEnabledToast: "Notifikasi diaktifkan.",
    notificationsDisabledToast: "Notifikasi dinonaktifkan.",
    languageChangedToast: "Bahasa Diubah",
    languageSetToToast: "Bahasa diatur ke {lang}.",

    // Sidebar labels - Indonesian
    sidebarDashboard: "Dasbor",
    sidebarMaintenanceTasks: "Tugas Perawatan",
    sidebarMaintenanceLog: "Log Perawatan",
    sidebarComponentStock: "Stok Komponen",
    sidebarManuals: "Manual",
    sidebarProfile: "Profil",
    sidebarSettings: "Pengaturan",
    sidebarLogout: "Keluar",
    sidebarMyAccount: "Akun Saya",

    // Page Headers - Indonesian
    pageTitleDashboard: "Selamat Datang, {userName}!",
    pageDescriptionDashboard: "Berikut adalah ringkasan aktivitas perawatan Anda.",
    pageTitleMaintenanceTasks: "Tugas Perawatan",
    pageDescriptionMaintenanceTasks: "Kelola dan lacak semua aktivitas perawatan.",
    addNewDailyTask: "Tambah Tugas Harian Baru",
    addNewWeeklyTask: "Tambah Tugas Mingguan Baru",
    addNewMonthlyTask: "Tambah Tugas Bulanan Baru",
    dailyTasksTab: "Tugas Harian",
    weeklyTasksTab: "Tugas Mingguan",
    monthlyTasksTab: "Tugas Bulanan",
    noDailyTasksFound: "Tidak ada tugas harian ditemukan.",
    noWeeklyTasksFound: "Tidak ada tugas mingguan ditemukan.",
    noMonthlyTasksFound: "Tidak ada tugas bulanan ditemukan.",
    pageTitleMaintenanceLog: "Log Tugas Perawatan",
    pageDescriptionMaintenanceLog: "Log historis dari semua tugas perawatan harian, mingguan, dan bulanan.",
    downloadPdfButton: "Unduh PDF",
    noMaintenanceTasksInLog: "Tidak ada tugas perawatan ditemukan di log.",
    addTasksToSeeLog: "Tambahkan tugas di bagian Harian, Mingguan, atau Bulanan untuk melihatnya di sini.",
    taskNameTableHeader: "Nama Tugas",
    machineIdTableHeader: "ID Mesin",
    typeTableHeader: "Tipe",
    dueDateTableHeader: "Tanggal Jatuh Tempo",
    statusTableHeader: "Status",
    priorityTableHeader: "Prioritas",
    assignedToTableHeader: "Ditugaskan Kepada",
    descriptionTableHeader: "Deskripsi",
    pageTitleComponentStock: "Manajemen Stok Komponen",
    pageDescriptionComponentStock: "Lacak tingkat inventaris untuk semua komponen mesin.",
    addNewComponentButton: "Tambah Komponen Baru",
    stockItemDeletedToastTitle: "Item Stok Dihapus",
    stockItemDeletedToastDescription: "Item stok telah berhasil dihapus.",
    noStockItemsFound: "Tidak ada item stok ditemukan",
    getStartedByAddingComponent: "Mulai dengan menambahkan komponen baru.",
    addComponentButton: "Tambah Komponen",
    pageTitleManuals: "Manual Perawatan",
    pageDescriptionManuals: "Akses dan kelola semua manual dan panduan teknis.",
    uploadNewManualButton: "Unggah Manual Baru",
    manualDeletedToastTitle: "Manual Dihapus",
    manualDeletedToastDescription: "Manual telah berhasil dihapus.",
    noManualsFound: "Tidak ada manual ditemukan",
    getStartedByUploadingManual: "Mulai dengan mengunggah manual baru.",
    uploadManualButton: "Unggah Manual",
    pageTitleProfile: "Profil Saya",
    pageDescriptionProfile: "Kelola detail akun dan preferensi Anda.",
    profileUpdatedToastTitle: "Profil Diperbarui",
    profileUpdatedToastDescription: "Informasi profil Anda telah disimpan.",
    memberRole: "Anggota",
    editProfileInformationTitle: "Edit Informasi Profil",
    fullNameLabel: "Nama Lengkap",
    yourFullNamePlaceholder: "Nama lengkap Anda",
    changeProfilePictureLabel: "Ubah Foto Profil",
    uploadAvatarDescription: "Unggah gambar baru untuk avatar Anda. Ukuran direkomendasikan: 200x200px.",
    newAvatarPreviewLabel: "Pratinjau Avatar Baru",
    saveChangesButton: "Simpan Perubahan",
    pendingDailyTasks: "Tugas Harian Tertunda",
    tasksNeedingAttention: "Tugas yang memerlukan perhatian",
    componentsLowStock: "Stok Komponen Rendah",
    orderNewPartsSoon: "Segera pesan suku cadang baru",
    completedThisWeek: "Selesai Minggu Ini",
    weeklyMaintenanceTasks: "Tugas perawatan mingguan",
    machinesOperational: "Mesin Beroperasi",
    overallEquipmentEffectiveness: "Efektivitas peralatan keseluruhan",
    quickActions: "Aksi Cepat",
    viewAllMaintenanceTasks: "Lihat semua tugas perawatan",
    viewHistoricalTaskLog: "Lihat log tugas historis",
    checkInventoryLevels: "Periksa tingkat inventaris",
    accessPdfGuides: "Akses panduan PDF",

    // Account Security on Profile Page - Indonesian
    accountSecurityTitle: "Keamanan Akun",
    accountSecurityDescriptionSimulated: "Ubah email atau kata sandi Anda (Disimulasikan untuk prototipe)",
    emailAddressLabel: "Alamat Email",
    yourEmailPlaceholder: "email.anda@contoh.com",
    currentPasswordLabel: "Kata Sandi Saat Ini",
    currentPasswordPlaceholder: "Masukkan kata sandi saat ini",
    currentPasswordDescriptionSimulated: "Diperlukan untuk mengubah kata sandi (Disimulasikan)",
    newPasswordLabel: "Kata Sandi Baru",
    newPasswordPlaceholder: "Masukkan kata sandi baru",
    confirmNewPasswordLabel: "Konfirmasi Kata Sandi Baru",
    confirmNewPasswordPlaceholder: "Konfirmasi kata sandi baru",
    passwordChangeSimulatedTitle: "Perubahan Kata Sandi (Disimulasikan)",
    passwordChangeSimulatedDescription: "Perubahan kata sandi disimulasikan dan tidak disimpan secara aman dalam prototipe ini.",
  },
  // Other languages would be stubs for this demo, referencing the pre-defined englishTranslations
  ja: { ...englishTranslations, settingsTitle: "設定", sidebarDashboard: "ダッシュボード", accountSecurityTitle: "アカウントセキュリティ"},
  ko: { ...englishTranslations, settingsTitle: "설정", sidebarDashboard: "대시보드", accountSecurityTitle: "계정 보안"},
  "zh-TW": { ...englishTranslations, settingsTitle: "設置", sidebarDashboard: "儀表板", accountSecurityTitle: "帳戶安全"},
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

    const loadLanguage = () => {
      const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
      if (savedLanguage && languageMap[savedLanguage]) {
        setSelectedLanguage(savedLanguage);
        setT(translations[savedLanguage] || translations.en);
      } else {
        setSelectedLanguage("en");
        setT(translations.en); // Default to English
      }
    };
    loadLanguage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLanguage') {
        loadLanguage();
      }
      if (event.key === 'theme') {
        const newTheme = event.newValue;
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDarkMode(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  // Update translations when selectedLanguage changes
  useEffect(() => {
    setT(translations[selectedLanguage] || translations.en);
  }, [selectedLanguage]);

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(checked);
    toast({ title: t.themeChangedToast, description: checked ? t.darkModeEnabledToast : t.lightModeEnabledToast });
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      newValue: newTheme,
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
      newValue: 'light', // Explicitly set to light as default
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
      title: (translations[newLang] || translations.en).languageChangedToast, 
      description: (translations[newLang] || translations.en).languageSetToToast.replace("{lang}", languageMap[newLang]),
    });
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'userLanguage',
        newValue: newLang,
        storageArea: localStorage,
    }));
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
              {/* This specific placeholder might remain in English or be translated if critical */}
              {translations[selectedLanguage]?.languagePlaceholder || englishTranslations.languagePlaceholder}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    