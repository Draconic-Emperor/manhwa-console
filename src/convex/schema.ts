import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove
      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    /* ------------------------- Manhwa Codex tables ------------------------- */

    manhwa: defineTable({
      title: v.string(),
      author: v.string(),
      description: v.string(),
      status: v.union(v.literal("ongoing"), v.literal("completed"), v.literal("hiatus")),
      rank: v.number(),
      cover_image: v.optional(v.string()),
      genre: v.optional(v.string()),
      created_at: v.number(),
    }).index("by_created_at", ["created_at"]),

    characters: defineTable({
      name: v.string(),
      role: v.string(),
      description: v.string(),
      rank: v.number(),
      image_url: v.optional(v.string()),
      manhwa_id: v.id("manhwa"),
    }).index("by_manhwa", ["manhwa_id"]),

    insights: defineTable({
      character_id: v.id("characters"),
      type: v.union(v.literal("theory"), v.literal("review"), v.literal("lore"), v.literal("analysis")),
      title: v.string(),
      content: v.string(),
      created_at: v.number(),
    })
      .index("by_character", ["character_id"])
      .index("by_created_at", ["created_at"]),

    favorites: defineTable({
      user_id: v.id("users"),
      item_id: v.union(v.id("manhwa"), v.id("characters")),
      item_kind: v.union(v.literal("manhwa"), v.literal("character")),
      created_at: v.number(),
    })
      .index("by_user", ["user_id"])
      .index("by_user_item", ["user_id", "item_id"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
