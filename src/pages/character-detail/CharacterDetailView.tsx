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
import type { Id } from "@/convex/_generated/dataModel";
import type { Character, Insight, InsightType } from "@/lib/codex";
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
    () =>
      insights
        .filter((i) => i.character_id === id)
        .sort((a, b) => b.created_at - a.created_at),
    [insights, id],
  );

  const saved = id ? isFavorite("character", id as Id<"characters">) : false;

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
        title="Profile not found"
        hint="This character is not cataloged in the codex — they may have been removed."
        action={
          <Link to="/characters" className="btn-arcane px-5 py-2.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to the registry
          </Link>
        }
      />
    );
  }

  const manhwa = manhwaById.get(character.manhwa_id);
  const tier = rankTier(character.rank);
  const savedTitle = character.name;

  const handleDeleteCharacter = async () => {
    setDeleting(true);
    try {
      await ensureAuth();
      await deleteCharacter({ id: character._id });
      toast.success(`“${character.name}” was struck from the codex.`);
      navigate("/characters");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove the character.");
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
      toast.success("Insight removed from the codex.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove the insight.");
    } finally {
      setDeleting(false);
      setInsightPendingDelete(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/dashboard" className="hover:text-foreground">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/characters" className="hover:text-foreground">Characters</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">{character.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="panel relative overflow-hidden rise-in">
        <div className="grid gap-0 md:grid-cols-[280px_1fr]">
          <div className="media-zoom relative aspect-[3/4] md:aspect-auto">
            <CoverImage
              src={character.image_url}
              seed={character._id}
              ratio="portrait"
              alt={`Portrait of ${character.name}`}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
          </div>

          <div className="relative flex flex-col justify-center gap-4 p-6 sm:p-10">
            <div aria-hidden="true" className="absolute -right-12 -top-12 size-48 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">
                <Trophy className="size-3" aria-hidden="true" /> Rank #{character.rank}
              </Badge>
              <Badge tone="violet">{character.role}</Badge>
              <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", tier.text)}>
                {tier.label} class
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {character.name}
            </h1>
            {manhwa && (
              <p className="text-sm text-muted-foreground">
                Bound to{" "}
                <Link
                  to={`/manhwa/${manhwa._id}`}
                  className="font-medium text-violet-bright underline-offset-4 hover:underline"
                >
                  {manhwa.title}
                </Link>
              </p>
            )}
            <p className="max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
              {character.description}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void toggleFavorite("character", character._id, savedTitle)}
                aria-pressed={saved}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  saved
                    ? "border-rose-400/50 bg-rose-500/15 text-rose-300 shadow-[0_0_18px_-6px_rgba(251,113,133,0.7)]"
                    : "border-white/15 bg-white/5 text-foreground hover:border-rose-400/40 hover:text-rose-300",
                )}
              >
                <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
                {saved ? "Saved to Codex" : "Save to Codex"}
              </button>
              <button type="button" onClick={() => setInsightOpen(true)} className="btn-arcane px-5 py-2.5 text-sm">
                <Quote className="size-4" aria-hidden="true" /> Share an insight
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-violet-400/40 hover:text-violet-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Pencil className="size-4" aria-hidden="true" /> Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-md border border-rose-400/25 bg-rose-500/5 px-5 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ScrollText className="size-4" aria-hidden="true" /> Remove
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section aria-labelledby="char-insights">
        <SectionHeader
          kicker="From the scribes"
          title="Insights & Theories"
          action={
            <button
              type="button"
              onClick={() => setInsightOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta"
            >
              <UserPlus className="size-4" aria-hidden="true" /> Add entry
            </button>
          }
        />
        {characterInsights.length === 0 ? (
          <EmptyState
            icon={<Quote className="size-6" />}
            title="No insights recorded"
            hint="Be the first scribe to share a theory, review, or lore note about this character."
            action={
              <button type="button" className="btn-gold px-5 py-2.5 text-sm" onClick={() => setInsightOpen(true)}>
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
                <article key={i._id} className="panel hover-lift group p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", cls)}>{type}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <time dateTime={new Date(i.created_at).toISOString()}>{timeAgo(i.created_at)}</time>
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-lg font-semibold text-foreground">{i.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-2">{i.content}</p>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInsight(i);
                        setInsightOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-violet-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" /> Edit
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Fellow characters from the same series */}
      {manhwa && (
        <section aria-labelledby="fellow-heading">
          <SectionHeader
            kicker={`More from ${manhwa.title}`}
            title="Fellow Cast"
            action={
              <Link to={`/manhwa/${manhwa._id}`} className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright hover:text-magenta">
                View series
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
        manhwaList={manhwaById ? Array.from(manhwaById.values()) : []}
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
        title={`Remove “${character.name}”?`}
        description="This strikes the character and their insights from the codex. This cannot be undone."
        confirmLabel="Strike from the codex"
        loading={deleting}
        onConfirm={() => void handleDeleteCharacter()}
      />
      <ConfirmDialog
        open={insightPendingDelete !== null}
        onOpenChange={(v) => {
          if (!v) setInsightPendingDelete(null);
        }}
        title="Remove this insight?"
        description="The entry will be struck from the codex. This cannot be undone."
        confirmLabel="Remove entry"
        loading={deleting}
        onConfirm={() => void handleDeleteInsight()}
      />
    </div>
  );
}
