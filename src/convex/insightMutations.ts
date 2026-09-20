import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";

export const addInsight = mutation({
  args: {
    character_id: v.id("characters"),
    type: v.union(v.literal("theory"), v.literal("review"), v.literal("lore"), v.literal("analysis")),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to share an insight.");

    return await ctx.db.insert("insights", { ...args, created_at: Date.now() });
  },
});

export const deleteInsight = mutation({
  args: { id: v.id("insights") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to edit the codex.");
    await ctx.db.delete(id);
  },
});
