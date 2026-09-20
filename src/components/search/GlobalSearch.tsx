import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  CornerDownLeft,
  Search,
  Sparkles,
  ScrollText,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCodex } from "@/hooks/use-codex";

/** Command palette opened via Ctrl/Cmd + K or the search buttons. */
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { manhwa, characters, insights } = useCodex();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("codex:open-search", onOpen);
    return () => window.removeEventListener("codex:open-search", onOpen);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const q = query.trim().toLowerCase();

  const seriesHits = useMemo(
    () =>
      manhwa
        .filter((m) => !q || m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q))
        .slice(0, 6),
    [manhwa, q],
  );
  const characterHits = useMemo(
    () =>
      characters
        .filter((c) => !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q))
        .slice(0, 6),
    [characters, q],
  );
  const insightHits = useMemo(
    () =>
      insights
        .filter((i) => !q || i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q))
        .slice(0, 4),
    [insights, q],
  );

  const pages = [
    { label: "Home", to: "/dashboard" },
    { label: "Series", to: "/series" },
    { label: "Characters", to: "/characters" },
    { label: "Insights", to: "/insights" },
    { label: "Rankings", to: "/rankings" },
    { label: "Collections", to: "/collections" },
    { label: "Favorites", to: "/favorites" },
    { label: "About Codex", to: "/about" },
  ].filter((p) => !q || p.label.toLowerCase().includes(q));

  return (
    <CommandDialog
      title="Search the archive"
      description="Find series, characters, and community insights."
      open={open}
      onOpenChange={setOpen}
      className="top-[8%] max-w-xl translate-y-0 overflow-hidden border-border bg-surface shadow-[var(--shadow-pop)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
    >
      <CommandInput placeholder="Search series, characters, insights…" value={query} onValueChange={setQuery} />
      <CommandList className="max-h-[min(60vh,420px)]">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Sparkles className="size-6 text-violet-bright" aria-hidden="true" />
            <p className="text-sm font-medium">No entries match your incantation.</p>
            <p className="text-xs text-muted-foreground">Try a different name or browse the archive.</p>
          </div>
        </CommandEmpty>

        {pages.length > 0 && (
          <CommandGroup heading="Navigate">
            {pages.map((p) => (
              <CommandItem key={p.to} value={`page ${p.label}`} onSelect={() => go(p.to)}>
                <Sparkles className="size-4 text-violet-bright" aria-hidden="true" />
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {seriesHits.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Series">
              {seriesHits.map((m) => (
                <CommandItem key={m._id} value={`series ${m.title} ${m.author}`} onSelect={() => go(`/manhwa/${m._id}`)}>
                  <BookOpen className="size-4 text-violet-bright" aria-hidden="true" />
                  <span className="flex-1 truncate">{m.title}</span>
                  <span className="text-xs text-muted-foreground">Rank #{m.rank}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {characterHits.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Characters">
              {characterHits.map((c) => (
                <CommandItem key={c._id} value={`character ${c.name} ${c.role}`} onSelect={() => go(`/character/${c._id}`)}>
                  <Users className="size-4 text-magenta" aria-hidden="true" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.role}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {insightHits.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Insights">
              {insightHits.map((i) => {
                const character = characters.find((c) => c._id === i.character_id);
                return (
                  <CommandItem
                    key={i._id}
                    value={`insight ${i.title} ${i.content}`}
                    onSelect={() => go(`/character/${i.character_id}`)}
                  >
                    <ScrollText className="size-4 text-amber-300" aria-hidden="true" />
                    <span className="flex-1 truncate">{i.title}</span>
                    {character && <span className="text-xs text-muted-foreground">{character.name}</span>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
      <div
        aria-hidden="true"
        className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <CornerDownLeft className="size-3" /> to open
        </span>
        <span>↑↓ to navigate</span>
        <span>esc to close</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Search className="size-3" /> Ctrl K
        </span>
      </div>
    </CommandDialog>
  );
}
