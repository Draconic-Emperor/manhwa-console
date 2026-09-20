import type { Id } from "@/convex/_generated/dataModel";

/* ---------- Types mirroring the Manhwa Console data ---------- */

export type ManhwaStatus = "ongoing" | "completed" | "hiatus";

export type Manhwa = {
  _id: Id<"manhwa">;
  title: string;
  author: string;
  description: string;
  status: ManhwaStatus;
  rank: number;
  cover_image?: string | null;
  genre?: string;
  created_at: number;
};

export type Character = {
  _id: Id<"characters">;
  name: string;
  role: string;
  description: string;
  rank: number;
  image_url?: string | null;
  manhwa_id: Id<"manhwa">;
};

export type InsightType = "theory" | "review" | "lore" | "analysis";

export type Insight = {
  _id: Id<"insights">;
  character_id: Id<"characters">;
  type: InsightType;
  title: string;
  content: string;
  created_at: number;
};

export type Favorite = {
  _id: Id<"favorites">;
  user_id: Id<"users">;
  item_id: Id<"manhwa"> | Id<"characters">;
  item_kind: "manhwa" | "character";
  created_at: number;
};

/* ---------- Display helpers ---------- */

export const STATUS_LABEL: Record<ManhwaStatus, string> = {
  ongoing: "Active Record",
  completed: "Sealed Record",
  hiatus: "Dormant Record",
};

export const STATUS_CLASS: Record<ManhwaStatus, string> = {
  ongoing: "bg-crimson/15 text-[#e59aa3] border-crimson/40",
  completed: "bg-[#7d9c6a]/12 text-[#a9c494] border-[#7d9c6a]/35",
  hiatus: "bg-gold/12 text-[#e8c96a] border-gold/35",
};

export const INSIGHT_LABEL: Record<InsightType, string> = {
  theory: "Theory",
  review: "Review",
  lore: "Lore",
  analysis: "Analysis",
};

export const INSIGHT_CLASS: Record<InsightType, string> = {
  theory: "bg-crimson/15 text-[#eda3ac] border-crimson/45",
  review: "bg-gold/12 text-gold border-gold/35",
  lore: "bg-[#7d9c6a]/12 text-[#a9c494] border-[#7d9c6a]/35",
  analysis: "bg-white/6 text-text-2 border-white/12",
};

/** Rank tiers: named power bands so colors never carry meaning alone. */
export function rankTier(rank: number): {
  label: string;
  text: string;
  border: string;
  bg: string;
  glow: string;
} {
  if (rank <= 10)
    return {
      label: "Mythic",
      text: "text-[#f0dd9a]",
      border: "border-gold/45",
      bg: "bg-gold/12",
      glow: "shadow-[0_0_18px_-4px_var(--gold-glow)]",
    };
  if (rank <= 25)
    return {
      label: "Legendary",
      text: "text-[#eda3ac]",
      border: "border-crimson/50",
      bg: "bg-crimson/15",
      glow: "shadow-[0_0_18px_-4px_var(--crimson-glow)]",
    };
  if (rank <= 50)
    return {
      label: "Elite",
      text: "text-gold",
      border: "border-gold/35",
      bg: "bg-gold/10",
      glow: "",
    };
  return {
    label: "Rising",
    text: "text-text-2",
    border: "border-white/15",
    bg: "bg-white/5",
    glow: "",
  };
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function fullDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

/** Deterministic tailwind gradient class pair for fallback panels. */
export function auraFor(seed: string): string {
  const options = [
    "from-crimson/30 via-gold/8 to-transparent",
    "from-gold/20 via-crimson/10 to-transparent",
    "from-[#7d9c6a]/20 via-crimson/10 to-transparent",
    "from-crimson/25 via-gold/6 to-transparent",
    "from-gold/15 via-crimson/12 to-transparent",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}
