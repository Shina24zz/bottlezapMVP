"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  role: "business" | "collector";
};

export function DashboardNav({ role }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  const linkClass =
    "rounded-xl px-3 py-2 font-medium text-bz-muted transition hover:bg-bz-accent-soft hover:text-bz-primary";

  return (
    <header className="border-b border-bz-border bg-bz-surface/90 shadow-sm shadow-bz-primary/5 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight text-bz-primary">
          BottleZap
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm sm:gap-2">
          {role === "collector" ? (
            <>
              <Link href="/collector/map" className={linkClass}>
                Map
              </Link>
              <Link href="/collector/listings" className={linkClass}>
                Listings
              </Link>
            </>
          ) : (
            <Link href="/business/dashboard" className={linkClass}>
              Dashboard
            </Link>
          )}
          <Button variant="outline" loading={loading} onClick={signOut} className="!py-2 !text-sm">
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
