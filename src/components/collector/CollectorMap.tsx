"use client";

import { createClient } from "@/lib/supabase/client";
import { DUBLIN_CENTER, GREEN_PIN_URL } from "@/lib/maps-constants";
import { distanceKm, formatDistance } from "@/lib/distance";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { ListingRow } from "@/types/listings";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { ClaimButton } from "./ClaimButton";

const DRS_PER_BOTTLE = 0.15;

export function CollectorMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { position: userPos, error: locError, loading: locLoading } = useUserLocation();
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ListingRow | null>(null);

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

  const selectedMeta = useMemo(() => {
    if (!selected) return null;
    const earnings = selected.bottle_count * DRS_PER_BOTTLE;
    let distanceLabel = "—";
    if (userPos) {
      distanceLabel = formatDistance(
        distanceKm(userPos, { lat: selected.lat, lng: selected.lng }),
      );
    } else if (locLoading) {
      distanceLabel = "Locating…";
    } else if (locError) {
      distanceLabel = "Enable location";
    }
    return { earnings, distanceLabel };
  }, [selected, userPos, locLoading, locError]);

  if (!apiKey) {
    return (
      <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
        Add <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-amber-900">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
        to your environment.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:min-h-[70vh] lg:flex-row">
      <div
        className="relative h-[65vh] min-h-[420px] w-full flex-1 overflow-hidden rounded-2xl border border-bz-border bg-bz-accent-wash/50 shadow-inner shadow-bz-primary/5 lg:h-auto lg:min-h-[560px]"
        style={{ WebkitTransform: "translateZ(0)" }}
      >
        <APIProvider apiKey={apiKey} version="weekly">
          <Map
            defaultCenter={DUBLIN_CENTER}
            defaultZoom={12}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="h-full w-full"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            {listings.map((l) => (
              <Marker
                key={l.id}
                position={{ lat: l.lat, lng: l.lng }}
                title={`${l.business_name} · ${l.bottle_count} bottles`}
                icon={GREEN_PIN_URL}
                onClick={() => setSelected(l)}
              />
            ))}
          </Map>
        </APIProvider>
      </div>

      <aside
        className={`w-full shrink-0 rounded-2xl border border-bz-border bg-bz-surface p-5 shadow-md shadow-bz-primary/5 lg:w-[380px] ${
          selected ? "ring-2 ring-bz-accent ring-offset-2 ring-offset-bz-canvas" : ""
        }`}
      >
        {!selected ? (
          <div className="text-sm text-bz-muted">
            <p className="font-heading font-bold text-bz-primary">Pick a pin</p>
            <p className="mt-2 leading-relaxed">
              Tap a green pin to see bottle count, DRS value, distance, and rewards.
            </p>
            {locError ? (
              <p className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-amber-950">
                {locError} Distance won&apos;t show.
              </p>
            ) : null}
            {loadError ? (
              <p className="mt-3 rounded-lg border border-red-100 bg-red-50/90 px-3 py-2 text-red-800" role="alert">
                {loadError}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-heading text-lg font-bold text-bz-primary">
                  {selected.business_name}
                </h2>
                <p className="text-xs font-medium uppercase tracking-wide text-bz-subtle">Listing</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg px-2 py-1 text-sm font-medium text-bz-primary transition hover:bg-bz-accent-soft"
              >
                Close
              </button>
            </div>
            <p className="text-sm text-bz-muted">{selected.address}</p>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-bz-border/80 pb-2">
                <dt className="text-bz-subtle">Bottles</dt>
                <dd className="font-semibold text-bz-primary">{selected.bottle_count}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-bz-border/80 pb-2">
                <dt className="text-bz-subtle">Est. DRS earnings</dt>
                <dd className="font-semibold text-bz-primary">
                  €{selectedMeta?.earnings.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-bz-border/80 pb-2">
                <dt className="text-bz-subtle">Distance</dt>
                <dd className="font-semibold text-bz-ink">{selectedMeta?.distanceLabel}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-bz-border/80 pb-2">
                <dt className="text-bz-subtle">Types</dt>
                <dd className="text-right text-bz-ink">{selected.bottle_types.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-bz-subtle">Reward</dt>
                <dd className="mt-1 font-medium text-bz-ink">{selected.reward_offer || "—"}</dd>
              </div>
              <div>
                <dt className="text-bz-subtle">Collection window</dt>
                <dd className="mt-1 text-bz-ink">{selected.collection_window || "—"}</dd>
              </div>
            </dl>
            <ClaimButton
              listingId={selected.id}
              onClaimed={(id) => {
                setListings((prev) => prev.filter((x) => x.id !== id));
                setSelected(null);
              }}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
