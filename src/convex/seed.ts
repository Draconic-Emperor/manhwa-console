import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/** A title from the old fictional demo seed — if present, the archive self-upgrades to the real roster. */
const LEGACY_SEED_TITLE = "Shadow Monarch's Descent";

type SeriesSeed = {
  key: string;
  title: string;
  author: string;
  status: "ongoing" | "completed" | "hiatus";
  rank: number;
  genre: string;
  description: string;
  daysAgo: number;
};

type CharSeed = {
  key: string;
  name: string;
  role: "Protagonist" | "Antagonist" | "Supporting";
  rank: number;
  series: string;
  description: string;
};

type InsightSeed = {
  type: "theory" | "review" | "lore" | "analysis";
  title: string;
  content: string;
  charKey: string;
};

const SERIES: SeriesSeed[] = [
  {
    key: "sololeveling",
    title: "Solo Leveling",
    author: "Chugong (art: DUBU / Redice Studio)",
    status: "completed",
    rank: 1,
    genre: "Action",
    description:
      "In a world where hunters awaken with fixed strength, Sung Jinwoo is the weakest E-rank of them all — until a double dungeon collapses and he alone receives a mysterious 'System' that lets him level up like a game character. From that day, the world's weakest hunter begins an ascent that will shake every gate, guild, and monarch on Earth.",
    daysAgo: 1,
  },
  {
    key: "orr",
    title: "Omniscient Reader's Viewpoint",
    author: "Sing Shong",
    status: "ongoing",
    rank: 2,
    genre: "Fantasy",
    description:
      "Kim Dokja is the sole reader to finish a web novel called Three Ways to Survive a Ruined World. When the novel's apocalypse becomes reality, only he knows how the story unfolds — and the lonely knowledge that carried him through his own life becomes humanity's most dangerous weapon.",
    daysAgo: 3,
  },
  {
    key: "tbate",
    title: "The Beginning After The End",
    author: "TurtleMe (art: Fuyuki23)",
    status: "ongoing",
    rank: 3,
    genre: "Fantasy",
    description:
      "King Grey ruled a world of strength and died with regrets he never voiced. Reborn as Arthur Leywin in a realm of magic and beasts, he carries an adult's mind and a king's discipline into a second childhood — determined this time to guard the people he loves instead of a crown.",
    daysAgo: 5,
  },
  {
    key: "eleceed",
    title: "Eleceed",
    author: "Son Je-ho (art: ZHENA)",
    status: "ongoing",
    rank: 4,
    genre: "Action",
    description:
      "Jiwoo Seo is a kind-hearted boy with lightning reflexes who rescues a huge, wounded cat — who turns out to be Kayden, one of the world's strongest awakened, hiding from assassination in feline form. A sleepy suburban house becomes the training ground for the next legend of the awakened world.",
    daysAgo: 7,
  },
  {
    key: "nanomachine",
    title: "Nano Machine",
    author: "Han-Joong-Wol (art: Gin-Eum-Gi-Hoek)",
    status: "ongoing",
    rank: 5,
    genre: "Martial Arts",
    description:
      "Cheon Yeo-Woon, the scorned orphan prince of the Demonic Cult, has poison slipped into his meal — and wakes to find a nanomachine injected into his body by a descendant from the far future. With future technology layered over demonic martial arts, the weakest prince begins his climb over a cult that wants him dead.",
    daysAgo: 10,
  },
  {
    key: "peak",
    title: "Tower of God",
    author: "SIU",
    status: "ongoing",
    rank: 6,
    genre: "Fantasy",
    description:
      "Twenty-Fifth Bam spent his whole life beneath a sealed cave with only Rachel for company. When she climbs the Tower without him, he opens a door that shouldn't open — and begins an ascent through floors that grant any wish to whoever reaches the top, against tests, princesses, and families older than kingdoms.",
    daysAgo: 14,
  },
  {
    key: "overgeared",
    title: "Overgeared",
    author: "Laborer (art: Mongya)",
    status: "ongoing",
    rank: 7,
    genre: "Action",
    description:
      "Shin Youngwoo has bad luck, worse debt, and one legendary stroke of fortune: in the VR game Satisfy he inherits Pagma's Successor, a blacksmith class no player has ever held. Every item he forges rewrites the game's balance — and drags the laziest man in Korea toward becoming its most indispensable legend.",
    daysAgo: 18,
  },
  {
    key: "northernblade",
    title: "Legend of the Northern Blade",
    author: "Jin Jun-kwon (art: Hae-Min)",
    status: "ongoing",
    rank: 9,
    genre: "Martial Arts",
    description:
      "The Northern Heavenly Sect held the border against the Silent Night until its lord was framed and destroyed. His heir Jin Mu-Won — left frail, exiled, and presumed finished — sharpens his father's northern sword arts in secret, preparing to answer a murim that abandoned him.",
    daysAgo: 21,
  },
  {
    key: "yourthrone",
    title: "Your Throne",
    author: "Samk",
    status: "hiatus",
    rank: 15,
    genre: "Psychological",
    description:
      "Medea Belial is the heir of a ducal house; Psyche Callista is the crown prince's fiancée. When a secret clash of ambitions leaves the two women inhabiting each other's lives, neither can afford to fail the role she has stolen — and every ally, servant, and enemy at court becomes a piece on their board.",
    daysAgo: 33,
  },
];

