
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

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/maintenance/daily', label: 'Daily Maintenance', icon: CalendarDays },
  { href: '/dashboard/maintenance/weekly', label: 'Weekly Maintenance', icon: CalendarCheck2 },
  { href: '/dashboard/maintenance/monthly', label: 'Monthly Maintenance', icon: CalendarClock },
  { href: '/dashboard/inventory', label: 'Inventory Maintenance', icon: ClipboardList },
  { href: '/dashboard/stock', label: 'Component Stock', icon: Archive },
  { href: '/dashboard/manuals', label: 'Manuals', icon: BookOpenText },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    console.log("User logged out");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/'); // Redirect to login page
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-20"
    )}>
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-6 transition-colors hover:bg-sidebar-accent",
          isOpen ? "justify-center" : "justify-center px-0", // Adjust padding when collapsed
          "cursor-pointer"
        )}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <Logo iconSize={6} textSize="text-xl" hideText={!isOpen} />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2"> {/* Reduced padding for nav */}
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start",
                pathname === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !isOpen && "justify-center h-12 w-12 p-0" // Centered icon, fixed size when collapsed
              )}
              title={item.label} // Tooltip for collapsed state
            >
              <item.icon className={cn("mr-3 h-5 w-5", !isOpen && "mr-0")} />
              {isOpen && item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <Separator className="bg-sidebar-border" />
      <div className={cn("p-2", !isOpen && "p-1")}> {/* Reduced padding for footer */}
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
                <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {isOpen && <span className="flex-1 text-left">User Name</span>}
              {isOpen && <ChevronDown className="ml-auto h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-1" side={isOpen ? "top" : "right"} align={isOpen ? "start" : "center"} sideOffset={isOpen ? 0 : 8}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle2 className="mr-2 h-4 w-4" />
              <span>Profile</span>
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
