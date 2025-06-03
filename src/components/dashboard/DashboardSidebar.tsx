
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Archive,
  BookOpenText,
  LogOut,
  UserCircle2,
  ChevronDown,
  Settings2,
  ClipboardList,
  Wrench, 
} from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, type ComponentType } from 'react';
import { translations, type SupportedLanguage, languageMap } from '@/app/dashboard/settings/page';

type UserRole = "operator" | "maintenance-planner" | "warehouse" | null;

interface NavItem {
  href: string;
  labelKey: keyof typeof translations.en; 
  icon: ComponentType<any>; 
  roles: UserRole[];
}


const allNavItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'sidebarDashboard', icon: LayoutDashboard, roles: ['operator', 'maintenance-planner', 'warehouse'] },
  { href: '/dashboard/maintenance', labelKey: 'sidebarMaintenanceTasks', icon: Wrench, roles: ['operator', 'maintenance-planner'] },
  { href: '/dashboard/inventory', labelKey: 'sidebarMaintenanceLog', icon: ClipboardList, roles: ['maintenance-planner'] },
  { href: '/dashboard/stock', labelKey: 'sidebarComponentStock', icon: Archive, roles: ['warehouse', 'maintenance-planner'] },
  { href: '/dashboard/manuals', labelKey: 'sidebarManuals', icon: BookOpenText, roles: ['operator', 'maintenance-planner'] },
];

interface DashboardSidebarProps {
  isOpen: boolean; 
  onToggle: () => void; 
  userRole: UserRole;
  isMobileView: boolean; 
}

interface UserProfile {
  name: string;
  avatarUrl: string;
}

const DEFAULT_AVATAR_PLACEHOLDER = "https://placehold.co/40x40.png";
const DEFAULT_USER_NAME = "User Name";

export default function DashboardSidebar({ isOpen, onToggle, userRole, isMobileView }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [userAvatarUrl, setUserAvatarUrl] = useState(DEFAULT_AVATAR_PLACEHOLDER);
  
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [currentTranslations, setCurrentTranslations] = useState(translations.en);

  const showText = isMobileView ? true : isOpen;

  const loadProfileAndLanguage = () => {
    if (typeof window !== 'undefined') {
      const storedProfileString = localStorage.getItem("userProfile");
      if (storedProfileString) {
        try {
          const storedProfile: UserProfile = JSON.parse(storedProfileString);
          setUserName(storedProfile.name || DEFAULT_USER_NAME);
          setUserAvatarUrl(storedProfile.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER);
        } catch (e) {
          setUserName(DEFAULT_USER_NAME);
          setUserAvatarUrl(DEFAULT_AVATAR_PLACEHOLDER);
        }
      } else {
          setUserName(DEFAULT_USER_NAME);
          setUserAvatarUrl(DEFAULT_AVATAR_PLACEHOLDER);
      }

      const savedLanguage = localStorage.getItem("userLanguage") as SupportedLanguage | null;
      if (savedLanguage && languageMap[savedLanguage]) {
        setSelectedLanguage(savedLanguage);
        setCurrentTranslations(translations[savedLanguage] || translations.en);
      } else {
        setSelectedLanguage("en");
        setCurrentTranslations(translations.en);
      }
    }
  };

  useEffect(() => {
    loadProfileAndLanguage(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userProfile' || event.key === 'userRole' || event.key === 'userLanguage') { 
        loadProfileAndLanguage();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("equipCareUserLoggedIn");
      localStorage.removeItem("userRole"); 
    }
    toast({
      title: currentTranslations.sidebarLogout || "Logged Out",
      description: "You have been successfully logged out.", 
    });
    router.push('/'); 
  };

  const getVisibleNavItems = () => {
    if (!userRole) return [];
    return allNavItems.filter(item => item.roles.includes(userRole));
  };

  const visibleNavItems = getVisibleNavItems();
  
  const sidebarContent = (
    <>
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-6 transition-colors hover:bg-sidebar-accent",
          showText ? "justify-start" : "justify-center px-0", 
          "cursor-pointer"
        )}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
        title={isMobileView ? "Close menu" : (isOpen ? "Collapse sidebar" : "Expand sidebar")}
      >
        <Logo iconSize={6} textSize="text-xl" hideText={!showText} className="ml-0" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {visibleNavItems.map((item) => {
          const label = currentTranslations[item.labelKey] || item.labelKey.replace('sidebar','');
          return (
            <Link key={item.labelKey} href={item.href} passHref>
              <Button
                variant={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start",
                  pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !showText && "justify-center h-12 w-12 p-0" 
                )}
                title={label}
                onClick={() => isMobileView && onToggle()} 
              >
                <item.icon className={cn("mr-3 h-5 w-5", !showText && "mr-0")} />
                {showText && label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <Separator className="bg-sidebar-border" />
      <div className={cn("p-2", !showText && "p-1")}>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !showText && "justify-center h-12 w-12 p-0"
              )}
              title={currentTranslations.sidebarMyAccount || "My Account"}
            >
              <Avatar className={cn("mr-3 h-8 w-8", !showText && "mr-0")}>
                <AvatarImage src={userAvatarUrl} alt={userName} data-ai-hint="user profile"/>
                <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              {showText && <span className="flex-1 text-left truncate">{userName}</span>}
              {showText && <ChevronDown className="ml-auto h-4 w-4 shrink-0" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 mb-1" 
            side={isMobileView ? "top" : (isOpen ? "top" : "right")} 
            align={isMobileView ? "center" : (isOpen ? "start" : "center")} 
            sideOffset={isMobileView ? 4 : (isOpen ? 0 : 8)}
          >
            <DropdownMenuLabel>{currentTranslations.sidebarMyAccount || "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => isMobileView && onToggle()}>
              <Link href="/dashboard/profile">
                <UserCircle2 className="mr-2 h-4 w-4" />
                <span>{currentTranslations.sidebarProfile || "Profile"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => isMobileView && onToggle()}>
              <Link href="/dashboard/settings">
                <Settings2 className="mr-2 h-4 w-4" />
                <span>{currentTranslations.sidebarSettings || "Settings"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {handleLogout(); if(isMobileView) onToggle();}} className="text-destructive focus:bg-destructive/30 focus:text-destructive-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{currentTranslations.sidebarLogout || "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  if (isMobileView) {
    return <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">{sidebarContent}</div>;
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-20" 
    )}>
      {sidebarContent}
    </aside>
  );
}
