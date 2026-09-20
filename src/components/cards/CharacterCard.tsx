import type { Character, Manhwa } from "@/lib/codex";
import { rankTier } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { LinkCard, RankBadge } from "@/components/ui/codex";
import { FavoriteButton } from "./FavoriteButton";

export function CharacterCard({
  character,
  manhwa,
}: {
  character: Character;
  manhwa?: Manhwa;
}) {
  const tier = rankTier(character.rank);
  return (
    <LinkCard
      to={`/character/${character._id}`}
      label={`View character: ${character.name}`}
      className="group flex flex-col"
    >
      <div className="media-zoom relative aspect-[3/4] w-full">
        <CoverImage src={character.image_url} seed={character._id} ratio="portrait" alt="" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
        <div className="absolute left-2 top-2">
          <RankBadge rank={character.rank} />
        </div>
        <div className="absolute right-2 top-2">
          <FavoriteButton kind="character" id={character._id} title={character.name} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${tier.text}`}>
            {tier.label}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-display truncate text-sm font-semibold text-foreground transition-colors group-hover:text-violet-bright">
          {character.name}
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {character.role}
          {manhwa ? ` · ${manhwa.title}` : ""}
        </p>
      </div>
    </LinkCard>
  );
}
