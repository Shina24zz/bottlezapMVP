import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { NewListingForm } from "@/components/business/NewListingForm";
import { BusinessListings } from "@/components/business/BusinessListings";
import type { ListingRow } from "@/types/listings";
import { redirect } from "next/navigation";

export default async function BusinessDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: rows } = await supabase
    .from("listings")
    .select("*")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  const listings = (rows ?? []) as ListingRow[];

  return (
    <div className="flex min-h-full flex-col">
      <DashboardNav role="business" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-2xl font-bold text-bz-primary sm:text-3xl">
          Business dashboard
        </h1>
        <p className="mt-2 text-sm text-bz-muted">
          Post bottles for collection and mark pickups as done when they&apos;re finished.
        </p>

        <section className="mt-10 rounded-2xl border border-bz-border bg-bz-surface p-6 shadow-md shadow-bz-primary/5">
          <h2 className="font-heading text-lg font-bold text-bz-primary">New listing</h2>
          <p className="mt-1 text-sm text-bz-muted">
            We geocode your address so collectors can find you on the map.
          </p>
          <div className="mt-6">
            <NewListingForm />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-lg font-bold text-bz-primary">Your listings</h2>
          <div className="mt-4">
            <BusinessListings listings={listings} />
          </div>
        </section>
      </main>
    </div>
  );
}
