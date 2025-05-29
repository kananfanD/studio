
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
  // Wrench, // No longer used for a general maintenance link
  Menu as MenuIcon,
  Sunrise, // For Daily Maintenance
  CalendarDays, // For Weekly Maintenance
  CalendarRange // For Monthly Maintenance
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
import { useState, useEffect } from 'react';

type UserRole = "operator" | "maintenance" | "warehouse" | null;

const allNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['operator', 'maintenance', 'warehouse'] },
  // { href: '/dashboard/maintenance', label: 'Maintenance Tasks', icon: Wrench, roles: ['operator', 'maintenance'] }, // Removed
  { href: '/dashboard/maintenance/daily', label: 'Daily Maintenance', icon: Sunrise, roles: ['operator', 'maintenance'] },
  { href: '/dashboard/maintenance/weekly', label: 'Weekly Maintenance', icon: CalendarDays, roles: ['operator', 'maintenance'] },
  { href: '/dashboard/maintenance/monthly', label: 'Monthly Maintenance', icon: CalendarRange, roles: ['operator', 'maintenance'] },
  { href: '/dashboard/inventory', label: 'Maintenance Log', icon: ClipboardList, roles: ['maintenance'] },
  { href: '/dashboard/stock', label: 'Component Stock', icon: Archive, roles: ['warehouse', 'maintenance'] },
  { href: '/dashboard/manuals', label: 'Manuals', icon: BookOpenText, roles: ['operator', 'maintenance'] },
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

  const showText = isMobileView ? true : isOpen;


  const loadProfile = () => {
    if (typeof window !== 'undefined') {
      const storedProfileString = localStorage.getItem("userProfile");
      if (storedProfileString) {
        try {
          const storedProfile: UserProfile = JSON.parse(storedProfileString);
          setUserName(storedProfile.name || DEFAULT_USER_NAME);
          setUserAvatarUrl(storedProfile.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER);
        } catch (e) {
          console.error("Failed to parse userProfile from localStorage in sidebar", e);
          setUserName(DEFAULT_USER_NAME);
          setUserAvatarUrl(DEFAULT_AVATAR_PLACEHOLDER);
        }
      } else {
          setUserName(DEFAULT_USER_NAME);
          setUserAvatarUrl(DEFAULT_AVATAR_PLACEHOLDER);
      }
    }
  };

  useEffect(() => {
    loadProfile(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userProfile' || event.key === 'userRole') { 
        loadProfile();
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
      title: "Logged Out",
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
        {visibleNavItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start",
                pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !showText && "justify-center h-12 w-12 p-0" 
              )}
              title={item.label}
              onClick={() => isMobileView && onToggle()} 
            >
              <item.icon className={cn("mr-3 h-5 w-5", !showText && "mr-0")} />
              {showText && item.label}
            </Button>
          </Link>
        ))}
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
              title="My Account"
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => isMobileView && onToggle()}>
              <Link href="/dashboard/profile">
                <UserCircle2 className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { alert('Settings page not implemented.'); if(isMobileView) onToggle();}}>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {handleLogout(); if(isMobileView) onToggle();}} className="text-destructive focus:bg-destructive/30 focus:text-destructive-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
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
