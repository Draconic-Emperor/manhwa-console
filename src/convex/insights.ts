import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("insights").withIndex("by_created_at").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("insights") },
  handler: async (ctx, { id }) => {
    return (await ctx.db.get(id)) ?? null;
  },
});

export const ofCharacter = query({
  args: { characterId: v.id("characters") },
  handler: async (ctx, { characterId }) => {
    return await ctx.db
      .query("insights")
      .withIndex("by_character", (q) => q.eq("character_id", characterId))
      .order("desc")
      .collect();
  },
});
