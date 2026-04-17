"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass =
  "mt-1 w-full rounded-xl border border-bz-border bg-bz-surface px-4 py-3 text-bz-ink shadow-sm transition-colors placeholder:text-bz-subtle/70 focus:border-bz-primary focus:outline-none focus:ring-2 focus:ring-bz-accent/45";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signError) {
      setLoading(false);
      setError(signError.message);
      return;
    }

    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    if (!sessionUser) {
      setLoading(false);
      setError("Could not load session.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", sessionUser.id)
      .single();

    setLoading(false);
    const role = profile?.role as "business" | "collector" | undefined;
    let dest = "/";
    if (nextParam?.startsWith("/")) {
      dest = nextParam;
    } else if (role === "business") {
      dest = "/business/dashboard";
    } else if (role === "collector") {
      dest = "/collector/map";
    }
    router.push(dest);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-bz-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-bz-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" loading={loading}>
        Log in
      </Button>

      <p className="text-center text-sm text-bz-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-bz-primary underline decoration-bz-accent decoration-2 underline-offset-2 hover:text-bz-primary-hover">
          Sign up
        </Link>
      </p>
    </form>
  );
}
