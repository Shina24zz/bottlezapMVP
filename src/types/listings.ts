export type ListingStatus = "active" | "claimed" | "completed";

export type BottleType =
  | "Beer"
  | "Wine"
  | "Water"
  | "Soft Drink"
  | "Spirits"
  | "Juice";

export const BOTTLE_TYPES: BottleType[] = [
  "Beer",
  "Wine",
  "Water",
  "Soft Drink",
  "Spirits",
  "Juice",
];

export type ListingRow = {
  id: string;
  created_at: string;
  business_id: string;
  business_email: string;
  business_name: string;
  address: string;
  lat: number;
  lng: number;
  bottle_count: number;
  bottle_types: string[];
  reward_offer: string;
  collection_window: string;
  status: ListingStatus;
  claimed_by: string | null;
  claimed_at: string | null;
};
