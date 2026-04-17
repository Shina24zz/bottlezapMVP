"use client";

import { createListing } from "@/app/actions/listings";
import { BOTTLE_TYPES } from "@/types/listings";
import { Button } from "@/components/ui/Button";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" loading={pending}>
      Post listing
    </Button>
  );
}

const initial = {} as { error?: string; ok?: boolean };

const inputClass =
  "mt-1 w-full rounded-xl border border-bz-border bg-bz-surface px-4 py-3 text-bz-ink shadow-sm transition-colors placeholder:text-bz-subtle/70 focus:border-bz-primary focus:outline-none focus:ring-2 focus:ring-bz-accent/45";

export function NewListingForm() {
  const [state, formAction] = useActionState(createListing, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state?.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div>
        <label htmlFor="business_name" className="block text-sm font-medium text-bz-ink">
          Business name
        </label>
        <input id="business_name" name="business_name" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-bz-ink">
          Address
        </label>
        <input
          id="address"
          name="address"
          required
          placeholder="Street, area, Dublin"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bottle_count" className="block text-sm font-medium text-bz-ink">
          Number of bottles (min 10)
        </label>
        <input
          id="bottle_count"
          name="bottle_count"
          type="number"
          min={10}
          step={1}
          defaultValue={10}
          required
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-bz-ink">Bottle types</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BOTTLE_TYPES.map((t) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-bz-border bg-bz-surface px-3 py-2.5 text-sm text-bz-ink transition hover:border-bz-border-strong hover:bg-bz-accent-wash"
            >
              <input
                type="checkbox"
                name="bottle_types"
                value={t}
                className="rounded border-bz-border-strong text-bz-primary focus:ring-bz-accent/50"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="reward_offer" className="block text-sm font-medium text-bz-ink">
          Reward offer for collector
        </label>
        <input
          id="reward_offer"
          name="reward_offer"
          placeholder="e.g. Free coffee, 10% off meal"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="collection_window" className="block text-sm font-medium text-bz-ink">
          Collection window
        </label>
        <input
          id="collection_window"
          name="collection_window"
          placeholder="e.g. Mon–Fri 9am–5pm"
          className={inputClass}
        />
      </div>

      {state?.error ? (
        <p className="rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p
          className="rounded-xl border border-bz-border-strong/60 bg-bz-accent-soft px-4 py-3 text-sm font-medium text-bz-primary"
          role="status"
        >
          Listing posted successfully.
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
