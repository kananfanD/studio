
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { translations, type SupportedLanguage, languageMap } from "../settings/page";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatarUrl: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfile {
  name: string;
  avatarUrl: string;
}

const DEFAULT_AVATAR_PLACEHOLDER = "https://placehold.co/128x128.png";
const DEFAULT_USER_NAME = "User Name";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: DEFAULT_USER_NAME,
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
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: DEFAULT_USER_NAME,
      avatarUrl: "",
    },
  });

  const watchedAvatarUrl = form.watch("avatarUrl");

  useEffect(() => {
    const storedProfileString = localStorage.getItem("userProfile");
    if (storedProfileString) {
      try {
        const storedProfile: UserProfile = JSON.parse(storedProfileString);
        setCurrentUser(storedProfile);
        form.reset({
          name: storedProfile.name || DEFAULT_USER_NAME,
          avatarUrl: storedProfile.avatarUrl || "", 
        });
      } catch (e) {
        console.error("Failed to parse userProfile from localStorage", e);
        setCurrentUser({ name: DEFAULT_USER_NAME, avatarUrl: DEFAULT_AVATAR_PLACEHOLDER });
        form.reset({ name: DEFAULT_USER_NAME, avatarUrl: "" });
      }
    } else {
        setCurrentUser({ name: DEFAULT_USER_NAME, avatarUrl: DEFAULT_AVATAR_PLACEHOLDER });
        form.reset({ name: DEFAULT_USER_NAME, avatarUrl: "" });
    }
  }, [form]);

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
      avatarUrl: data.avatarUrl ? data.avatarUrl : currentUser.avatarUrl,
    };
    
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    setCurrentUser(newProfile); 
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userProfile',
      newValue: JSON.stringify(newProfile),
      storageArea: localStorage,
    }));

    toast({
      title: currentTranslations.profileUpdatedToastTitle || "Profile Updated",
      description: currentTranslations.profileUpdatedToastDescription || "Your profile information has been saved.",
    });
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
              <p className="text-sm text-muted-foreground">{currentTranslations.memberRole || "Member"}</p>
            </CardHeader>
            <CardContent>
              {/* Additional profile info can be displayed here if needed */}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{currentTranslations.editProfileInformationTitle || "Edit Profile Information"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  <div className="flex justify-end pt-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" /> {currentTranslations.saveChangesButton || "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

    