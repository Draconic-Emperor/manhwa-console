import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("characters").collect();
  },
});

export const get = query({
  args: { id: v.id("characters") },
  handler: async (ctx, { id }) => {
    return (await ctx.db.get(id)) ?? null;
  },
});

/** Characters belonging to a series. */
export const ofManhwa = query({
  args: { manhwaId: v.id("manhwa") },
  handler: async (ctx, { manhwaId }) => {
    return await ctx.db
      .query("characters")
      .withIndex("by_manhwa", (q) => q.eq("manhwa_id", manhwaId))
      .collect();
  },
});