const CHARACTERS: CharSeed[] = [
  {
    key: "jinwoo",
    name: "Sung Jinwoo",
    role: "Protagonist",
    rank: 1,
    series: "sololeveling",
    description:
      "The weakest E-rank hunter reborn as the Shadow Monarch. He levels without limit, commands an army of extracted shadows, and pays for every step upward with the people the dungeons take from him.",
  },
  {
    key: "cha-haein",
    name: "Cha Hae-In",
    role: "Supporting",
    rank: 5,
    series: "sololeveling",
    description:
      "The Sword Dancer — Korea's only S-rank huntress, whose sharpened senses smell hunters' mana like perfume or rot. Jinwoo is the first person whose mana she cannot smell at all.",
  },
  {
    key: "igris",
    name: "Igris the Blood-Red",
    role: "Supporting",
    rank: 9,
    series: "sololeveling",
    description:
      "The silent knight of Job Change Dungeon, first of Jinwoo's shadow soldiers. A crimson-armored marshal whose loyalty is absolute and whose bow precedes his blade.",
  },
  {
    key: "go-gunhee",
    name: "Go Gunhee",
    role: "Supporting",
    rank: 22,
    series: "sololeveling",
    description:
      "Chairman of the Korean Hunter Association and an S-rank hunter in body and will. Old enough to remember the first gates, and honest enough to burn for what the guilds became.",
  },
  {
    key: "dokja",
    name: "Kim Dokja",
    role: "Protagonist",
    rank: 2,
    series: "orr",
    description:
      "The only reader who finished the novel and survived. He spends his own life like currency to buy the party one more chapter, and calls it nothing more than reading ahead.",
  },
  {
    key: "joonghyuk",
    name: "Yoo Joonghyuk",
    role: "Protagonist",
    rank: 6,
    series: "orr",
    description:
      "The novel's regressor, on a life he has already lived more than a thousand times. He trusts no prophecy, kills without hesitation, and slowly learns that the reader beside him is the only constant across every round.",
  },
  {
    key: "han-sooyoung",
    name: "Han Sooyoung",
    role: "Supporting",
    rank: 14,
    series: "orr",
    description:
      "Author of the plagiarized bestseller and self-appointed archivist of the apocalypse. Sharp tongue, quicker pen — she writes the endings Dokja refuses to speak aloud.",
  },
  {
    key: "arthur",
    name: "Arthur Leywin",
    role: "Protagonist",
    rank: 3,
    series: "tbate",
    description:
      "A king reborn as a child in Dicathen. He binds his second life to family first, magic second — and learns that every advance in power paints a larger target on the people he loves.",
  },
  {
    key: "sylvie",
    name: "Sylvie",
    role: "Supporting",
    rank: 16,
    series: "tbate",
    description:
      "An asuran dragon-hatchling bound to Arthur as his bond. Small, silver, and wise far beyond her years, she is both his familiar and his conscience.",
  },
  {
    key: "kayden",
    name: "Kayden Break",
    role: "Protagonist",
    rank: 4,
    series: "eleceed",
    description:
      "Top-ten awakened, master of lightning, currently a very large and opinionated cat. Injured saving his pride and hiding in Jiwoo's house, he coaches the boy like a rowdy heir and defends him like family.",
  },
  {
    key: "jiwoo",
    name: "Jiwoo Seo",
    role: "Protagonist",
    rank: 8,
    series: "eleceed",
    description:
      "A gentle boy with superhuman reaction speed and a habit of feeding strays. His kindness keeps tripping the awakened world's rules — and quietly re-writing them.",
  },
  {
    key: "yeo-woon",
    name: "Cheon Yeo-Woon",
    role: "Protagonist",
    rank: 10,
    series: "nanomachine",
    description:
      "The Demonic Cult's despised sixth prince. A nano machine from the future rewires his meridians, and the boy who survived by hiding becomes the storm the cult cannot outrun.",
  },
  {
    key: "bam",
    name: "Twenty-Fifth Bam",
    role: "Protagonist",
    rank: 13,
    series: "peak",
    description:
      "The boy who opened the Tower's door to chase one friend. He enters with nothing but devotion and a talent the Tower itself seems to lean toward — and every floor asks whether the will to follow someone can become the will to surpass them.",
  },
  {
    key: "khun",
    name: "Khun Aguero Agnes",
    role: "Supporting",
    rank: 20,
    series: "peak",
    description:
      "A disowned son of the great Khun family, all lighthouse tactics and careful betrayals. He chooses Bam as his investment of a lifetime — the one climb where his scheming keeps turning into sincerity.",
  },
  {
    key: "grid",
    name: "Grid / Shin Youngwoo",
    role: "Protagonist",
    rank: 15,
    series: "overgeared",
    description:
      "The unluckiest man in Korea until Satisfy dealt him Pagma's Successor. As Grid, he forges items that break the game's balance and gathers the Church of Overgeared around the idea that even a petty, greedy man can grow into a legend worth following.",
  },
  {
    key: "mu-won",
    name: "Jin Mu-Won",
    role: "Protagonist",
    rank: 11,
    series: "northernblade",
    description:
      "The last heir of the Northern Heavenly Sect. Left frail and exiled after his father's downfall, he rebuilds the sect's sword arts in secret — a quiet blade sharpening itself for a murim that forgot him on purpose.",
  },
  {
    key: "medea",
    name: "Medea Belial",
    role: "Protagonist",
    rank: 17,
    series: "yourthrone",
    description:
      "Heir of House Belial, a mind like a scalpel playing a decade-long game for the throne. Living in another woman's skin forces the empire's coldest strategist to feel the weight of the life she is wearing.",
  },
  {
    key: "psyche",
    name: "Psyche Callista",
    role: "Supporting",
    rank: 24,
    series: "yourthrone",
    description:
      "The saintly fiancée of the crown prince — gentle, watched, and far sharper than her cage allows. The swap with Medea is the first door out of her gilded life, and she does not intend to hand the key back.",
  },
];

