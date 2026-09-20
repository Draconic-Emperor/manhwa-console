import { useMemo } from "react";
import { Link } from "react-router";
import { Heart, Users } from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import type { Character, Manhwa } from "@/lib/codex";
import { EmptyState, SectionHeader } from "@/components/ui/codex";
import { ManhwaCard } from "@/components/cards/ManhwaCard";
import { CharacterCard } from "@/components/cards/CharacterCard";

/** Saved Records mirror the Collections view but lead with entities. */
export default function FavoritesView() {
  const { loading, characters, favorites, manhwaById, characterById } = useCodex();

  const favoriteCharacters = useMemo(
    () =>
      favorites
        .filter((f) => f.item_kind === "character")
        .map((f) => characterById.get(f.item_id))
        .filter(Boolean) as Character[],
    [favorites, characterById],
  );
  const favoriteManhwa = useMemo(
    () =>
      favorites
        .filter((f) => f.item_kind === "manhwa")
        .map((f) => manhwaById.get(f.item_id))
        .filter(Boolean) as Manhwa[],
    [favorites, manhwaById],
  );

  const total = favoriteCharacters.length + favoriteManhwa.length;

  return (
    <div className="space-y-10">
      <header className="rise-in">
        <p className="kicker">Sealed in your vault</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
          Saved Records
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          Your most cherished entities and worlds, gathered in one shrine of the archive.
        </p>
      </header>

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          <div className="skeleton h-40 w-full" aria-hidden="true" />
          <div className="skeleton h-40 w-full" aria-hidden="true" />
        </div>
      ) : total === 0 ? (
        <EmptyState
          icon={<Heart className="size-6" />}
          title="Nothing sealed yet"
          hint="Touch the heart on any entity or record to keep them close."
          action={
            <Link to="/characters" className="btn-amethyst px-5 py-2.5 text-sm">
              <Users className="size-4" aria-hidden="true" /> Browse entities
            </Link>
          }
        />
      ) : (
        <>
          {favoriteCharacters.length > 0 && (
            <section aria-labelledby="fav-chars">
              <SectionHeader kicker="Cherished souls" title="Saved Entities" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {favoriteCharacters.map((c) => (
                  <CharacterCard key={c._id} character={c} manhwa={manhwaById.get(c.manhwa_id)} />
                ))}
              </div>
            </section>
          )}

          {favoriteManhwa.length > 0 && (
            <section aria-labelledby="fav-series">
              <SectionHeader kicker="Cherished worlds" title="Saved Records" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {favoriteManhwa.map((m) => (
                  <ManhwaCard key={m._id} manhwa={m} charCount={0} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
