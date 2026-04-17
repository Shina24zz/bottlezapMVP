import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  let listingId: string;
  try {
    const body = (await request.json()) as { listingId?: string };
    listingId = String(body.listingId ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!listingId) {
    return NextResponse.json({ error: "listingId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "collector") {
    return NextResponse.json({ error: "Only collectors can claim" }, { status: 403 });
  }

  const { error: rpcError } = await supabase.rpc("claim_listing", {
    p_listing_id: listingId,
  });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 400 });
  }

  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select(
      "business_name, bottle_count, business_email, reward_offer, collection_window, address",
    )
    .eq("id", listingId)
    .single();

  if (fetchError || !listing) {
    return NextResponse.json({ ok: true, emailed: false });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "BottleZap <onboarding@resend.dev>";

  if (apiKey && listing.business_email) {
    const resend = new Resend(apiKey);
    const bottleCount = listing.bottle_count as number;
    const businessName = listing.business_name as string;
    await resend.emails.send({
      from,
      to: listing.business_email,
      subject: "Someone is coming to collect your bottles!",
      text:
        `Great news! A collector has claimed your listing at ${businessName} and is on their way. ` +
        `They will collect ${bottleCount} bottles. ` +
        `Listing will be marked as completed once done.`,
    });
  }

  return NextResponse.json({ ok: true });
}
