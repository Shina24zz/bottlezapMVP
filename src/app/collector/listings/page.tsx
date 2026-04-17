import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { CollectorListingsView } from "@/components/collector/CollectorListingsView";

export default function CollectorListingsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <DashboardNav role="collector" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-2xl font-bold text-bz-primary sm:text-3xl">
          All listings
        </h1>
        <p className="mt-2 text-sm text-bz-muted">
          Browse active pickups sorted by distance when location is available.
        </p>
        <div className="mt-8">
          <CollectorListingsView />
        </div>
      </main>
    </div>
  );
}
