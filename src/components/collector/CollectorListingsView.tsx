"use client";

import { createClient } from "@/lib/supabase/client";
import { distanceKm, formatDistance } from "@/lib/distance";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { ListingRow } from "@/types/listings";
import { useEffect, useMemo, useState } from "react";
import { ClaimButton } from "./ClaimButton";

const DRS_PER_BOTTLE = 0.15;

export function CollectorListingsView() {
  const { position: userPos, error: locError, loading: locLoading } = useUserLocation();
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  function removeListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) setLoadError(error.message);
      else setListings((data ?? []) as ListingRow[]);
    })();
  }, []);

  const sorted = useMemo(() => {
    if (!userPos) return listings;
    return [...listings].sort((a, b) => {
      const da = distanceKm(userPos, { lat: a.lat, lng: a.lng });
      const db = distanceKm(userPos, { lat: b.lat, lng: b.lng });
      return da - db;
    });
  }, [listings, userPos]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-bz-border-strong/50 bg-bz-accent-soft/90 px-4 py-3 text-sm text-bz-ink">
        {locLoading ? (
          <p>Getting your location...</p>
        ) : locError ? (
          <p className="text-bz-muted">{locError} Listings are unsorted by distance.</p>
        ) : (
          <p>Sorted by distance from you.</p>
        )}
      </div>

      {loadError ? (
        <p className="rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800" role="alert">
          {loadError}
        </p>
      ) : null}

      <ul className="space-y-4">
        {sorted.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-bz-border-strong bg-bz-accent-wash/60 px-6 py-12 text-center text-sm text-bz-muted">
            No active listings right now. Check back soon.
          </li>
        ) : (
          sorted.map((l) => {
            const dist =
              userPos != null
                ? formatDistance(distanceKm(userPos, { lat: l.lat, lng: l.lng }))
                : "—";
            const earnings = l.bottle_count * DRS_PER_BOTTLE;
            return (
              <li
                key={l.id}
                className="rounded-2xl border border-bz-border bg-bz-surface p-5 shadow-md shadow-bz-primary/5 transition hover:border-bz-border-strong"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-bz-primary">
                      {l.business_name}
                    </h2>
                    <p className="mt-1 text-sm text-bz-muted">{l.address}</p>
                    <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-bz-subtle">Bottles</dt>
                        <dd className="font-semibold text-bz-ink">{l.bottle_count}</dd>
                      </div>
                      <div>
                        <dt className="text-bz-subtle">Est. DRS</dt>
                        <dd className="font-semibold text-bz-primary">€{earnings.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-bz-subtle">Distance</dt>
                        <dd className="font-semibold text-bz-ink">{dist}</dd>
                      </div>
                      <div>
                        <dt className="text-bz-subtle">Types</dt>
                        <dd className="text-bz-ink">{l.bottle_types.join(", ")}</dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-sm text-bz-ink">
                      <span className="text-bz-subtle">Reward: </span>
                      {l.reward_offer || "—"}
                    </p>
                    <p className="text-sm text-bz-ink">
                      <span className="text-bz-subtle">Window: </span>
                      {l.collection_window || "—"}
                    </p>
                  </div>
                  <div className="w-full shrink-0 sm:w-48">
                    <ClaimButton listingId={l.id} onClaimed={removeListing} />
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
