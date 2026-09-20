import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/** Idempotent demo archive: seeds 6 series, 12 characters, 6 insights on first run. */
export const seedArchive = mutation({
  args: {},
  handler: (ctx) => seedArchiveInner(ctx),
});

async function seedArchiveInner(ctx: MutationCtx) {
  const existing = await ctx.db.query("manhwa").first();
  if (existing) return { seeded: false };

  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Sign in to awaken the archive.");

  const now = Date.now();
  const day = 86_400_000;

  const series = [
    {
      title: "Shadow Monarch's Descent",
      author: "Sung-Hyun Park",
      status: "ongoing",
      rank: 1,
      genre: "Action",
      description:
        "When the gates between worlds fractured, a nameless hunter inherited the throne of shadows. Each dungeon he clears writes another page in the codex of the Shadow Monarch — and the monarchs of other realms have begun to notice.",
      daysAgo: 2,
    },
    {
      title: "Chronicles of the Ninth Tower",
      author: "Ji-Eun Han",
      status: "ongoing",
      rank: 7,
      genre: "Fantasy",
      description:
        "Nine towers pierce the clouds, each guarding a fragment of a dead god's memory. Sera climbs not for power, but to recover the one memory that mentions her name — and the tower guardians remember everything.",
      daysAgo: 5,
    },
    {
      title: "Blade of the Ember Court",
      author: "Min-Jun Choi",
      status: "completed",
      rank: 12,
      genre: "Martial Arts",
      description:
        "The Ember Court rules the night markets with flame and debt. A debt-collector's blade sings in codes older than the court itself, and every strike repays a promise made before she was born.",
      daysAgo: 11,
    },
    {
      title: "The Healer Who Binds",
      author: "Da-Eun Kim",
      status: "ongoing",
      rank: 23,
      genre: "Romance",
      description:
        "In a world where healing is contract magic, Yuna's binding is different: she takes the wound's memory into herself. Nobles pay in secrets, and she is running out of room for them.",
      daysAgo: 18,
    },
    {
      title: "Rune Requiem",
      author: "Hyun-Woo Jung",
      status: "hiatus",
      rank: 31,
      genre: "Mystery",
      description:
        "Every rune carved into the capital's walls is a note in a song that must never finish. A tuneless bard discovers the final verse — and the choir that hunts anyone who can hear it.",
      daysAgo: 27,
    },
    {
      title: "Iron Necromancer",
      author: "Seo-Yeon Lim",
      status: "completed",
      rank: 44,
      genre: "Action",
      description:
        "The empire outlawed raising the dead, so its greatest necromancer raised the mountain instead. Iron constructs march in the shape of fallen legions, seeking the soul that animates them.",
      daysAgo: 34,
    },
  ] as { title: string; author: string; status: "ongoing" | "completed" | "hiatus"; rank: number; genre: string; description: string; daysAgo: number }[];

  const seriesIds: Record<number, string> = {};
  for (const s of series) {
    seriesIds[s.rank] = await ctx.db.insert("manhwa", {
      title: s.title,
      author: s.author,
      description: s.description,
      status: s.status,
      rank: s.rank,
      genre: s.genre,
      created_at: now - s.daysAgo * day,
    });
  }

  const charDefs: { name: string; role: string; rank: number; m: number; desc: string }[] = [
    { name: "Kael Arden", role: "Protagonist", rank: 3, m: 1, desc: "The Shadow Monarch's chosen vessel. Wields sovereign authority over an army of shadows and a debt he cannot name." },
    { name: "Vermillion Wraith", role: "Antagonist", rank: 8, m: 1, desc: "A monarch who trades in crimson mist. Her bargains always conclude — the only question is at whose conclusion." },
    { name: "Sera Vael", role: "Protagonist", rank: 1, m: 7, desc: "Tower-climber, memory-thief, and the only person the Ninth Tower refuses to forget." },
    { name: "Ignis Dorn", role: "Supporting", rank: 17, m: 7, desc: "Guardian of the seventh floor. Speaks only in echoes of the god whose memory he protects." },
    { name: "Ryn Vesper", role: "Protagonist", rank: 5, m: 12, desc: "Debt-collector of the Ember Court. Her blade's code predates the court and outlasts its kings." },
    { name: "Madam Hessonite", role: "Antagonist", rank: 22, m: 12, desc: "Keeper of the Ember ledgers. Every contract bears her seal, and every seal burns when broken." },
    { name: "Yuna Solane", role: "Protagonist", rank: 9, m: 23, desc: "A healer who stores others' wounds as memories. She has forgotten her own face and remembers everyone else's pain." },
    { name: "Cassio Vale", role: "Supporting", rank: 38, m: 23, desc: "A noble who pays in blank pages because he has nothing else. Knows exactly what Yuna has forgotten." },
    { name: "Orin Mute", role: "Protagonist", rank: 14, m: 31, desc: "The tuneless bard. Carries the final verse written on the inside of his ribs." },
    { name: "Nerys Thorn", role: "Antagonist", rank: 26, m: 31, desc: "First chair of the Choir. Hunts unfinished songs with a conductor's patience and a guillotine's courtesy." },
    { name: "Magrus Ferrum", role: "Protagonist", rank: 6, m: 44, desc: "The Iron Necromancer. Raised a mountain of constructs and cannot remember whose soul walks among them." },
    { name: "Legion Zero", role: "Supporting", rank: 47, m: 44, desc: "The first construct. Loyal to the mountain, curious about the man, terrified of both." },
  ];

  const charIds: Record<number, string> = {};
  for (const c of charDefs) {
    charIds[c.rank] = await ctx.db.insert("characters", {
      name: c.name,
      role: c.role,
      description: c.desc,
      rank: c.rank,
      manhwa_id: seriesIds[c.m] as Id<"manhwa">,
      image_url: undefined,
    });
  }

  const insightDefs: { charRank: number; type: "theory" | "review" | "lore" | "analysis"; title: string; content: string }[] = [
    {
      charRank: 3,
      type: "theory",
      title: "The debt the Monarch cannot name",
      content:
        "Kael's shadows obey him instantly, but he pays for each summoning with a memory he doesn't know he's losing. Theory: the debt he cannot name is his own name — the monarch template overwrites the vessel's identity. Notice how no one has called him by a family name since the first gate.",
    },
    {
      charRank: 1,
      type: "lore",
      title: "Why the Ninth Tower refuses to forget her",
      content:
        "Towers remember fragments of the dead god. Sera's name appearing in a memory implies she existed before the towers — or that someone wrote her into the god's memory deliberately. The seventh floor's guardian speaks in echoes; compare his phrasing across floors 7 and 8.",
    },
    {
      charRank: 5,
      type: "analysis",
      title: "The blade-code predates the Ember Court",
      content:
        "Ryn's sword notations use pre-court grammar. The court claims to author all debt law, but her blade executes contracts the court cannot void — meaning the court itself might be operating on borrowed authority.",
    },
    {
      charRank: 9,
      type: "review",
      title: "The quietest heartbreaking arc this year",
      content:
        "A healer who remembers everyone's pain and none of her own past is a devastating premise, and the story earns every scene. Cassio paying in secrets he knows she'll keep is the most tender transaction in the genre right now.",
    },
    {
      charRank: 6,
      type: "theory",
      title: "Myth: Whose soul walks in the mountain?",
      content:
        "The constructs march in legion formations no living soldier remembers. Legion Zero's terror of 'both' the man and the mountain suggests the soul is someone Magrus loved — and the mountain is the tomb he built without knowing.",
    },
    {
      charRank: 26,
      type: "lore",
      title: "Reading the Choir's courtesy",
      content:
        "Every time the Choir kills, they first offer the target a chance to finish their song. Nerys's guillotine courtesy is not mercy — it's quality control. Finished songs stay dead; unfinished ones come back wrong.",
    },
  ];

  for (const i of insightDefs) {
    await ctx.db.insert("insights", {
      character_id: charIds[i.charRank] as Id<"characters">,
      type: i.type,
      title: i.title,
      content: i.content,
      created_at: now - Math.floor((i.charRank % 6) + 1) * day,
    });
  }

  return { seeded: true };
}
