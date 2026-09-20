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
      aria-label={saved ? `Remove “${title}” from your Codex` : `Save “${title}” to your Codex`}
      title={saved ? "Remove from your Codex" : "Save to your Codex"}
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
          ? "border-rose-400/50 bg-rose-500/20 text-rose-300 shadow-[0_0_16px_-4px_rgba(251,113,133,0.6)]"
          : "border-white/15 bg-black/40 text-white/80 hover:border-rose-400/40 hover:text-rose-300",
        pop && "heart-pop",
        className,
      )}
    >
      <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
    </button>
  );
}
