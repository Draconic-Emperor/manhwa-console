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
    { label: "Chronicles", to: "/chronicles" },
    { label: "Rankings", to: "/rankings" },
    { label: "Collections", to: "/collections" },
    { label: "Saved Records", to: "/favorites" },
    { label: "About the Console", to: "/about" },
  ].filter((p) => !q || p.label.toLowerCase().includes(q));

  return (
    <CommandDialog
      title="Query the Archive"
      description="Search forbidden records: series, entities, and chronicles."
      open={open}
      onOpenChange={setOpen}
      className="top-[8%] max-w-xl translate-y-0 overflow-hidden border-gold/30 bg-void shadow-[var(--shadow-pop)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
    >
      <CommandInput placeholder="Query the Archive…" value={query} onValueChange={setQuery} />
      <CommandList className="max-h-[min(60vh,420px)]">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Sparkles className="size-6 text-gold" aria-hidden="true" />
            <p className="text-sm font-medium">No records match your query.</p>
            <p className="text-xs text-text-3">Try another name, or browse the archive directly.</p>
          </div>
        </CommandEmpty>

        {pages.length > 0 && (
          <CommandGroup heading="Navigate">
            {pages.map((p) => (
              <CommandItem key={p.to} value={`page ${p.label}`} onSelect={() => go(p.to)}>
                <Sparkles className="size-4 text-gold" aria-hidden="true" />
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
                  <BookOpen className="size-4 text-gold" aria-hidden="true" />
                  <span className="flex-1 truncate">{m.title}</span>
                  <span className="text-xs text-text-3">Rank #{m.rank}</span>
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
                  <Users className="size-4 text-crimson" aria-hidden="true" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-text-3">{c.role}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {insightHits.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Chronicles">
              {insightHits.map((i) => {
                const character = characters.find((c) => c._id === i.character_id);
                return (
                  <CommandItem
                    key={i._id}
                    value={`insight ${i.title} ${i.content}`}
                    onSelect={() => go(`/character/${i.character_id}`)}
                  >
                    <ScrollText className="size-4 text-gold" aria-hidden="true" />
                    <span className="flex-1 truncate">{i.title}</span>
                    {character && <span className="text-xs text-text-3">{character.name}</span>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
      <div
        aria-hidden="true"
        className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-text-3"
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
