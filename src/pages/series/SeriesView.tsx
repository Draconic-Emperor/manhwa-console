import { useMemo, useState } from "react";
import { Library, Search, SlidersHorizontal, X } from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import { STATUS_LABEL } from "@/lib/codex";
import { EmptyState, SectionHeader, SkeletonGrid } from "@/components/ui/codex";
import { ManhwaCard } from "@/components/cards/ManhwaCard";
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
import { cn } from "@/lib/utils";

export default function SeriesView() {
  const { loading, manhwa, characters } = useCodex();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");
  const [author, setAuthor] = useState<string>("all");
  const [sort, setSort] = useState<"recent" | "rank" | "title" | "chars">("recent");

  const charCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of characters) map.set(c.manhwa_id, (map.get(c.manhwa_id) ?? 0) + 1);
    return map;
  }, [characters]);

  const genres = useMemo(
    () => Array.from(new Set(manhwa.map((m) => m.genre).filter(Boolean))) as string[],
    [manhwa],
  );
  const authors = useMemo(() => Array.from(new Set(manhwa.map((m) => m.author))).sort(), [manhwa]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = manhwa.filter((m) => {
      if (q && !m.title.toLowerCase().includes(q) && !m.author.toLowerCase().includes(q)) return false;
      if (status !== "all" && m.status !== status) return false;
      if (genre !== "all" && m.genre !== genre) return false;
      if (author !== "all" && m.author !== author) return false;
      return true;
    });
    switch (sort) {
      case "rank":
        return [...list].sort((a, b) => a.rank - b.rank);
      case "title":
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case "chars":
        return [...list].sort((a, b) => (charCounts.get(b._id) ?? 0) - (charCounts.get(a._id) ?? 0));
      default:
        return list;
    }
  }, [manhwa, query, status, genre, author, sort, charCounts]);

  const activeFilters = [status, genre, author].filter((v) => v !== "all").length;

  const resetFilters = () => {
    setStatus("all");
    setGenre("all");
    setAuthor("all");
    setQuery("");
  };

  return (
    <div className="space-y-8">
      <header className="rise-in">
        <p className="kicker">The archive</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Series Archive</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          Every manhwa inscribed by the community — browse, filter, and step through into each world.
        </p>
      </header>

      {/* Toolbar */}
      <div className="panel-glass sticky top-16 z-20 rounded-xl border p-4 lg:top-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or author…"
              className="pl-9"
              aria-label="Search series"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-center">
            <div>
              <Label htmlFor="f-status" className="sr-only">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="f-status" className="w-full lg:w-36" aria-label="Filter by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.entries(STATUS_LABEL).map(([v, label]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="f-genre" className="sr-only">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger id="f-genre" className="w-full lg:w-36" aria-label="Filter by genre">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="all">All genres</SelectItem>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="f-author" className="sr-only">Author</Label>
              <Select value={author} onValueChange={setAuthor}>
                <SelectTrigger id="f-author" className="w-full lg:w-40" aria-label="Filter by author">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="all">All authors</SelectItem>
                  {authors.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="f-sort" className="sr-only">Sort</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger id="f-sort" className="w-full lg:w-40" aria-label="Sort series">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="recent">Recently added</SelectItem>
                  <SelectItem value="rank">Rank (best first)</SelectItem>
                  <SelectItem value="title">Title A–Z</SelectItem>
                  <SelectItem value="chars">Most characters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span aria-live="polite">
            {loading ? "Consulting the archive…" : `${filtered.length} of ${manhwa.length} series`}
          </span>
          {activeFilters > 0 && (
            <>
              <span className="inline-flex items-center gap-1 text-violet-bright">
                <Filter className="size-3" aria-hidden="true" />
                {activeFilters} active
              </span>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
                <X className="size-3" aria-hidden="true" /> Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={10} />
      ) : manhwa.length === 0 ? (
        <EmptyState
          icon={<Library className="size-6" />}
          title="The archive shelf is empty"
          hint="No series have been inscribed yet. The first entry starts the legend."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="size-6" />}
          title="No series match your filters"
          hint="Loosen the filters or clear them to see the full archive."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtered.map((m) => (
            <ManhwaCard key={m._id} manhwa={m} charCount={charCounts.get(m._id) ?? 0} />
          ))}
        </div>
      )}
    </div>
  );
}
