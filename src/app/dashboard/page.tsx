import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { CalendarClock, AlertTriangle, PackageCheck, Wrench, PlusCircle, ListChecks, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome to EquipCare Hub. Here's a summary of your maintenance activities."
      >
        <Button asChild>
          <Link href="/dashboard/maintenance/daily/new"> {/* Example link */}
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Pending Daily Tasks"
          value="5"
          icon={CalendarClock}
          description="+2 since yesterday"
          className="bg-card border-primary/20"
          iconClassName="text-primary"
        />
        <StatCard
          title="Components Low Stock"
          value="3"
          icon={AlertTriangle}
          description="Order new parts soon"
          className="bg-card border-destructive/30"
          iconClassName="text-destructive"
        />
        <StatCard
          title="Completed This Week"
          value="12"
          icon={ListChecks}
          description="Weekly maintenance tasks"
          className="bg-card border-green-500/30"
          iconClassName="text-green-500"
        />
        <StatCard
          title="Machines Operational"
          value="98%"
          icon={CheckCircle2}
          description="Overall equipment effectiveness"
          className="bg-card border-blue-500/30"
          iconClassName="text-blue-500"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/maintenance/daily" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Daily Maintenance</h3>
                <p className="text-sm text-muted-foreground">View and manage daily tasks</p>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/stock" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <PackageCheck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Component Stock</h3>
                <p className="text-sm text-muted-foreground">Check inventory levels</p>
              </div>
            </Card>
          </Link>
           <Link href="/dashboard/manuals" className="block">
            <Card className="hover:bg-accent/50 transition-colors p-6 flex items-center gap-4 shadow-md">
              <BookOpenText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">Maintenance Manuals</h3>
                <p className="text-sm text-muted-foreground">Access PDF guides</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </>
  );
}
