import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { CollectorMap } from "@/components/collector/CollectorMap";

export default function CollectorMapPage() {
  return (
    <div className="flex min-h-full flex-col">
      <DashboardNav role="collector" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-2xl font-bold text-bz-primary sm:text-3xl">
          Collection map
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-bz-muted">
          Active listings appear as green pins. Allow location access to see distance from you.
        </p>
        <div className="mt-8">
          <CollectorMap />
        </div>
      </main>
    </div>
  );
}
