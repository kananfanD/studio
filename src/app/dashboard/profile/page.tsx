
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, UserCircle2, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { translations, type SupportedLanguage, languageMap } from "../settings/page";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatarUrl: z.string().optional().or(z.literal('')),
  email: z.string().email({ message: "Invalid email address."}).optional().or(z.literal('')),
  currentPassword: z.string().optional().or(z.literal('')), // Simulated
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }).optional().or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
}).refine(data => {
  if (data.newPassword && !data.confirmNewPassword) {
    return false; // Error if new password is set but confirm is not
  }
  return data.newPassword === data.confirmNewPassword;
}, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
}).refine(data => {
  // If new password is provided, current password should also be provided (for simulation)
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password.",
  path: ["currentPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfile {
  name: string;
  email?: string;
  avatarUrl: string;
}

const DEFAULT_AVATAR_PLACEHOLDER = "https://placehold.co/128x128.png";
const DEFAULT_USER_NAME = "User Name";
const DEFAULT_USER_EMAIL = "user@example.com";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: DEFAULT_USER_NAME,
    email: DEFAULT_USER_EMAIL,
    avatarUrl: DEFAULT_AVATAR_PLACEHOLDER,
  });

  const [currentTranslations, setCurrentTranslations] = useState(translations.en);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const loadLanguage = () => {
      const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
      if (savedLanguage && languageMap[savedLanguage]) {
        setSelectedLanguage(savedLanguage);
        setCurrentTranslations(translations[savedLanguage] || translations.en);
      } else {
        setSelectedLanguage("en");
        setCurrentTranslations(translations.en);
      }
    };
    loadLanguage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLanguage') {
        loadLanguage();
      }
       if (event.key === 'userProfile') {
        loadProfileData();
      }
    };
    
    const loadProfileData = () => {
      const storedProfileString = localStorage.getItem("userProfile");
      if (storedProfileString) {
        try {
          const storedProfile: UserProfile = JSON.parse(storedProfileString);
          setCurrentUser({
            name: storedProfile.name || DEFAULT_USER_NAME,
            email: storedProfile.email || DEFAULT_USER_EMAIL,
            avatarUrl: storedProfile.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER,
          });
          form.reset({
            name: storedProfile.name || DEFAULT_USER_NAME,
            email: storedProfile.email || DEFAULT_USER_EMAIL,
            avatarUrl: storedProfile.avatarUrl || "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        } catch (e) {
          console.error("Failed to parse userProfile from localStorage", e);
          // Reset to defaults if parsing fails
          setCurrentUser({ name: DEFAULT_USER_NAME, email: DEFAULT_USER_EMAIL, avatarUrl: DEFAULT_AVATAR_PLACEHOLDER });
          form.reset({ name: DEFAULT_USER_NAME, email: DEFAULT_USER_EMAIL, avatarUrl: "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
        }
      } else {
        // Set defaults if no profile in localStorage
        setCurrentUser({ name: DEFAULT_USER_NAME, email: DEFAULT_USER_EMAIL, avatarUrl: DEFAULT_AVATAR_PLACEHOLDER });
        form.reset({ name: DEFAULT_USER_NAME, email: DEFAULT_USER_EMAIL, avatarUrl: "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
      }
    };

    loadProfileData();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [form]); // Added form to dependency array for reset

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: DEFAULT_USER_NAME,
      avatarUrl: "",
      email: DEFAULT_USER_EMAIL,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watchedAvatarUrl = form.watch("avatarUrl");

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatarUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: ProfileFormValues) {
    const newProfile: UserProfile = {
      name: data.name,
      // Use new email if provided, otherwise keep current from state
      email: data.email ? data.email : currentUser.email, 
      avatarUrl: data.avatarUrl ? data.avatarUrl : currentUser.avatarUrl,
    };
    
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    setCurrentUser(newProfile); 
    
    // Clear password fields after submission for security demonstration
    form.reset({ 
        ...newProfile, 
        avatarUrl: data.avatarUrl || "", // Keep avatar if already set
        currentPassword: "", 
        newPassword: "", 
        confirmNewPassword: "" 
    });


    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userProfile',
      newValue: JSON.stringify(newProfile),
      storageArea: localStorage,
    }));

    toast({
      title: currentTranslations.profileUpdatedToastTitle || "Profile Updated",
      description: currentTranslations.profileUpdatedToastDescription || "Your profile information has been saved.",
    });
    if (data.newPassword) {
        toast({
            title: currentTranslations.passwordChangeSimulatedTitle || "Password Change (Simulated)",
            description: currentTranslations.passwordChangeSimulatedDescription || "Password change is simulated and not actually stored securely in this prototype.",
            variant: "default", 
        });
    }
  }

  const displayAvatar = watchedAvatarUrl || currentUser.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER;

  return (
    <>
      <PageHeader
        title={currentTranslations.pageTitleProfile || "My Profile"}
        description={currentTranslations.pageDescriptionProfile || "Manage your account details and preferences."}
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentTranslations.backToDashboard || "Back to Dashboard"}
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="items-center">
              <Avatar className="h-32 w-32 mb-4 border-2 border-primary">
                <AvatarImage src={displayAvatar} alt={currentUser.name} data-ai-hint="user avatar" />
                <AvatarFallback className="text-4xl">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground mt-1">{currentTranslations.memberRole || "Member"}</p>
            </CardHeader>
            <CardContent>
              {/* Additional profile info can be displayed here if needed */}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>{currentTranslations.editProfileInformationTitle || "Edit Profile Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentTranslations.fullNameLabel || "Full Name"}</FormLabel>
                        <FormControl>
                          <Input placeholder={currentTranslations.yourFullNamePlaceholder || "Your full name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avatarUrl" 
                    render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>{currentTranslations.changeProfilePictureLabel || "Change Profile Picture"}</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                          />
                        </FormControl>
                        <FormDescription>
                          {currentTranslations.uploadAvatarDescription || "Upload a new image for your avatar. Recommended size: 200x200px."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchedAvatarUrl && (
                    <div className="mt-4">
                      <FormLabel>{currentTranslations.newAvatarPreviewLabel || "New Avatar Preview"}</FormLabel>
                      <div className="relative mt-2 h-32 w-32 rounded-md border bg-muted/30 flex items-center justify-center">
                        <Image
                          src={watchedAvatarUrl}
                          alt="New Avatar Preview"
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                          data-ai-hint="avatar preview"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>{currentTranslations.accountSecurityTitle || "Account Security"}</CardTitle>
                  <CardDescription>{currentTranslations.accountSecurityDescriptionSimulated || "Change your email or password (Simulated for prototype)"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{currentTranslations.emailAddressLabel || "Email Address"}</FormLabel>
                            <FormControl>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input type="email" placeholder={currentTranslations.yourEmailPlaceholder || "your.email@example.com"} {...field} className="pl-10" />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{currentTranslations.currentPasswordLabel || "Current Password"}</FormLabel>
                            <FormControl>
                             <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input type="password" placeholder={currentTranslations.currentPasswordPlaceholder || "Enter current password"} {...field} className="pl-10" />
                            </div>
                            </FormControl>
                            <FormDescription>{currentTranslations.currentPasswordDescriptionSimulated || "Required to change password (Simulated)"}</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{currentTranslations.newPasswordLabel || "New Password"}</FormLabel>
                            <FormControl>
                             <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input type="password" placeholder={currentTranslations.newPasswordPlaceholder || "Enter new password"} {...field} className="pl-10" />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{currentTranslations.confirmNewPasswordLabel || "Confirm New Password"}</FormLabel>
                            <FormControl>
                             <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input type="password" placeholder={currentTranslations.confirmNewPasswordPlaceholder || "Confirm new password"} {...field} className="pl-10" />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {currentTranslations.saveChangesButton || "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

    