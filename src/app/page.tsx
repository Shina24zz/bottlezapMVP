import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-bz-accent-wash via-bz-hero-mid to-bz-canvas px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-bz-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-bz-accent-bright/40 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-block rounded-full border border-bz-border-strong/60 bg-bz-surface/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-bz-primary shadow-sm backdrop-blur-sm">
              Ireland&apos;s Deposit Return Scheme
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-bz-primary sm:text-5xl md:text-6xl">
              BottleZap
            </h1>
            <p className="mt-4 text-lg text-bz-ink/90 sm:text-xl">
              Turn empty bottles into money
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-bz-muted">
              Restaurants, pubs, and hotels list bottles for pickup. Collectors earn €0.15 per
              bottle at the recycling point — everyone wins, sustainably.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup?role=business"
                className="inline-flex items-center justify-center rounded-2xl bg-bz-primary px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-bz-primary/25 transition hover:bg-bz-primary-hover hover:shadow-bz-primary/30"
              >
                I&apos;m a Business
              </Link>
              <Link
                href="/signup?role=collector"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-bz-primary/25 bg-bz-surface px-8 py-4 text-center text-base font-semibold text-bz-primary shadow-sm transition hover:border-bz-accent-bright hover:bg-bz-accent-soft"
              >
                I&apos;m a Collector
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-bold text-bz-primary sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Business posts",
                body: "List how many bottles you have, what types, and when collectors can stop by.",
              },
              {
                step: "2",
                title: "Collector finds",
                body: "Browse the map or list, see distance and DRS earnings, then claim a pickup.",
              },
              {
                step: "3",
                title: "Everyone wins",
                body: "Bottles get recycled, collectors earn rewards, and businesses stay clutter-free.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-bz-border bg-bz-surface p-6 shadow-md shadow-bz-primary/5 transition hover:border-bz-border-strong hover:shadow-lg hover:shadow-bz-primary/8"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bz-accent-soft font-heading text-xl font-bold text-bz-primary">
                  {item.step}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-bz-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bz-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-bz-primary via-bz-primary to-bz-primary-deep px-4 py-16 text-center text-white sm:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Ready to zap those bottles?</h2>
            <p className="mt-3 text-bz-accent-wash/95">
              Join BottleZap — friendly, energetic, and built for a greener Ireland.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex justify-center rounded-2xl bg-bz-accent-bright px-8 py-4 font-semibold text-bz-primary shadow-md transition hover:bg-bz-surface hover:shadow-lg"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center rounded-2xl border-2 border-white/35 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:border-bz-accent/60 hover:bg-white/15"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-bz-border bg-bz-elevated/90 py-6 text-center text-xs text-bz-subtle">
        BottleZap — DRS bottles worth €0.15 each at return points. Not affiliated with Re-turn or any scheme operator.
      </footer>
    </div>
  );
}
