import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const saveManhwa = mutation({
  args: {
    id: v.optional(v.id("manhwa")),
    title: v.string(),
    author: v.string(),
    description: v.string(),
    status: v.union(v.literal("ongoing"), v.literal("completed"), v.literal("hiatus")),
    rank: v.number(),
    cover_image: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to edit the codex.");

    const { id, ...fields } = args;
    if (id) {
      const existing = await ctx.db.get(id);
      if (existing === null) throw new Error("Series not found.");
      await ctx.db.patch(id, fields);
      return id;
    }
    return await ctx.db.insert("manhwa", { ...fields, created_at: Date.now() });
  },
});

/** Deletes a series plus its characters, their insights, and related favorites. */
export const deleteManhwa = mutation({
  args: { id: v.id("manhwa") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to edit the codex.");

    const chars = await ctx.db
      .query("characters")
      .withIndex("by_manhwa", (q) => q.eq("manhwa_id", id))
      .collect();

    for (const c of chars) {
      const itsInsights = await ctx.db
        .query("insights")
        .withIndex("by_character", (q) => q.eq("character_id", c._id))
        .collect();
      for (const i of itsInsights) await ctx.db.delete(i._id);
      await ctx.db.delete(c._id);
    }

    const favs = await ctx.db.query("favorites").collect();
    const charIds = new Set(chars.map((c) => c._id));
    for (const f of favs) {
      const orphaned =
        (f.item_kind === "manhwa" && f.item_id === id) ||
        (f.item_kind === "character" && charIds.has(f.item_id as Id<"characters">));
      if (orphaned) await ctx.db.delete(f._id);
    }

    await ctx.db.delete(id);
  },
});
