import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-bz-border bg-bz-surface/85 shadow-sm shadow-bz-primary/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-bz-primary">
          BottleZap
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 font-medium text-bz-muted transition hover:bg-bz-accent-soft hover:text-bz-primary"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-bz-primary px-4 py-2 font-semibold text-white shadow-md shadow-bz-primary/20 transition hover:bg-bz-primary-hover"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
