import { useMemo, useState } from "react";
import { Quote, ScrollText, Search } from "lucide-react";
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
        <p className="kicker">Sealed knowledge</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
          Chronicles
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          Theories, lore breakdowns, and reviews from researchers of the archive — knowledge is
          meant to be kept.
        </p>
      </header>

      <div className="panel-glass sticky top-16 z-20 rounded-xl p-4 lg:top-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the forbidden records…"
              className="input-console pl-9"
              aria-label="Query chronicles"
            />
          </div>
          <div>
            <Label htmlFor="in-filter" className="sr-only">Chronicle type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="in-filter" className="input-console w-full sm:w-44" aria-label="Filter by chronicle type">
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
        <p className="mt-3 text-xs text-text-3" aria-live="polite">
          {loading ? "Unrolling scrolls…" : `${filtered.length} of ${insights.length} chronicles revealed`}
        </p>
      </div>

      {loading ? (
        <SkeletonGrid count={4} kind="insight" />
      ) : insights.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="size-6" />}
          title="The scribes are silent"
          hint="No chronicles have been sealed yet. Open an entity record to contribute the first entry."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Quote className="size-6" />}
          title="No chronicles match"
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