const INSIGHTS: InsightSeed[] = [
  {
    type: "theory",
    title: "The System was never neutral",
    content:
      "Every quest reward Jinwoo receives pushes him one step closer to the Monarch's throne — training regimens, the Daily Quest, even the penance he pays for skipping one. Read the System's language again: it never offers choices, only costs. Theory: the Architect designed the whole run not to save a human, but to audition one.",
    charKey: "jinwoo",
  },
  {
    type: "lore",
    title: "Why Hae-In cannot smell him",
    content:
      "Cha Hae-In's mana-scent works on every hunter because awakened power leaves a residue. Jinwoo's power isn't borrowed mana at all — it is the Shadow Monarch's authority, a different order of being wearing a hunter's license. Her senses aren't failing; they are refusing to classify him as prey.",
    charKey: "cha-haein",
  },
  {
    type: "analysis",
    title: "Dokja spends himself like text",
    content:
      "Track the cost of every 'Fourth Wall' branch: Kim Dokja always pays in the currency the scenario values least — his own future. The novel frames him as a reader, but his real curse is that he treats himself as a supporting character whose sacrifice costs the plot nothing. Joonghyuk is the only one who keeps counting the deaths.",
    charKey: "dokja",
  },
  {
    type: "review",
    title: "Eleceed's warmth is the power system",
    content:
      "The awakened world runs on dominance, and the story keeps answering that with caretaking: feeding strays, adopting the strongest cat alive, shielding a bullied classmate. Kayden's strength feels earned in Jiwoo's house because the series argues — convincingly — that protection is a higher form of power than pride.",
    charKey: "jiwoo",
  },
  {
    type: "lore",
    title: "The nano machine's true origin",
    content:
      "The device that saves Yeo-Woon is introduced as future technology, but its behavior — adaptive cultivation, self-repair, loyalty to its host — mirrors the Cult's own foundational arts. Lore thread: the descendant who sent it back didn't invent it. He recovered it, which implies the Cult's legends already contain a lost, machine-age scripture.",
    charKey: "yeo-woon",
  },
  {
    type: "theory",
    title: "The swap was Medea's second move",
    content:
      "Your Throne reads like a body-swap accident, but re-watch the court from Medea's first scene: she had already mapped Psyche's routines, alliances, and blind spots. Theory: the trade was not misfortune but a gambit that slipped its leash — Medea planned to borrow the throne's route, not to inherit a conscience. Her flickers of care for Psyche's people are the one variable she never priced in.",
    charKey: "medea",
  },
];

