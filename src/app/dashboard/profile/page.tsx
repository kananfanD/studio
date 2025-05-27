
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
          avatarUrl: storedProfile.avatarUrl || "", // Keep form avatarUrl as data URI or empty
        });
      } catch (e) {
        console.error("Failed to parse userProfile from localStorage", e);
        // Use default values if parsing fails
        setCurrentUser({ name: DEFAULT_USER_NAME, avatarUrl: DEFAULT_AVATAR_PLACEHOLDER });
        form.reset({ name: DEFAULT_USER_NAME, avatarUrl: "" });
      }
    } else {
        // If no profile, set form to defaults and current user to placeholder
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
      // If a new avatar was uploaded (data.avatarUrl is a data URI), use it.
      // Otherwise, keep the existing currentUser.avatarUrl (which might be a placeholder or a previous upload).
      avatarUrl: data.avatarUrl ? data.avatarUrl : currentUser.avatarUrl,
    };
    
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    setCurrentUser(newProfile); // Update displayed user info immediately
    
    // Dispatch a storage event so other parts of the app (like the sidebar) can react
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userProfile',
      newValue: JSON.stringify(newProfile),
      storageArea: localStorage,
    }));

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  }

  const displayAvatar = watchedAvatarUrl || currentUser.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER;

  return (
    <>
      <PageHeader
        title="My Profile"
        description="Manage your account details and preferences."
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
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
              <p className="text-sm text-muted-foreground">Member</p>
            </CardHeader>
            <CardContent>
              {/* Additional profile info can be displayed here if needed */}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avatarUrl" 
                    render={({ field }) => ( // field.value will be the data URI from upload
                      <FormItem>
                        <FormLabel>Change Profile Picture</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            // File input value is managed by the browser, not directly by React Hook Form state
                          />
                        </FormControl>
                        <FormDescription>
                          Upload a new image for your avatar. Recommended size: 200x200px.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchedAvatarUrl && (
                    <div className="mt-4">
                      <FormLabel>New Avatar Preview</FormLabel>
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
                      <Save className="mr-2 h-4 w-4" /> Save Changes
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

    