
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  Archive,
  BookOpenText,
  LogOut,
  UserCircle2,
  ChevronDown,
  Settings2,
  ClipboardList,
  Wrench, // Added Wrench icon
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

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/maintenance', label: 'Maintenance Tasks', icon: Wrench }, // Consolidated menu
  { href: '/dashboard/inventory', label: 'Maintenance Log', icon: ClipboardList }, // Renamed for clarity
  { href: '/dashboard/stock', label: 'Component Stock', icon: Archive },
  { href: '/dashboard/manuals', label: 'Manuals', icon: BookOpenText },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface UserProfile {
  name: string;
  avatarUrl: string;
}

const DEFAULT_AVATAR_PLACEHOLDER = "https://placehold.co/40x40.png";
const DEFAULT_USER_NAME = "User Name";

export default function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [userAvatarUrl, setUserAvatarUrl] = useState(DEFAULT_AVATAR_PLACEHOLDER);

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
      if (event.key === 'userProfile') {
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
      // Optionally clear userProfile from localStorage on logout
      // localStorage.removeItem("userProfile"); 
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/'); 
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-20"
    )}>
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-6 transition-colors hover:bg-sidebar-accent",
          isOpen ? "justify-start" : "justify-center px-0", 
          "cursor-pointer"
        )}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <Logo iconSize={6} textSize="text-xl" hideText={!isOpen} className="ml-0" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start",
                pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !isOpen && "justify-center h-12 w-12 p-0" 
              )}
              title={item.label} 
            >
              <item.icon className={cn("mr-3 h-5 w-5", !isOpen && "mr-0")} />
              {isOpen && item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <Separator className="bg-sidebar-border" />
      <div className={cn("p-2", !isOpen && "p-1")}>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !isOpen && "justify-center h-12 w-12 p-0"
              )}
              title="My Account"
            >
              <Avatar className={cn("mr-3 h-8 w-8", !isOpen && "mr-0")}>
                <AvatarImage src={userAvatarUrl} alt={userName} data-ai-hint="user profile"/>
                <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              {isOpen && <span className="flex-1 text-left truncate">{userName}</span>}
              {isOpen && <ChevronDown className="ml-auto h-4 w-4 shrink-0" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-1" side={isOpen ? "top" : "right"} align={isOpen ? "start" : "center"} sideOffset={isOpen ? 0 : 8}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <UserCircle2 className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/30 focus:text-destructive-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
