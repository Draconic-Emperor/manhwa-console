import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorite } from "@/hooks/use-codex";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  kind,
  id,
  title,
  className,
}: {
  kind: "manhwa" | "character";
  id: Id<"manhwa"> | Id<"characters">;
  title: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorite();
  const [pop, setPop] = useState(false);
  const saved = isFavorite(kind, id);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Release “${title}” from your collection` : `Seal “${title}” into your collection`}
      title={saved ? "Release from your collection" : "Seal into your collection"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setPop(true);
        window.setTimeout(() => setPop(false), 450);
        void toggleFavorite(kind, id, title);
      }}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border backdrop-blur transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        saved
          ? "border-crimson/60 bg-crimson/25 text-[#f2b8bb] shadow-[0_0_16px_-4px_var(--crimson-glow)]"
          : "border-amethyst/30 bg-obsidian/60 text-parchment/85 hover:border-crimson/50 hover:text-[#f2b8bb]",
        pop && "record-pop",
        className,
      )}
    >
      <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
    </button>
  );
}
