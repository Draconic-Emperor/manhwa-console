import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Crown, Medal, Trophy } from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import { rankTier } from "@/lib/codex";
import type { Character } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { Badge, EmptyState, SectionHeader, SkeletonGrid } from "@/components/ui/codex";
import { cn } from "@/lib/utils";

const PODIUM_STYLES = [
  {
    ring: "border-amber-400/50 shadow-[0_0_40px_-8px_var(--gold-glow)]",
    chip: "bg-amber-400/15 text-amber-200 border-amber-400/50",
    label: "1st",
    icon: Crown,
  },
  {
    ring: "border-fuchsia-400/50 shadow-[0_0_36px_-8px_var(--magenta-glow)]",
    chip: "bg-fuchsia-400/15 text-fuchsia-200 border-fuchsia-400/50",
    label: "2nd",
    icon: Medal,
  },
  {
    ring: "border-violet-400/50",
    chip: "bg-violet-400/15 text-violet-200 border-violet-400/50",
    label: "3rd",
    icon: Medal,
  },
];

function PodiumCard({ character, manhwaTitle, place }: { character: Character; manhwaTitle?: string; place: number }) {
  const navigate = useNavigate();
  const style = PODIUM_STYLES[place];
  const Icon = style.icon;
  const tier = rankTier(character.rank);
  return (
    <button
      type="button"
      onClick={() => navigate(`/character/${character._id}`)}
      className={cn(
        "panel hover-lift group relative flex flex-col items-center gap-3 border p-6 pt-8 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        style.ring,
        place === 0 && "md:-mt-4",
      )}
      aria-label={`Rank ${place + 1}: ${character.name}${manhwaTitle ? ` from ${manhwaTitle}` : ""}`}
    >
      <span className={cn("absolute left-1/2 top-3 -translate-x-1/2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider", style.chip)}>
        <Icon className="size-3" aria-hidden="true" /> {style.label}
      </span>
      <span className="media-zoom relative mt-4 block size-24 overflow-hidden rounded-full border-2 border-white/15">
        <CoverImage src={character.image_url} seed={character._id} ratio="portrait" alt="" />
      </span>
      <span className="font-display text-lg font-bold text-foreground group-hover:text-violet-bright">
        {character.name}
      </span>
      <span className="text-xs text-muted-foreground">{manhwaTitle}</span>
      <span className={cn("text-[11px] font-bold uppercase tracking-[0.18em]", tier.text)}>
        {tier.label} · Rank {character.rank}
      </span>
    </button>
  );
}

export default function RankingsView() {
  const { loading, characters, manhwaById } = useCodex();
  const navigate = useNavigate();

  const ranked = useMemo(() => [...characters].sort((a, b) => a.rank - b.rank), [characters]);
  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const tierBuckets = useMemo(() => {
    const buckets: Record<string, Character[]> = { Mythic: [], Legendary: [], Elite: [], Rising: [] };
    for (const c of ranked) buckets[rankTier(c.rank).label]?.push(c);
    return buckets;
  }, [ranked]);

  return (
    <div className="space-y-10">
      <header className="rise-in">
        <p className="kicker">Power registry</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Power Rankings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
          The community's standing of every cataloged character. Lower rank numbers mean greater standing within the codex — tier names group the registry.
        </p>
      </header>

      {loading ? (
        <SkeletonGrid count={3} kind="character" />
      ) : ranked.length === 0 ? (
        <EmptyState
          icon={<Trophy className="size-6" />}
          title="No champions yet"
          hint="Catalog characters with ranks to raise the power registry."
        />
      ) : (
        <>
          {/* Podium */}
          <section aria-label="Top three characters">
            <div className="grid gap-4 md:grid-cols-3">
              {podium.map((c, i) => (
                <PodiumCard key={c._id} character={c} manhwaTitle={manhwaById.get(c.manhwa_id)?.title} place={i} />
              ))}
            </div>
          </section>

          {/* Tiered ladder */}
          {(["Mythic", "Legendary", "Elite", "Rising"] as const).map((tierName) => {
            const list = tierBuckets[tierName];
            if (!list || list.length === 0) return null;
            return (
              <section key={tierName} aria-label={`${tierName} tier`}>
                <SectionHeader
                  kicker={`Rank ${tierName === "Mythic" ? "1–10" : tierName === "Legendary" ? "11–25" : tierName === "Elite" ? "26–50" : "51+"}`}
                  title={`${tierName} Tier`}
                />
                <ol className="space-y-2">
                  {list.map((c, idx) => {
                    const globalIndex = ranked.indexOf(c);
                    const tier = rankTier(c.rank);
                    return (
                      <li key={c._id}>
                        <button
                          type="button"
                          onClick={() => navigate(`/character/${c._id}`)}
                          className="panel hover-lift group flex w-full items-center gap-4 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={`Rank ${globalIndex + 1}: ${c.name}`}
                        >
                          <span className="font-display w-10 shrink-0 text-center text-xl font-bold tabular-nums text-muted-foreground">
                            {globalIndex + 1}
                          </span>
                          <span className="media-zoom size-12 shrink-0 overflow-hidden rounded-lg border border-white/10">
                            <CoverImage src={c.image_url} seed={c._id} ratio="portrait" alt="" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-foreground group-hover:text-violet-bright">
                              {c.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {manhwaById.get(c.manhwa_id)?.title ?? "Unbound"} · {c.role}
                            </span>
                          </span>
                          <Badge tone="neutral" className="hidden sm:inline-flex">{tier.label}</Badge>
                          <span className={cn("shrink-0 font-display text-lg font-bold tabular-nums", tier.text)}>
                            #{c.rank}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
