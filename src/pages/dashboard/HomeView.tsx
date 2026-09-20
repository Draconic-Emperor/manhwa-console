import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Quote,
  ScrollText,
  Search,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  Users,
  Wand2,
} from "lucide-react";
import { useCodex } from "@/hooks/use-codex";
import type { Character, Manhwa } from "@/lib/codex";
import { rankTier } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { Badge, EmptyState, RankBadge, SectionHeader, SkeletonGrid, StatusPill } from "@/components/ui/codex";
import { ManhwaCard } from "@/components/cards/ManhwaCard";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { InsightCard } from "@/components/cards/InsightCard";
import { ManhwaFormDialog } from "@/components/forms/ManhwaFormDialog";
import { CharacterFormDialog } from "@/components/forms/CharacterFormDialog";
import { InsightFormDialog } from "@/components/forms/InsightFormDialog";
import { cn } from "@/lib/utils";

const WEEK = 7 * 86400000;

/* ------------------------------ Hero ------------------------------ */

function HeroCarousel({ series, charCounts }: { series: Manhwa[]; charCounts: Map<string, number> }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const featured = series.slice(0, 5);
  const current = featured[index];

  useEffect(() => {
    if (featured.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % featured.length), 7000);
    return () => window.clearInterval(t);
  }, [featured.length]);

  useEffect(() => {
    if (index >= featured.length) setIndex(0);
  }, [featured.length, index]);

  if (!current) return null;

  return (
    <section aria-label="Featured series" className="relative">
      <div className="panel relative overflow-hidden">
        <div className="absolute inset-0">
          <CoverImage
            key={current._id}
            src={current.cover_image}
            seed={current._id}
            ratio="wide"
            alt=""
            className="h-full w-full"
            imgClassName={cn(
              "object-cover",
              "transition-all duration-700",
            )}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
          />
        </div>

        <div className="relative z-10 flex min-h-[380px] flex-col justify-end gap-5 p-6 sm:min-h-[420px] sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="violet">
              <Sparkles className="size-3" aria-hidden="true" /> Featured
            </Badge>
            <StatusPill status={current.status} />
            <RankBadge rank={current.rank} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {current.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              by {current.author}
              {current.genre ? ` · ${current.genre}` : ""}
            </p>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
            {current.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-4 text-violet-bright" aria-hidden="true" />
              {charCounts.get(current._id) ?? 0} characters cataloged
            </span>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate(`/manhwa/${current._id}`)} className="btn-arcane px-5 py-2.5 text-sm">
                Explore Series <ArrowRight className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/characters?series=${current._id}`)}
                className="btn-gold px-5 py-2.5 text-sm"
              >
                View Characters
              </button>
            </div>
          </div>
        </div>

        {featured.length > 1 && (
          <div className="relative z-10 flex items-center gap-2 p-6 pt-0 sm:p-10 sm:pt-0">
            <div role="tablist" aria-label="Choose featured series" className="flex items-center gap-2">
              {featured.map((s, i) => (
                <button
                  key={s._id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${s.title}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full border border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    i === index ? "w-8 bg-violet-bright" : "w-2 bg-white/25 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------ Stats ------------------------------ */

function StatCard({
  icon,
  label,
  value,
  sub,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="panel hover-lift group relative overflow-hidden p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 size-24 rounded-full bg-violet-400/10 blur-2xl transition-opacity group-hover:opacity-150"
      />
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="font-display mt-3 truncate text-2xl font-bold tabular-nums text-foreground" title={value}>
        {value}
      </p>
      {sub && <p className="mt-1 truncate text-xs text-muted-foreground">{sub}</p>}
    </button>
  );
}

/* ------------------------------ Page ------------------------------ */

export default function HomeView() {
  const { loading, manhwa, characters, insights, manhwaById, characterById, favorites } = useCodex();
  const navigate = useNavigate();

  const [manhwaForm, setManhwaForm] = useState(false);
  const [characterForm, setCharacterForm] = useState(false);
  const [insightForm, setInsightForm] = useState(false);

  const charCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of characters) map.set(c.manhwa_id, (map.get(c.manhwa_id) ?? 0) + 1);
    return map;
  }, [characters]);

  const featured = useMemo(
    () =>
      [...manhwa].sort((a, b) => a.rank - b.rank).slice(0, 5),
    [manhwa],
  );

  const recent = useMemo(() => [...manhwa].slice(0, 10), [manhwa]);

  const topCharacters = useMemo(
    () => [...characters].sort((a, b) => a.rank - b.rank).slice(0, 10),
    [characters],
  );

  const spotlight: Character | undefined = topCharacters[0];

  const latestInsights = useMemo(() => insights.slice(0, 3), [insights]);

  const newThisWeek = useMemo(
    () => manhwa.filter((m) => Date.now() - m.created_at < WEEK).length,
    [manhwa],
  );

  const favoriteManhwa = useMemo(
    () => favorites.filter((f) => f.item_kind === "manhwa").map((f) => manhwaById.get(f.item_id)).filter(Boolean) as Manhwa[],
    [favorites, manhwaById],
  );
  const favoriteCharacters = useMemo(
    () => favorites.filter((f) => f.item_kind === "character").map((f) => characterById.get(f.item_id)).filter(Boolean) as Character[],
    [favorites, characterById],
  );

  const openSearch = useCallback(() => window.dispatchEvent(new CustomEvent("codex:open-search")), []);

  const isEmpty = !loading && manhwa.length === 0 && characters.length === 0;

  return (
    <div className="space-y-12">
      {loading ? (
        <>
          <div className="skeleton h-[380px] w-full rounded-2xl sm:h-[420px]" aria-hidden="true" />
          <SkeletonGrid count={6} />
        </>
      ) : isEmpty ? (
        <EmptyState
          icon={<Wand2 className="size-6" />}
          title="The archive awaits its first entry"
          hint="No series or characters are cataloged yet. Open the vault: inscribe the first series and awaken the codex."
          action={
            <button type="button" className="btn-arcane px-5 py-2.5 text-sm" onClick={() => setManhwaForm(true)}>
              <BookOpen className="size-4" aria-hidden="true" /> Inscribe a series
            </button>
          }
        />
      ) : (
        <>
          <HeroCarousel series={featured} charCounts={charCounts} />

          {/* Stats */}
          <section aria-label="Archive statistics">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard icon={<BookOpen className="size-4 text-violet-bright" aria-hidden="true" />} label="Series" value={String(manhwa.length)} sub="entries in the archive" to="/series" />
              <StatCard icon={<Users className="size-4 text-magenta" aria-hidden="true" />} label="Characters" value={String(characters.length)} sub="cataloged profiles" to="/characters" />
              <StatCard icon={<ScrollText className="size-4 text-amber-300" aria-hidden="true" />} label="Insights" value={String(insights.length)} sub="community entries" to="/insights" />
              <StatCard
                icon={<Star className="size-4 text-amber-300" aria-hidden="true" />}
                label="Top ranked"
                value={topCharacters[0]?.name ?? "—"}
                sub={topCharacters[0] ? `Rank #${topCharacters[0].rank} · ${topCharacters[0].role}` : "no characters yet"}
                to={topCharacters[0] ? `/character/${topCharacters[0]._id}` : "/characters"}
              />
            </div>
          </section>

          {/* Quick actions */}
          <section aria-label="Quick actions">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <QuickAction icon={BookOpen} label="Add Series" hint="Inscribe a new manhwa" onClick={() => setManhwaForm(true)} />
              <QuickAction icon={UserPlus} label="Add Character" hint="Catalog a new hero" onClick={() => setCharacterForm(true)} />
              <QuickAction icon={Quote} label="Share Insight" hint="Add theory or lore" onClick={() => setInsightForm(true)} />
              <QuickAction icon={Search} label="Open Search" hint="Ctrl + K anywhere" onClick={openSearch} />
            </div>
          </section>

          {/* Recently added */}
          <section aria-labelledby="recent-heading">
            <SectionHeader
              kicker="Newly inscribed"
              title="Recently Added Series"
              action={
                <Link to="/series" className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta">
                  View all <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            <span id="recent-heading" className="sr-only">Recently added series</span>
            {recent.length === 0 ? (
              <EmptyState icon={<BookOpen className="size-6" />} title="No series yet" hint="Inscribe your first series to begin the archive." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {recent.map((m) => (
                  <ManhwaCard key={m._id} manhwa={m} charCount={charCounts.get(m._id) ?? 0} />
                ))}
              </div>
            )}
          </section>

          {/* Highest ranked characters */}
          <section aria-labelledby="top-characters-heading">
            <SectionHeader
              kicker="Power registry"
              title="Highest Ranked Characters"
              action={
                <Link to="/rankings" className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta">
                  Full rankings <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {topCharacters.length === 0 ? (
              <EmptyState icon={<Users className="size-6" />} title="No characters yet" hint="Catalog characters to fill the power registry." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {topCharacters.slice(0, 10).map((c) => (
                  <CharacterCard key={c._id} character={c} manhwa={manhwaById.get(c.manhwa_id)} />
                ))}
              </div>
            )}
          </section>

          {/* Character spotlight */}
          {spotlight && (
            <section aria-labelledby="spotlight-heading">
              <SectionHeader kicker="Character spotlight" title="This Cycle's Legend" />
              <SpotlightPanel character={spotlight} manhwa={manhwaById.get(spotlight.manhwa_id)} />
            </section>
          )}

          {/* Latest insights */}
          <section aria-labelledby="insights-heading">
            <SectionHeader
              kicker="From the scribes"
              title="Latest Insights"
              action={
                <Link to="/insights" className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta">
                  All insights <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {latestInsights.length === 0 ? (
              <EmptyState icon={<Quote className="size-6" />} title="No insights yet" hint="Be the first scribe to share a theory or lore note." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {latestInsights.map((i) => (
                  <InsightCard key={i._id} insight={i} character={characterById.get(i.character_id)} manhwa={manhwaById.get(characterById.get(i.character_id)?.manhwa_id ?? "")} />
                ))}
              </div>
            )}
          </section>

          {/* Your library */}
          <section aria-labelledby="library-heading">
            <SectionHeader
              kicker="Saved to your codex"
              title="Your Library"
              action={
                <Link to="/collections" className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta">
                  Collections <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {favoriteManhwa.length === 0 && favoriteCharacters.length === 0 ? (
              <EmptyState
                icon={<Heart className="size-6" />}
                title="Your Codex is empty"
                hint="Tap the heart on any series or character to keep them close."
                action={
                  <Link to="/series" className="btn-gold px-5 py-2.5 text-sm">
                    Discover series
                  </Link>
                }
              />
            ) : (
              <div className="space-y-6">
                {favoriteManhwa.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {favoriteManhwa.slice(0, 5).map((m) => (
                      <ManhwaCard key={m._id} manhwa={m} charCount={charCounts.get(m._id) ?? 0} />
                    ))}
                  </div>
                )}
                {favoriteCharacters.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {favoriteCharacters.slice(0, 5).map((c) => (
                      <CharacterCard key={c._id} character={c} manhwa={manhwaById.get(c.manhwa_id)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {/* Forms */}
      <ManhwaFormDialog open={manhwaForm} onOpenChange={setManhwaForm} />
      <CharacterFormDialog
        open={characterForm}
        onOpenChange={setCharacterForm}
        manhwaList={manhwa}
      />
      <InsightFormDialog
        open={insightForm}
        onOpenChange={setInsightForm}
        characters={characters}
        manhwaById={manhwaById}
      />
    </div>
  );
}

/* ------------------------------ Helpers ------------------------------ */

function QuickAction({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: typeof BookOpen;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="panel hover-lift group flex items-center gap-3.5 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-bright transition-all group-hover:shadow-[0_0_18px_-4px_var(--violet-glow)]">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}

function SpotlightPanel({ character, manhwa }: { character: Character; manhwa?: Manhwa }) {
  const { toggleFavorite } = useFavorite();
  const navigate = useNavigate();
  const tier = rankTier(character.rank);
  return (
    <article className="panel hover-lift group relative overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[240px_1fr]">
        <div className="media-zoom relative aspect-[3/4] md:aspect-auto">
          <CoverImage src={character.image_url} seed={character._id} ratio="portrait" alt={`Portrait of ${character.name}`} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="relative flex flex-col justify-center gap-3 p-6 sm:p-8">
          <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full bg-magenta/10 blur-3xl" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">
              <Trophy className="size-3" aria-hidden="true" /> Rank #{character.rank}
            </Badge>
            <Badge tone="violet">{character.role}</Badge>
            {manhwa && <Badge tone="neutral">{manhwa.title}</Badge>}
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{character.name}</h3>
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${tier.text}`}>{tier.label} class</p>
          <p className="max-w-2xl text-sm leading-relaxed text-text-2">{character.description}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate(`/character/${character._id}`)} className="btn-arcane px-5 py-2.5 text-sm">
              View character <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => void toggleFavorite("character", character._id, character.name)}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-rose-400/40 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Heart className="size-4" aria-hidden="true" /> Save to Codex
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
