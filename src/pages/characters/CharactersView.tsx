import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Search, Users, UserX } from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import { EmptyState, SkeletonGrid } from "@/components/ui/codex";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CharactersView() {
  const { loading, manhwa, characters, manhwaById } = useCodex();
  const [searchParams, setSearchParams] = useSearchParams();
  const seriesParam = searchParams.get("series") ?? "all";

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "name" | "series">("rank");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = characters.filter((c) => {
      if (seriesParam !== "all" && c.manhwa_id !== seriesParam) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.role.toLowerCase().includes(q)) return false;
      return true;
    });
    switch (sort) {
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "series":
        return [...list].sort(
          (a, b) =>
            (manhwaById.get(a.manhwa_id)?.title ?? "").localeCompare(manhwaById.get(b.manhwa_id)?.title ?? "") ||
            a.rank - b.rank,
        );
      default:
        return [...list].sort((a, b) => a.rank - b.rank);
    }
  }, [characters, query, seriesParam, sort, manhwaById]);

  return (
    <div className="space-y-8">
      <header className="rise-in">
        <p className="kicker">Power registry</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
          Entity Registry
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          Every cataloged hero, villain, and supporting soul — ranked, bound to their series, and
          searchable across the archive.
        </p>
      </header>

      {/* Toolbar */}
      <div className="panel-glass sticky top-16 z-20 rounded-xl p-4 lg:top-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query entities by name or designation…"
              className="input-console pl-9"
              aria-label="Query entity records"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex">
            <div>
              <Label htmlFor="cf-series" className="sr-only">Series</Label>
              <Select
                value={seriesParam}
                onValueChange={(v) => setSearchParams(v === "all" ? {} : { series: v })}
              >
                <SelectTrigger id="cf-series" className="input-console w-full lg:w-52" aria-label="Filter by series">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="all">All series</SelectItem>
                  {manhwa.map((m) => (
                    <SelectItem key={m._id} value={m._id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cf-sort" className="sr-only">Order</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger id="cf-sort" className="input-console w-full lg:w-44" aria-label="Order entities">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="rank">Rank (highest first)</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                  <SelectItem value="series">By series</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-text-3" aria-live="polite">
          {loading ? "Consulting the registry…" : `${filtered.length} of ${characters.length} entities revealed`}
        </p>
      </div>

      {loading ? (
        <SkeletonGrid count={10} kind="character" />
      ) : characters.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title="The registry is empty"
          hint="No entities have been cataloged yet."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<UserX className="size-6" />}
          title="No entities found"
          hint="Try another name, designation, or series filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSearchParams({});
              }}
            >
              Reset
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtered.map((c) => (
            <CharacterCard key={c._id} character={c} manhwa={manhwaById.get(c.manhwa_id)} />
          ))}
        </div>
      )}
    </div>
  );
}
