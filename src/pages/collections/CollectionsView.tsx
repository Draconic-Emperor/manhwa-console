import { useMemo } from "react";
import { Link } from "react-router";
import { FolderHeart, Heart, Users } from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import type { Character, Manhwa } from "@/lib/codex";
import { EmptyState, SectionHeader } from "@/components/ui/codex";
import { ManhwaCard } from "@/components/cards/ManhwaCard";
import { CharacterCard } from "@/components/cards/CharacterCard";

export default function CollectionsView() {
  const { loading, manhwa, characters, favorites, manhwaById, characterById } = useCodex();

  const favoriteManhwa = useMemo(
    () =>
      favorites
        .filter((f) => f.item_kind === "manhwa")
        .map((f) => manhwaById.get(f.item_id))
        .filter(Boolean) as Manhwa[],
    [favorites, manhwaById],
  );
  const favoriteCharacters = useMemo(
    () =>
      favorites
        .filter((f) => f.item_kind === "character")
        .map((f) => characterById.get(f.item_id))
        .filter(Boolean) as Character[],
    [favorites, characterById],
  );

  const charCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of characters) map.set(c.manhwa_id, (map.get(c.manhwa_id) ?? 0) + 1);
    return map;
  }, [characters]);

  const total = favoriteManhwa.length + favoriteCharacters.length;
  const loadingState = loading;

  return (
    <div className="space-y-10">
      <header className="rise-in">
        <p className="kicker">Saved to your codex</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Collections</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          Everything you have kept close — series and characters bound into your personal wing of the archive.
        </p>
      </header>

      {loadingState ? (
        <div className="space-y-4" aria-busy="true">
          <div className="skeleton h-40 w-full" aria-hidden="true" />
          <div className="skeleton h-40 w-full" aria-hidden="true" />
        </div>
      ) : total === 0 ? (
        <EmptyState
          icon={<FolderHeart className="size-6" />}
          title="Your codex is empty"
          hint="Tap the heart on any series or character to bind them into your collection."
          action={
            <Link to="/series" className="btn-arcane px-5 py-2.5 text-sm">
              <Heart className="size-4" aria-hidden="true" /> Discover series
            </Link>
          }
        />
      ) : (
        <>
          {/* Summary strip */}
          <section aria-label="Collection summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryTile icon={<Heart className="size-4 text-rose-300" aria-hidden="true" />} label="Saved series" value={favoriteManhwa.length} />
            <SummaryTile icon={<Users className="size-4 text-magenta" aria-hidden="true" />} label="Saved characters" value={favoriteCharacters.length} />
            <SummaryTile icon={<FolderHeart className="size-4 text-violet-bright" aria-hidden="true" />} label="Total keepsakes" value={total} />
            <SummaryTile
              icon={<span aria-hidden="true" className="text-xs font-bold">♪</span>}
              label="Archive size"
              value={manhwa.length + characters.length}
            />
          </section>

          {favoriteManhwa.length > 0 && (
            <section aria-labelledby="coll-series">
              <SectionHeader kicker="Kept worlds" title="Saved Series" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {favoriteManhwa.map((m) => (
                  <ManhwaCard key={m._id} manhwa={m} charCount={charCounts.get(m._id) ?? 0} />
                ))}
              </div>
            </section>
          )}

          {favoriteCharacters.length > 0 && (
            <section aria-labelledby="coll-chars">
              <SectionHeader kicker="Kept souls" title="Saved Characters" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {favoriteCharacters.map((c) => (
                  <CharacterCard key={c._id} character={c} manhwa={manhwaById.get(c.manhwa_id)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function SummaryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="font-display mt-3 text-2xl font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
