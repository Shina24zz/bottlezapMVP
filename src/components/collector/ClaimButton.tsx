"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  listingId: string;
  onClaimed?: (listingId: string) => void;
};

export function ClaimButton({ listingId, onClaimed }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function claim() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/listings/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not claim listing.");
        setLoading(false);
        return;
      }
      onClaimed?.(listingId);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button className="w-full" loading={loading} onClick={claim}>
        Claim this collection
      </Button>
    </div>
  );
}
