import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

/** Toggles a favorite; returns the new state (true = now saved). */
export const toggleFavorite = mutation({
  args: {
    item_id: v.union(v.id("manhwa"), v.id("characters")),
    item_kind: v.union(v.literal("manhwa"), v.literal("character")),
  },
  handler: async (ctx, { item_id, item_kind }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to save favorites.");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) => q.eq("user_id", userId).eq("item_id", item_id))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }
    await ctx.db.insert("favorites", {
      user_id: userId,
      item_id,
      item_kind,
      created_at: Date.now(),
    });
    return true;
  },
});

/** All favorites of the signed-in user (empty when signed out). */
export const listFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .collect();
  },
});
