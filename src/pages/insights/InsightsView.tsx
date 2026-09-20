import { useMemo, useState } from "react";
import { Quote, ScrollText } from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import { EmptyState, SkeletonGrid } from "@/components/ui/codex";
import { InsightCard } from "@/components/cards/InsightCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function InsightsView() {
  const { loading, insights, characters, characterById, manhwaById } = useCodex();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return insights.filter((i) => {
      if (type !== "all" && i.type !== type) return false;
      if (q) {
        const character = characterById.get(i.character_id);
        const haystack = `${i.title} ${i.content} ${character?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [insights, query, type, characterById]);

  return (
    <div className="space-y-8">
      <header className="rise-in">
        <p className="kicker">From the scribes</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Community Insights</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          Theories, lore breakdowns, and reviews from readers of the codex — knowledge is meant to be shared.
        </p>
      </header>

      <div className="panel-glass sticky top-16 z-20 rounded-xl border p-4 lg:top-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights, characters…"
              className="pl-9"
              aria-label="Search insights"
            />
          </div>
          <div>
            <Label htmlFor="in-filter" className="sr-only">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="in-filter" className="w-full sm:w-44" aria-label="Filter by insight type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="theory">Theories</SelectItem>
                <SelectItem value="lore">Lore</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          {loading ? "Unrolling scrolls…" : `${filtered.length} of ${insights.length} entries`}
        </p>
      </div>

      {loading ? (
        <SkeletonGrid count={4} kind="insight" />
      ) : insights.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="size-6" />}
          title="The scribes are silent"
          hint="No insights have been shared yet. Open a character page to contribute the first entry."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Quote className="size-6" />}
          title="No entries match"
          hint="Try another phrase or type filter."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((i) => {
            const character = characterById.get(i.character_id);
            return (
              <InsightCard
                key={i._id}
                insight={i}
                character={character}
                manhwa={character ? manhwaById.get(character.manhwa_id) : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