export const seedArchive = mutation({
  args: {},
  handler: (ctx) => seedArchiveInner(ctx),
});

async function seedArchiveInner(ctx: MutationCtx) {
  const existing = await ctx.db.query("manhwa").first();

  // Fresh install: inscribe the real roster.
  // Legacy install: the old fictional demo roster is present — wipe it and self-upgrade.
  // Otherwise: the archive already holds real data, do nothing.
  const isFresh = existing === null;
  const isLegacy =
    !isFresh &&
    (await ctx.db
      .query("manhwa")
      .filter((q) => q.eq(q.field("title"), LEGACY_SEED_TITLE))
      .first()) !== null;

  if (!isFresh && !isLegacy) return { seeded: false as const, upgraded: false as const };

  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Sign in to awaken the archive.");

  const now = Date.now();
  const day = 86_400_000;

  // Remove the fictional demo archive (and everything bound to it).
  if (isLegacy) {
    for (const s of await ctx.db.query("manhwa").collect()) {
      const chars = await ctx.db
        .query("characters")
        .withIndex("by_manhwa", (q) => q.eq("manhwa_id", s._id))
        .collect();
      for (const c of chars) {
        for (const i of await ctx.db
          .query("insights")
          .withIndex("by_character", (q) => q.eq("character_id", c._id))
          .collect()) {
          await ctx.db.delete(i._id);
        }
        await ctx.db.delete(c._id);
      }
      for (const f of await ctx.db.query("favorites").collect()) {
        if (
          (f.item_kind === "manhwa" && f.item_id === s._id) ||
          (f.item_kind === "character" && chars.some((c) => c._id === f.item_id))
        ) {
          await ctx.db.delete(f._id);
        }
      }
      await ctx.db.delete(s._id);
    }
  }

  // Inscribe the real roster.
  const seriesIds: Record<string, Id<"manhwa">> = {};
  for (const s of SERIES) {
    seriesIds[s.key] = await ctx.db.insert("manhwa", {
      title: s.title,
      author: s.author,
      description: s.description,
      status: s.status,
      rank: s.rank,
      genre: s.genre,
      created_at: now - s.daysAgo * day,
    });
  }

  const charIds: Record<string, Id<"characters">> = {};
  for (const c of CHARACTERS) {
    const seriesId = seriesIds[c.series];
    if (seriesId === undefined) continue;
    charIds[c.key] = await ctx.db.insert("characters", {
      name: c.name,
      role: c.role,
      description: c.description,
      rank: c.rank,
      manhwa_id: seriesId,
      image_url: undefined,
    });
  }

  for (const i of INSIGHTS) {
    const charId = charIds[i.charKey];
    if (charId === undefined) continue;
    await ctx.db.insert("insights", {
      character_id: charId,
      type: i.type,
      title: i.title,
      content: i.content,
      created_at: now - i.charKey.length * day,
    });
  }

  return { seeded: true as const, upgraded: true as const };
}
