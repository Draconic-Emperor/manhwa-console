import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Character, Favorite, Insight, Manhwa } from "@/lib/codex";

/**
 * Reactive access to the whole archive, mirroring the original DataContext:
 * manhwa / characters / insights lists, favorites, and all CRUD mutations.
 */
export function useCodex() {
  const manhwa = useQuery(api.manhwa.list) as Manhwa[] | undefined;
  const characters = useQuery(api.characters.list) as Character[] | undefined;
  const insights = useQuery(api.insights.list) as Insight[] | undefined;
  const favorites = useQuery(api.favorites.listFavorites) as Favorite[] | undefined;

  const loading =
    manhwa === undefined || characters === undefined || insights === undefined || favorites === undefined;

  const manhwaById = useMemo(() => new Map<string, Manhwa>((manhwa ?? []).map((m) => [m._id as string, m])), [manhwa]);
  const characterById = useMemo(
    () => new Map<string, Character>((characters ?? []).map((c) => [c._id as string, c])),
    [characters],
  );

  const favoriteIds = useMemo(
    () => new Set((favorites ?? []).map((f) => `${f.item_kind}:${f.item_id}`)),
    [favorites],
  );
  const isFavorite = useCallback(
    (kind: "manhwa" | "character", id: string) => favoriteIds.has(`${kind}:${id}`),
    [favoriteIds],
  );

  return {
    loading,
    manhwa: manhwa ?? [],
    characters: characters ?? [],
    insights: insights ?? [],
    favorites: favorites ?? [],
    manhwaById,
    characterById,
    isFavorite,
  };
}

/** Ensures a signed-in identity exists (email user or anonymous guest) before writes. */
export function useEnsureAuth() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();

  return useCallback(async () => {
    if (!isAuthenticated) {
      await signIn("anonymous");
    }
  }, [isAuthenticated, signIn]);
}

export function useFavorite() {
  const { isFavorite } = useCodex();
  const toggle = useMutation(api.favorites.toggleFavorite);
  const ensureAuth = useEnsureAuth();

  const toggleFavorite = useCallback(
    async (kind: "manhwa" | "character", id: string, title: string) => {
      const nowSaved = !isFavorite(kind, id);
      try {
        await ensureAuth();
        await toggle({ item_kind: kind, item_id: id as Id<"manhwa"> | Id<"characters"> });
        toast.success(nowSaved ? `Saved “${title}” to your Codex` : `Removed “${title}” from your Codex`);
      } catch {
        toast.error("The seal rejected the offering. Please try again.");
      }
    },
    [ensureAuth, isFavorite, toggle],
  );

  return { isFavorite, toggleFavorite };
}
