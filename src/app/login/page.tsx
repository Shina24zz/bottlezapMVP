import { LoginForm } from "@/components/auth/LoginForm";
import { SiteHeader } from "@/components/SiteHeader";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <h1 className="text-center font-heading text-3xl font-bold text-bz-primary">Log in</h1>
        <p className="mt-2 text-center text-sm text-bz-muted">
          Welcome back — we&apos;ll send you to the right dashboard.
        </p>
        <div className="mt-8 rounded-2xl border border-bz-border bg-bz-surface p-6 shadow-md shadow-bz-primary/5">
          <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-bz-accent-soft" />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
