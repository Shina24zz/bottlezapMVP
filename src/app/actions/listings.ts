"use server";

import { createClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";
import { BOTTLE_TYPES, type BottleType } from "@/types/listings";
import { revalidatePath } from "next/cache";

function parseBottleTypes(formData: FormData): string[] {
  const raw = formData.getAll("bottle_types") as string[];
  return raw.filter((x): x is BottleType =>
    typeof x === "string" && (BOTTLE_TYPES as string[]).includes(x),
  );
}

export async function createListing(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { error: "You must be signed in to post a listing." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "business") {
    return { error: "Only business accounts can post listings." };
  }

  const businessName = String(formData.get("business_name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const bottleCount = Number(formData.get("bottle_count"));
  const rewardOffer = String(formData.get("reward_offer") ?? "").trim();
  const collectionWindow = String(formData.get("collection_window") ?? "").trim();
  const bottleTypes = parseBottleTypes(formData);

  if (!businessName || !address) {
    return { error: "Business name and address are required." };
  }
  if (!Number.isFinite(bottleCount) || bottleCount < 10) {
    return { error: "Number of bottles must be at least 10." };
  }
  if (bottleTypes.length === 0) {
    return { error: "Select at least one bottle type." };
  }

  const geo = await geocodeAddress(address);
  if (!geo) {
    return {
      error:
        "Could not find that address on the map. Check the spelling or add more detail (e.g. city).",
    };
  }

  const { error } = await supabase.from("listings").insert({
    business_id: user.id,
    business_email: user.email,
    business_name: businessName,
    address,
    lat: geo.lat,
    lng: geo.lng,
    bottle_count: Math.floor(bottleCount),
    bottle_types: bottleTypes,
    reward_offer: rewardOffer,
    collection_window: collectionWindow,
    status: "active",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/business/dashboard");
  return { ok: true };
}

export async function completeListing(listingId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("listings")
    .update({ status: "completed" })
    .eq("id", listingId)
    .eq("business_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/business/dashboard");
  return {};
}
