import { BookOpen, Star, Users } from "lucide-react";
import type { Manhwa } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { LinkCard, RankBadge, StatusPill } from "@/components/ui/codex";
import { FavoriteButton } from "./FavoriteButton";

export function ManhwaCard({ manhwa, charCount }: { manhwa: Manhwa; charCount: number }) {
  return (
    <LinkCard
      to={`/manhwa/${manhwa._id}`}
      label={`Open archive entry: ${manhwa.title}`}
      className="group flex flex-col"
    >
      <div className="media-zoom relative aspect-[2/3] w-full">
        <CoverImage src={manhwa.cover_image} seed={manhwa._id} ratio="portrait" alt="" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/15 to-transparent"
        />
        {/* Rank + status badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          <RankBadge rank={manhwa.rank} />
        </div>
        <div className="absolute right-2.5 top-2.5">
          <FavoriteButton kind="manhwa" id={manhwa._id} title={manhwa.title} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <StatusPill status={manhwa.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="font-display line-clamp-2 text-[15px] font-semibold leading-snug text-parchment transition-colors group-hover:text-amethyst">
          {manhwa.title}
        </h3>
        <p className="truncate text-xs text-text-3">{manhwa.author}</p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] text-text-3">
          <span className="inline-flex items-center gap-1" title={`${charCount} cataloged entities`}>
            <Users className="size-3.5" aria-hidden="true" />
            {charCount}
          </span>
          {manhwa.genre && (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" aria-hidden="true" />
              {manhwa.genre}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 tabular-nums" title="Archive rank">
            <Star className="size-3.5 text-amethyst" aria-hidden="true" />#{manhwa.rank}
          </span>
        </div>
      </div>
    </LinkCard>
  );
}
