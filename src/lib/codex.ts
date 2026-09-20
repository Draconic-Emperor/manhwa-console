import type { Id } from "@/convex/_generated/dataModel";

/* ---------- Types mirroring the original Manhwa Codex data ---------- */

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
  ongoing: "Ongoing",
  completed: "Completed",
  hiatus: "Hiatus",
};

export const STATUS_CLASS: Record<ManhwaStatus, string> = {
  ongoing: "bg-violet-soft text-violet-bright border-violet/30",
  completed: "bg-emerald-500/12 text-emerald-300 border-emerald-400/30",
  hiatus: "bg-amber-500/12 text-amber-300 border-amber-400/30",
};

export const INSIGHT_LABEL: Record<InsightType, string> = {
  theory: "Theory",
  review: "Review",
  lore: "Lore",
  analysis: "Analysis",
};

export const INSIGHT_CLASS: Record<InsightType, string> = {
  theory: "bg-fuchsia-500/12 text-fuchsia-300 border-fuchsia-400/30",
  review: "bg-violet-soft text-violet-bright border-violet/30",
  lore: "bg-cyan-500/12 text-cyan-300 border-cyan-400/30",
  analysis: "bg-amber-500/12 text-amber-300 border-amber-400/30",
};

/** Rank tiers: named power bands so colors never carry meaning alone. */
export function rankTier(rank: number): { label: string; text: string; border: string; bg: string; glow: string } {
  if (rank <= 10)
    return {
      label: "Mythic",
      text: "text-amber-300",
      border: "border-amber-400/40",
      bg: "bg-amber-400/12",
      glow: "shadow-[0_0_18px_-4px_var(--gold-glow)]",
    };
  if (rank <= 25)
    return {
      label: "Legendary",
      text: "text-fuchsia-300",
      border: "border-fuchsia-400/40",
      bg: "bg-fuchsia-400/12",
      glow: "shadow-[0_0_18px_-4px_var(--magenta-glow)]",
    };
  if (rank <= 50)
    return {
      label: "Elite",
      text: "text-violet-bright",
      border: "border-violet-400/40",
      bg: "bg-violet-400/12",
      glow: "",
    };
  return {
    label: "Rising",
    text: "text-sky-300",
    border: "border-sky-400/40",
    bg: "bg-sky-400/12",
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
    "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    "from-fuchsia-500/25 via-violet-500/10 to-transparent",
    "from-amber-400/20 via-fuchsia-500/10 to-transparent",
    "from-sky-500/20 via-violet-500/10 to-transparent",
    "from-emerald-500/20 via-violet-500/10 to-transparent",
    "from-rose-500/20 via-amber-400/10 to-transparent",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}
