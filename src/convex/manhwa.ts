import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Public archive queries. Anyone (signed in or not) can browse the codex —
 * only writes (handled in manhwa.ts, characters.ts, insights.ts) require auth,
 * matching the original app where browsing is open and contributing is gated.
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("manhwa").withIndex("by_created_at").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("manhwa") },
  handler: async (ctx, { id }) => {
    return (await ctx.db.get(id)) ?? null;
  },
});
