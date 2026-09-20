import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Heart,
  Pencil,
  Quote,
  ScrollText,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Character, Insight } from "@/lib/codex";
import { INSIGHT_CLASS, INSIGHT_LABEL, rankTier, timeAgo } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { Badge, EmptyState, SectionHeader } from "@/components/ui/codex";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { CharacterFormDialog } from "@/components/forms/CharacterFormDialog";
import { InsightFormDialog } from "@/components/forms/InsightFormDialog";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";
import { useCodex, useFavorite, useEnsureAuth } from "@/hooks/use-codex";
import { cn } from "@/lib/utils";

export default function CharacterDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, characters, insights, manhwaById } = useCodex();
  const { isFavorite, toggleFavorite } = useFavorite();
  const ensureAuth = useEnsureAuth();
  const deleteCharacter = useMutation(api.characterMutations.deleteCharacter);
  const deleteInsight = useMutation(api.insightMutations.deleteInsight);

  const [editOpen, setEditOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [insightPendingDelete, setInsightPendingDelete] = useState<Insight | null>(null);
  const [deleting, setDeleting] = useState(false);

  const character: Character | undefined = useMemo(
    () => characters.find((c) => c._id === id),
    [characters, id],
  );

  const characterInsights = useMemo(
    () => insights.filter((i) => i.character_id === id).sort((a, b) => b.created_at - a.created_at),
    [insights, id],
  );

  const saved = id ? isFavorite("character", id) : false;

  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true" aria-live="polite">
        <div className="skeleton h-10 w-40" aria-hidden="true" />
        <div className="skeleton h-72 w-full" aria-hidden="true" />
        <div className="skeleton h-24 w-full" aria-hidden="true" />
      </div>
    );
  }

  if (!character) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="Entity record not found"
        hint="This entity is not cataloged in the archive — the record may have been struck."
        action={
          <Link to="/characters" className="btn-gold px-5 py-2.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to the registry
          </Link>
        }
      />
    );
  }

  const manhwa = manhwaById.get(character.manhwa_id);
  const tier = rankTier(character.rank);

  const handleDeleteCharacter = async () => {
    setDeleting(true);
    try {
      await ensureAuth();
      await deleteCharacter({ id: character._id });
      toast.success(`“${character.name}” was struck from the archive.`);
      navigate("/characters");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove the entity.");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleDeleteInsight = async () => {
    if (!insightPendingDelete) return;
    setDeleting(true);
    try {
      await ensureAuth();
      await deleteInsight({ id: insightPendingDelete._id });
      toast.success("Chronicle struck from the archive.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove the chronicle.");
    } finally {
      setDeleting(false);
      setInsightPendingDelete(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-text-3">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/dashboard" className="hover:text-parchment">Archive</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/characters" className="hover:text-parchment">Entities</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-parchment">{character.name}</li>
        </ol>
      </nav>

      {/* ENTITY RECORD hero */}
      <section className="record relative overflow-hidden rise-in">
        <div className="grid gap-0 md:grid-cols-[280px_1fr]">
          <div className="media-zoom relative aspect-[3/4] md:aspect-auto">
            <CoverImage
              src={character.image_url}
              seed={character._id}
              ratio="portrait"
              alt={`Portrait of ${character.name}`}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent md:bg-gradient-to-r" />
          </div>

          <div className="relative flex flex-col justify-center gap-4 p-6 sm:p-10">
            <div aria-hidden="true" className="absolute -right-12 -top-12 size-48 rounded-full bg-crimson/15 blur-3xl" />
            <p className="kicker">
              Entity Record · {character._id.slice(-6).toUpperCase()}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-parchment sm:text-4xl lg:text-5xl">
              {character.name}
            </h1>

            {/* Classification grid */}
            <dl className="grid gap-x-8 gap-y-3 border-y border-border py-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Designation</dt>
                <dd className="mt-1"><Badge tone="crimson">{character.role}</Badge></dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Known Affiliations</dt>
                <dd className="mt-1 font-medium text-parchment">
                  {manhwa ? (
                    <Link
                      to={`/manhwa/${manhwa._id}`}
                      className="font-medium text-gold underline-offset-4 hover:underline"
                    >
                      {manhwa.title}
                    </Link>
                  ) : (
                    "Unbound"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Archive Rank</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <Badge tone="gold">
                    <Trophy className="size-3" aria-hidden="true" /> Rank #{character.rank}
                  </Badge>
                  <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", tier.text)}>
                    {tier.label} class
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">Status</dt>
                <dd className="mt-1 font-medium text-parchment">Active within the archive</dd>
              </div>
            </dl>

            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">
                Entity Dossier
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
                {character.description}
              </p>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void toggleFavorite("character", character._id, character.name)}
                aria-pressed={saved}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  saved
                    ? "border-crimson/60 bg-crimson/20 text-[#f2b8bb] shadow-[0_0_18px_-6px_var(--crimson-glow)]"
                    : "border-gold/35 bg-void/60 text-parchment hover:border-crimson/50 hover:text-[#f2b8bb]",
                )}
              >
                <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
                {saved ? "Sealed in vault" : "Seal in vault"}
              </button>
              <button type="button" onClick={() => setInsightOpen(true)} className="btn-gold px-5 py-2.5 text-sm">
                <Quote className="size-4" aria-hidden="true" /> Seal a chronicle
              </button>
              <button type="button" onClick={() => setEditOpen(true)} className="btn-ember px-5 py-2.5 text-sm">
                <Pencil className="size-4" aria-hidden="true" /> Amend record
              </button>
              <button type="button" onClick={() => setConfirmDelete(true)} className="btn-ember-danger px-5 py-2.5 text-sm">
                <ScrollText className="size-4" aria-hidden="true" /> Strike record
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chronicles */}
      <section aria-labelledby="char-insights">
        <SectionHeader
          kicker="Attached chronicles"
          title="Chronicles & Theories"
          action={
            <button
              type="button"
              onClick={() => setInsightOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#f0dd9a]"
            >
              <UserPlus className="size-4" aria-hidden="true" /> Add entry
            </button>
          }
        />
        {characterInsights.length === 0 ? (
          <EmptyState
            icon={<Quote className="size-6" />}
            title="No chronicles recorded"
            hint="Be the first researcher to seal a theory, review, or lore note on this entity."
            action={
              <button type="button" className="btn-ember px-5 py-2.5 text-sm" onClick={() => setInsightOpen(true)}>
                Write the first entry
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {characterInsights.map((i) => {
              const type = INSIGHT_LABEL[i.type] ?? "Note";
              const cls = INSIGHT_CLASS[i.type] ?? "border-white/10 bg-white/5 text-text-2";
              return (
                <article key={i._id} className="record hover-lift group p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", cls)}>{type}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-text-3">
                      <time dateTime={new Date(i.created_at).toISOString()}>{timeAgo(i.created_at)}</time>
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-lg font-semibold text-parchment">{i.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-2">{i.content}</p>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInsight(i);
                        setInsightOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-text-3 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" /> Amend
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Fellow entities from the same series */}
      {manhwa && (
        <section aria-labelledby="fellow-heading">
          <SectionHeader
            kicker={`Also affiliated with ${manhwa.title}`}
            title="Known Associates"
            action={
              <Link
                to={`/manhwa/${manhwa._id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#f0dd9a]"
              >
                Open archive entry
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {characters
              .filter((c) => c.manhwa_id === manhwa._id && c._id !== character._id)
              .slice(0, 5)
              .map((c) => (
                <CharacterCard key={c._id} character={c} manhwa={manhwa} />
              ))}
          </div>
        </section>
      )}

      {/* Forms */}
      <CharacterFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        character={character}
        manhwaList={Array.from(manhwaById.values())}
      />
      <InsightFormDialog
        open={insightOpen}
        onOpenChange={(v) => {
          setInsightOpen(v);
          if (!v) setEditingInsight(null);
        }}
        presetCharacterId={character._id}
        editing={editingInsight}
        characters={characters}
        manhwaById={manhwaById}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Strike “${character.name}” from the archive?`}
        description="This removes the entity and their chronicles. This cannot be undone."
        confirmLabel="Strike from the archive"
        loading={deleting}
        onConfirm={() => void handleDeleteCharacter()}
      />
      <ConfirmDialog
        open={insightPendingDelete !== null}
        onOpenChange={(v) => {
          if (!v) setInsightPendingDelete(null);
        }}
        title="Strike this chronicle?"
        description="The entry will be removed from the archive. This cannot be undone."
        confirmLabel="Remove entry"
        loading={deleting}
        onConfirm={() => void handleDeleteInsight()}
      />
    </div>
  );
}
