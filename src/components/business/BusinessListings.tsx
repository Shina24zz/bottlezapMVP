"use client";

import { completeListing } from "@/app/actions/listings";
import type { ListingRow, ListingStatus } from "@/types/listings";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  listings: ListingRow[];
};

function statusBadge(status: ListingStatus) {
  const map: Record<ListingStatus, string> = {
    active:
      "border border-bz-border-strong/70 bg-bz-accent-soft text-bz-primary shadow-sm",
    claimed: "border border-amber-200/90 bg-amber-50 text-amber-900",
    completed: "border border-bz-border bg-bz-accent-wash text-bz-muted",
  };
  return map[status];
}

export function BusinessListings({ listings }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function markComplete(id: string) {
    setError(null);
    setLoadingId(id);
    const res = await completeListing(id);
    setLoadingId(null);
    if (res.error) setError(res.error);
    else router.refresh();
  }

  if (listings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-bz-border-strong bg-bz-accent-wash/80 px-4 py-8 text-center text-sm text-bz-muted">
        No listings yet. Post your first batch of bottles above.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {error ? (
        <li className="rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800">{error}</li>
      ) : null}
      {listings.map((l) => (
        <li
          key={l.id}
          className="rounded-2xl border border-bz-border bg-bz-surface p-4 shadow-md shadow-bz-primary/5 transition hover:border-bz-border-strong sm:flex sm:items-start sm:justify-between sm:gap-4"
        >
          <div>
            <h3 className="font-heading font-bold text-bz-primary">{l.business_name}</h3>
            <p className="mt-1 text-sm text-bz-muted">{l.address}</p>
            <p className="mt-2 text-sm text-bz-ink">
              <span className="font-semibold text-bz-primary">{l.bottle_count}</span> bottles ·{" "}
              {l.bottle_types.join(", ")}
            </p>
            <p className="mt-1 text-sm text-bz-subtle">
              Reward: {l.reward_offer || "—"} · {l.collection_window || "—"}
            </p>
            <p
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadge(l.status)}`}
            >
              {l.status}
            </p>
          </div>
          {l.status !== "completed" ? (
            <div className="mt-4 shrink-0 sm:mt-0">
              <Button
                variant="outline"
                loading={loadingId === l.id}
                onClick={() => markComplete(l.id)}
                className="!text-sm"
              >
                Mark completed
              </Button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
