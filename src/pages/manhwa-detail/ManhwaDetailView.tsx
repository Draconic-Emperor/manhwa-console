import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Pencil,
  ScrollText,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Manhwa } from "@/lib/codex";
import { STATUS_LABEL, fullDate } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { Badge, EmptyState, SectionHeader, SkeletonGrid, StatusPill } from "@/components/ui/codex";
import { ManhwaCard } from "@/components/cards/ManhwaCard";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { ManhwaFormDialog } from "@/components/forms/ManhwaFormDialog";
import { CharacterFormDialog } from "@/components/forms/CharacterFormDialog";
import { InsightFormDialog } from "@/components/forms/InsightFormDialog";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";
import { useCodex, useEnsureAuth } from "@/hooks/use-codex";
import { cn } from "@/lib/utils";

export default function ManhwaDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { manhwa, characters, insights, characterById, manhwaById, loading } = useCodex();
  const ensureAuth = useEnsureAuth();
  const deleteManhwa = useMutation(api.mutations.deleteManhwa);

  const [editOpen, setEditOpen] = useState(false);
  const [charOpen, setCharOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const series: Manhwa | undefined = useMemo(() => manhwa.find((m) => m._id === id), [manhwa, id]);

  const seriesCharacters = useMemo(
    () =>
      characters
        .filter((c) => c.manhwa_id === id)
        .sort((a, b) => a.rank - b.rank),
    [characters, id],
  );

  const seriesInsights = useMemo(() => {
    const charIds = new Set(seriesCharacters.map((c) => c._id));
    return insights.filter((i) => charIds.has(i.character_id)).slice(0, 4);
  }, [insights, seriesCharacters]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-10 w-40" aria-hidden="true" />
        <div className="skeleton h-64 w-full" aria-hidden="true" />
        <SkeletonGrid count={5} kind="character" />
      </div>
    );
  }

  if (!series) {
    return (
      <EmptyState
        icon={<BookOpen className="size-6" />}
        title="Entry not found"
        hint="This series has not been inscribed in the codex — it may have been removed."
        action={
          <Link to="/series" className="btn-arcane px-5 py-2.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to the archive
          </Link>
        }
      />
    );
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ensureAuth();
      await deleteManhwa({ id: series._id });
      toast.success(`“${series.title}” was struck from the codex.`);
      navigate("/series");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove the series.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/dashboard" className="hover:text-foreground">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/series" className="hover:text-foreground">Series</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">{series.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="panel relative overflow-hidden rise-in">
        <div className="absolute inset-0" aria-hidden="true">
          <CoverImage src={series.cover_image} seed={series._id} ratio="wide" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="relative z-10 grid gap-8 p-6 sm:p-10 md:grid-cols-[200px_1fr]">
          <div className="hidden md:block">
            <div className="media-zoom overflow-hidden rounded-xl border border-white/15 shadow-[var(--shadow-card)]">
              <div className="aspect-[2/3]">
                <CoverImage
                  src={series.cover_image}
                  seed={series._id}
                  ratio="portrait"
                  alt={`Cover art for ${series.title}`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={series.status} />
              {series.genre && <Badge tone="violet">{series.genre}</Badge>}
              <Badge tone="gold">Rank #{series.rank}</Badge>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {series.title}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" aria-hidden="true" /> by {series.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" /> inscribed {fullDate(series.created_at)}
                </span>
              </p>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
              {series.description}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setCharOpen(true)} className="btn-arcane px-5 py-2.5 text-sm">
                <UserPlus className="size-4" aria-hidden="true" /> Add character
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-violet-400/40 hover:text-violet-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Pencil className="size-4" aria-hidden="true" /> Edit series
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-rose-400/25 bg-rose-500/5 px-5 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="size-4" aria-hidden="true" /> Remove
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Series statistics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={<Users className="size-4 text-violet-bright" aria-hidden="true" />} label="Characters" value={String(seriesCharacters.length)} />
        <StatTile icon={<ScrollText className="size-4 text-amber-300" aria-hidden="true" />} label="Insights" value={String(seriesInsights.length > 4 ? seriesInsights.length : insights.filter((i) => seriesCharacters.some((c) => c._id === i.character_id)).length)} />
        <StatTile icon={<BookOpen className="size-4 text-magenta" aria-hidden="true" />} label="Status" value={STATUS_LABEL[series.status]} />
        <StatTile icon={<Calendar className="size-4 text-emerald-300" aria-hidden="true" />} label="Inscribed" value={fullDate(series.created_at)} />
      </section>

      {/* Characters */}
      <section aria-labelledby="series-characters">
        <SectionHeader
          kicker="Cast of this world"
          title="Characters"
          action={
            <button
              type="button"
              onClick={() => setCharOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta"
            >
              <UserPlus className="size-4" aria-hidden="true" /> Add character
            </button>
          }
        />
        {seriesCharacters.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title="No characters bound to this series yet"
            hint="Catalog the cast so readers can follow their arcs."
            action={
              <button type="button" className="btn-gold px-5 py-2.5 text-sm" onClick={() => setCharOpen(true)}>
                <UserPlus className="size-4" aria-hidden="true" /> Catalog the first
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {seriesCharacters.map((c) => (
              <CharacterCard key={c._id} character={c} manhwa={series} />
            ))}
          </div>
        )}
      </section>

      {/* Related series */}
      {manhwa.length > 1 && (
        <section aria-labelledby="related-series">
          <SectionHeader kicker="More from the archive" title="Related Series" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {manhwa
              .filter((m) => m._id !== series._id)
              .slice(0, 5)
              .map((m) => (
                <ManhwaCard key={m._id} manhwa={m} charCount={characters.filter((c) => c.manhwa_id === m._id).length} />
              ))}
          </div>
        </section>
      )}

      {/* Latest insights in this series */}
      {seriesInsights.length > 0 && (
        <section aria-labelledby="series-insights">
          <SectionHeader
            kicker="From the scribes"
            title="Latest Insights"
            action={
              <Link to="/insights" className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta">
                All insights <ScrollText className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="space-y-3">
            {seriesInsights.map((i) => {
              const character = characterById.get(i.character_id);
              return (
                <Link
                  key={i._id}
                  to={character ? `/character/${character._id}` : "/insights"}
                  className="panel hover-lift flex items-center gap-4 p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-400/10">
                    <ScrollText className="size-4 text-violet-bright" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-foreground">{i.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {character?.name ?? "Unknown character"} · {i.type}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Forms */}
      <ManhwaFormDialog open={editOpen} onOpenChange={setEditOpen} manhwa={series} />
      <CharacterFormDialog
        open={charOpen}
        onOpenChange={setCharOpen}
        manhwaList={manhwa}
        presetManhwaId={series._id}
      />
      <InsightFormDialog
        open={insightOpen}
        onOpenChange={setInsightOpen}
        characters={characters}
        manhwaById={manhwaById}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove “${series.title}”?`}
        description="This strikes the series, its characters, and their insights from the codex. This cannot be undone."
        confirmLabel="Strike from the codex"
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}

function StatTile({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="font-display mt-3 truncate text-xl font-bold tabular-nums text-foreground" title={value}>
        {value}
      </p>
    </div>
  );
}
