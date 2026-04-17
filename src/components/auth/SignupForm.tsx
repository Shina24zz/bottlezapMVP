"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Role = "business" | "collector";

const inputClass =
  "mt-1 w-full rounded-xl border border-bz-border bg-bz-surface px-4 py-3 text-bz-ink shadow-sm transition-colors placeholder:text-bz-subtle/70 focus:border-bz-primary focus:outline-none focus:ring-2 focus:ring-bz-accent/45";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>("collector");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "business" || r === "collector") setRole(r);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    const dest = role === "business" ? "/business/dashboard" : "/collector/map";
    router.push(dest);
    router.refresh();
  }

  const roleBase =
    "flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-center text-sm font-semibold transition";
  const roleActive = "border-bz-primary bg-bz-accent-soft text-bz-primary shadow-sm ring-1 ring-bz-border-strong/50";
  const roleIdle =
    "border-bz-border bg-bz-surface text-bz-muted hover:border-bz-border-strong hover:bg-bz-accent-wash hover:text-bz-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-bz-primary">I am a</legend>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`${roleBase} ${role === "business" ? roleActive : roleIdle}`}
          >
            <input
              type="radio"
              name="role"
              className="sr-only"
              checked={role === "business"}
              onChange={() => setRole("business")}
            />
            Business
          </label>
          <label
            className={`${roleBase} ${role === "collector" ? roleActive : roleIdle}`}
          >
            <input
              type="radio"
              name="role"
              className="sr-only"
              checked={role === "collector"}
              onChange={() => setRole("collector")}
            />
            Collector
          </label>
        </div>
      </fieldset>

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
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-bz-subtle">At least 6 characters.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" loading={loading}>
        Create account
      </Button>

      <p className="text-center text-sm text-bz-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-bz-primary underline decoration-bz-accent decoration-2 underline-offset-2 hover:text-bz-primary-hover">
          Log in
        </Link>
      </p>
    </form>
  );
}
