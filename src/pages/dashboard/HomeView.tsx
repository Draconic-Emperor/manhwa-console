import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Heart,
  KeyRound,
  Quote,
  ScrollText,
  Search,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { useCodex, useFavorite } from "@/hooks/use-codex";
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
    <section aria-label="Featured records" className="relative">
      <div className="record relative overflow-hidden">
        <div className="absolute inset-0">
          <CoverImage
            key={current._id}
            src={current.cover_image}
            seed={current._id}
            ratio="wide"
            alt=""
            className="h-full w-full"
            imgClassName="object-cover transition-all duration-700"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"
          />
        </div>

        <div className="relative z-10 flex min-h-[380px] flex-col justify-end gap-5 p-6 sm:min-h-[420px] sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">
              <Sparkles className="size-3" aria-hidden="true" /> Featured Record
            </Badge>
            <StatusPill status={current.status} />
            <RankBadge rank={current.rank} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-parchment sm:text-4xl lg:text-5xl">
              {current.title}
            </h1>
            <p className="mt-1 text-sm text-text-2">
              by {current.author}
              {current.genre ? ` · ${current.genre}` : ""}
            </p>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
            {current.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-text-2">
              <Users className="size-4 text-gold" aria-hidden="true" />
              {charCounts.get(current._id) ?? 0} entities cataloged
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(`/manhwa/${current._id}`)}
                className="btn-gold px-5 py-2.5 text-sm"
              >
                Open the Record <ArrowRight className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/characters?series=${current._id}`)}
                className="btn-ember px-5 py-2.5 text-sm"
              >
                View Entities
              </button>
            </div>
          </div>
        </div>

        {featured.length > 1 && (
          <div className="relative z-10 flex items-center gap-2 p-6 pt-0 sm:p-10 sm:pt-0">
            <div role="tablist" aria-label="Choose featured record" className="flex items-center gap-2">
              {featured.map((s, i) => (
                <button
                  key={s._id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${s.title}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full border border-parchment/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    i === index ? "w-8 bg-gold" : "w-2 bg-parchment/25 hover:bg-parchment/45",
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
      className="record hover-lift group relative overflow-hidden p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 size-24 rounded-full bg-crimson/15 blur-2xl transition-opacity group-hover:opacity-150"
      />
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-text-3">
        {icon}
        {label}
      </div>
      <p className="font-display mt-3 truncate text-2xl font-bold tabular-nums text-parchment" title={value}>
        {value}
      </p>
      {sub && <p className="mt-1 truncate text-xs text-text-3">{sub}</p>}
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

  const featured = useMemo(() => [...manhwa].sort((a, b) => a.rank - b.rank).slice(0, 5), [manhwa]);
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
          icon={<Sparkles className="size-6" />}
          title="The archive awaits its first record"
          hint="No series or entities are sealed here yet. Open the vault: inscribe the first series and awaken the console."
          action={
            <button type="button" className="btn-gold px-5 py-2.5 text-sm" onClick={() => setManhwaForm(true)}>
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
              <StatCard icon={<BookOpen className="size-4 text-gold" aria-hidden="true" />} label="Records" value={String(manhwa.length)} sub="series in the archive" to="/series" />
              <StatCard icon={<Users className="size-4 text-crimson" aria-hidden="true" />} label="Entities" value={String(characters.length)} sub="cataloged profiles" to="/characters" />
              <StatCard icon={<ScrollText className="size-4 text-gold" aria-hidden="true" />} label="Chronicles" value={String(insights.length)} sub="researcher entries" to="/chronicles" />
              <StatCard
                icon={<Star className="size-4 text-gold" aria-hidden="true" />}
                label="Highest ranked"
                value={topCharacters[0]?.name ?? "—"}
                sub={topCharacters[0] ? `Rank #${topCharacters[0].rank} · ${topCharacters[0].role}` : "no entities yet"}
                to={topCharacters[0] ? `/character/${topCharacters[0]._id}` : "/characters"}
              />
            </div>
          </section>

          {/* Quick actions */}
          <section aria-label="Quick actions">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <QuickAction icon={BookOpen} label="Inscribe Series" hint="Add a new record" onClick={() => setManhwaForm(true)} />
              <QuickAction icon={UserPlus} label="Catalog Entity" hint="Add a new profile" onClick={() => setCharacterForm(true)} />
              <QuickAction icon={Quote} label="Seal Chronicle" hint="Add theory or lore" onClick={() => setInsightForm(true)} />
              <QuickAction icon={Search} label="Query Archive" hint="Ctrl + K anywhere" onClick={openSearch} />
            </div>
          </section>

          {/* Recently added */}
          <section aria-labelledby="recent-heading">
            <SectionHeader
              kicker="Newly sealed"
              title="Recently Inscribed Records"
              action={
                <Link to="/series" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#f0dd9a]">
                  View all <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            <span id="recent-heading" className="sr-only">Recently inscribed records</span>
            {recent.length === 0 ? (
              <EmptyState icon={<BookOpen className="size-6" />} title="No records yet" hint="Inscribe your first series to begin the archive." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {recent.map((m) => (
                  <ManhwaCard key={m._id} manhwa={m} charCount={charCounts.get(m._id) ?? 0} />
                ))}
              </div>
            )}
          </section>

          {/* Highest ranked entities */}
          <section aria-labelledby="top-characters-heading">
            <SectionHeader
              kicker="Power registry"
              title="Highest Ranked Entities"
              action={
                <Link to="/rankings" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#f0dd9a]">
                  Full rankings <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {topCharacters.length === 0 ? (
              <EmptyState icon={<Users className="size-6" />} title="No entities yet" hint="Catalog entities to fill the power registry." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {topCharacters.slice(0, 10).map((c) => (
                  <CharacterCard key={c._id} character={c} manhwa={manhwaById.get(c.manhwa_id)} />
                ))}
              </div>
            )}
          </section>

          {/* Entity spotlight */}
          {spotlight && (
            <section aria-labelledby="spotlight-heading">
              <SectionHeader kicker="Entity spotlight" title="This Cycle's Legend" />
              <SpotlightPanel character={spotlight} manhwa={manhwaById.get(spotlight.manhwa_id)} />
            </section>
          )}

          {/* Latest chronicles */}
          <section aria-labelledby="insights-heading">
            <SectionHeader
              kicker="From the researchers"
              title="Latest Chronicles"
              action={
                <Link to="/chronicles" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#f0dd9a]">
                  All chronicles <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {latestInsights.length === 0 ? (
              <EmptyState icon={<Quote className="size-6" />} title="No chronicles yet" hint="Be the first researcher to seal a theory or lore note." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {latestInsights.map((i) => (
                  <InsightCard
                    key={i._id}
                    insight={i}
                    character={characterById.get(i.character_id)}
                    manhwa={manhwaById.get(characterById.get(i.character_id)?.manhwa_id ?? "")}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Your vault */}
          <section aria-labelledby="library-heading">
            <SectionHeader
              kicker="Sealed in your vault"
              title="Your Collection"
              action={
                <Link to="/collections" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#f0dd9a]">
                  Collections <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {favoriteManhwa.length === 0 && favoriteCharacters.length === 0 ? (
              <EmptyState
                icon={<Heart className="size-6" />}
                title="Your vault is empty"
                hint="Touch the heart on any record or entity to keep them close."
                action={
                  <Link to="/series" className="btn-ember px-5 py-2.5 text-sm">
                    Discover records
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

          {/* newThisWeek keeps a whisper of recency in the footer of stats */}
          <p className="sr-only">{newThisWeek} records inscribed this week</p>
        </>
      )}

      {/* Forms */}
      <ManhwaFormDialog open={manhwaForm} onOpenChange={setManhwaForm} />
      <CharacterFormDialog open={characterForm} onOpenChange={setCharacterForm} manhwaList={manhwa} />
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
      className="record hover-lift group flex items-center gap-3.5 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-crimson/12 text-gold transition-all group-hover:shadow-[0_0_18px_-4px_var(--crimson-glow)]">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-parchment">{label}</span>
        <span className="block truncate text-xs text-text-3">{hint}</span>
      </span>
    </button>
  );
}

function SpotlightPanel({ character, manhwa }: { character: Character; manhwa?: Manhwa }) {
  const { toggleFavorite } = useFavorite();
  const navigate = useNavigate();
  const tier = rankTier(character.rank);
  return (
    <article className="record hover-lift group relative overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[240px_1fr]">
        <div className="media-zoom relative aspect-[3/4] md:aspect-auto">
          <CoverImage src={character.image_url} seed={character._id} ratio="portrait" alt={`Portrait of ${character.name}`} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="relative flex flex-col justify-center gap-3 p-6 sm:p-8">
          <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full bg-crimson/15 blur-3xl" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">
              <Trophy className="size-3" aria-hidden="true" /> Rank #{character.rank}
            </Badge>
            <Badge tone="crimson">{character.role}</Badge>
            {manhwa && <Badge tone="neutral">{manhwa.title}</Badge>}
          </div>
          <h3 className="font-display text-2xl font-bold text-parchment sm:text-3xl">{character.name}</h3>
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${tier.text}`}>{tier.label} class</p>
          <p className="max-w-2xl text-sm leading-relaxed text-text-2">{character.description}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/character/${character._id}`)}
              className="btn-gold px-5 py-2.5 text-sm"
            >
              Open entity record <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => void toggleFavorite("character", character._id, character.name)}
              className="btn-ember px-5 py-2.5 text-sm"
            >
              <Heart className="size-4" aria-hidden="true" /> Seal in vault
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-text-3">
            <KeyRound className="size-3" aria-hidden="true" /> Verified archive entity
          </p>
        </div>
      </div>
    </article>
  );
}
