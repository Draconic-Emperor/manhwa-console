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
    () => characters.filter((c) => c.manhwa_id === id).sort((a, b) => a.rank - b.rank),
    [characters, id],
  );

  const seriesInsights = useMemo(() => {
    const charIds = new Set(seriesCharacters.map((c) => c._id));
    return insights.filter((i) => charIds.has(i.character_id)).slice(0, 4);
  }, [insights, seriesCharacters]);

  const insightTotal = useMemo(
    () => insights.filter((i) => seriesCharacters.some((c) => c._id === i.character_id)).length,
    [insights, seriesCharacters],
  );

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
        title="Record not found"
        hint="This entry has not been inscribed in the archive — it may have been struck from the records."
        action={
          <Link to="/series" className="btn-amethyst px-5 py-2.5 text-sm">
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
      toast.success(`“${series.title}” was struck from the archive.`);
      navigate("/series");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove the record.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-text-3">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/dashboard" className="hover:text-parchment">Archive</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/series" className="hover:text-parchment">Records</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-parchment">{series.title}</li>
        </ol>
      </nav>

      {/* Archive entry hero */}
      <section className="record relative overflow-hidden rise-in">
        <div className="absolute inset-0" aria-hidden="true">
          <CoverImage src={series.cover_image} seed={series._id} ratio="wide" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/88 to-obsidian/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
        </div>

        <div className="relative z-10 grid gap-8 p-6 sm:p-10 md:grid-cols-[200px_1fr]">
          <div className="hidden md:block">
            <div className="media-zoom overflow-hidden rounded-xl border border-amethyst/25 shadow-[var(--shadow-card)]">
              <div className="aspect-[2/3]">
                <CoverImage
                  src={series.cover_image}
                  seed={series._id}
                  ratio="portrait"
                  alt={`Sealed cover art for ${series.title}`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <p className="kicker">
              Archive Entry #{series._id.slice(-6).toUpperCase()}
            </p>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-parchment sm:text-4xl lg:text-5xl">
                {series.title}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-2">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" aria-hidden="true" /> recorded under the authorship of {series.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" /> inscribed {fullDate(series.created_at)}
                </span>
              </p>
            </div>

            {/* Classification grid */}
            <dl className="grid gap-x-8 gap-y-3 border-y border-border py-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Classification</dt>
                <dd className="mt-1">
                  <Badge tone="amethyst">{series.genre ?? "Unclassified"}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Record Status</dt>
                <dd className="mt-1">
                  <StatusPill status={series.status} />
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Archive Rank</dt>
                <dd className="font-display mt-1 font-bold tabular-nums text-[#dccbfb]">#{series.rank}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Known Affiliations</dt>
                <dd className="mt-1 font-medium text-parchment">
                  {seriesCharacters.length} {seriesCharacters.length === 1 ? "entity" : "entities"}
                </dd>
              </div>
            </dl>

            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">
                Chronicle Summary
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
                {series.description}
              </p>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setCharOpen(true)} className="btn-amethyst px-5 py-2.5 text-sm">
                <UserPlus className="size-4" aria-hidden="true" /> Catalog entity
              </button>
              <button type="button" onClick={() => setEditOpen(true)} className="btn-ember px-5 py-2.5 text-sm">
                <Pencil className="size-4" aria-hidden="true" /> Amend record
              </button>
              <button type="button" onClick={() => setConfirmOpen(true)} className="btn-ember-danger px-5 py-2.5 text-sm">
                <Trash2 className="size-4" aria-hidden="true" /> Strike record
              </button>
              <button type="button" onClick={() => setInsightOpen(true)} className="btn-ember px-5 py-2.5 text-sm">
                <ScrollText className="size-4" aria-hidden="true" /> Seal a chronicle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Entities */}
      <section aria-labelledby="series-characters">
        <SectionHeader
          kicker="Known affiliations"
          title="Entities of this Record"
          action={
            <button
              type="button"
              onClick={() => setCharOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-amethyst hover:text-[#dccbfb]"
            >
              <UserPlus className="size-4" aria-hidden="true" /> Catalog entity
            </button>
          }
        />
        {seriesCharacters.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title="No entities bound to this record"
            hint="Catalog the cast so researchers can follow their arcs."
            action={
              <button type="button" className="btn-ember px-5 py-2.5 text-sm" onClick={() => setCharOpen(true)}>
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

      {/* Related records */}
      {manhwa.length > 1 && (
        <section aria-labelledby="related-series">
          <SectionHeader kicker="Adjacent vault shelves" title="Related Records" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {manhwa
              .filter((m) => m._id !== series._id)
              .slice(0, 5)
              .map((m) => (
                <ManhwaCard
                  key={m._id}
                  manhwa={m}
                  charCount={characters.filter((c) => c.manhwa_id === m._id).length}
                />
              ))}
          </div>
        </section>
      )}

      {/* Latest chronicles for this record */}
      {seriesInsights.length > 0 && (
        <section aria-labelledby="series-insights">
          <SectionHeader
            kicker="Attached chronicles"
            title="Latest Chronicles"
            action={
              <Link to="/chronicles" className="inline-flex items-center gap-1 text-sm font-medium text-amethyst hover:text-[#dccbfb]">
                All chronicles <ScrollText className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="space-y-3">
            {seriesInsights.map((i) => {
              const character = characterById.get(i.character_id);
              return (
                <Link
                  key={i._id}
                  to={character ? `/character/${character._id}` : "/chronicles"}
                  className="record hover-lift flex items-center gap-4 p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amethyst/30 bg-crimson/12">
                    <ScrollText className="size-4 text-amethyst" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-parchment">{i.title}</span>
                    <span className="block truncate text-xs text-text-3">
                      {character?.name ?? "Unknown entity"} · {STATUS_LABEL[i.type as keyof typeof STATUS_LABEL] ?? i.type}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <p className="sr-only">
        Record status: {STATUS_LABEL[series.status]}; {insightTotal} chronicles attached.
      </p>

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
        title={`Strike “${series.title}” from the archive?`}
        description="This removes the record, its entities, and their chronicles. This cannot be undone."
        confirmLabel="Strike from the archive"
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
