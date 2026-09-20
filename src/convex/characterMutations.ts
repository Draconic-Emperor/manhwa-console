import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";

export const saveCharacter = mutation({
  args: {
    id: v.optional(v.id("characters")),
    name: v.string(),
    role: v.string(),
    description: v.string(),
    rank: v.number(),
    image_url: v.optional(v.string()),
    manhwa_id: v.id("manhwa"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to edit the codex.");

    const { id, ...fields } = args;
    if (id) {
      const existing = await ctx.db.get(id);
      if (existing === null) throw new Error("Character not found.");
      await ctx.db.patch(id, fields);
      return id;
    }
    return await ctx.db.insert("characters", fields);
  },
});

/** Deletes a character plus their insights and related favorites. */
export const deleteCharacter = mutation({
  args: { id: v.id("characters") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to edit the codex.");

    const itsInsights = await ctx.db
      .query("insights")
      .withIndex("by_character", (q) => q.eq("character_id", id))
      .collect();
    for (const i of itsInsights) await ctx.db.delete(i._id);

    const favs = await ctx.db.query("favorites").collect();
    for (const f of favs) {
      if (f.item_kind === "character" && f.item_id === id) await ctx.db.delete(f._id);
    }

    await ctx.db.delete(id);
  },
});
